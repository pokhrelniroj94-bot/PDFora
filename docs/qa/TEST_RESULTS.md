# QA test results

Results below were executed on branch `feature/complete-12-language-platform` at commit
`c98b849`.

| Check | Result | Evidence |
|---|---|---|
| Catalog validation | PASS | 124 catalog tools and 173 unified entries |
| Frontend Jest | PASS | 1 suite, 5 tests |
| i18n unit/routing/shared UI tests | PASS | 22/22 plus 2 coverage tests |
| i18n dictionary check | PASS | Ten locales explicitly reported unpublished |
| Translation coverage generation | PASS | `npm run i18n:coverage` |
| TypeScript | PASS | `npx tsc --noEmit` |
| ESLint | PASS | `npm run lint -- --quiet`; no errors |
| Production build | PASS | 390 generated routes |
| Backend pytest | PASS | 27 passed, 1 upstream `fitz` deprecation warning |
| npm audit | PASS | 0 production dependency vulnerabilities |
| pip-audit | PASS | No known vulnerabilities in `backend/requirements.txt` |
| PR Vercel check | BLOCKED | Provider reports `build-rate-limit`; local production build passed |
| Live frontend HTTP checks | Not run | Local DNS is not evidence of production availability |
| Live backend checks | Not run | Use the existing GitHub Actions smoke workflow |

The available system Python initially lacked pytest; pytest was installed into the
existing temporary validation environment, not added to project dependencies.
