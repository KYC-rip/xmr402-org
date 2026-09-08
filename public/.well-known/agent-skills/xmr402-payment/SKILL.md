---
name: xmr402-payment
description: Autonomous Monero HTTP 402 payment challenge settlement and tx-proof verification for AI agents.
---

# XMR402 Payment Skill

Autonomous Monero HTTP 402 payment challenge settlement and zero-confirmation transaction proof verification for AI agents.

## What This Skill Does

Enables autonomous software agents, LLMs, and API clients to interact with XMR402-gated endpoints without human identity or KYC credentials:
1. Detects `HTTP 402 Payment Required` responses.
2. Parses `WWW-Authenticate: XMR402 address="...", amount="...", message="...", timestamp="..."`.
3. Dispatches Monero transfer via local wallet RPC (`transfer` or `transfer_split`).
4. Generates an unforgeable cryptographic payment proof via `get_tx_proof(txid, address, message)`.
5. Retries the HTTP request with `Authorization: XMR402 txid="...", proof="..."`.

## Endpoints

- **Live Sandbox:** `https://demo-api.xmr402.org/intel`
- **WebSocket Relay:** `wss://demo-api.xmr402.org/relay`
- **Discovery Card:** `https://xmr402.org/.well-known/agent-card.json`
- **MCP Card:** `https://xmr402.org/.well-known/mcp/server-card.json`
- **OAuth PRM:** `https://xmr402.org/.well-known/oauth-protected-resource`
- **Auth.md:** `https://xmr402.org/auth.md`
