Type: research
Status: resolved
Blocked by: 05

# Verify ambiguous exercise identities before trusting the generated batch

## Question

Reviewing [Generate the regenerated exercise content ourselves](05-generate-regenerated-content-ourselves.md)'s output, the human caught that several original exercise names look like legacy or possibly-mistranslated gym vocabulary (e.g. "Army Press" for what's now usually called Overhead Press, "Barbell Full Squat" for Barbell Back Squat — both already fixed directly, see below, since the *movement* those entries described was already correct).

A separate, more serious group of names is genuinely ambiguous — the content generated for them in [exercise-regeneration.output.json](../assets/exercise-regeneration.output.json) was guessed from the bare name plus general fitness knowledge, with no source lookup, so the guess could describe the wrong movement entirely, not just wear an unfashionable label:

- **Backlash with Dumbbells** (id `UNpo9QQILw9SQOsWteZW`) — guessed as a bent-over rear-delt raise
- **Moving Claw Series** (id `fex6EVbTeCqOABoJhl9j`) — guessed as a bear-crawl variant
- **Power Partials** (ids `0wdI8mA5fp4cO56AXIVe`, `OBKgRngKw5tT6xlj4rA9`) — guessed as rack partial-range squat/deadlift work
- **Vertical Swing** (id `jwGJNzo67aeBA3kb4Sa6`) — guessed as an overhead kettlebell swing
- **Upper Back-Leg Grab** (ids `O1ekT2E8OXUVsk4YaB6c`, `kohngeqyrsFeNzgGmlCX`) — guessed as a standing quad/upper-back stretch
- **Downward Facing Balance** (id `VILQv96CwyzVFrabjlZ3`) — guessed as a bird-dog/superman-style balance hold
- **Suspended Hip Thrust** (id `NibNwrQMyONc4DKjijnj`) — guessed as TRX-strap hip thrust; equally plausible it means feet-and-shoulders elevated between two benches, which would also change its `equipment` value
- **The Straddle** (id `StZabgMXbA8S2vmeHId9`) — guessed as a seated straddle stretch
- **Kneeling Squat** (id `LWPRjxvQXTwsYFvth7J1`) — accidentally given identical content to the separate "Kneeling Jump Squat" entry; nothing justifies assuming they're the same movement — this is a modeling error surfaced by the same review, not just a naming judgment call

Find what each of these movements actually is, using high-trust sources (this taxonomy/exercise set likely traces back to a known open exercise dataset — check whether it matches free-exercise-db/wger.de or similar before falling back to general web search per name). For each, report: the real movement, its correct `exerciseType`/`targetMuscles`/`equipment` per this map's finalized taxonomy (see [Finalize the exercise taxonomy](02-finalize-taxonomy.md)), and a modern, unambiguous display name (per the map's naming-normalization decision — see Notes).

## Answer

Dispatched a research subagent (`/research`). Full citations and per-exercise reasoning: [ambiguous-exercise-identities-research.md](../assets/ambiguous-exercise-identities-research.md).

**Source identified**: this library traces back to the public [`free-exercise-db`](https://github.com/yuhonas/free-exercise-db) dataset (a scrape of bodybuilding.com's exercise database) — 8 of the 9 names matched verbatim, corroborated independently by this app's own pre-regeneration Firestore data (only `targetMuscle`, not `exerciseType`/`equipment`, was corrupted per [ticket 02](02-finalize-taxonomy.md), so the old `exerciseType`/`equipment` fields served as a third confirming source).

**8 of 9 resolved and applied to** [exercise-regeneration.output.json](../assets/exercise-regeneration.output.json) (high-to-very-high confidence, one medium-high):

| Name (old → new) | Correction |
|---|---|
| Moving Claw Series → **Sprint Claw Drill** | Sprint-mechanics drill, not a bear crawl. `PLYOMETRICS` / HAMSTRINGS, CALVES, QUADRICEPS / BODY_ONLY |
| Power Partials → **Dumbbell Lateral Raise (Partial Reps)** | Shoulder isolation move, not a squat/deadlift partial. `STRENGTH` / SHOULDERS / DUMBBELL |
| Vertical Swing → **Dumbbell Swing** | Single-dumbbell swing, not kettlebell. `PLYOMETRICS` / HAMSTRINGS, GLUTES, SHOULDERS / DUMBBELL |
| Upper Back-Leg Grab → **Seated Hamstring and Upper Back Stretch** | Seated two-leg forward fold, not a standing quad stretch; was missing its actual primary muscle. `STRETCHING` / HAMSTRINGS, LOWER_BACK, MIDDLE_BACK / NONE |
| Downward Facing Balance → **Stability Ball Plank Hold** | Requires an exercise ball, not bodyweight-only. `STRENGTH` / GLUTES, ABDOMINAL, HAMSTRINGS / EXERCISE_BALL |
| Suspended Hip Thrust → **TRX Hip Thrust** | Confirmed strap-based, not the two-bench interpretation. `STRENGTH` / GLUTES, HAMSTRINGS / OTHER |
| The Straddle → **Seated Straddle Stretch** | Confirmed as guessed; added CALVES as a secondary muscle. `STRETCHING` / HAMSTRINGS, ADDUCTORS, CALVES / BODY_ONLY |
| Kneeling Squat → **Barbell Kneeling Squat** | A real barbell powerlifting movement, confirmed wrongly copy-pasted from "Kneeling Jump Squat" (which stays correct as-is). `POWERLIFTING` / GLUTES, HAMSTRINGS, LOWER_BACK / BARBELL |

**1 of 9 could not be identified — left unresolved, flagged for a human decision**:

- **Backlash with Dumbbells** (id `UNpo9QQILw9SQOsWteZW`) — no match in free-exercise-db, wger, a second exercise-dataset mirror, bodybuilding glossaries, or general web search; no evidence a page by this name ever existed on bodybuilding.com either (unlike Suspended Hip Thrust, which had confirmed Wayback Machine snapshots). The app's own pre-regeneration data for this id records `targetMuscle: QUADRICEPS` — a leg exercise — which conflicts with the currently-guessed rear-delt-raise content (SHOULDERS/MIDDLE_BACK/TRAPS) still sitting in the output asset. **Left as the original unverified guess in the output JSON — do not trust it without further input** (e.g. asking whoever originally entered this exercise, or retiring the name as unidentifiable).

**Human decision (2026-08-17)**: keep the unverified rear-delt-raise guess and persist it like every other entry — no further identity work.
