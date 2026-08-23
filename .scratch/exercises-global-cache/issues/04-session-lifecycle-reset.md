Type: grilling
Status: open
Blocked by: 01

## Question

How does the global exercise cache reset on logout / user switch, so a new session doesn't see the previous user's personal exercises or a stale admin catalog snapshot?

Specifically resolve:

- What triggers the reset — an auth-state-change listener, a logout action/effect, or a store-level hook tied to the auth facade (`selectIsAdmin`/`isAdmin$` already exposed via `libs/auth/domain`)?
- Does reset mean clearing in-memory state only, or also clearing/scoping the Firestore IndexedDB persistence cache (shared across tabs via `persistentMultipleTabManager`) so a second user on the same device/browser doesn't see the first user's cached personal exercises?
- Does the next login re-trigger Ticket 02's eager-load flow automatically, or does something need to explicitly re-arm it?

## Notes for this ticket

Blocked by Ticket 01 — reset mechanics depend on the store's shape (NgRx action-based reset vs. signalStore state replacement).

## Revised by ticket 02

Two of the three questions are answered. The store subscribes off the `(uid, isAdmin)` pair, so identity changing or going null is itself the reset. It tears down the listener and clears state, and the next login re-arms the load by the same mechanism, with nothing to re-arm explicitly.

What survives is the question ticket 02 could not answer from the store's side. Does Firestore's persistent IndexedDB cache, shared across tabs via `persistentMultipleTabManager`, let a second user on the same device read documents the first user's queries pulled down? If so, clearing in-memory state is not enough, and the persistence layer needs scoping or clearing at logout too.
