Type: grilling
Status: resolved

## Question

What state pattern should the new global exercise store use, where does it live relative to the existing `ExerciseFacade`/NgRx `+state` for the `exercise` domain, and what does its public-api surface (the `InjectionToken`-based Query/Command boundary, per `CONTEXT.md`) look like?

Specifically resolve:

- **Pattern choice**: `@ngrx/signals` `signalStore` (following `program`'s pilot at `libs/program/domain/src/lib/application/program.store.ts:78`) vs. extending the existing classic NgRx store+effects that `exercise` already uses (`libs/exercise/domain/src/lib/application/+state/`, `exercise.facade.ts`). Consider: does adopting signalStore here make it the repo's new default for domain state, or is `program` staying a one-off pilot? Weigh consistency with `exercise`'s current pattern vs. the reactive/simpler ergonomics that made `program` choose signalStore.
- **Relationship to `ExerciseFacade`**: does the new global store replace the facade's list-holding responsibility entirely, wrap/compose it, or coexist alongside it (facade keeps handling per-detail/CRUD operations, new store owns the cached list)?
- **Public-api surface**: what `InjectionToken` Query/Command tokens do consumers use? Decide whether to extend the existing `EXERCISE_PICKER_QUERY` / `LOAD_EXERCISE_PICKER_LIST_COMMAND` tokens (already used by Training Planner, `libs/exercise/public-api/src/index.ts`) to back onto the new global store, or introduce new tokens. This surface is what the library/admin screen, Training Planner, and the future workout dropdown will all consume — get it right once.

## Notes for this ticket

This is the architectural root of the map — Tickets 02 (eager-load trigger relies on knowing whether it's an NgRx effect or a signalStore init call, though its *timing* decision is independent — see below), 03, 04, and 05 depend on its answer.

## Answer

**Q1 — Pattern choice:** `@ngrx/signals` `signalStore`, following `program`'s pilot (`libs/program/domain/src/lib/application/program.store.ts:78`). Treat this as the second data point that a lean signals store fits a "hold a collection, load once, patch on write" shape — not yet a blanket rule that NgRx effects are deprecated repo-wide, just a per-domain-store choice made twice now.

**Q2 — Relationship to `ExerciseFacade`:** Coexist, narrowly. The new store becomes the single owner of the *cached full list* (replacing `exercisesList`/`getAllExercises`/`findExercises`-as-list-loader on the facade). `ExerciseFacade` keeps everything else it does today — exercise-details, dialog-opening, save/delete commands, navigation. No retrofit of `ExerciseFacade`'s other responsibilities.

**Q3 — Public-api surface:** Re-point `EXERCISE_PICKER_QUERY` and `LOAD_EXERCISE_PICKER_LIST_COMMAND` (`useExisting`) at the new store — they're semantically "give me the cached list," now the new store's job. Add one new narrow token, `EXERCISE_CATALOG_QUERY`, exposing the full `ExerciseResponseModel[]` signal for the admin/library screen (Ticket 05), rather than widening `ExercisePickerQuery`'s `{id, name}` contract. Confirmed by research (`research-ngrx-signalstore-patterns.md`, §4): `signalStore` returns a plain injectable class with no token-pair API of its own (NgRx co-author Marko Stanimirović, [ngrx/platform Discussion #4188](https://github.com/ngrx/platform/discussions/4188)) — narrowing via `InjectionToken`/`useExisting` is ordinary Angular DI layered on top, exactly this repo's existing pattern, with no signalStore-specific wrinkle to reconcile.

**Q4 — Store composition:** `withEntities<ExerciseResponseModel>()` + a hand-written `withRequestStatus`-style feature (idle/pending/fulfilled/error), composed via `signalStoreFeature` — NgRx's own documented composition style (`research-ngrx-signalstore-patterns.md`, §1 and §2; `withFeature`'s own JSDoc example is named `withEntityLoader`). `withEntities`'s `updateEntity`/`removeEntity`/`upsertEntity` updaters are the exact "patch entries on write" primitives Ticket 03 needs, tested and free instead of hand-written. `program.store.ts` stays as-is — no retrofit; two independent stores are free to make independent composition choices at this scale.

**Asset:** [research-ngrx-signalstore-patterns.md](../research-ngrx-signalstore-patterns.md) — full primary-source research backing Q3/Q4, including the still-open items (no NgRx rule for `withEntities`-vs-hand-rolled at small scale; no primary source addresses stale-while-revalidate/background-refresh in signalStore terms — left for Ticket 02).

### Correction (from ticket 02)

Q3's re-pointing of `LOAD_EXERCISE_PICKER_LIST_COMMAND` no longer holds. Ticket 02 made the store subscribe off the authenticated identity instead of exposing a load method, and a realtime listener has no refetch to trigger, so the command goes away entirely: token, interface, provider entry, and call site. `EXERCISE_PICKER_QUERY` and the new `EXERCISE_CATALOG_QUERY` are unaffected. See [ticket 02](02-eager-load-trigger-and-loading-ux.md).
