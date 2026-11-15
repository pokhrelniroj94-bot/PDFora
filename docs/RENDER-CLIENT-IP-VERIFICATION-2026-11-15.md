# Render client-IP and service verification notes

Date: 2026-11-15

## Code change

The backend no longer treats the presence of `RENDER=true` or an arbitrary `CF-Connecting-IP` header as proof of a trusted proxy. `_client_ip()` now:

1. Parses the actual socket peer address.
2. Reads `PDFORA_TRUSTED_PROXY_CIDRS` as comma-separated IPv4/IPv6 CIDRs.
3. Uses `CF-Connecting-IP` only when the socket peer is inside one of those explicitly configured networks.
4. Ignores `X-Forwarded-For` completely.
5. Falls back to the parsed socket peer when no trusted proxy match exists.

Regression tests cover an attacker-supplied forwarding header with no trusted CIDR and a valid trusted-proxy case.

## Render runtime status: not verified

The Render service endpoints were unreachable from the available execution environment during this work. The following therefore remain unverified and must not be treated as completed:

- Which Render service ID currently receives production traffic.
- Whether the frontend points to `PDFora` or `PDFora-backend`.
- The actual socket peer address observed by the running backend.
- The exact Cloudflare/Render proxy CIDRs that reach the application.
- Whether a trusted-proxy CIDR value can safely be configured for the live service.
- Live health, logs, rate-limit behaviour and whether all users are assigned distinct client IPs.

Do not populate `PDFORA_TRUSTED_PROXY_CIDRS` with guessed networks. Verify the real peer addresses from trusted Render/Cloudflare infrastructure documentation or live service logs first. Until configured, the backend safely uses the socket peer; if Render terminates all requests through a shared proxy, rate limits may be shared across visitors. That operational trade-off is explicit rather than silently trusting spoofable headers.

## Service inventory safeguard

No Render service, environment variable, deployment, or data store was changed. Do not delete either similarly named service until the production frontend's configured backend URL and service IDs are verified in the Render dashboard.
