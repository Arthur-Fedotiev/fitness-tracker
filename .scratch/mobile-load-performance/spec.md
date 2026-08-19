# Mobile load performance

Status: ready-for-human (implemented, pending prod verification)

## Problem

On mobile, tapping a nav item frequently did nothing — the drawer closed, the
page stayed put, and the app "started working" only after tens of seconds.

## Evidence

Measured, not assumed. Three independent sources:

**1. Sourcemap byte attribution of `main.js`** (1.83 MB raw / 513 KB gzip):

| Size | % | Module |
|---|---|---|
| 348.4 KB | 19.1% | `@angular/material` |
| 322.1 KB | 17.6% | `@firebase/firestore` |
| 241.5 KB | 13.2% | `@angular/core` |
| 141.8 KB | 7.8% | `re2js` |
| 130.4 KB | 7.1% | `@angular/cdk` |

**2. Lazy routes were not lazy.** 18 source files from `exercise/feature-display`
and all of `workout/domain` sat in `main.js` despite both being `loadChildren`
routes. Cause: `app.routes.ts` statically imported `DISPLAY_PAGE_PROVIDERS` (via
the `exercise/public-api` barrel, which also re-exports `DisplayPageComponent`)
and `workoutDataProviders`. `workout.routes.ts` and `program.routes.ts` already
declared their providers inside their own lazy shells — `exercises` was the only
deviation.

**3. Production HAR under 3G throttling** (`/exercises/all`, logged in):
- `onContentLoad` 14.7 s, `onLoad` 16.9 s
- every request `_fetchedViaServiceWorker=false`, served from disk cache
- app assets returned `cache-control: max-age=3600` (Firebase Hosting default)
- a Firestore WebChannel Listen stream held open 62 s (`receive: 60170 ms`)

That last one matters: a permanently-open channel is exactly the "recurrent
asynchronous task" that stops `ApplicationRef.isStable` from ever emitting, so
`registerWhenStable:30000` always degraded to its full 30 s timeout. A local
measurement showed registration at 243 ms, but it ran *unauthenticated* with no
Firestore listeners and therefore did not reproduce the condition.

## Decisions

| # | Decision |
|---|---|
| 1 | Move `DISPLAY_PAGE_PROVIDERS` into the lazy `EXERCISE_ROUTES`; **delete** `workoutDataProviders` from the exercises route (nothing under `libs/exercise/` imports `@fitness-tracker/workout*`) |
| 2 | `registrationStrategy: 'registerImmediately'` — sidesteps stabilization entirely |
| 3 | Explicit Firebase Hosting cache headers |
| 4 | Move `@ngrx/store-devtools` out of prod via `fileReplacements` (a `!production` ternary cannot — the static import survives tree-shaking) |
| 5 | `withPreloading(PreloadAllModules)` |
| 6 | Global route-transition progress bar + snackbar on `NavigationError` |
| 7 | Tighten the `initial` budget to 1.85 MB warning / 2 MB error |

**Explicitly not done:** stubbing `re2js` (141.8 KB). It arrives via a bare
side-effect `import 're2js';` in `@firebase/firestore`'s ESM build and cannot be
tree-shaken. Firestore pipelines are unused, so it is dead weight — but a
`resolve.alias` stub or a pnpm override fighting `@angular/fire`'s peer range is
its own risk surface and belongs in a separate PR.

## Results

| Metric | Before | After |
|---|---|---|
| `main.js` raw | 1827.0 KB | 1584.2 KB (**−242.8 KB, −13.3%**) |
| `main.js` gzip | 513.5 KB | 452.0 KB (**−61.5 KB, −12.0%**) |
| `@angular/material` in main | 348.4 KB | 222.0 KB |
| `@angular/cdk` in main | 130.4 KB | 99.1 KB |
| lazy-feature sources in main | 18 | 0 |
| `store-devtools` in main | present | 0 |

The Material and CDK drops are knock-on: the leaked display component was
dragging its table/dialog/paginator dependencies into the initial bundle.

## Verification performed

Driven via Chrome DevTools Protocol against the auth emulator and a dev server:

- logged in, client-side navigation to `/exercises/all` **succeeded**, rendering
  the display page ("Select target muscles", "Search exercise", "Mine / All")
  with **zero DI / `NG0201` / NullInjector errors** — confirming the
  `workoutDataProviders` deletion is safe
- no `libs/workout/` sources appear in any built exercise chunk
- progress bar appears **within ~0 ms of a nav click, while the URL is still the
  old route** (verified against `/training-planner`, whose Firestore-backed
  resolver stalls) and clears once navigation settles
- production build clean, budget satisfied, lint clean on all touched files,
  unit tests pass for all 4 affected projects

**Not verified:** the Firestore emulator requires Java 21 (only 16 installed),
so no exercise data was loaded — component instantiation was verified, data flow
was not. The `registerImmediately` change has not been confirmed against prod.

## Follow-ups

- Confirm in prod: visit `/ngsw/state` logged in, and capture a HAR with
  "Preserve log" from a hard reload for 45+ s to see when `ngsw-worker.js` lands
- `re2js` — 141.8 KB, pnpm override the likely lever
- `@firebase/analytics` / `app-check` / `installations` (~29 KB) arrive via
  `ScreenTrackingService`/`UserTrackingService` in `provide-shared-data-access.ts`
- The e2e suite is non-functional: `attachCustomCommands` is commented out in
  `commands.ts` (so `cy.login()` does not exist) and `exercise-display.cy.ts`
  still asserts on the multilang selector removed by ADR-0002
- Root cause of instability: running Firestore's channel outside the Angular zone
  would let `registerWhenStable` work as designed
