/**
 * Batch-publish blog posts.
 *
 *   npm run publish-all                 # every posts/*.json, skipping ones already live & unchanged
 *   npm run publish-all -- --dry-run    # show what would happen, send nothing
 *   npm run publish-all -- --force      # re-publish even if live and identical
 *   npm run publish-all -- posts/a.json posts/b.json
 *
 * Env:
 *   BLOG_API_BASE   default https://xmr402.org
 *   BLOG_API_KEY    overrides the .blog-api-key file
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve, basename } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BASE = (process.env.BLOG_API_BASE ?? 'https://xmr402.org').replace(/\/$/, '');

const API_KEY =
  process.env.BLOG_API_KEY ??
  (() => {
    const f = join(ROOT, '.blog-api-key');
    if (!existsSync(f)) {
      console.error(`No API key: set BLOG_API_KEY or create ${f}`);
      process.exit(1);
    }
    return readFileSync(f, 'utf-8').trim();
  })();

const argv = process.argv.slice(2);
const dryRun = argv.includes('--dry-run');
const force = argv.includes('--force');
const files = argv.filter((a) => !a.startsWith('--'));

const postFiles = (
  files.length
    ? files
    : readdirSync(join(ROOT, 'posts'))
        .filter((f) => f.endsWith('.json'))
        .sort()
        .map((f) => join('posts', f))
).map((f) => resolve(ROOT, f));

/** Fields that matter for "is the live copy up to date?" */
const COMPARED = ['title', 'description', 'content', 'author', 'date', 'tags', 'ogImage', 'coverImage'] as const;

const stable = (v: unknown): string =>
  JSON.stringify(v, (_k, val) =>
    val && typeof val === 'object' && !Array.isArray(val)
      ? Object.fromEntries(Object.entries(val as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)))
      : val
  );

const sameAsLive = (local: Record<string, unknown>, live: Record<string, unknown>) =>
  COMPARED.every((k) => stable(local[k] ?? null) === stable(live[k] ?? null));

/** Pull the useful bit out of a fetch error: ECONNREFUSED, EAI_AGAIN, etc. */
function describe(err: unknown): string {
  const cause = (err as { cause?: { code?: string; message?: string } })?.cause;
  return cause?.code ?? cause?.message ?? (err as Error)?.message ?? String(err);
}

async function withRetry<T>(label: string, fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastErr: unknown;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const cause = describe(err);
      if (i < attempts) {
        const wait = 1000 * 2 ** (i - 1);
        console.log(`   ↻ ${label} failed (${cause || (err as Error).message}) — retry ${i}/${attempts - 1} in ${wait}ms`);
        await new Promise((r) => setTimeout(r, wait));
      }
    }
  }
  throw lastErr;
}

type Outcome = 'published' | 'updated' | 'skipped' | 'would-publish' | 'failed';
const results: { slug: string; outcome: Outcome; note?: string }[] = [];

console.log(`Batch publish → ${BASE}`);
console.log(`${postFiles.length} post file(s)${dryRun ? ' — DRY RUN, nothing will be sent' : ''}\n`);

for (const file of postFiles) {
  const name = basename(file);
  let post: Record<string, unknown>;
  try {
    post = JSON.parse(readFileSync(file, 'utf-8'));
  } catch (err) {
    console.log(`✗ ${name} — invalid JSON: ${(err as Error).message}`);
    results.push({ slug: name, outcome: 'failed', note: 'invalid JSON' });
    continue;
  }

  const slug = post.slug as string;
  const titleEn = (post.title as Record<string, string> | undefined)?.en ?? '(untitled)';
  if (!slug || !titleEn || !(post.content as Record<string, string> | undefined)?.en || !post.date) {
    console.log(`✗ ${name} — missing a required field (slug, title.en, content.en, date)`);
    results.push({ slug: slug ?? name, outcome: 'failed', note: 'missing required field' });
    continue;
  }

  // Is it already live, and identical?
  let liveState: 'absent' | 'same' | 'different' = 'absent';
  if (!force) {
    try {
      const res = await withRetry(`GET ${slug}`, () => fetch(`${BASE}/api/blog/${slug}`));
      if (res.ok) {
        const live = (await res.json()) as Record<string, unknown>;
        const body = (live.post ?? live) as Record<string, unknown>;
        liveState = sameAsLive(post, body) ? 'same' : 'different';
      }
    } catch (err) {
      const cause = describe(err);
      console.log(`✗ ${slug} — could not reach ${BASE} (${cause})`);
      results.push({ slug, outcome: 'failed', note: `unreachable: ${cause}` });
      // Host is down or DNS is blocked: every remaining post would fail the same way.
      console.log(`\n${BASE} is unreachable — aborting before the remaining posts.`);
      if (/EAI_AGAIN|ENOTFOUND/.test(String(cause))) {
        console.log('DNS could not resolve the host. Check your network, or run this from a machine that can reach it.');
      }
      break;
    }
  }

  if (liveState === 'same') {
    console.log(`· ${slug} — already live and unchanged, skipping`);
    results.push({ slug, outcome: 'skipped' });
    continue;
  }

  const verb = liveState === 'different' ? 'update' : 'publish';
  const verbPast = liveState === 'different' ? 'updated' : 'published';
  if (dryRun) {
    console.log(`→ ${slug} — would ${verb}  "${titleEn.slice(0, 60)}${titleEn.length > 60 ? '…' : ''}"`);
    results.push({ slug, outcome: 'would-publish', note: verb });
    continue;
  }

  try {
    const res = await withRetry(`POST ${slug}`, () =>
      fetch(`${BASE}/api/blog/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
        body: JSON.stringify(post),
      })
    );
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (res.ok) {
      console.log(`✓ ${slug} — ${verbPast}  /blog/${(body.slug as string) ?? slug}`);
      results.push({ slug, outcome: liveState === 'different' ? 'updated' : 'published' });
    } else {
      console.log(`✗ ${slug} — HTTP ${res.status}: ${JSON.stringify(body)}`);
      results.push({ slug, outcome: 'failed', note: `HTTP ${res.status}` });
    }
  } catch (err) {
    const cause = describe(err);
    console.log(`✗ ${slug} — ${cause}`);
    results.push({ slug, outcome: 'failed', note: String(cause) });
  }

  await new Promise((r) => setTimeout(r, 400)); // be polite to the Worker
}

const count = (o: Outcome) => results.filter((r) => r.outcome === o).length;
console.log('\n───────────────────────────────');
console.log(
  `published ${count('published')}  ·  updated ${count('updated')}  ·  skipped ${count('skipped')}` +
    (dryRun ? `  ·  would publish ${count('would-publish')}` : '') +
    `  ·  failed ${count('failed')}`
);

const failed = results.filter((r) => r.outcome === 'failed');
if (failed.length) {
  console.log('\nFailed:');
  for (const f of failed) console.log(`  ${f.slug} — ${f.note}`);
  console.log('\nCover images need `npm run deploy` to be served.');
  process.exit(1);
}

if (count('published') + count('updated') > 0) {
  console.log('\nNext: `npm run deploy` so the cover SVGs in public/ are served.');
}
