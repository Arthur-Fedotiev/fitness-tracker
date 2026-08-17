Type: task
Status: resolved

# Delete dead ExerciseResponseModel taxonomy arrays

## Question

[Finalize the exercise taxonomy](02-finalize-taxonomy.md) declared `exercise-descriptors.provider.ts` "the sole taxonomy source of truth" and deleted the dead value-enums from `exercise.enums.ts` on that basis, but missed a second duplicate: `ExerciseResponseModel.TARGET_MUSCLES`/`EQUIPMENT`/`EXERCISE_TYPES`/`PROFICIENCY_LEVEL` (`libs/exercise/domain/src/lib/application/models/exercise-response.model.ts:5-53`) are a separate, stale, `as const` copy of the same three taxonomies — pre-finalization values (`WEIGHTLIFTING` not renamed to `OLYMPIC_WEIGHTLIFTING`, no `FUNCTIONAL`/`OBLIQUES`/`HIP_FLEXORS`/`ADDUCTORS`/`ABDUCTORS`, no new equipment values, still the `LOWE_BACK` typo).

Confirmed by grep (2026-08-16): these four static arrays have zero consumers repo-wide — the `ExerciseResponseModel` class itself is live and widely imported, but nothing reads `.TARGET_MUSCLES`/`.EQUIPMENT`/`.EXERCISE_TYPES`/`.PROFICIENCY_LEVEL` off it. Same dead-code shape as the `exercise.enums.ts` enums ticket 02 already deleted — not a live validator that would reject regenerated content, just an incomplete cleanup.

No decision needed — apply the same call ticket 02 already made (`exercise-descriptors.provider.ts` is sole source of truth): delete these four static members from `ExerciseResponseModel`, confirm `tsc --noEmit` and `nx lint exercise-domain` stay clean.

## Answer

Ran AFK — no decision needed, just the cleanup ticket 02 already called for but missed this file. Re-confirmed zero consumers of `.TARGET_MUSCLES`/`.EQUIPMENT`/`.EXERCISE_TYPES`/`.PROFICIENCY_LEVEL` repo-wide (grep over `libs`/`apps`), then deleted all four static members from `ExerciseResponseModel` (`libs/exercise/domain/src/lib/application/models/exercise-response.model.ts`), a pure 50-line deletion touching nothing else — `exercise-descriptors.provider.ts` remains the sole taxonomy source of truth, now with no lingering stale copies anywhere in the domain lib.

Verified: `tsc --noEmit -p libs/exercise/domain/tsconfig.lib.json` clean. `nx lint exercise-domain` shows 47 pre-existing errors (down from ticket 02's reported 51 — the four deleted arrays weren't contributing any), none touching the deleted lines or newly introduced; matches the known repo-wide lint baseline.
