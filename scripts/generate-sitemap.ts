import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BASE_URL = 'https://xmr402.org';

const LOCALES = [
  { code: 'en', hreflang: 'en', pathPrefix: '' },
  { code: 'zh-TW', hreflang: 'zh-Hant', pathPrefix: '/zh-TW' },
  { code: 'ru', hreflang: 'ru', pathPrefix: '/ru' },
  { code: 'es', hreflang: 'es', pathPrefix: '/es' },
  { code: 'pt', hreflang: 'pt', pathPrefix: '/pt' },
  { code: 'ja', hreflang: 'ja', pathPrefix: '/ja' },
] as const;

interface PostMeta {
  slug: string;
  date: string;
  updatedAt?: string;
}

// Load all posts
const postsDir = join(ROOT, 'posts');
const postFiles = readdirSync(postsDir).filter((f) => f.endsWith('.json')).sort();
const posts: PostMeta[] = [];

for (const file of postFiles) {
  try {
    const raw = JSON.parse(readFileSync(join(postsDir, file), 'utf-8'));
    if (raw.slug && raw.date) {
      posts.push({
        slug: raw.slug,
        date: raw.date,
        updatedAt: raw.updatedAt,
      });
    }
  } catch (err) {
    console.warn(`Skipping invalid post file ${file}:`, err);
  }
}

// Sort posts by date descending
posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

interface RouteConfig {
  path: string; // e.g. '', '/ecosystem', '/donate', '/blog', '/blog/xyz'
  priority: string;
  changefreq: string;
  lastmod?: string;
}

const latestPostDate = posts[0]?.date ? new Date(posts[0].date).toISOString().split('T')[0] : '2026-03-17';
const today = new Date().toISOString().split('T')[0];

const routes: RouteConfig[] = [
  { path: '', priority: '1.0', changefreq: 'weekly', lastmod: latestPostDate },
  { path: '/ecosystem', priority: '0.9', changefreq: 'weekly', lastmod: today },
  { path: '/blog', priority: '0.9', changefreq: 'daily', lastmod: latestPostDate },
  { path: '/donate', priority: '0.7', changefreq: 'monthly', lastmod: '2026-03-17' },
];

for (const post of posts) {
  const mod = post.updatedAt ? new Date(post.updatedAt).toISOString().split('T')[0] : new Date(post.date).toISOString().split('T')[0];
  routes.push({
    path: `/blog/${post.slug}`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: mod,
  });
}

function getUrl(pathPrefix: string, path: string): string {
  if (!pathPrefix && !path) return `${BASE_URL}/`;
  return `${BASE_URL}${pathPrefix}${path}`;
}

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

for (const route of routes) {
  for (const currentLocale of LOCALES) {
    const loc = getUrl(currentLocale.pathPrefix, route.path);
    xml += `  <url>\n`;
    xml += `    <loc>${loc}</loc>\n`;
    if (route.lastmod) {
      xml += `    <lastmod>${route.lastmod}</lastmod>\n`;
    }
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;

    // Reciprocal hreflang tags for all languages
    for (const altLocale of LOCALES) {
      const altHref = getUrl(altLocale.pathPrefix, route.path);
      xml += `    <xhtml:link rel="alternate" hreflang="${altLocale.hreflang}" href="${altHref}" />\n`;
    }
    // x-default points to default English path
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${getUrl('', route.path)}" />\n`;
    xml += `  </url>\n`;
  }
}

xml += `</urlset>\n`;

const outputPath = join(ROOT, 'public', 'sitemap.xml');
writeFileSync(outputPath, xml, 'utf-8');
console.log(`✓ Generated sitemap with ${routes.length * LOCALES.length} URLs (${routes.length} paths x ${LOCALES.length} locales) -> ${outputPath}`);
