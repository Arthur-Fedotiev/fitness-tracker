# Do not use Nx Cloud, and never commit its access token

This workspace does not use Nx Cloud. `nx.json` sets `"neverConnectToCloud": true` so that `nx connect`, `nx migrate`, and the various "connect your workspace" prompts cannot quietly re-enable it. Local computation caching is unaffected and still works — the only thing given up is *remote/distributed* caching, which buys close to nothing here: this is a single-developer repo with no CI pipeline (there is no `.github/workflows/`), so there are no other machines to share a cache with.

`"analytics": false` is pinned in the same file for a related reason: Nx re-adds `"analytics": true` on its own after CLI runs, and pinning it to `false` stops that line reappearing in unrelated diffs.

## The incident that prompted this

From 2025-08-02 (commit `f6d8886`) until 2026-08-10, `nx.json` carried a live `nxCloudAccessToken` scoped **read-write**, committed to a repository that is public. That is a real credential: a read-write cache token allows both reading and *writing* build artifacts, so the worst case is cache poisoning — an attacker writes malicious artifacts that later replay onto a developer machine as legitimate build output. That is a supply-chain risk, not merely an information leak.

Two things reduced the actual impact. The workspace was apparently never claimed — every Nx invocation returned `401` with *"This workspace is more than three days old and is not connected"* — so there was most likely no live cache to poison. And no CI or other consumer ever used the token.

Deliberate decisions taken at the time:

- **The token was removed going forward, but git history was not rewritten.** It remains readable in `f6d8886` and always will be. Rewriting was rejected as disproportionate and largely ineffective: the value had already been public for 373 days, so purging it would prevent only future casual discovery, not past scraping — while forcing a rewrite of already-merged `main` and orphaning in-flight worktrees. Revocation, not rewriting, is the mitigation that actually changes the risk.
- **GitHub secret scanning and push protection were enabled** (both had been off). Push protection is the control that would have blocked the original commit at `git push`, and is the reason this is unlikely to recur.

## Consequences

- Do not re-add `nxCloudAccessToken` to `nx.json`, and do not remove `neverConnectToCloud`. If Nx Cloud is ever genuinely wanted — most plausibly if CI is introduced — the token belongs in a `NX_CLOUD_ACCESS_TOKEN` environment variable or CI secret, never in a committed file. Revisit this ADR at that point rather than reverting it silently.
- Because history was not rewritten, treat the historical token as permanently public. It should be revoked at the provider; until confirmed revoked, its safety rests on the workspace being unclaimed rather than on the value being secret.
- Unrelated but discovered while enabling scanning: the Firebase **web** API keys in `libs/shared/environments/` are flagged as `google_api_key`. These are public by design — Firebase web config ships in every client bundle, and access is governed by Firestore rules and Firebase Auth, not by hiding the key. They are not a leak. The one thing worth keeping true is that the key stays restricted (HTTP referrers, scoped to Firebase APIs) in the Google Cloud console, so it cannot be used to burn quota against other APIs on the project.
