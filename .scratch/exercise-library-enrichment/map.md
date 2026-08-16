Label: wayfinder:map

# Exercise library enrichment

## Destination

A finalized exercise taxonomy (muscles, equipment, exerciseTypes) plus a JSON schema and a crafted ChatGPT prompt that regenerates the entire admin-owned exercise library — covering popular main lifts, powerlifts, olympic lifts, and functional/conditioning movements (sled push/pull, wall balls, etc). Every currently-admin-owned document gets fresh content (same document ID, in-place overwrite — no workout reference ever dangles); genuinely new exercises get new documents. The output is reviewed by hand before persisting; the actual persist/overwrite-to-Firestore execution is out of scope for this map (see Out of scope).

## Notes

- Domain: `exercise` (see [CONTEXT.md](../../CONTEXT.md), [ADR-0005](../../docs/adr/0005-flatten-exercise-basedata.md) flatten-exercise-basedata).
- Every session should consult `/grilling` and `/domain-modeling`.
- **Superseded from the original charting**: this was additive-only at first (see the first Decisions-so-far entry). A later session reopened it — the user wanted a clean slate, not just gap-filling. Landed on in-place regeneration instead of a true reseed: same document IDs, so ADR-0005's dangling-workout-reference risk stays fully avoided while still getting a fully regenerated, taxonomy-conformant library.
- A read-only survey (2026-08-16, mirroring ADR-0005's own survey script, via the local `sa.json`/`sa.prod.json`) confirmed the blast radius is tiny: staging has 30 admin-owned + exactly 1 user-owned exercise ("Light weight", referenced by zero workouts); prod has 128 admin-owned + 0 user-owned. All 23 workout↔exercise references across both environments (11 staging + 12 prod) point only to admin-owned exercises. The full inventories (names/IDs/current taxonomy values) are saved as assets: [staging-exercise-inventory-2026-08-16.json](assets/staging-exercise-inventory-2026-08-16.json), [prod-exercise-inventory-2026-08-16.json](assets/prod-exercise-inventory-2026-08-16.json).
- The one user-owned exercise (staging only) is slated for deletion once execution happens — safe, since the survey confirms no workout references it.
- New exercises get `targetMuscles: string[]`. Existing (overwritten) docs also move to `targetMuscles: string[]` as part of their regeneration — no dual-shape period once regeneration executes.
- `exercise.enums.ts`'s `EXERCISE_TYPE`/`MUSCLES`/`MUSCLES_LATINA` value-enums are dead code (zero consumers of their values — only its `EXERCISE_FIELD_NAMES` member is actually imported anywhere). `exercise-descriptors.provider.ts` is the live, DI-wired taxonomy source and is the one to finalize; the dead enums should be deleted as part of the taxonomy cleanup, not reconciled with.
- `proficiencyLvls` (BEGINNER/INTERMEDIATE/ADVANCED) is an existing descriptor with no backing field on the `Exercise` entity — stays dead, out of scope.
- Originating spec: [Enrich the exercise library](spec.md) — deferred during the ADR-0005 grilling session, `needs-triage`. This map resolves its "regenerate with LLM content" thread; its other open question (revising instructions on existing exercises) is now in scope (see above), reversing the original charting's call.

## Decisions so far

- [Destination grilling (original charting session)](map.md) — additive-only, prompt+schema destination (no persist script), `targetMuscles: string[]` for new docs only, add a FUNCTIONAL/CONDITIONING exerciseType, fold taxonomy cleanup into scope, feed existing exercise names into the prompt for dedup, expand equipment as needed, leave `proficiencyLvls` dead, add missing muscle groups (obliques, hip flexors, adductors/abductors) at the current broad granularity. **Superseded** by the next entry on the additive-vs-reseed question; the taxonomy/equipment/muscle/`proficiencyLvls` calls still stand.
- [Reseed-in-place redraw](map.md) — switched from additive-only to full in-place regeneration of every admin-owned exercise (same doc ID, new content), after a read-only survey confirmed near-zero blast radius (see Notes). The one orphaned user-owned exercise gets deleted. Persisting/overwriting execution itself stays out of scope for this map.
- [Finalize the exercise taxonomy](issues/02-finalize-taxonomy.md) — 8 exerciseTypes (added `FUNCTIONAL`, renamed `WEIGHTLIFTING`→`OLYMPIC_WEIGHTLIFTING`), 19 muscles (added `OBLIQUES`/`HIP_FLEXORS`/`ADDUCTORS`/`ABDUCTORS`, fixed the `LOWE_BACK` typo), 20 equipment values (added `SLED`/`TRAP_BAR`/`ROWER`/`JUMP_ROPE`/`BATTLE_ROPES`/`BOX`/`SANDBAG`). Applied to code: `exercise-descriptors.provider.ts` updated, dead value-enums deleted from `exercise.enums.ts`. Also surfaced that 14 of 158 live admin exercises have corrupted `targetMuscle` data (equipment names or literal `"NULL"`).

## Not yet specified

## Out of scope

- Executing the regeneration — overwriting admin-owned docs in place, creating new docs, and deleting the one orphaned user-owned exercise — deferred to a future effort once the reviewed JSON exists. This is real destructive/production-writing work and deserves its own careful, human-driven session.
- Adding a difficulty/proficiency field to the `Exercise` schema — `proficiencyLvls` stays an unused descriptor, matching current behavior.
- Reviving or populating the orphaned `muscles`/`exercise-types`/`equipment` Firestore collections — this effort's taxonomy lives in code (`exercise-descriptors.provider.ts`), not those collections, which predate the current architecture and have zero consumers.
