# auth.md - XMR402 Autonomous Agent Authentication & Discovery

> XMR402 is an open, stateless, anonymous payment and authentication primitive for the machine economy. Unlike legacy OAuth workflows that require human identity, email verification, or KYC accounts, XMR402 allows any autonomous software agent to prove authorization cryptographically without identity registration.

---

## 1. Agent Audience & Philosophy

- **Target Audience:** Autonomous AI Agents (LLM runtimes, LangChain, AutoGPT, CrewAI, Eliza, AgentKit), API clients, and P2P messaging relays.
- **Identity Model:** **Anonymous & Stateless**. No account registration, no credit cards, no email verification, no biometric passports.
- **Security Primitive:** Monero (XMR) Transaction Proofs (`get_tx_proof` / `check_tx_proof`) with HMAC-bound intent nonces.

---

## 2. Registration and Provisioning Endpoints

Because XMR402 operates on an anonymous, stateless model, agents do not provision permanent accounts or register human identities. Provisioning of temporary bearer tokens or one-time access is performed dynamically at the resource boundary:

- **Registration / Challenge URI:** `https://demo-api.xmr402.org/intel`
- **Claim URI:** `https://demo-api.xmr402.org/intel`
- **Revocation:** Stateless; challenges expire after the timestamp window (default 300s).

---

## 3. Supported Authentication Methods

1. **`xmr402-tx-proof`**: Cryptographic Monero zero-confirmation transaction proof verification (`WWW-Authenticate: XMR402` challenge / `Authorization: XMR402` response).
2. **`anonymous`**: Instantaneous, identity-free authorization granted via single-use transaction proof verification.

---

## 4. Credential Use & Verification Flow (HTTP 402 Handshake)

1. **Discovery:** Agent requests a protected resource (e.g. `GET https://demo-api.xmr402.org/intel`).
2. **Challenge:** Server returns HTTP 402 with challenge details:
   ```http
   HTTP/1.1 402 Payment Required
   WWW-Authenticate: XMR402 address="8...", amount="1000", message="<nonce_hmac>", timestamp="1772937600"
   ```
3. **Settlement:** Agent sends payment to the single-use subaddress and derives an unforgeable cryptographic proof signature.
4. **Credential Presentation:** Agent retries with the credential header:
   ```http
   GET /intel HTTP/1.1
   Authorization: XMR402 txid="<tx_hash>", proof="<proof_signature>"
   ```
5. **Access Granted:** Server verifies the signature statelessly via Monero node RPC in ~200ms and grants access.

---

## 5. Machine-Readable Metadata & Discovery

- **OAuth Protected Resource Metadata (PRM):** `https://xmr402.org/.well-known/oauth-protected-resource`
- **OAuth Authorization Server Metadata:** `https://xmr402.org/.well-known/oauth-authorization-server`
- **API Catalog (RFC 9727):** `https://xmr402.org/.well-known/api-catalog`
- **ARD AI Catalog:** `https://xmr402.org/.well-known/ai-catalog.json`
- **Agent Skills Index:** `https://xmr402.org/.well-known/agent-skills/index.json`
- **A2A Agent Card:** `https://xmr402.org/.well-known/agent-card.json`
- **MCP Server Card:** `https://xmr402.org/.well-known/mcp/server-card.json`
- **Agent Capabilities Manifest:** `https://xmr402.org/.well-known/agents.json`
- **OpenAPI 3.1 Spec:** `https://xmr402.org/openapi.json`
- **LLM Context:** `https://xmr402.org/llms.txt`
- **Full LLM Knowledge Base:** `https://xmr402.org/llms-full.txt`

---

## 6. Supported Anonymous Credentials & Flow Metadata

- `identity_types_supported`: `["anonymous"]`
- `anonymous.credential_types_supported`: `["xmr402_proof"]`
- `claim_uri`: `https://demo-api.xmr402.org/intel`
- `bearer_methods_supported`: `["header"]`
