import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BASE_URL = 'https://xmr402.org';

const LOCALES = [
  { code: 'en', pathPrefix: '' },
  { code: 'zh-TW', pathPrefix: '/zh-TW' },
  { code: 'ru', pathPrefix: '/ru' },
  { code: 'es', pathPrefix: '/es' },
  { code: 'pt', pathPrefix: '/pt' },
  { code: 'ja', pathPrefix: '/ja' },
] as const;

interface BlogPost {
  slug: string;
  title: Record<string, string>;
  description: Record<string, string>;
  content: Record<string, string>;
  author: string;
  date: string;
  tags?: string[];
}

const postsDir = join(ROOT, 'posts');
const publicDir = join(ROOT, 'public');

const postFiles = readdirSync(postsDir)
  .filter((f) => f.endsWith('.json'))
  .sort();

const posts: BlogPost[] = [];

for (const file of postFiles) {
  try {
    const raw = JSON.parse(readFileSync(join(postsDir, file), 'utf-8'));
    if (raw.slug && raw.date && raw.title && raw.content) {
      posts.push(raw);
    }
  } catch (err) {
    console.warn(`Skipping invalid post file ${file}:`, err);
  }
}

// Sort posts by date descending
posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

let generatedCount = 0;

// 1. Generate individual post .md files
for (const post of posts) {
  const dateStr = post.date.split('T')[0];
  const tagsStr = (post.tags || []).join(', ');
  const canonicalUrl = `${BASE_URL}/blog/${post.slug}`;

  for (const locale of LOCALES) {
    const lang = locale.code;
    const title = post.title[lang] ?? post.title.en;
    const desc = post.description[lang] ?? post.description.en;
    const body = post.content[lang] ?? post.content.en;

    const md = `# ${title}\n\n> ${desc}\n\n- **Author:** ${post.author}\n- **Date:** ${dateStr}\n- **Tags:** ${tagsStr}\n- **Canonical:** ${canonicalUrl}\n\n---\n\n${body}\n`;

    if (lang === 'en') {
      const rootBlogDir = join(publicDir, 'blog');
      ensureDir(rootBlogDir);
      writeFileSync(join(rootBlogDir, `${post.slug}.md`), md, 'utf-8');
      generatedCount++;

      const enBlogDir = join(publicDir, 'en', 'blog');
      ensureDir(enBlogDir);
      writeFileSync(join(enBlogDir, `${post.slug}.md`), md, 'utf-8');
      generatedCount++;
    } else {
      const langBlogDir = join(publicDir, lang, 'blog');
      ensureDir(langBlogDir);
      writeFileSync(join(langBlogDir, `${post.slug}.md`), md, 'utf-8');
      generatedCount++;
    }
  }
}

// 2. Generate blog index .md files
for (const locale of LOCALES) {
  const lang = locale.code;
  let indexMd = `# XMR402 Transmissions & Research\n\n> Technical articles, protocol analyses, and research on autonomous agent payments, zero-confirmation Monero settlements, and surveillance capitalism.\n\n`;

  for (const p of posts) {
    const pTitle = p.title[lang] ?? p.title.en;
    const pDesc = p.description[lang] ?? p.description.en;
    const pDate = p.date.split('T')[0];
    const pTags = (p.tags || []).join(', ');
    const pUrl = `${BASE_URL}/blog/${p.slug}`;

    indexMd += `### [${pTitle}](${pUrl})\n\n${pDesc}\n\n*Date: ${pDate} | Author: ${p.author} | Tags: ${pTags}*\n\n---\n\n`;
  }

  if (lang === 'en') {
    writeFileSync(join(publicDir, 'blog.md'), indexMd, 'utf-8');
    generatedCount++;

    const enDir = join(publicDir, 'en');
    ensureDir(enDir);
    writeFileSync(join(enDir, 'blog.md'), indexMd, 'utf-8');
    generatedCount++;
  } else {
    const langDir = join(publicDir, lang);
    ensureDir(langDir);
    writeFileSync(join(langDir, 'blog.md'), indexMd, 'utf-8');
    generatedCount++;
  }
}

console.log(`✓ Generated ${generatedCount} static markdown files for ${posts.length} posts across 6 locales.`);
