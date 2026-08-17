Type: task
Status: resolved

# Pull existing exercise names (prod + staging)

## Question

Collect the current exercise names from both Firestore environments — 128 documents in prod, 31 in staging (`exercises` collection, per [Enrich the exercise library](../spec.md)) — so the generation prompt in [Draft the JSON schema and ChatGPT prompt](03-draft-schema-and-prompt.md) can be told what already exists and avoid regenerating near-duplicates (e.g. another "Back Squat").

Drive this AFK if Firebase CLI / admin access from this machine allows a read-only listing of the `exercises` collection's `name` field in both projects (see the active-project-override gotcha — `firebase use` resolves to the prod alias, not `.firebaserc`'s default; confirm which project before querying). If that access isn't available in this session, hand the human a precise checklist (export command or console steps) instead.

## Answer

Ran AFK, driven from the local, gitignored admin credentials `functions/scripts/sa.json` (staging, `fitness-tracker-ui-dev`) and `functions/scripts/sa.prod.json` (prod, `fitness-tracker-de06b`) — the same credentials ADR-0005's own migration used. Read-only, no writes.

Mid-resolution the user reopened the additive-vs-reseed question (see the map's "Reseed-in-place redraw" decision) — pulling names surfaced the need for a fuller inventory anyway (IDs + current taxonomy values, not just names, since regeneration overwrites in place), so this ticket's scope grew to match.

**Staging** (`fitness-tracker-ui-dev`): 31 exercises — 30 admin-owned, 1 user-owned (`"Light weight"`, doc `VBdVhPdQJ7KmUn6RdJLq`, owned by a single distinct user). 3 workouts, 11 total exercise references, all to admin-owned docs, 0 dangling, 0 referencing the user-owned exercise.

**Prod** (`fitness-tracker-de06b`): 128 exercises — all 128 admin-owned, 0 user-owned. 2 workouts, 12 total exercise references, all to admin-owned docs, 0 dangling.

Full inventories (id, name, exerciseType, targetMuscle, equipment per exercise) saved as assets, both pulled 2026-08-16:

- [staging-exercise-inventory-2026-08-16.json](../assets/staging-exercise-inventory-2026-08-16.json)
- [prod-exercise-inventory-2026-08-16.json](../assets/prod-exercise-inventory-2026-08-16.json)

These findings are what justified the reseed-in-place decision: the blast radius on workouts is zero either way (same-ID overwrite), and the only user-owned exercise anywhere is unreferenced, so deleting it is safe.
