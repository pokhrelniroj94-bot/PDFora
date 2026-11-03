# PDFora Web Push setup

The opt-in web-push UI and delivery endpoints are implemented, but delivery stays disabled until the production secrets and persistent Redis store are configured.

## Render backend environment variables

Set these on the PDFora FastAPI service:

- `RATE_LIMIT_REDIS_URL`: a persistent Upstash/Redis TLS URL. Required for subscriptions to survive restarts and work across multiple instances.
- `PDFORA_VAPID_PUBLIC_KEY`: VAPID public key.
- `PDFORA_VAPID_PRIVATE_KEY`: matching VAPID private key. Keep secret; never put it in frontend variables.
- `PDFORA_VAPID_SUBJECT`: contact URI such as `mailto:admin@example.com`.
- `PDFORA_PUSH_CRON_SECRET`: long random secret used by the scheduled dispatcher.

Generate a VAPID key pair in a trusted local environment after installing the backend requirements. For example, use the `vapid` command provided by `py-vapid`; store the public and private values only in Render environment variables.

## Vercel environment variables

- `NEXT_PUBLIC_API_URL`: `https://pdfora-493r.onrender.com` (optional; this is the current default).
- `PDFORA_NEWS_CRON_SECRET`: a long random secret. This must be sent as a Bearer token when invoking the scheduled route.
- `PDFORA_PUSH_CRON_SECRET`: same value as the Render backend secret.

## Scheduled delivery

Invoke this URL every 15 minutes from a trusted scheduler (Render Cron Job or another scheduler):

`GET https://pd-fora.vercel.app/api/cron/nepal-news-push`

Send header:

`Authorization: Bearer <PDFORA_NEWS_CRON_SECRET>`

The dispatcher fetches the latest news and asks the backend to send the newest headline. Redis stores a 14-day deduplication key so the same story is not sent repeatedly. The scheduled job should not run until Redis and VAPID variables are configured.

## Important behaviour

- Users must explicitly tap Enable notifications and grant browser permission.
- Android Chrome supports push when the site is installed or allowed by the browser.
- On iPhone/iPad, users need iOS/iPadOS 16.4+ and must add the website to the Home Screen before enabling web push.
- Notifications are best-effort and depend on browser/device settings.
- If Redis is not configured, the backend falls back to in-memory storage; subscriptions will be lost on restart and won't be shared across instances. Do not treat that as production-ready.
