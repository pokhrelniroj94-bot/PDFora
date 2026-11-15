# Render service ownership evidence — 2026-11-15

## Scope and result

This record documents the Render verification boundary for the PDFora audit. The frontend repository points to the Render API hostname `https://pdfora-493r.onrender.com`. Two Render service display names have previously been observed in project notes: `PDFora` and `PDFora-backend`.

**Service identity, service IDs, repository/root-directory settings, traffic ownership, and current live health are not verified by this document.** The Render workspace could not be selected in the connected service inventory, and the Render hostnames were unreachable from the audit sandbox. A failed connection is not evidence that a service is deleted, stopped, or unhealthy.

## Safety decisions

- No Render service was deleted, renamed, redeployed, or reconfigured.
- No environment variable values or secrets were requested, copied, or written to source.
- Do not remove either similarly named service until its service ID, deployed commit, root directory, custom domains, inbound traffic and dependency graph have been confirmed.
- Do not assume both services are duplicates merely because they reference the same GitHub repository.

## Required dashboard evidence before any cleanup

1. Select the correct Render workspace and list all services.
2. Record each candidate service's display name and service ID.
3. Compare repository URL, branch, root directory, build command, start command and latest deployed commit.
4. Check which service owns `pdfora-493r.onrender.com` and whether any other custom domain points to it.
5. Inspect recent deploy history, health checks, request metrics and logs for both services.
6. Check only environment-variable **names and presence** where necessary; never paste values or secrets into an issue, report or chat.
7. Trace the frontend API base URL and any internal service-to-service calls to the owning backend.
8. Only propose removal after proving one service has no unique domain, traffic, data store, or dependency.

## Status

- [x] Repository-side API hostname documented.
- [x] Duplicate-service deletion explicitly avoided.
- [ ] Render workspace/service IDs confirmed.
- [ ] Domain and deployed-commit ownership confirmed.
- [ ] Traffic, logs and live health confirmed.
- [ ] Any cleanup decision reviewed by the owner.

No production infrastructure action is authorized by this evidence note.
