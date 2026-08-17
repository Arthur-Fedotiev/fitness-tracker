Type: grilling
Status: resolved

# Finalize the exercise taxonomy

## Question

Pin down the exact, final values for the three taxonomies that new exercise documents will be generated against, and clean up the code that defines them:

- **`exerciseTypes`**: current list is CARDIO, WEIGHTLIFTING/OLYMPIC_WEIGHT, PLYOMETRICS, POWERLIFTING, STRENGTH, STRETCHING, STRONGMAN. Add a FUNCTIONAL/CONDITIONING value (decided in the destination grilling) so sled push/pull, wall balls, etc. have a real home — settle its exact name and where powerlifts vs olympic lifts vs strongman vs functional draw their lines.
- **`muscles`**: current list is 15 broad groups (NECK, TRAPS, SHOULDERS, CHEST, BICEPS, FOREARM, ABDOMINAL, QUADRICEPS, CALVES, TRICEPS, LATS, MIDDLE_BACK, LOWE_BACK [typo], GLUTES, HAMSTRINGS). Add the missing major groups needed for oly-lift/functional coverage (obliques, hip flexors, adductors/abductors), fix the `LOWE_BACK` typo and the `ABS`/`ABDOMINAL` mismatch between `exercise.enums.ts` and `exercise-descriptors.provider.ts`, at the current broad granularity (not full anatomical detail).
- **`equipment`**: current list is BANDS, ROLL, BARBELL, KETTLEBELLS, BODY_ONLY, MACHINE, CABLE, MEDICINE_BALL, DUMBBELL, NONE, E-Z_BAR, OTHER, EXERCISE_BALL. Add what the target exercise list (main lifts, powerlifts, oly lifts, functional) actually needs — at minimum SLED; check whether trap/hex bar, platform, or others are needed too.
- **Cleanup**: `exercise.enums.ts`'s `EXERCISE_TYPE`/`MUSCLES`/`MUSCLES_LATINA`/`EXERCISE_MUSCLES_CATEGORY`/`EXERCISE_LOAD_CATEGORY` enums are dead (zero consumers of their values). Delete them, keeping only the live `EXERCISE_FIELD_NAMES` member. `exercise-descriptors.provider.ts` becomes the sole taxonomy source of truth.

Invoke `/grilling` and `/domain-modeling`. The output is the exact final arrays for all three taxonomies (ready to drop into `exercise-descriptors.provider.ts`) — not yet the code change itself unless this session chooses to make it.

## Answer

Grounded in a real-data pass over both inventories from [Pull existing exercise names (prod + staging)](01-existing-exercise-names.md) (158 admin-owned exercises total): confirmed which of the currently-declared values are actually ever used, and found a live data-quality issue — 14 of 158 exercises (~9%) have a corrupted `targetMuscle` (an equipment name like `BARBELL`/`DUMBBELL`/`CABLE`, or the literal string `"NULL"`), which further validates the reseed-in-place call.

**exerciseTypes** (8): `CARDIO`, `OLYMPIC_WEIGHTLIFTING` (renamed from `WEIGHTLIFTING`), `PLYOMETRICS`, `POWERLIFTING`, `STRENGTH`, `STRETCHING`, `STRONGMAN`, `FUNCTIONAL` (new). Sled push/pull and wall balls → `FUNCTIONAL`; classic strongman events (farmer's walk, carries) stay `STRONGMAN`; box jumps stay `PLYOMETRICS`.

**muscles** (19): `NECK`, `TRAPS`, `SHOULDERS`, `CHEST`, `BICEPS`, `FOREARM`, `ABDOMINAL`, `OBLIQUES` (new), `QUADRICEPS`, `HIP_FLEXORS` (new), `ADDUCTORS` (new), `ABDUCTORS` (new), `CALVES`, `TRICEPS`, `LATS`, `MIDDLE_BACK`, `LOWER_BACK` (typo fixed from `LOWE_BACK`), `GLUTES`, `HAMSTRINGS`. Broad-group granularity kept; full-body oly-lift/functional movements are handled by `targetMuscles` being an array (per the map's reseed-in-place decision), not by a "full body" catch-all value.

**equipment** (20): the 13 existing values (`BANDS`, `ROLL`, `BARBELL`, `KETTLEBELLS`, `BODY_ONLY`, `MACHINE`, `CABLE`, `MEDICINE_BALL`, `DUMBBELL`, `NONE`, `E-Z_BAR`, `OTHER`, `EXERCISE_BALL`) plus 7 new: `SLED`, `TRAP_BAR`, `ROWER`, `JUMP_ROPE`, `BATTLE_ROPES`, `BOX`, `SANDBAG`.

**Cleanup applied**: deleted the dead `EXERCISE_TYPE`/`MUSCLES`/`MUSCLES_LATINA`/`EXERCISE_MUSCLES_CATEGORY`/`EXERCISE_LOAD_CATEGORY` enums from `exercise.enums.ts` (confirmed zero consumers repo-wide before deleting; kept `EXERCISE_MODE` and `EXERCISE_FIELD_NAMES`, both still live). `exercise-descriptors.provider.ts`'s three arrays updated to the final lists above — it's now the sole taxonomy source of truth. Verified: `tsc --noEmit` clean, `nx lint exercise-domain` shows zero new errors (51 pre-existing, unrelated to these two files, matching the known repo-wide lint baseline).

Note: `proficiencyLvls` and the `targetMuscle`→`targetMuscles` field rename were both explicitly out of scope for this ticket (see map's Out of scope / Notes) and were left untouched.
