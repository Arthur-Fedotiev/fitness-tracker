Type: grilling
Status: resolved

## Question

What event triggers the one-per-session exercise load, and what does stale-while-revalidate loading UX look like?

Specifically resolve:

- **Trigger point**: the query needs an authenticated `uid` (ownership filter: `userId == X OR admin == true`), so it can't fire at literal app bootstrap. What's the earliest point after auth resolves that's safe to fire from — an auth-success effect/hook, a root-level provider/initializer gated on the first authenticated route, or something else? Should it block navigation (a route guard/resolver) for routes that need exercises immediately, or fire-and-forget in the background?
- **Stale-while-revalidate**: the user wants cached data shown instantly, with a background refresh updating the UI for free via the reactive store. Decide the concrete data-access shape: read-from-cache-first (e.g. `getDocsFromCache` then a background `getDocs`/`getDocsFromServer`), or switch to a realtime listener (`onSnapshot`/`collectionData`, which Firestore's persistent cache already emits as cache-then-server automatically) — note the current service uses one-shot `getDocs` (`libs/exercise/domain/src/lib/infrastructure/exercise.data.service.ts`), not a listener.
- **In-flight/first-load UX**: what shows when there's genuinely nothing cached yet (first-ever load on a device, e.g. cold IndexedDB + slow/no network)? Does the UI signal "refreshing in the background" at all, or is it invisible-by-design given the dataset is small enough that a full fetch is fast?

## Notes for this ticket

Timing/UX questions here are largely independent of Ticket 01's pattern choice (the *event* that should trigger loading doesn't depend on NgRx vs signalStore), so this ticket is unblocked and can run in parallel with Ticket 01. The concrete *wiring* of the trigger (effect vs. store method call) will follow from whichever pattern Ticket 01 lands on.

## Answer

**Q1. What the load fetches.** A new `findAllExercises(userId, isAdmin)` on `FirebaseExerciseDataService`, unpaginated, with no cursor and no `targetMuscles` filter. The cached set is everything the identity may see: `admin == true` for an admin, `userId == me OR admin == true` for everyone else. That asymmetry is correct rather than a bug, because admin saves persist `userId: null, admin: true` (`libs/exercise/domain/src/lib/application/+state/exercise.effects.ts:98`), so an admin owns no personal exercises. Reusing `findExercisesPaginated` with a large `pageSize` was rejected. It keeps writing the `exerciseDocCash` cursor on a call that has no next page.

**Q2. Data-access shape.** One `onSnapshot`-backed subscription via `collectionData`, not one-shot reads. `getDocs` under `persistentLocalCache` does not read cache-first. It queries the server while online and falls back to cache only when offline, so the current one-shot path cannot produce the instant IndexedDB paint the destination asks for without hand-rolling `getDocsFromCache` plus a background `getDocs`. `onSnapshot` emits the cached snapshot first and the server snapshot after, and resume tokens limit the server sync to documents that changed. This is the repo's first realtime listener. Nothing else uses `onSnapshot`, `collectionData`, or `docData`.

**Q3. Trigger.** The store is `providedIn: 'root'` and wakes when `LayoutComponent` injects it. That component sits behind `AuthGuard` and parents every authenticated route (`apps/fitness-tracker/src/app/app.routes.ts`). It exposes no load method. It reacts to the `(uid, isAdmin)` pair, subscribing when an identity appears and tearing down when that identity changes or goes null. Nothing blocks navigation, so there is no resolver and no guard. The pair matters because `authState$` dispatches `loginSuccess` and `setAdmin` as two sequential actions (`libs/auth/domain/src/lib/application/+state/effects/auth.effects.ts:110-121`). A trigger listening for `loginSuccess` alone can fire while `admin` is still stale.

**Q4. First-load UX.** Expose the `withRequestStatus` signal from ticket 01 (idle/pending/fulfilled/error) and let each consumer choose its own treatment. No app-level indicator, and no visible background-refresh signal, because the post-cache server round-trip should stay invisible. The status signal exists to separate "empty" from "not loaded yet". Without it the Training Planner picker renders "no exercises" while the first load is still in flight, which is a real bug. Offline with an empty cache is not an error to `onSnapshot`. It never emits, so it presents as an indefinite `pending`.

**Q5. Delete `LOAD_EXERCISE_PICKER_LIST_COMMAND`,** including the token, the interface, the provider entry, and the call site at `libs/program/feature-dashboard/src/lib/program-dashboard.component.ts:210`. Nothing needs to ask the store to load, and a listener has no refetch to trigger. A no-op token would invite a future caller to believe it does something. `EXERCISE_PICKER_QUERY` still points at the new store, as ticket 01 decided. This revises ticket 01's Q3 answer, and the correction is recorded there.

**Q6. Listener failure is terminal.** Record it in `status` and stop. `onSnapshot` does not retry after an error, and going offline is not an error, so what remains are rules and permission failures that a retry cannot fix. Only an identity change restarts the stream.

**Q7. Plumbing.** `findAllExercises` returns `Observable<ExerciseResponseModel[]>` built on `collectionData`, which keeps every Firestore call inside `FirebaseExerciseDataService`. The store consumes it through an `rxMethod` fed the `(uid, isAdmin)` computed signal, with `switchMap` and `tapResponse`. The NgRx docs frame `rxMethod` as "call once, react forever" wired to a signal ([research-ngrx-signalstore-patterns.md](../research-ngrx-signalstore-patterns.md), §3), and `tapResponse` gives Q6's policy exactly. The failed stream stays dead while the method survives to react to the next identity change. Diverging from `ProgramStore`'s plain `async`/`await` style is deliberate. Ticket 01 already allowed each store its own composition choices, and this store has a reactive trigger that `ProgramStore` lacks.

`ExerciseResponseModel` needs no adaptation. It is a plain class of readonly primitives with an `id` field and no getters, so `withEntities` and NgRx's dev-mode deep-freeze both work on it as-is.

### Knock-on effects on other tickets

- **Ticket 03 shrinks.** Firestore's latency compensation patches the local snapshot before a write confirms and reverts it if the write fails, so optimistic patching and rollback arrive free. What survives is whether the existing CRUD effects move into the store, and what the user sees when a write fails.
- **Ticket 04 shrinks.** Q3 answers its trigger and re-arm questions. Only the shared-IndexedDB question survives.
- **Ticket 05 gains a fact.** `sortOrder` travels from the effects through `normalizeSearchOptions` into the request DTO and then goes unused. `orderBy` appears nowhere in the exercise domain, so there is no current sort order to preserve.
