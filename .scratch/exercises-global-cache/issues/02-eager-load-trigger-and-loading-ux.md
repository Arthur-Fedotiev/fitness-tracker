Type: grilling
Status: claimed

## Question

What event triggers the one-per-session exercise load, and what does stale-while-revalidate loading UX look like?

Specifically resolve:

- **Trigger point**: the query needs an authenticated `uid` (ownership filter: `userId == X OR admin == true`), so it can't fire at literal app bootstrap. What's the earliest point after auth resolves that's safe to fire from — an auth-success effect/hook, a root-level provider/initializer gated on the first authenticated route, or something else? Should it block navigation (a route guard/resolver) for routes that need exercises immediately, or fire-and-forget in the background?
- **Stale-while-revalidate**: the user wants cached data shown instantly, with a background refresh updating the UI for free via the reactive store. Decide the concrete data-access shape: read-from-cache-first (e.g. `getDocsFromCache` then a background `getDocs`/`getDocsFromServer`), or switch to a realtime listener (`onSnapshot`/`collectionData`, which Firestore's persistent cache already emits as cache-then-server automatically) — note the current service uses one-shot `getDocs` (`libs/exercise/domain/src/lib/infrastructure/exercise.data.service.ts`), not a listener.
- **In-flight/first-load UX**: what shows when there's genuinely nothing cached yet (first-ever load on a device, e.g. cold IndexedDB + slow/no network)? Does the UI signal "refreshing in the background" at all, or is it invisible-by-design given the dataset is small enough that a full fetch is fast?

## Notes for this ticket

Timing/UX questions here are largely independent of Ticket 01's pattern choice (the *event* that should trigger loading doesn't depend on NgRx vs signalStore), so this ticket is unblocked and can run in parallel with Ticket 01. The concrete *wiring* of the trigger (effect vs. store method call) will follow from whichever pattern Ticket 01 lands on.
