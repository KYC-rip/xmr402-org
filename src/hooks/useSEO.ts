import { useEffect } from 'react';

const DEFAULT_OG_IMAGE = 'https://xmr402.org/og-image.jpg';
const DEFAULT_TITLE = 'XMR402 | The Tactical Standard for AI-Native Payments';
const DEFAULT_DESCRIPTION = 'XMR402 is an open, neutral standard for internet-native payments. It empowers agentic micro-transactions between clients and servers with zero friction and maximum privacy.';

const LOCALES = [
  { code: 'en', hreflang: 'en', prefix: '' },
  { code: 'zh-TW', hreflang: 'zh-Hant', prefix: '/zh-TW' },
  { code: 'ru', hreflang: 'ru', prefix: '/ru' },
  { code: 'es', hreflang: 'es', prefix: '/es' },
  { code: 'pt', hreflang: 'pt', prefix: '/pt' },
  { code: 'ja', hreflang: 'ja', prefix: '/ja' },
] as const;

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonicalPath?: string; // e.g. '/', '/blog', '/blog/my-post'
  canonicalUrl?: string;  // e.g. 'https://xmr402.org/blog/my-post'
  jsonLd?: object;
}

export function useSEO({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  canonicalPath,
  canonicalUrl,
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    document.title = title || DEFAULT_TITLE;

    const setMeta = (key: string, content: string, isProperty = true) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const image = ogImage || DEFAULT_OG_IMAGE;
    const desc = description || DEFAULT_DESCRIPTION;

    let path = canonicalPath;
    if (!path && canonicalUrl) {
      try {
        path = new URL(canonicalUrl).pathname;
      } catch {
        path = canonicalUrl;
      }
    }
    const cleanPath = !path || path === '/' ? '' : path.replace(/\/$/, '');
    const resolvedCanonical = `https://xmr402.org${cleanPath || '/'}`;

    setMeta('description', desc, false);
    if (keywords && keywords.length > 0) {
      setMeta('keywords', keywords.join(', '), false);
    }
    setMeta('og:title', title);
    setMeta('og:description', desc);
    setMeta('og:type', ogType);
    setMeta('og:image', image);
    setMeta('og:url', resolvedCanonical);

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', desc);
    setMeta('twitter:image', image);

    // Update <link rel="canonical">
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = resolvedCanonical;

    // Update hreflang alternate links
    const hreflangEls: HTMLLinkElement[] = [];
    LOCALES.forEach((loc) => {
      const href = `https://xmr402.org${loc.prefix}${cleanPath || '/'}`;
      let link = document.querySelector(`link[rel="alternate"][hreflang="${loc.hreflang}"]`) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = loc.hreflang;
        document.head.appendChild(link);
      }
      link.href = href;
      hreflangEls.push(link);
    });

    // x-default hreflang
    let xDefault = document.querySelector('link[rel="alternate"][hreflang="x-default"]') as HTMLLinkElement | null;
    if (!xDefault) {
      xDefault = document.createElement('link');
      xDefault.rel = 'alternate';
      xDefault.hreflang = 'x-default';
      document.head.appendChild(xDefault);
    }
    xDefault.href = `https://xmr402.org${cleanPath || '/'}`;

    // Manage JSON-LD
    let scriptEl = document.getElementById('dynamic-jsonld') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = 'dynamic-jsonld';
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    return () => {
      // Revert title
      document.title = DEFAULT_TITLE;
      if (scriptEl) scriptEl.remove();
    };
  }, [title, description, keywords, ogImage, ogType, canonicalPath, canonicalUrl, jsonLd]);
}
