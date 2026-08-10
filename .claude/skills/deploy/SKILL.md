---
name: deploy
description: Deploy fitness-tracker (Firestore rules, functions, hosting) to staging or prod.
disable-model-invocation: true
---

# Deploy

Ships rules, functions, and hosting to one Firebase environment, in that order — the backend contract lands before frontend code that assumes it's already live.

## 1. Pick the environment

Whatever the user names — `staging` or `prod` — is the target. If they didn't specify one, ask.

| | staging | prod |
|---|---|---|
| Firebase project | `fitness-tracker-ui-dev` (also the `default` alias) | `fitness-tracker-de06b` |

Run `firebase use <env>`. Done when it prints `Now using alias <env> (<project-id>)`.

**If it fails instead** with `Invalid project selection` or a 401 on token refresh: the CLI's cached login has gone stale. Tell the user to run `firebase login --reauth` in their own terminal — it opens a browser, so you can't complete it for them — and wait for them to confirm before retrying.

## 2. Deploy Firestore rules

```
firebase deploy --only firestore:rules
```

No project script wraps this — it's always this exact command. Done on `✔ Deploy complete!`. No known gotchas; clean in both environments so far.

## 3. Deploy functions

```
firebase deploy --only functions
```

(Root `package.json` only scripts the staging side, as `deploy-functions:staging`. `functions/package.json` has its own `deploy:dev`/`deploy:prod`, equivalent to `firebase use <env> && firebase deploy --only functions`. Either works once step 1 already set the target.)

Done when it prints `✔ Deploy complete!` with each function showing a successful update. Failure modes, roughly in the order you're likely to meet them:

- **`Cannot find lib definition for 'X'`** during the predeploy `tsc` build: an ambient `@types` package from elsewhere in the monorepo (e.g. root's `jest-mock`) is leaking into the functions build, because `functions/tsconfig.json` doesn't restrict `types`. Fixed already with `"types": ["node"]` in that file — if this resurfaces, that line was reverted; restore it rather than re-diagnosing from scratch.
- **`Runtime Node.js X was decommissioned`**: Google deprecates Cloud Functions runtimes on a rolling schedule. Bump `engines.node` in `functions/package.json` to a currently-supported version — check https://cloud.google.com/functions/docs/runtime-support for what's still valid. Safe, low-risk bump for this codebase (Firebase Admin SDK auth triggers only, nothing runtime-sensitive) — no need to hunt for breaking changes first.
- **`403 ... Write access ... denied: please check billing account associated`**: the target project's billing isn't attached or has lapsed. Fixed in the Firebase console (Project Settings → Usage and billing) — hand this back to the user and wait; there's no CLI-side fix.
- **"functions are found in your project but do not exist in your local source code"**: expected the first deploy after a commit deletes a function. The error prints the exact command needed — `firebase functions:delete <name> --region <region>`. Give that command to the human to run themselves: it deletes live infrastructure, so it needs their own hand on it, never an automatic run on their behalf.
- **Interactive prompt for container image retention days** (`No cleanup policy detected for repositories...`): answer `1`. Short retention is fine here — rollback in this project means redeploying from git, not restoring an old container image.

## 4. Deploy hosting

```
npm run deploy:staging   # or deploy:prod
```

Builds first (`nx run fitness-tracker:build:staging`/`:production`), then deploys — expect this to take longer than rules or functions. Bundle-size and Nx Cloud warnings during the build are pre-existing noise. Done on `✔ Deploy complete!` with a `Hosting URL`.

## 5. Hand back for verification

Give the user the hosting URL (`https://<project-id>.web.app`) and ask them to click through the golden path themselves — there's no browser tool here to do it for them. If they already had a tab open before this deploy, mention the service worker may take a normal update cycle (or a manual unregister/re-register) before it picks up the new version — expected PWA behavior, not a sign anything broke.
