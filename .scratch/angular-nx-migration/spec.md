# Angular / Nx upgrade: 20.1.4 / 21.3.11 → 21 / 22

Status: ready-for-agent

## Goal

Move the root workspace (`apps/`, `libs/`) from Angular 20.1.4 / Nx 21.3.11 to Angular 21 / Nx 22 — the newest versions where this repo's core dependencies (`@ngrx/*`, `@angular/fire`) still have genuine stable support. See [ADR-0004](../../docs/adr/0004-cap-angular-nx-upgrade-below-latest.md) for why this isn't the literal latest (Angular 22 / Nx 23), and `.scratch/angular-nx-migration/research-latest-versions.md` for the full version/compatibility research this plan is based on.

## Scope

**In scope** — Angular/Nx core plus their tightly-coupled peers:
`@angular/*` (core, cdk, common, compiler, forms, material, platform-browser(-dynamic), pwa, router, service-worker, fire), `@angular-devkit/*`, `@schematics/angular`, `@angular/cli`, `@angular/language-service`, `@nx/*` (angular, cypress, eslint, jest, js, workspace), `nx`, `@ngrx/*` (effects, entity, store, store-devtools, schematics), `@angular-eslint/*`, `zone.js`, `rxjs`, `typescript`, `jest-preset-angular`, `@angular-architects/ddd`.

**Only if a peer-dep conflict forces it**: `cypress`, `cypress-firebase`, `firebase`, plain `eslint`/`@typescript-eslint`, `jest`. Don't proactively bump these otherwise.

**Explicitly out of scope**:
- `functions/` — the separate Firebase Cloud Functions backend (own `package.json`, Node 20 engine, TypeScript 4.5.4, `firebase-admin` ^11.10.1, ESLint ^8.9.0). Nothing here touches Angular or Nx. This is a known, intentional next follow-up — don't let it get lost (see repo-level agent memory).
- Cypress → Playwright migration. Considered and explicitly declined, not even as a deferred follow-up.
- `@ngneat/until-destroy` → `DestroyRef`/`takeUntil` and `lodash-es` → native code — both already deferred by [ADR-0003](../../docs/adr/0003-prune-dependencies-and-retire-completed-migrations.md); stay deferred here too, this migration doesn't reopen that scope call.
- Nx's inferred-tasks / Project Crystal model (`nx g convert-to-inferred`) — not adopted; the workspace keeps its explicit `nx.json` `targetDefaults`/`generators` config.
- ESLint flat-config conversion — only if the version bump makes legacy `.eslintrc.json` non-functional. Per the research, the forced ESLint 8→9 / flat-config requirement traces specifically to Nx 23.1, past this migration's Nx 22 ceiling — likely moot here, but confirm rather than assume once the Nx 22 bump is in.

## Process

- Angular: `ng update` from 20 → 21 (adjacent-major hop, per Angular's own tooling constraints).
- Nx: `nx migrate` from 21.3.11 → 22 (walk the latest 21.x patch first, run migrations, then migrate to 22, run migrations — per Nx's documented advanced-update flow).
- One commit per major-version bump; one PR per major-version bump. Each PR independently reviewable/mergeable — no requirement to land both before merging either.
- Validation gate per step: `nx test`, lint, and a production build must pass before moving on.
- Full Cypress e2e run and a manual browser smoke test happen once, after both bumps are in — not repeated after every step.
- Package manager: correct `nx.json`'s `"packageManager"` field from `"npm"` to `"pnpm"` as part of this work — the repo has actually been running on pnpm for a while (`pnpm-lock.yaml` is the real, actively-updated lockfile); the `"npm"` value was stale, not intentional.

## Code-change stance: opportunistic, not purely mechanical

Bump versions, and while touching affected code, also clean up what the bump itself surfaces as deprecated or superseded — e.g. remaining `NgModule`-based files (`libs/create-user/feature`, `libs/create-user/data`, `libs/workout/feature-details`), `enableProdMode()` in `apps/fitness-tracker/src/main.ts`, `importProvidersFrom(BrowserModule, MatDialogModule)` if a standalone-provider equivalent exists by Angular 21.

Do **not** use this as license to reopen unrelated, already-deferred cleanup (ADR-0003 items above) or to make architecture calls not required by the version bump (e.g. no zoneless-change-detection adoption in this pass — zoneless became the new-app default in Angular 21, but this is an existing app; leave it on zone.js unless the migration itself removes zone.js support, which it doesn't at this target).

## Known risks going in

- `@angular/fire` has no stable release for Angular 21 — its `21.0.0-rc.0` prerelease is the only option, in flight since 2025-11-26. This is a release-candidate dependency in the auth/Firestore layer; test that surface carefully.
- Node: Angular 21's `engines.node` range is `^20.19.0 || ^22.12.0 || >=24.0.0` — the repo's pinned `.nvmrc` (v22.18.0) already satisfies this, no bump needed for this target (Angular 22's tighter `^22.22.3` requirement doesn't apply since we're stopping at 21).
- Nx 22 makes DB-backed caching unconditional and defaults `useLegacyTypescriptPlugin` to `false` — both auto-migrated, but worth a sanity check post-migration that caching and typecheck behavior didn't silently change.

## Next steps once this lands

- Follow-up: bump `functions/` (Node, TypeScript, `firebase-admin`, ESLint) — separate effort, not covered here.
- Revisit Angular 22 / Nx 23 once `@ngrx/*` and `@angular/fire` both ship stable support for Angular 22 (see ADR-0004).
