# Render service ownership evidence — 2026-11-15

## Verified inventory

The connected Render workspace contains two active Free web services in Oregon:

| Field | Primary service | Additional service |
|---|---|---|
| Name | `PDFora` | `PDFora-backend` |
| Service ID | `srv-d9ut5uvavr4c73bfo480` | `srv-d9u26ve417fc73fijmr0` |
| Public hostname | `https://pdfora-493r.onrender.com` | `https://pdfora-backend.onrender.com` |
| Repository | `pokhrelniroj94-bot/PDFora` | Same |
| Branch | `master` | `master` |
| Root directory | `backend` | `backend` |
| Runtime | Python | Python |
| Build command | `pip install -r requirements.txt` | Same |
| Start command | `uvicorn main:app --host 0.0.0.0 --port $PORT` | Same |
| Plan / region | Free / Oregon | Free / Oregon |
| Auto deploy | Enabled on commit | Enabled on commit |
| Current service state | Not suspended; latest deploy reports live | Not suspended; latest deploy reports live |
| Latest deployed commit | `faf737462beed59b6b9018105e607f0d7d76e4de` | Same |

The frontend source and backend defaults reference only `pdfora-493r.onrender.com`. A repository-wide source search found no reference to `pdfora-backend.onrender.com`. The second service therefore appears redundant from the repository's perspective, but external consumers cannot be ruled out.

## Runtime evidence

- The primary service's app logs on 2026-11-15 show `GET /` and `GET /health` returning HTTP 200, and `GET /api/nepal-forex` returning HTTP 200.
- The primary service's same log sample includes `GET /api/nepse-market` returning HTTP 404. This was an audit probe against the backend hostname; confirm whether the frontend route is expected to be handled by the Next.js app rather than this FastAPI service before treating it as a production defect.
- The additional service's logs show a successful build/deploy and startup, plus Render's root health probe. No user-facing API request was visible in the sampled application logs.
- Render's request-log query returned no dedicated request-log entries for either service in the last seven days; HTTP request/latency/instance metrics also returned empty datasets. These empty datasets do **not** prove zero traffic.
- Both services have no explicit Render health-check path configured. The API's own `/health` route responds 200 in the primary service's application logs. The additional service was not independently confirmed via a successful `/health` request in the sampled logs.
- Both services are live on the same commit, but that commit is older than the current repository `master` / PR #183 base. No backend deployment was triggered as part of this follow-up.

## Safety decision

**Do not delete or suspend either service yet.** The primary service is clearly the repository-configured endpoint. The second service is likely redundant, but the available logs/metrics cannot prove that it has no external consumers.

Before cleanup:
1. Check DNS, custom-domain mappings and any external clients for `pdfora-backend.onrender.com`.
2. Review a longer period of service logs/metrics if Render retains them.
3. Confirm whether the older hostname is shared in documentation, mobile clients, third-party integrations or user bookmarks.
4. If no dependencies exist, ask the owner to approve a planned suspension first; preserve the service configuration for rollback before eventual deletion.

## Environment and secret handling

- Service configuration was inspected without retrieving environment-variable values.
- No environment variables were changed.
- No secret values were copied into source, logs or this report.
- The backend rate-limit code now trusts `CF-Connecting-IP` only when the socket peer matches an explicitly configured `PDFORA_TRUSTED_PROXY_CIDRS` network. No CIDR was added to Render because the actual trusted proxy network has not been established. Until that is verified, the backend safely uses the socket peer rather than trusting spoofable forwarding headers; behind a shared proxy this may aggregate clients under one rate-limit key.

## Status

- [x] Render workspace and both service IDs confirmed.
- [x] Repository, branch, root directory, runtime, build/start commands and region compared.
- [x] Primary hostname confirmed in frontend source.
- [x] Same deployed commit and current live state confirmed.
- [x] Duplicate service left untouched; no speculative deletion or suspension.
- [ ] External consumers of the additional hostname ruled out.
- [ ] Trusted proxy CIDR verified and configured, if appropriate.
- [ ] Backend deployment updated after the code changes are validated and approved.

No production infrastructure action is authorized by this evidence note.
