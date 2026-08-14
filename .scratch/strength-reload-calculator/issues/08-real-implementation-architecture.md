**Type**: grilling
Status: resolved

## Question

Now that the UI direction is settled ([UI flow prototype](04-ui-flow-prototype.md) — Variant C, tabbed dashboard), how does the `program` domain actually get built: Nx lib split, state management approach, Firestore I/O pattern, how "Add Exercise Block" sources an exercise, save/persistence cadence, and routing.

## Answer

1. **Nx lib split — start lean.** `program-domain`, `program-feature-dashboard` (the tabbed Variant C screen), `program-shell` (lazy-loaded routes). No `program-public-api` and no `program-ui-components` until an actual second consumer needs them — mirrors `workout`'s lean 5-lib split (no `public-api` exists there either, added to `exercise` only once something outside the domain needed it) rather than `exercise`'s fuller 6-lib set, which grew that way over time rather than starting there.

2. **State management — `@ngrx/signals`' `signalStore`, not classic NgRx Store/Effects and not raw hand-rolled signals.** First domain in the repo to use it (`exercise` and `workout` both use classic NgRx `+state` uniformly). Deliberate pilot: because domains only ever communicate through `public-api` commands/queries per `CONTEXT.md`'s "Architecture conventions", `program`'s internal state choice is fully private and can't create inconsistency for the other two domains — low-risk place to try it before considering it for them.

3. **Firestore I/O — plain `async`/`await` on the modular SDK functions (`getDocs`, `addDoc`, `setDoc`, `deleteDoc`, same `@angular/fire/firestore` imports `exercise`/`workout` already use) directly inside `signalStore`'s `withMethods`, `patchState()` on resolution. No Observables, no `rxMethod`, no `@ngrx/effects` dependency for this domain.** Verified this isn't a loss of capability: `FirebaseExerciseDataService` already only does one-shot fetches via `getDocs`/`getDoc` wrapped in `from(...)` to feed classic Effects — nothing in this codebase uses Firestore's realtime `onSnapshot`/`collectionData()`/`docData()` listeners today, and Programs are single-user/private per [Program lifecycle](02-program-lifecycle.md) with no live-sync requirement, so there's no stream to preserve. `rxMethod` stays available for the day something genuinely reactive shows up (e.g. debounced as-you-type search). `exercise`'s and `workout`'s existing data services are untouched by this — they keep their `from(promise)` → Observable → Effects pattern exactly as-is; the two domains simply end up on different internal patterns, which is fine since that's never externally visible.

4. **Exercise picker for "Add Exercise Block" — build now, lean.** A new narrow query minted off `exercise/public-api` (per [Module boundary constraints](07-module-boundary-constraints.md)'s convention — its own `InjectionToken`, not the whole `ExerciseFacade`), returning just `{id, name}` for a simple name-filtered dropdown/autocomplete. Not the full searchable/filterable picker the exercise library page has (muscle/equipment filters, pagination) — the library is small enough today that a dropdown covers it; richer search can come later if needed. This query lives in `exercise/domain`/`exercise/public-api`, so it follows _that_ domain's existing conventions (Observable-based, matching `ExerciseDetailsQuery`), not `program`'s async/await pattern — the boundary is the seam where the two styles meet.

5. **Save cadence — explicit Save, matching `exercise` and `workout` exactly** (`onSave()` / `saveWorkout()`); no autosave-on-keystroke introduced as a third pattern.

6. **Generate Reload Cycle persists immediately**, scoped to that Exercise Block, rather than waiting on a Program-level Save — it's a meaningful, frozen event per the lifecycle decision (editing after generation doesn't auto-recompute), not draft data that's safe to lose to a refresh.

7. **Routing — `/training-planner`**, lazy-loaded via `loadChildren` in `app.routes.ts` exactly like `exercises`/`workouts`, plus a resolver preloading the Program list before the dashboard renders, mirroring `workout`'s `composedWorkoutDataResolver`.

Decided in conversation with the user (grilling session), 2026-08-12.
