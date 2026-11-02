# PDFora deployment security settings

## Render backend

Set these environment variables in the Render service:

- `APP_ENV=production` — disables FastAPI Swagger, ReDoc and OpenAPI routes.
- `CORS_ALLOWED_ORIGINS=https://pd-fora.vercel.app` — exact comma-separated frontend origins only. Add a custom production domain only if it serves this same frontend.
- `CLEANUP_ADMIN_TOKEN` — generate a long random secret (at least 32 bytes) and keep it only in Render. The `POST /api/cleanup` endpoint returns 404 unless the matching `X-Admin-Token` header is supplied.

Do not put `CLEANUP_ADMIN_TOKEN` in any frontend environment variable or browser code. No public frontend cleanup call should be added.

## Vercel frontend

The existing security headers remain enabled. Content Security Policy is initially delivered as
`Content-Security-Policy-Report-Only` so that Next.js, file uploads/downloads and approved ad
integrations can be tested before enforcing a policy. Review browser reports before changing it
to an enforcing header.

## Important remaining controls

This release does not yet enable JWT/API authentication or distributed rate limiting. Do not claim
that processing endpoints are authenticated or abuse-proof. Those controls need a coordinated
short-lived session-token flow, Turnstile verification, and a configured Redis-compatible service.
Enabling backend authentication before the frontend obtains and sends short-lived tokens would
break every PDF processing tool.

## Verification

- `GET /docs`, `GET /redoc` and `GET /openapi.json` should return 404 when `APP_ENV=production`.
- `POST /api/cleanup` without the admin header should return 404.
- `POST /api/cleanup` with a wrong token should return 404.
- Browser requests from unlisted origins should not receive an allow-origin CORS header.
- Verify response headers on both frontend and backend.
- Test every PDF tool with valid PDFs, invalid signatures, oversized files and unexpected MIME types.
