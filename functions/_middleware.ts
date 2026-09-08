import type { Env, BlogPost, BlogPostMeta } from './types';
import { markdownToHtml } from './markdown';

const BOT_PATTERNS = [
  // Search engines
  'googlebot', 'bingbot', 'yandex', 'duckduckbot', 'slurp', 'baiduspider', 'sogou', 'yahoo', 'ecosia',
  // AI Models & Crawlers
  'gptbot', 'oai-searchbot', 'chatgpt-user', 'chatgpt', 'claudebot', 'claude-web', 'anthropic-ai',
  'perplexitybot', 'perplexity', 'applebot', 'applebot-extended', 'amazonbot', 'cohere-ai', 'bytespider',
  'diffbot', 'ccbot', 'meta-externalagent', 'omgilibot', 'youbot',
  // Social & Messengers
  'facebookexternalhit', 'twitterbot', 'linkedinbot', 'whatsapp', 'telegrambot', 'discordbot', 'slackbot',
  // CLI & AI Agent Scraping Tools
  'curl', 'wget', 'python-requests', 'aiohttp', 'httpie', 'axios', 'undici', 'go-http-client'
];

function isBot(ua: string): boolean {
  if (!ua) return false;
  const lower = ua.toLowerCase();
  return BOT_PATTERNS.some((pattern) => lower.includes(pattern));
}

function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const LANG_CONFIG = [
  { code: 'en', hreflang: 'en', pathPrefix: '' },
  { code: 'zh-TW', hreflang: 'zh-Hant', pathPrefix: '/zh-TW' },
  { code: 'ru', hreflang: 'ru', pathPrefix: '/ru' },
  { code: 'es', hreflang: 'es', pathPrefix: '/es' },
  { code: 'pt', hreflang: 'pt', pathPrefix: '/pt' },
  { code: 'ja', hreflang: 'ja', pathPrefix: '/ja' },
] as const;

type SupportedLang = (typeof LANG_CONFIG)[number]['code'];

function getHreflangTags(canonicalPath: string): string {
  const cleanPath = canonicalPath === '/' ? '' : canonicalPath;
  const tags = LANG_CONFIG.map((l) => {
    const href = `https://xmr402.org${l.pathPrefix}${cleanPath || '/'}`;
    return `<link rel="alternate" hreflang="${l.hreflang}" href="${href}" />`;
  });
  tags.push(`<link rel="alternate" hreflang="x-default" href="https://xmr402.org${cleanPath || '/'}" />`);
  return tags.join('\n    ');
}

const RFC8288_LINK_HEADERS = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</.well-known/ai-catalog.json>; rel="ai-catalog"',
  '</.well-known/agent-skills/index.json>; rel="service-desc"',
  '</.well-known/acp.json>; rel="service-desc"',
  '</.well-known/ucp>; rel="service-desc"',
  '</.well-known/agents.json>; rel="service-desc"',
  '</.well-known/agent-card.json>; rel="service-desc"',
  '</.well-known/mcp/server-card.json>; rel="service-desc"',
  '</openapi.json>; rel="service-doc"',
  '</llms.txt>; rel="service-doc"',
  '</auth.md>; rel="describedby"',
].join(', ');

const COMMON_STYLES = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6;
    color: #e2e8f0;
    background-color: #0a0a0c;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 860px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }
  header {
    border-bottom: 1px solid #27272a;
    padding-bottom: 1.5rem;
    margin-bottom: 2rem;
  }
  h1 { font-size: 2.25rem; font-weight: 900; line-height: 1.2; margin-top: 0; color: #f8fafc; text-transform: uppercase; }
  h2 { font-size: 1.5rem; font-weight: 800; margin-top: 2rem; margin-bottom: 0.75rem; color: #f8fafc; border-bottom: 1px solid #1e293b; padding-bottom: 0.5rem; }
  h3 { font-size: 1.25rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #38bdf8; }
  p { margin: 1rem 0; color: #cbd5e1; }
  a { color: #10b981; text-decoration: none; }
  a:hover { text-decoration: underline; }
  pre {
    background: #111827;
    border: 1px solid #1f2937;
    padding: 1rem;
    border-radius: 6px;
    overflow-x: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.875rem;
  }
  code {
    background: #1e293b;
    color: #34d399;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.875em;
  }
  pre code {
    background: transparent;
    padding: 0;
    color: #f1f5f9;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
  }
  th, td {
    border: 1px solid #334155;
    padding: 0.75rem;
    text-align: left;
  }
  th {
    background: #1e293b;
    color: #f8fafc;
    font-weight: 700;
  }
  blockquote {
    border-left: 4px solid #10b981;
    margin: 1.5rem 0;
    padding: 0.5rem 1rem;
    background: rgba(16, 185, 129, 0.05);
    color: #94a3b8;
  }
  .meta {
    font-size: 0.85rem;
    color: #94a3b8;
    margin-bottom: 1rem;
    font-family: ui-monospace, monospace;
  }
  .tag {
    display: inline-block;
    background: #1e293b;
    border: 1px solid #334155;
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    font-size: 0.75rem;
    color: #94a3b8;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
  }
  .cover-img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    border: 1px solid #334155;
    margin-bottom: 2rem;
  }
  footer {
    border-top: 1px solid #27272a;
    margin-top: 3rem;
    padding-top: 1.5rem;
    font-size: 0.875rem;
    color: #64748b;
  }
  .nav-bar {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

function markdownResponse(content: string): Response {
  const tokens = Math.ceil(content.length / 4);
  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'x-markdown-tokens': tokens.toString(),
      'Vary': 'Accept',
      'Cache-Control': 'public, max-age=300',
    },
  });
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const path = url.pathname;
  const acceptHeader = context.request.headers.get('accept') ?? '';
  const wantsMarkdown = acceptHeader.includes('text/markdown') || acceptHeader.includes('text/x-markdown');
  const ua = context.request.headers.get('user-agent') ?? '';

  // 1. SPECIFIC WELL-KNOWN ENDPOINTS & ROUTING RULES
  if (path === '/.well-known/api-catalog') {
    const catalogData = {
      linkset: [
        {
          anchor: 'https://demo-api.xmr402.org/intel',
          'service-desc': [
            {
              href: 'https://xmr402.org/openapi.json',
              type: 'application/json',
            },
          ],
          'service-doc': [
            {
              href: 'https://xmr402.org/llms.txt',
              type: 'text/markdown',
            },
          ],
          status: [
            {
              href: 'https://demo-api.xmr402.org/intel',
            },
          ],
        },
      ],
    };
    return new Response(JSON.stringify(catalogData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/linkset+json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  if (path === '/auth.md' || path === '/.well-known/auth.md') {
    const authMd = `# auth.md - XMR402 Autonomous Agent Authentication & Discovery

> XMR402 is an open, stateless, anonymous payment and authentication primitive for the machine economy. Unlike legacy OAuth workflows that require human identity, email verification, or KYC accounts, XMR402 allows any autonomous software agent to prove authorization cryptographically without identity registration.

---

## 1. Agent Audience & Philosophy

- **Target Audience:** Autonomous AI Agents (LLM runtimes, LangChain, AutoGPT, CrewAI, Eliza, AgentKit), API clients, and P2P messaging relays.
- **Identity Model:** **Anonymous & Stateless**. No account registration, no credit cards, no email verification, no biometric passports.
- **Security Primitive:** Monero (XMR) Transaction Proofs (\`get_tx_proof\` / \`check_tx_proof\`) with HMAC-bound intent nonces.

---

## 2. Registration and Provisioning Endpoints

Because XMR402 operates on an anonymous, stateless model, agents do not provision permanent accounts or register human identities. Provisioning of temporary bearer tokens or one-time access is performed dynamically at the resource boundary:

- **Registration / Challenge URI:** \`https://demo-api.xmr402.org/intel\`
- **Claim URI:** \`https://demo-api.xmr402.org/intel\`
- **Revocation:** Stateless; challenges expire after the timestamp window (default 300s).

---

## 3. Supported Authentication Methods

1. **\`xmr402-tx-proof\`**: Cryptographic Monero zero-confirmation transaction proof verification (\`WWW-Authenticate: XMR402\` challenge / \`Authorization: XMR402\` response).
2. **\`anonymous\`**: Instantaneous, identity-free authorization granted via single-use transaction proof verification.

---

## 4. Credential Use & Verification Flow (HTTP 402 Handshake)

1. **Discovery:** Agent requests a protected resource (e.g. \`GET https://demo-api.xmr402.org/intel\`).
2. **Challenge:** Server returns HTTP 402 with challenge details:
   \`\`\`http
   HTTP/1.1 402 Payment Required
   WWW-Authenticate: XMR402 address="8...", amount="1000", message="<nonce_hmac>", timestamp="1772937600"
   \`\`\`
3. **Settlement:** Agent sends payment to the single-use subaddress and derives an unforgeable cryptographic proof signature.
4. **Credential Presentation:** Agent retries with the credential header:
   \`\`\`http
   GET /intel HTTP/1.1
   Authorization: XMR402 txid="<tx_hash>", proof="<proof_signature>"
   \`\`\`
5. **Access Granted:** Server verifies the signature statelessly via Monero node RPC in ~200ms and grants access.

---

## 5. Machine-Readable Metadata & Discovery

- **OAuth Protected Resource Metadata (PRM):** \`https://xmr402.org/.well-known/oauth-protected-resource\`
- **OAuth Authorization Server Metadata:** \`https://xmr402.org/.well-known/oauth-authorization-server\`
- **API Catalog (RFC 9727):** \`https://xmr402.org/.well-known/api-catalog\`
- **ARD AI Catalog:** \`https://xmr402.org/.well-known/ai-catalog.json\`
- **Agent Skills Index:** \`https://xmr402.org/.well-known/agent-skills/index.json\`
- **A2A Agent Card:** \`https://xmr402.org/.well-known/agent-card.json\`
- **MCP Server Card:** \`https://xmr402.org/.well-known/mcp/server-card.json\`
- **Agent Capabilities Manifest:** \`https://xmr402.org/.well-known/agents.json\`
- **OpenAPI 3.1 Spec:** \`https://xmr402.org/openapi.json\`
- **LLM Context:** \`https://xmr402.org/llms.txt\`
- **Full LLM Knowledge Base:** \`https://xmr402.org/llms-full.txt\`

---

## 6. Supported Anonymous Credentials & Flow Metadata

- \`identity_types_supported\`: \`["anonymous"]\`
- \`anonymous.credential_types_supported\`: \`["xmr402_proof"]\`
- \`claim_uri\`: \`https://demo-api.xmr402.org/intel\`
- \`bearer_methods_supported\`: \`["header"]\`
`;
    return markdownResponse(authMd);
  }

  if (path === '/.well-known/oauth-protected-resource') {
    const prm = {
      resource: 'https://xmr402.org',
      authorization_servers: ['https://xmr402.org'],
      scopes_supported: ['read:intel', 'stream:relay'],
      bearer_methods_supported: ['header'],
    };
    return new Response(JSON.stringify(prm, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  if (path === '/.well-known/oauth-authorization-server') {
    const as = {
      issuer: 'https://xmr402.org',
      authorization_endpoint: 'https://demo-api.xmr402.org/intel',
      token_endpoint: 'https://demo-api.xmr402.org/intel',
      jwks_uri: 'https://demo-api.xmr402.org/.well-known/jwks.json',
      scopes_supported: ['read:intel', 'stream:relay'],
      response_types_supported: ['token'],
      grant_types_supported: [
        'urn:ietf:params:oauth:grant-type:token-exchange',
        'client_credentials',
      ],
      identity_types_supported: ['anonymous'],
      agent_auth: {
        skill: 'https://xmr402.org/auth.md',
        register_uri: 'https://demo-api.xmr402.org/intel',
        claim_uri: 'https://demo-api.xmr402.org/intel',
        identity_types_supported: ['anonymous'],
        supported_methods: ['xmr402-tx-proof', 'anonymous'],
        anonymous: {
          credential_types_supported: ['xmr402_proof'],
          claim_uri: 'https://demo-api.xmr402.org/intel',
        },
      },
      anonymous: {
        credential_types_supported: ['xmr402_proof'],
        claim_uri: 'https://demo-api.xmr402.org/intel',
      },
    };
    return new Response(JSON.stringify(as, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  if (path === '/.well-known/ai-catalog.json') {
    const ardCatalog = {
      specVersion: '1.0',
      host: {
        displayName: 'XMR402 Protocol',
        identifier: 'did:web:xmr402.org',
      },
      entries: [
        {
          identifier: 'urn:air:xmr402.org:mcp:server',
          displayName: 'XMR402 MCP Server',
          type: 'application/mcp-server-card+json',
          url: 'https://xmr402.org/.well-known/mcp/server-card.json',
          representativeQueries: [
            'access anonymous paywalled intelligence streams',
            'fetch real-time monero payment challenges',
            'verify zero confirmation monero transaction proofs',
          ],
        },
        {
          identifier: 'urn:air:xmr402.org:agent:gateway',
          displayName: 'XMR402 Payment Gateway Agent',
          type: 'application/json',
          url: 'https://xmr402.org/.well-known/agent-card.json',
          representativeQueries: [
            'autonomous agent to agent settlement',
            'settle monero tx proofs without KYC accounts',
            'request machine payable resource challenge',
          ],
        },
        {
          identifier: 'urn:air:xmr402.org:api:intel',
          displayName: 'XMR402 Intelligence API',
          type: 'application/linkset+json',
          url: 'https://xmr402.org/.well-known/api-catalog',
          representativeQueries: [
            'inspect machine payable http 402 specifications',
            'query private paywall intelligence feeds',
            'rfc 9727 api catalog for monero payments',
          ],
        },
      ],
    };
    return new Response(JSON.stringify(ardCatalog, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  if (path === '/.well-known/agent-skills/index.json' || path === '/.well-known/skills/index.json') {
    const agentSkillsIndex = {
      $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
      skills: [
        {
          name: 'xmr402-payment',
          type: 'skill-md',
          description: 'Autonomous Monero HTTP 402 payment challenge settlement and tx-proof verification for AI agents.',
          url: '/.well-known/agent-skills/xmr402-payment/SKILL.md',
          digest: 'sha256:63306ae5dfb246cdb32df0a01d249504f9757f6913d14c11857517947e1bdbcc',
        },
      ],
    };
    return new Response(JSON.stringify(agentSkillsIndex, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  if (path === '/.well-known/acp.json') {
    const acp = {
      protocol: {
        name: 'acp',
        version: '1.0.0',
      },
      api_base_url: 'https://demo-api.xmr402.org',
      transports: ['http', 'websocket'],
      capabilities: {
        services: [
          'payments',
          'proof-verification',
          'challenge-generation',
          'intel-feed',
        ],
      },
      endpoints: {
        challenge: 'https://demo-api.xmr402.org/intel',
        verify: 'https://demo-api.xmr402.org/intel',
        relay: 'wss://demo-api.xmr402.org/relay',
      },
    };
    return new Response(JSON.stringify(acp, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  if (path === '/.well-known/ucp') {
    const ucp = {
      ucp: {
        version: '2026-04-08',
        services: {
          'dev.ucp.shopping': [
            {
              transport: 'rest',
              endpoint: 'https://demo-api.xmr402.org/intel',
              version: '2026-04-08',
            },
          ],
        },
        capabilities: {
          'dev.ucp.shopping.checkout': [
            {
              version: '2026-04-08',
              spec: 'https://ucp.dev/specification/overview/',
            },
          ],
        },
      },
      protocol_version: '1.0.0',
      services: [
        {
          id: 'xmr402-payments',
          name: 'XMR402 Content & API Payments',
          description: 'Universal autonomous content gating and micro-settlements using zero-confirmation Monero proofs',
          spec_url: 'https://xmr402.org/openapi.json',
        },
      ],
      capabilities: {
        streaming: true,
        instant_settlement: true,
        stateless_verification: true,
      },
      endpoints: {
        challenge: 'https://demo-api.xmr402.org/intel',
        verification: 'https://demo-api.xmr402.org/intel',
        catalog: 'https://xmr402.org/.well-known/api-catalog',
      },
    };
    return new Response(JSON.stringify(ucp, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // Handle 404 for unknown /.well-known probes (prevents SPA soft-404 HTML)
  const KNOWN_WELL_KNOWN = [
    '/.well-known/api-catalog',
    '/.well-known/ai-catalog.json',
    '/.well-known/agent-skills/index.json',
    '/.well-known/skills/index.json',
    '/.well-known/acp.json',
    '/.well-known/ucp',
    '/.well-known/agents.json',
    '/.well-known/agent-card.json',
    '/.well-known/mcp/server-card.json',
    '/.well-known/llms.txt',
    '/.well-known/llms-full.txt',
    '/.well-known/ai-plugin.json',
    '/.well-known/oauth-protected-resource',
    '/.well-known/oauth-authorization-server',
    '/.well-known/auth.md',
  ];
  if (
    path.startsWith('/.well-known/') &&
    !KNOWN_WELL_KNOWN.includes(path) &&
    !path.startsWith('/.well-known/agent-skills/')
  ) {
    return new Response(JSON.stringify({ error: 'Not found', path }), {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  // 1.5. x402 PAYMENT PROTOCOL MIDDLEWARE (HTTP 402 for /api and /api/v1)
  if (path === '/api' || path === '/api/' || path === '/api/v1' || path === '/api/v1/') {
    const challengeHeader = 'XMR402 address="82txTMTFiXihfBeJL5E6keb1p8pzGhdAMb1u6dwnCu66hBgP8orJSKAMuAMjg5HkaTaSTRUVDHo67WAv3FFjt4CW73b8scF", amount="1000", message="nonce_x402_challenge", timestamp="1772937600"';
    const paymentRequiredObj = {
      x402Version: 1,
      version: '1.0',
      scheme: 'exact',
      network: 'monero',
      address: '82txTMTFiXihfBeJL5E6keb1p8pzGhdAMb1u6dwnCu66hBgP8orJSKAMuAMjg5HkaTaSTRUVDHo67WAv3FFjt4CW73b8scF',
      amount: '1000',
      currency: 'XMR',
      facilitator: 'https://demo-api.xmr402.org/intel',
      description: 'XMR402 autonomous machine access challenge',
    };
    const b64 = btoa(JSON.stringify(paymentRequiredObj));
    const x402Response = {
      protocol: 'x402',
      version: '1.0',
      facilitator: 'https://demo-api.xmr402.org/intel',
      wallet: '82txTMTFiXihfBeJL5E6keb1p8pzGhdAMb1u6dwnCu66hBgP8orJSKAMuAMjg5HkaTaSTRUVDHo67WAv3FFjt4CW73b8scF',
      amount: 1000,
      currency: 'XMR',
      payment_url: 'https://demo-api.xmr402.org/intel',
      error: 'Payment Required',
      message: 'x402 payment protocol challenge issued. Pay Monero atomic units and provide tx proof.',
      challenge: challengeHeader,
    };
    return new Response(JSON.stringify(x402Response, null, 2), {
      status: 402,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'WWW-Authenticate': challengeHeader,
        'Payment-Required': b64,
        'PAYMENT-REQUIRED': b64,
        'x-payment-required': b64,
        'x402-facilitator': 'https://demo-api.xmr402.org/intel',
        'x402-wallet': '82txTMTFiXihfBeJL5E6keb1p8pzGhdAMb1u6dwnCu66hBgP8orJSKAMuAMjg5HkaTaSTRUVDHo67WAv3FFjt4CW73b8scF',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'WWW-Authenticate, Payment-Required, PAYMENT-REQUIRED, x-payment-required, x402-facilitator, x402-wallet',
      },
    });
  }

  // 2. MARKDOWN CONTENT NEGOTIATION (Accept: text/markdown)
  if (wantsMarkdown) {
    // A) Blog Post in Markdown
    const postMatch = path.match(/^(?:\/(en|zh-TW|ru|es|pt|ja))?\/blog\/([a-z0-9-]+)\/?$/);
    if (postMatch) {
      const lang = (postMatch[1] as SupportedLang) ?? 'en';
      const slug = postMatch[2];
      const post = await context.env.BLOG_KV.get<BlogPost>(`post:${slug}`, 'json');
      if (post) {
        const title = post.title[lang] ?? post.title.en;
        const desc = post.description[lang] ?? post.description.en;
        const body = post.content[lang] ?? post.content.en;
        const tags = (post.tags || []).join(', ');

        const md = `# ${title}\n\n> ${desc}\n\n- **Author:** ${post.author}\n- **Date:** ${post.date.split('T')[0]}\n- **Tags:** ${tags}\n- **Canonical:** https://xmr402.org/blog/${slug}\n\n---\n\n${body}\n`;
        return markdownResponse(md);
      }
    }

    // B) Blog Index in Markdown
    const listMatch = path.match(/^(?:\/(en|zh-TW|ru|es|pt|ja))?\/blog\/?$/);
    if (listMatch) {
      const lang = (listMatch[1] as SupportedLang) ?? 'en';
      const index: BlogPostMeta[] = (await context.env.BLOG_KV.get('posts:index', 'json')) ?? [];
      let md = `# XMR402 Transmissions & Research\n\n> Technical articles, protocol analyses, and research on autonomous agent payments, zero-confirmation Monero settlements, and surveillance capitalism.\n\n`;
      index.forEach((p) => {
        const pTitle = p.title[lang] ?? p.title.en;
        const pDesc = p.description[lang] ?? p.description.en;
        const pUrl = `https://xmr402.org/blog/${p.slug}`;
        md += `### [${pTitle}](${pUrl})\n\n${pDesc}\n\n*Date: ${p.date.split('T')[0]} | Author: ${p.author} | Tags: ${p.tags.join(', ')}*\n\n---\n\n`;
      });
      return markdownResponse(md);
    }

    // C) Homepage in Markdown
    const homeMatch = path.match(/^(?:\/(en|zh-TW|ru|es|pt|ja))?\/?$/);
    if (homeMatch) {
      const md = `# XMR402: The Stateless, Anonymous Payment Primitive for the Machine Economy\n\n> XMR402 (https://xmr402.org) is the open, neutral payment protocol for autonomous AI agents, APIs, and P2P relays. It implements the IETF HTTP 402 Payment Required standard powered by Monero (XMR) transaction proofs (TX Proofs) with zero accounts, zero protocol fees, and sub-200ms verification.\n\n## Core Protocol Specification\n\n1. Client requests a protected resource (e.g. \`GET /intel\`).\n2. Server responds with HTTP 402 and a challenge header:\n   \`WWW-Authenticate: XMR402 address="8...", amount="1000", message="nonce_hmac", timestamp="1772937600"\`\n3. Client pays Monero atomic units and derives a cryptographic transaction proof (\`get_tx_proof\`).\n4. Client retries with proof header:\n   \`Authorization: XMR402 txid="<hash>", proof="<signature>"\`\n5. Server verifies proof statelessly using Monero node RPC \`check_tx_proof\` (~200ms) and grants access.\n\n## Links & Endpoints\n\n- Full Knowledge Base: https://xmr402.org/llms-full.txt\n- Live Sandbox: https://demo-api.xmr402.org/intel\n- Agent Discovery: https://xmr402.org/.well-known/agents.json\n- Whitepaper: https://xmr402.org/XMR402_Whitepaper.pdf\n`;
      return markdownResponse(md);
    }
  }

  // 3. SEARCH BOT & AI SCRAPER SSR PRE-RENDERING
  if (isBot(ua)) {
    // A) Blog Post SSR
    const postMatch = path.match(/^(?:\/(en|zh-TW|ru|es|pt|ja))?\/blog\/([a-z0-9-]+)\/?$/);
    if (postMatch) {
      const lang = (postMatch[1] as SupportedLang) ?? 'en';
      const slug = postMatch[2];
      const post = await context.env.BLOG_KV.get<BlogPost>(`post:${slug}`, 'json');
      if (!post) return context.next();

      const title = escapeHtml(post.title[lang] ?? post.title.en);
      const desc = escapeHtml(post.description[lang] ?? post.description.en);
      const rawContent = post.content[lang] ?? post.content.en;
      const htmlContent = markdownToHtml(rawContent);
      const img = escapeHtml(post.coverImage ?? post.ogImage ?? 'https://xmr402.org/og-image.jpg');
      const canonicalUrl = `https://xmr402.org/blog/${slug}`;
      const pageUrl = `https://xmr402.org${lang === 'en' ? '' : `/${lang}`}/blog/${slug}`;
      const tags = post.tags || [];

      const jsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BlogPosting',
            '@id': `${canonicalUrl}#article`,
            isPartOf: {
              '@type': 'WebSite',
              name: 'XMR402',
              url: 'https://xmr402.org',
            },
            headline: post.title[lang] ?? post.title.en,
            description: post.description[lang] ?? post.description.en,
            image: [img],
            datePublished: post.date,
            dateModified: post.updatedAt ?? post.date,
            author: {
              '@type': 'Person',
              name: post.author,
              url: 'https://x.com/xbtoshi',
            },
            publisher: {
              '@type': 'Organization',
              name: 'XMR402',
              url: 'https://xmr402.org',
              logo: {
                '@type': 'ImageObject',
                url: 'https://xmr402.org/favicon.svg',
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': canonicalUrl,
            },
            keywords: tags.join(', '),
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://xmr402.org/',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: 'https://xmr402.org/blog',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: post.title[lang] ?? post.title.en,
                item: canonicalUrl,
              },
            ],
          },
        ],
      });

      const hreflangTags = getHreflangTags(`/blog/${slug}`);
      const tagsHtml = tags.map((t) => `<span class="tag">#${escapeHtml(t)}</span>`).join(' ');

      return new Response(
        `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | XMR402 Blog</title>
  <meta name="description" content="${desc}">
  <meta name="keywords" content="${escapeHtml(tags.join(', '))}">
  <meta name="author" content="${escapeHtml(post.author)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  ${hreflangTags}
  <!-- Open Graph -->
  <meta property="og:site_name" content="XMR402">
  <meta property="og:title" content="${title} | XMR402 Blog">
  <meta property="og:description" content="${desc}">
  <meta property="og:type" content="article">
  <meta property="og:image" content="${img}">
  <meta property="og:url" content="${pageUrl}">
  <meta property="article:published_time" content="${post.date}">
  <meta property="article:author" content="${escapeHtml(post.author)}">
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@xmr402">
  <meta name="twitter:creator" content="@xbtoshi">
  <meta name="twitter:title" content="${title} | XMR402 Blog">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="${img}">
  <script type="application/ld+json">${jsonLd}</script>
  <style>${COMMON_STYLES}</style>
</head>
<body>
  <div class="container">
    <div class="nav-bar">
      <a href="/">← Home</a>
      <a href="/blog">Blog Index</a>
      <a href="/ecosystem">Ecosystem</a>
      <a href="/llms.txt">llms.txt</a>
      <a href="/XMR402_Whitepaper.pdf">Whitepaper (PDF)</a>
    </div>
    <header>
      <div class="meta">
        <span>📅 ${escapeHtml(post.date.split('T')[0])}</span> •
        <span>✍️ ${escapeHtml(post.author)}</span>
      </div>
      <h1>${title}</h1>
      <p style="font-size: 1.1rem; color: #94a3b8; line-height: 1.5;">${desc}</p>
      <div style="margin-top: 1rem;">${tagsHtml}</div>
    </header>

    ${post.coverImage ? `<img src="${escapeHtml(post.coverImage)}" alt="${title}" class="cover-img" />` : ''}

    <article class="content">
      ${htmlContent}
    </article>

    <footer>
      <p>
        <a href="/blog">← Back to all transmissions</a> •
        <a href="https://xmr402.org">XMR402 Home</a> •
        <a href="https://xmr402.org/llms-full.txt">Full LLM Reference</a> •
        <a href="https://github.com/xmr402/XMR402-org">GitHub</a>
      </p>
      <p>© 2026 XMR402 Protocol • The Tactical Standard for AI-Native Payments</p>
    </footer>
  </div>
</body>
</html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300' } }
      );
    }

    // B) Blog Index SSR
    const listMatch = path.match(/^(?:\/(en|zh-TW|ru|es|pt|ja))?\/blog\/?$/);
    if (listMatch) {
      const lang = (listMatch[1] as SupportedLang) ?? 'en';
      const index: BlogPostMeta[] = (await context.env.BLOG_KV.get('posts:index', 'json')) ?? [];

      const canonicalUrl = 'https://xmr402.org/blog';
      const pageUrl = `https://xmr402.org${lang === 'en' ? '' : `/${lang}`}/blog`;
      const hreflangTags = getHreflangTags('/blog');

      const postsHtml = index
        .map((p) => {
          const pTitle = escapeHtml(p.title[lang] ?? p.title.en);
          const pDesc = escapeHtml(p.description[lang] ?? p.description.en);
          const pUrl = `${lang === 'en' ? '' : `/${lang}`}/blog/${p.slug}`;
          const pTags = (p.tags || []).slice(0, 4).map((t) => `<span class="tag">#${escapeHtml(t)}</span>`).join(' ');
          return `
            <article style="border: 1px solid #1e293b; background: #0f172a; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
              <div class="meta">${escapeHtml(p.date.split('T')[0])} • ${escapeHtml(p.author)}</div>
              <h2 style="margin-top: 0; border-bottom: none;"><a href="${pUrl}" style="color: #f8fafc;">${pTitle}</a></h2>
              <p>${pDesc}</p>
              <div style="margin-top: 0.75rem;">${pTags}</div>
              <div style="margin-top: 1rem;"><a href="${pUrl}" style="font-weight: 700; color: #10b981;">Read Transmission →</a></div>
            </article>
          `;
        })
        .join('\n');

      const jsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'XMR402 Transmissions & Research',
        url: canonicalUrl,
        description: 'Technical articles, protocol analyses, and research on autonomous agent payments, zero-confirmation Monero settlements, and surveillance capitalism.',
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: index.map((p, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            url: `https://xmr402.org/blog/${p.slug}`,
            name: p.title.en,
          })),
        },
      });

      return new Response(
        `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Transmissions & Research | XMR402 Blog</title>
  <meta name="description" content="Technical articles, protocol analyses, and research on autonomous agent payments, zero-confirmation Monero settlements, and surveillance capitalism.">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  ${hreflangTags}
  <meta property="og:site_name" content="XMR402">
  <meta property="og:title" content="Transmissions & Research | XMR402 Blog">
  <meta property="og:description" content="Technical articles and architectural research on stateless, anonymous payments for AI agents and APIs.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:image" content="https://xmr402.org/og-image.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Transmissions & Research | XMR402 Blog">
  <meta name="twitter:description" content="Technical articles and architectural research on stateless, anonymous payments for AI agents and APIs.">
  <meta name="twitter:image" content="https://xmr402.org/og-image.jpg">
  <script type="application/ld+json">${jsonLd}</script>
  <style>${COMMON_STYLES}</style>
</head>
<body>
  <div class="container">
    <div class="nav-bar">
      <a href="/">← Home</a>
      <a href="/ecosystem">Ecosystem</a>
      <a href="/donate">Donate</a>
      <a href="/llms.txt">llms.txt</a>
      <a href="/XMR402_Whitepaper.pdf">Whitepaper (PDF)</a>
    </div>
    <header>
      <h1>XMR402 Transmissions</h1>
      <p style="font-size: 1.1rem; color: #94a3b8;">Technical monographs, protocol comparisons, and architectural research on autonomous machine payments.</p>
    </header>

    <main>
      ${postsHtml}
    </main>

    <footer>
      <p><a href="/">XMR402 Home</a> • <a href="/llms.txt">llms.txt</a> • <a href="/sitemap.xml">XML Sitemap</a> • <a href="https://github.com/xmr402/XMR402-org">GitHub</a></p>
      <p>© 2026 XMR402 Protocol • Standardized v2.0.0</p>
    </footer>
  </div>
</body>
</html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300' } }
      );
    }

    // C) Ecosystem SSR
    const ecoMatch = path.match(/^(?:\/(en|zh-TW|ru|es|pt|ja))?\/ecosystem\/?$/);
    if (ecoMatch) {
      const lang = (ecoMatch[1] as SupportedLang) ?? 'en';
      const canonicalUrl = 'https://xmr402.org/ecosystem';
      const hreflangTags = getHreflangTags('/ecosystem');

      return new Response(
        `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ecosystem | XMR402 Protocol</title>
  <meta name="description" content="Explore the ecosystem of tools, guards, gateways, and AI agent skills built on the XMR402 payment standard.">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  ${hreflangTags}
  <meta property="og:title" content="Ecosystem | XMR402 Protocol">
  <meta property="og:description" content="Explore tools, guards, and gateways built on XMR402.">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://xmr402.org/og-image.jpg">
  <style>${COMMON_STYLES}</style>
</head>
<body>
  <div class="container">
    <div class="nav-bar">
      <a href="/">← Home</a>
      <a href="/blog">Blog</a>
      <a href="/donate">Donate</a>
      <a href="/llms.txt">llms.txt</a>
      <a href="/XMR402_Whitepaper.pdf">Whitepaper (PDF)</a>
    </div>
    <header>
      <h1>XMR402 Ecosystem</h1>
      <p>Registry of production-grade implementations, middleware guards, agent toolkits, and gateways implementing XMR402.</p>
    </header>
    <main>
      <h2>Guards & Middleware</h2>
      <article style="border: 1px solid #1e293b; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; background: #0f172a;">
        <h3>Ripley Guard</h3>
        <p>Drop-in HTTP 402 middleware for Hono, Express, and standard Node servers. Intercepts incoming requests, generates HMAC-bound payment challenges, and verifies Monero TX proofs in 200ms.</p>
        <p><strong>Package:</strong> <code>@kyc-rip/ripley-guard-ts</code> (npm) | <code>xmr402-guard</code> (crates.io)</p>
      </article>

      <h2>Agent Gateways & Runtimes</h2>
      <article style="border: 1px solid #1e293b; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; background: #0f172a;">
        <h3>Ripley XMR Gateway</h3>
        <p>A self-hosted payment bridge and automated executor for autonomous AI agents. Listens for 402 challenges and fulfills them autonomously using local wallet RPCs.</p>
      </article>

      <h2>Wallets & Terminals</h2>
      <article style="border: 1px solid #1e293b; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; background: #0f172a;">
        <h3>Ripley Terminal</h3>
        <p>Tactical desktop wallet with native deep-linking support for <code>xmr402://</code> protocol challenges.</p>
      </article>

      <h2>AI Agent Toolkits</h2>
      <article style="border: 1px solid #1e293b; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; background: #0f172a;">
        <h3>Monero-MCP</h3>
        <p>Model Context Protocol (MCP) server equipping LLMs (Claude, ChatGPT) with sovereign payment tools.</p>
      </article>
    </main>
    <footer>
      <p><a href="/">XMR402 Home</a> • <a href="https://github.com/xmr402/ecosystem">Submit Project on GitHub</a></p>
    </footer>
  </div>
</body>
</html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300' } }
      );
    }

    // D) Donate SSR
    const donateMatch = path.match(/^(?:\/(en|zh-TW|ru|es|pt|ja))?\/donate\/?$/);
    if (donateMatch) {
      const lang = (donateMatch[1] as SupportedLang) ?? 'en';
      const canonicalUrl = 'https://xmr402.org/donate';
      const hreflangTags = getHreflangTags('/donate');

      return new Response(
        `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Donate & Support | XMR402 Protocol</title>
  <meta name="description" content="Support open-source development of XMR402 and sovereign, privacy-preserving infrastructure for the autonomous machine economy.">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  ${hreflangTags}
  <meta property="og:title" content="Donate & Support | XMR402 Protocol">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://xmr402.org/og-image.jpg">
  <style>${COMMON_STYLES}</style>
</head>
<body>
  <div class="container">
    <div class="nav-bar">
      <a href="/">← Home</a>
      <a href="/blog">Blog</a>
      <a href="/ecosystem">Ecosystem</a>
      <a href="/llms.txt">llms.txt</a>
    </div>
    <header>
      <h1>Support XMR402 Development</h1>
      <p>XMR402 is 100% community-funded, open source, and free of venture capital or protocol rent-seeking.</p>
    </header>
    <main>
      <h2>General Development Fund</h2>
      <p>All contributions directly support protocol specification engineering, reference client maintenance, and developer sandboxes.</p>
      <p><strong>Primary Monero (XMR) Address:</strong></p>
      <pre><code>82txTMTFiXihfBeJL5E6keb1p8pzGhdAMb1u6dwnCu66hBgP8orJSKAMuAMjg5HkaTaSTRUVDHo67WAv3FFjt4CW73b8scF</code></pre>
      <p><strong>OpenAlias:</strong> <code>donate.xmr402.org</code></p>
    </main>
    <footer>
      <p><a href="/">← Back to Home</a> • © 2026 XMR402</p>
    </footer>
  </div>
</body>
</html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300' } }
      );
    }

    // E) Homepage SSR
    const homeMatch = path.match(/^(?:\/(en|zh-TW|ru|es|pt|ja))?\/?$/);
    if (homeMatch) {
      const lang = (homeMatch[1] as SupportedLang) ?? 'en';
      const canonicalUrl = 'https://xmr402.org/';
      const hreflangTags = getHreflangTags('/');

      const jsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': 'https://xmr402.org/#website',
            name: 'XMR402',
            url: 'https://xmr402.org/',
            description: 'The Tactical Standard for AI-Native Payments. Stateless, anonymous HTTP 402 payment protocol powered by Monero.',
            publisher: {
              '@type': 'Organization',
              name: 'XMR402',
              url: 'https://xmr402.org',
              logo: 'https://xmr402.org/favicon.svg',
              sameAs: [
                'https://x.com/xmr402',
                'https://github.com/xmr402/XMR402-org',
              ],
            },
          },
          {
            '@type': 'SoftwareApplication',
            name: 'XMR402',
            applicationCategory: 'PaymentApplication',
            operatingSystem: 'All',
            description: 'A transport-agnostic, stateless payment protocol implementing IETF HTTP 402 using Monero transaction proofs.',
            url: 'https://xmr402.org',
            softwareVersion: '2.0.0',
          },
          {
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What is XMR402 used for?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'XMR402 is designed for high-frequency, low-friction micro-payments. Key use cases include pay-per-request API access, dynamic content gating, autonomous AI agent interactions, and decentralized service monetization without traditional accounts or KYC.',
                },
              },
              {
                '@type': 'Question',
                name: 'Is XMR402 production ready?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'The XMR402 v2.0 specification is finalized. Stable reference implementations are available in TypeScript, Go, and Rust. It is deployed across the Ripley AI ecosystem.',
                },
              },
              {
                '@type': 'Question',
                name: 'How do I integrate XMR402?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Integration requires a single middleware line. Server developers deploy Ripley Guard to issue challenges. Clients handle HTTP 402 responses by paying and returning the Authorization header with a TX proof.',
                },
              },
              {
                '@type': 'Question',
                name: 'What blockchains does XMR402 support?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'XMR402 prioritizes Monero (XMR) due to its default stealth addresses, RingCT, FCMP++ anonymity set, and native zero-confirmation transaction proof verification.',
                },
              },
              {
                '@type': 'Question',
                name: 'Does it require a special wallet?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'XMR402 is compatible with any wallet supporting the Monero Transaction Proof standard (get_tx_proof). For human desktop usage, Ripley Terminal is recommended. For agents, Ripley Gateway handles automated execution.',
                },
              },
            ],
          },
        ],
      });

      return new Response(
        `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>XMR402 | The Tactical Standard for AI-Native Payments</title>
  <meta name="description" content="XMR402 is an open, neutral standard for internet-native payments. It empowers agentic micro-transactions between clients and servers with zero friction and maximum privacy.">
  <meta name="keywords" content="XMR402, Monero, AI Payments, Micro-transactions, HTTP 402, Agentic Web, Privacy Payments, Stateless Payments, FCMP++">
  <meta name="author" content="@xbtoshi">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  ${hreflangTags}
  <meta property="og:site_name" content="XMR402">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://xmr402.org/">
  <meta property="og:title" content="XMR402 | The Tactical Standard for AI-Native Payments">
  <meta property="og:description" content="Natively integrated payments for the agentic web. Zero friction, zero protocol fees, pure sovereignty.">
  <meta property="og:image" content="https://xmr402.org/og-image.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:creator" content="@xbtoshi">
  <meta name="twitter:title" content="XMR402 | The Tactical Standard for AI-Native Payments">
  <meta name="twitter:description" content="Natively integrated payments for the agentic web. Zero friction, zero protocol fees, pure sovereignty.">
  <meta name="twitter:image" content="https://xmr402.org/og-image.jpg">
  <script type="application/ld+json">${jsonLd}</script>
  <style>${COMMON_STYLES}</style>
</head>
<body>
  <div class="container">
    <div class="nav-bar">
      <a href="/blog">Blog & Transmissions</a>
      <a href="/ecosystem">Ecosystem</a>
      <a href="/donate">Donate</a>
      <a href="/llms.txt">llms.txt</a>
      <a href="/llms-full.txt">Full LLM Specs</a>
      <a href="/XMR402_Whitepaper.pdf">Whitepaper (PDF)</a>
    </div>

    <header>
      <div style="font-family: monospace; font-size: 0.8rem; color: #10b981; margin-bottom: 0.5rem; text-transform: uppercase;">PROTOCOL v2.0.0 • TRANSPORT AGNOSTIC</div>
      <h1>XMR402</h1>
      <p style="font-size: 1.25rem; font-weight: 700; color: #f1f5f9; margin-top: 0.5rem;">The Internet's Sovereign Payment Primitive for Agents, APIs, & Relays.</p>
      <p style="font-size: 1.05rem; color: #94a3b8; line-height: 1.6;">XMR402 is an open, neutral standard for internet-native payments. In v2.0, it evolves into a decoupled, transport-agnostic primitive. Whether you're gating REST APIs via HTTP 402 or streaming P2P JSON frames over WebSockets, XMR402 enables any client to buy network resources in milliseconds.</p>
      <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
        <a href="/XMR402_Whitepaper.pdf" style="background: #10b981; color: #000; font-weight: 800; padding: 0.6rem 1.2rem; border-radius: 4px; text-decoration: none;">Download Whitepaper (PDF)</a>
        <a href="/blog" style="border: 1px solid #334155; color: #f8fafc; font-weight: 700; padding: 0.6rem 1.2rem; border-radius: 4px; text-decoration: none;">Read 21 Research Articles</a>
        <a href="/ecosystem" style="border: 1px solid #334155; color: #f8fafc; font-weight: 700; padding: 0.6rem 1.2rem; border-radius: 4px; text-decoration: none;">Explore Ecosystem</a>
      </div>
    </header>

    <main>
      <h2>Protocol Pillars</h2>
      <ul>
        <li><strong>Transport Agnostic:</strong> From IETF HTTP 402 Headers to persistent JSON WebSocket relays. Dumb pipes, smart cryptographic edges.</li>
        <li><strong>Payload Binding:</strong> Intent matters. Every payment is cryptographically HMAC-bound to the request payload to kill instruction-spoofing.</li>
        <li><strong>Zero Friction:</strong> No accounts, no email, no personal information needed. Just a Monero wallet and a challenge.</li>
        <li><strong>Absolute Speed:</strong> Money moves at internet speed. 0-conf verification ensures 200ms resource access.</li>
        <li><strong>Stateless Purity:</strong> No databases. No polling. No wallet tracking bloat. XMR402 relies purely on mathematics and node RPCs.</li>
        <li><strong>Zero Protocol Fees:</strong> 100% free and open source. Only standard network transaction fees apply.</li>
      </ul>

      <h2>Tactical Implementation</h2>
      <p>Server challenge header (HTTP 402):</p>
      <pre><code>WWW-Authenticate: XMR402 address="8...", amount="1000", message="nonce_123", timestamp="1772937600"</code></pre>
      <p>Client authorization header (HTTP retry):</p>
      <pre><code>Authorization: XMR402 txid="&lt;hash&gt;", proof="&lt;signature&gt;"</code></pre>

      <h2>Developer Sandbox & Live API</h2>
      <p>Test the protocol live against our public sandbox:</p>
      <ul>
        <li><strong>Endpoint:</strong> <code>https://demo-api.xmr402.org/intel</code></li>
        <li><strong>WebSocket Relay:</strong> <code>wss://demo-api.xmr402.org/relay</code></li>
        <li><strong>NPM Middleware:</strong> <code>@kyc-rip/ripley-guard-ts</code></li>
      </ul>

      <h2>Frequently Asked Questions</h2>
      <details style="margin-bottom: 1rem; border-bottom: 1px solid #1e293b; padding-bottom: 0.5rem;">
        <summary style="font-weight: 700; cursor: pointer; color: #f8fafc;">What is XMR402 used for?</summary>
        <p>XMR402 is designed for high-frequency, low-friction micro-payments: pay-per-request API access, dynamic content gating, autonomous AI agent interactions, and decentralized service monetization without KYC.</p>
      </details>
      <details style="margin-bottom: 1rem; border-bottom: 1px solid #1e293b; padding-bottom: 0.5rem;">
        <summary style="font-weight: 700; cursor: pointer; color: #f8fafc;">Is XMR402 production ready?</summary>
        <p>The XMR402 v2.0 specification is finalized. Stable reference implementations are available in TypeScript, Go, and Rust. It is deployed across the Ripley AI ecosystem.</p>
      </details>
      <details style="margin-bottom: 1rem; border-bottom: 1px solid #1e293b; padding-bottom: 0.5rem;">
        <summary style="font-weight: 700; cursor: pointer; color: #f8fafc;">How do I integrate XMR402?</summary>
        <p>Deploy Ripley Guard middleware on the server side to issue challenges and verify proofs statelessly. Configure clients to handle HTTP 402 responses with a compatible Monero wallet.</p>
      </details>
      <details style="margin-bottom: 1rem; border-bottom: 1px solid #1e293b; padding-bottom: 0.5rem;">
        <summary style="font-weight: 700; cursor: pointer; color: #f8fafc;">What blockchains does XMR402 support?</summary>
        <p>XMR402 prioritizes Monero (XMR) due to superior privacy primitives (stealth addresses, RingCT, FCMP++) and native transaction proof capabilities.</p>
      </details>
      <details style="margin-bottom: 1rem; border-bottom: 1px solid #1e293b; padding-bottom: 0.5rem;">
        <summary style="font-weight: 700; cursor: pointer; color: #f8fafc;">Does it require a special wallet?</summary>
        <p>XMR402 is compatible with any wallet supporting Monero Transaction Proofs (get_tx_proof). We recommend Ripley Terminal for desktop users and Ripley Gateway for autonomous agents.</p>
      </details>
    </main>

    <footer>
      <p>
        <a href="https://x.com/xmr402">@XMR402</a> •
        <a href="https://github.com/xmr402/XMR402-org">GitHub Repository</a> •
        <a href="/blog">Blog</a> •
        <a href="/donate">Donate</a> •
        <a href="/llms.txt">llms.txt</a> •
        <a href="/sitemap.xml">Sitemap</a>
      </p>
      <p>© 2026 XMR402 Protocol • Standardized v2.0.0</p>
    </footer>
  </div>
</body>
</html>`,
        {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Link': RFC8288_LINK_HEADERS,
            'Cache-Control': 'public, max-age=300',
          },
        }
      );
    }
  }

  // 4. NORMAL BROWSER REQUESTS -> HANDOFF TO NEXT (SPA)
  // Ensure RFC 8288 Link headers are present on the homepage for all clients
  const response = await context.next();
  if (path === '/' || path === '') {
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Link', RFC8288_LINK_HEADERS);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  }

  return response;
};
