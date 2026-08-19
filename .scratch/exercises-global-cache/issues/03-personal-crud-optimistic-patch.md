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
