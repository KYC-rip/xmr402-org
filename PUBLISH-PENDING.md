# Pending posts — publish them all at once

Five scheduled runs (2026-09-04 → 09-08) wrote their post JSON and cover SVG successfully but could not
reach `xmr402.org` from the sandbox (`getaddrinfo EAI_AGAIN`). Nothing was lost — every file is in the
working tree and ready to go.

## Run this from the project root, on a machine with network

```bash
npm run publish-all
npm run deploy        # serves the five cover SVGs in public/
```

That's it. `publish-all` checks each post against the live API first and only sends the ones that are
missing or have changed, so it is safe to re-run as often as you like.

## Pending

| Date | Slug | Title (en) |
|---|---|---|
| 2026-09-04 | `reversal-paradox-chargeback-freeze-finality-xmr402` | The Reversal Paradox: Why Agentic Commerce Can't Decide If a Payment Is Final |
| 2026-09-05 | `cloudflare-pay-handles-agent-naming-layer-xmr402` | The Name Is the Chokepoint: Why cloudflare.pay Gives Every Agent a Permanent Payment Address |
| 2026-09-06 | `phantom-volume-wash-trading-agent-metrics-xmr402` | The Mirage Metric: Why Half of Agentic Payment "Volume" Is Wash Trading |
| 2026-09-07 | `personalized-pricing-agent-wallet-willingness-to-pay-xmr402` | The Willingness-to-Pay Oracle: How Public Agent Wallets Price You Before You Ask |
| 2026-09-08 | `agent-wallet-refill-thorchain-delistings-xmr402` | The Refill Problem: How XMR402 Agents Fund Themselves When No Exchange Will List Their Money |

Each has all six languages (en, zh-TW, ru, es, pt, ja), two mermaid diagrams, one comparison table,
and a 1200×630 cover SVG in `public/`.

## Options

```bash
npm run publish-all -- --dry-run     # show what would be sent, send nothing
npm run publish-all -- --force       # re-publish even if live and identical
npm run publish-all -- posts/a.json posts/b.json   # just these
```

Environment overrides: `BLOG_API_BASE` (default `https://xmr402.org`), `BLOG_API_KEY`
(default: the contents of `.blog-api-key`).

## What it does

1. `GET /api/blog/<slug>` for each post file — 404 means not published, 200 means compare
   title / description / content / author / date / tags / ogImage / coverImage against the live copy.
2. Skips anything already live and identical; publishes the rest via `POST /api/blog/publish`.
3. Retries transient network errors up to 3× with backoff, and aborts the whole run early if the host
   itself is unreachable rather than grinding through 21 identical failures.
4. Exits non-zero if anything failed, so it can be wired into CI or a scheduled job.

## Note on the sandbox

The daily scheduled task will keep hitting this DNS wall — it writes files fine but cannot reach the
API. Two ways to make the pipeline self-healing:

- Have the scheduled task call `npm run publish-all` instead of `publish-post`. It will keep failing in
  the sandbox, but the next time *you* run it locally every backlogged post goes out in one command.
- Or run `npm run publish-all && npm run deploy` from a local cron / CI job that does have network,
  and let the scheduled task be purely about writing content.
