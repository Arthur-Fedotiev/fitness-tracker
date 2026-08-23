Label: wayfinder:map

## Destination

Lock an architecture decision + implementation plan for a global, per-session, eagerly-loaded, cached exercise store — which state pattern it uses and where it lives, how/when it loads (stale-while-revalidate: instant from Firestore's existing IndexedDB cache, background-refresh updates the reactive store for free), how it invalidates, and how the existing exercise library/admin screen and Training Planner's picker migrate onto it. The future workout "add exercise via dropdown" feature isn't built here, but gets served for free through the same public-api tokens. This is a plan-only effort (ADR + ready-to-build tickets) — no execution inside this map.

## Notes

- Domain: `libs/exercise/` (see `CONTEXT.md` for the bounded-context glossary and the public-api Query/Command boundary rule — any new store's cross-domain surface must go through narrow `InjectionToken`s, never the facade/store class directly).
- Consult `/grilling` and `/domain-modeling` for every ticket unless the ticket says otherwise.
- Firestore collection: `exercises` (`COLLECTIONS.EXERCISES`, `libs/packages/shared-utils/src/lib/models/enums.ts:7`). Flat schema per ADR-0005.
- Current fetch path: `FirebaseExerciseDataService` (`libs/exercise/domain/src/lib/infrastructure/exercise.data.service.ts`) — one-shot `getDocs`, cursor pagination (`findExercisesPaginated`), server-side ownership filter (`userId == X OR admin == true`).
- `program` domain (Training Planner) just piloted `@ngrx/signals` `signalStore` (`libs/program/domain/src/lib/application/program.store.ts:78`) — first adopter in this repo, explicitly called a "deliberate pilot." `exercise` and `workout` domains still use classic NgRx store+effects.
- Firestore IndexedDB persistence (`persistentLocalCache` + `persistentMultipleTabManager`) is already on (`libs/shared/data-access/src/lib/firebase-persistence/provide-persistence.ts:44-49`). `@angular/service-worker` is configured but only caches app/assets, not data.
- Dataset is small: 31 exercises (dev), 128 (prod) — per ADR-0005's migration survey. This is why a shared cross-user CDN cache was ruled out of scope; revisit only if the catalog or read cost grows an order of magnitude.
- Admin/role check already exists via Firebase custom claims (`claims.admin`), surfaced through NgRx auth state (`selectIsAdmin` / `isAdmin$`) and already gating exercise queries/writes today.

## Decisions so far

- [State pattern and public-api surface](issues/01-state-pattern-and-public-api.md) — `signalStore` (following `program`'s pilot); coexists narrowly with `ExerciseFacade` (new store owns the cached list, facade keeps everything else); `EXERCISE_PICKER_QUERY`/`LOAD_EXERCISE_PICKER_LIST_COMMAND` re-point at the new store, plus a new `EXERCISE_CATALOG_QUERY` token for full-record access; store composed via `withEntities` + a hand-written `withRequestStatus` feature
- [Eager-load trigger and loading UX](issues/02-eager-load-trigger-and-loading-ux.md) — root store woken by injection in `LayoutComponent`, reacting to the `(uid, isAdmin)` pair instead of exposing a load method; a single `onSnapshot` listener via `collectionData`, consumed through `rxMethod`/`switchMap`/`tapResponse`, gives cache-then-server for free (plain `getDocs` does not read cache-first); new unpaginated `findAllExercises`; `withRequestStatus` exposed per-consumer with no background-refresh indicator; listener errors terminal; `LOAD_EXERCISE_PICKER_LIST_COMMAND` deleted

## Not yet specified

(none — the frontier below covers the full known scope; nothing else has surfaced as in-scope-but-unsharp)

## Out of scope

- **Admin-gating exercise creation for non-admins** — a future write-path/permissions change, orthogonal to this read-side caching/global-state effort. Personal exercise CRUD keeps working as-is for now.
- **Shared cross-user CDN/service-worker cache for the admin catalog** — considered and rejected for now given the dataset's small size (31 dev / 128 prod); the per-session in-memory approach already turns "N queries per navigation" into "≈1 per session" at near-zero engineering cost. Revisit if the catalog or Firestore read cost grows significantly.
