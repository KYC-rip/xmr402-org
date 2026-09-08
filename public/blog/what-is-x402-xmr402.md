# What is X402 & XMR402? The Payment Standard the Internet Was Missing

> A deep dive into HTTP 402 Payment Required, the X402 open standard, and how XMR402 extends it for Monero-powered internet-native payments with 200ms verification.

- **Author:** @xbtoshi
- **Date:** 2026-03-17
- **Tags:** protocol, X402, XMR402, Monero, HTTP 402, payments
- **Canonical:** https://xmr402.org/blog/what-is-x402-xmr402

---

## The Forgotten Status Code

HTTP 402 Payment Required has existed since 1999. It was included in the original HTTP/1.1 specification (RFC 2616) alongside familiar codes like 200 OK, 404 Not Found, and 401 Unauthorized. But unlike its siblings, 402 was marked as "reserved for future use" — a placeholder for a payment layer that never materialized.

For over two decades, the internet evolved without a native payment primitive. Instead, we built fragile layers on top: credit card forms, OAuth tokens, API key dashboards, subscription paywalls. Every one of these solutions requires human identity, manual enrollment, and centralized intermediaries.

The status code was waiting for the right technology to give it meaning. That technology is here.

## Enter X402: The Open Standard

X402 is an open specification that finally gives HTTP 402 its purpose. It defines a machine-readable payment challenge-response protocol that any server can issue and any client can fulfill — without accounts, without identity, without intermediaries.

When a server protects a resource with X402, the flow is simple:

1. **Client requests a resource** — a standard HTTP GET or POST
2. **Server responds with 402** — including a `WWW-Authenticate: X402` header containing the payment challenge (address, amount, nonce)
3. **Client pays** — sends cryptocurrency to the specified address
4. **Client retries with proof** — includes an `Authorization: X402` header with the transaction ID and cryptographic proof
5. **Server verifies and unlocks** — validates the proof statelessly and returns the resource

This is HTTP as it was meant to be: stateless, open, and machine-readable. No cookies, no sessions, no API keys. Just a cryptographic handshake between two parties.

## XMR402: Monero's Tactical Advantage

XMR402 is the Monero-native implementation of the X402 standard. It leverages Monero's unique cryptographic primitives — specifically **Transaction Proof (TX Proof)** — to enable stateless, zero-confirmation payment verification.

Why Monero? Because it's the only major cryptocurrency that provides:

- **Native TX Proof**: A cryptographic proof that a specific transaction was sent to a specific address. No blockchain scanning required.
- **Privacy by default**: Stealth addresses and ring signatures mean the server never learns the payer's identity or balance.
- **Subaddress generation**: Each payment challenge can use a unique subaddress, making correlation impossible.
- **Zero-confirmation safety**: For micro-payments (the primary XMR402 use case), the economics of double-spending make 0-conf attacks impractical.

With XMR402, verification takes approximately **200 milliseconds** — the time it takes for the server to check the TX Proof against its Monero node. No block confirmations needed. No polling. No waiting.

## Protocol v2.0: Transport Agnostic

XMR402 v2.0 introduces a critical evolution: **transport agnosticism**. The protocol is no longer limited to HTTP headers. It now supports:

- **HTTP 402 Headers**: The classic IETF-standard flow for REST APIs. Server responds with `WWW-Authenticate: XMR402`, client responds with `Authorization: XMR402`.
- **WebSocket JSON Frames**: For persistent P2P connections, the same payment challenge-response can occur over WebSocket using structured JSON frames (`PAYMENT_CHALLENGE`, `PAYMENT_PROOF`).

This decoupled architecture means XMR402 can gate any network resource — REST endpoints, GraphQL queries, WebSocket streams, Nostr relay access, or any custom protocol that supports bidirectional messaging.

## Key Features

| Feature | Description |
|---------|-------------|
| **Zero Friction** | No accounts, no email, no personal information. Just a Monero wallet and a challenge. |
| **Absolute Speed** | 200ms verification via 0-conf TX Proof. Money moves at internet speed. |
| **Payload Binding** | HMAC-SHA256 binds each payment to the specific request intent, preventing instruction spoofing. |
| **Stateless** | No databases, no session tracking, no wallet bloat. Pure math and node RPCs. |
| **Zero Protocol Fees** | XMR402 charges nothing. Only standard Monero network fees apply. |
| **Privacy First** | Stealth addresses + subaddresses = zero correlation between payments. |

## The Ripley Ecosystem

XMR402 is supported by three reference implementations:

**Ripley Guard** — Server-side middleware for Hono, Express, and standard HTTP servers. Drop one line of code into your API to start accepting payments. The Guard handles challenge generation, proof verification, and resource gating automatically.

**Ripley Gateway** — A high-availability payment executor for autonomous AI agents. When an agent encounters a 402 challenge, it pipes the challenge to its local Gateway, which automatically creates the transaction and returns the Authorization header.

**Ripley Terminal** — A tactical desktop application for human users. When a browser encounters a 402 response, it triggers an `xmr402://` deep-link that wakes the Terminal, displays the payment details, and lets the user authorize with one click.

## Use Cases

XMR402 enables entirely new business models:

- **API Monetization**: Charge per-request instead of monthly subscriptions. No API keys, no dashboards, no billing infrastructure.
- **Content Paywalling**: Gate articles, videos, or data behind a micro-payment. Readers pay pennies, not $15/month.
- **AI Agent Payments**: Autonomous agents can purchase compute, data, and API access without human intervention.
- **P2P Stream Gating**: Monetize WebSocket streams, Nostr relay access, or any persistent connection.

## Getting Started

XMR402 is open source, open standard, and free to implement. The protocol specification, reference implementations, and developer sandbox are all available at [xmr402.org](https://xmr402.org).

The internet has waited 25 years for HTTP 402 to find its purpose. With XMR402, that wait is over.
