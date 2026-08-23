Type: grilling
Status: open
Blocked by: 01

## Question

Personal (non-admin-authored) exercise create/edit/delete stays user-facing (admin-gating is out of scope for this map — see map's Out of scope). How does a CRUD operation performed through the app patch the in-memory global cache directly, instead of triggering a refetch, and what happens on failure?

Specifically resolve:

- Where do today's create/edit/delete flows live (existing NgRx effects in `libs/exercise/domain/src/lib/application/+state/exercise.effects.ts`), and do they get ported into the new store (per Ticket 01's answer) or kept as-is with a bridge that patches the new store on success?
- Optimistic vs. confirm-then-patch: does the UI update the cache immediately (optimistic) and roll back on Firestore write failure, or wait for write confirmation before patching?
- Rollback mechanics on failure — what does the user see, and does the cache need to reconcile with a potential concurrent server-side change?

## Notes for this ticket

Blocked by Ticket 01 — the patch mechanics depend on the chosen store's shape (NgRx action/reducer vs. signalStore `patchState`).

## Revised by ticket 02

Ticket 02 chose a realtime `onSnapshot` listener as the store's data source, which answers most of this ticket for free. Firestore's latency compensation patches the local snapshot before a write confirms and reverts it if the write fails, so the listener re-emits and the cache follows. No hand-written optimistic patch, no hand-written rollback, and no reconciliation against concurrent server-side changes.

What still needs deciding:

- Do the existing create, edit, and delete NgRx effects (`libs/exercise/domain/src/lib/application/+state/exercise.effects.ts`) move into the new signalStore, or stay where they are and let the listener carry their writes into the cache?
- What does the user see when a write fails? The cache heals itself, but the failure still needs surfacing. Today `exerciseSavedFailure` only reaches `console.error`.
