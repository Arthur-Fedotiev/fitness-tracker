---
name: firestore-migration-scripts
description: Write a one-off admin script that bulk-reads/writes Firestore documents — a data migration, a schema backfill, or regenerating a content library. Use when asked to migrate, backfill, reseed, or bulk-regenerate Firestore-backed data in this repo.
---

This repo has run this exact shape of script twice — [`flatten-exercise-basedata.ts`](../../../functions/scripts/lib/flatten-exercise-basedata.ts) (ADR-0005) and [`persist-exercise-regeneration.ts`](../../../functions/scripts/lib/persist-exercise-regeneration.ts) — and both converged on the same conventions below. Follow them rather than reinventing the shape.

## Where it lives

`functions/scripts/lib/<name>.ts`, compiled to `dist/lib/<name>.js`, run as `node dist/lib/<name>.js <path-to-service-account-json> [...args]`. Uses `firebase-admin` with a service-account cert, which bypasses Firestore rules — deliberate, since it lets the script run before `firestore.rules` or app code have caught up with the new shape.

## The conventions

- **Dry-run by default, `--commit` to write.** Every write path logs what it *would* do (`DRY-RUN overwrite`, `DRY-RUN create`, ...) whether or not `--commit` is passed; only the actual `.commit()`/`.delete()` calls are gated on the flag. Never make a script that writes unconditionally.
- **Staging first.** Run against `./sa.json` (staging), review the dry run, `--commit`, confirm in the app, only then repeat against `./sa.prod.json`. Document this order in the script's usage comment.
- **Idempotent.** Re-running the script (dry or committed) must not double-write or duplicate. Check existing state before writing: skip a doc that's already in the target shape (`flatten-exercise-basedata.ts`'s `alreadyFlat` check), dedup creates by a natural key like name (`persist-exercise-regeneration.ts`'s `existingAdminNames` check).
- **Batched writes**, 500 per batch (Firestore's hard limit) — accumulate into a `db.batch()`, flush and reset at 500, flush again at the end.
- **Full `.set()` replace, not `.update()`/merge, when the point is to drop fields the new shape doesn't have.** A merge would leave stale sibling fields behind; a full replace is what actually migrates the shape.
- **Log a JSON summary of counts** (created/overwritten/skipped/deleted) at the end — the audit trail for what a run actually did.
- **A doc comment at the top of the file** explaining what it does, why (link the ADR or decision it implements), and usage — these scripts outlive the effort that wrote them, so the comment is the only context a future reader gets.
