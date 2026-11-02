# PDFora deployment security settings

## Render backend

The backend applies PDF signature checks, upload-size limits, per-route and per-IP rate limits, temporary-file cleanup, and security response headers.

Recommended Render environment variables:

- `APP_ENV=production` — disables FastAPI Swagger, ReDoc, and OpenAPI routes. Render also sets its own `RENDER=true` flag, which enables production behavior.
- `CLEANUP_ADMIN_TOKEN` — optional strong random secret, kept only in Render. The maintenance endpoint `POST /api/cleanup` returns 404 unless the matching `X-Admin-Token` header is supplied. The public frontend must never receive this value.
- `RATE_LIMIT_REDIS_URL` — optional Redis-compatible connection URL for shared rate limits across multiple backend instances. Without it, rate limits are process-local and do not coordinate between instances.
- `PDFORA_RATE_LIMIT_ROUTE` and `PDFORA_RATE_LIMIT_PER_HOUR` — optional numeric overrides for the default per-route and per-IP request limits.

CORS currently uses a fixed allowlist in `backend/main.py`. If the frontend domain changes, update that list and test browser uploads before deploying.

## Vercel frontend

The frontend sends security headers including `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and HSTS. Keep the third-party ad integrations in mind before introducing an enforcing Content Security Policy.

## Remaining controls

PDF processing endpoints are not authenticated with JWTs. Rate limiting and file validation reduce abuse but do not make the API abuse-proof. A future authentication layer needs coordinated short-lived frontend tokens, bot verification, and a shared Redis-compatible service. Do not enable backend authentication independently because that would break existing browser uploads.

## Release checks

- Run the backend regression suite and Python dependency audit.
- Run the frontend catalog verifier, ESLint, production build, and production dependency audit.
- Test PDF upload with valid, malformed, encrypted, oversized, and incorrect-MIME files.
- Test image conversion with valid JPEG/PNG/WEBP, SVG, oversized files, and high-pixel-count images.
- Verify CORS, response headers, and maintenance-endpoint access against the deployed Render service.
