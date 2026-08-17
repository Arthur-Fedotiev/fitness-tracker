Type: task
Status: resolved
Blocked by: 03

# Generate the regenerated exercise content ourselves (no ChatGPT hand-off)

## Question

[Draft the JSON schema and ChatGPT prompt](03-draft-schema-and-prompt.md) produced a ready-to-run prompt whose only documented path to real content was handing it off externally — paste into ChatGPT's web UI, or call the OpenAI API. The map's destination described the deliverable as "a crafted ChatGPT prompt," meaning the actual regenerated content for the library never got produced as part of this effort.

The user asked to skip that hand-off: generate the actual regenerated content directly in this session, using the already-finalized taxonomy, prompt, and schema as the spec — without touching ChatGPT at all. Scope stays generation-only; review-by-hand and the Firestore persist/overwrite/delete execution remain out of scope for this map exactly as before (see the map's Out of scope section) — this ticket only replaces *who writes the instructions*, not who reviews or who touches prod.

Do it: produce the full regenerated batch (all 158 existing admin-owned rows across staging + prod, deduplicated to 143 unique document ids since 15 ids are shared verbatim across both environments, plus new popular lifts filling taxonomy/equipment gaps) as a schema-conformant JSON asset, validated programmatically the same way ticket 03's sample batch was validated.

## Answer

Generated directly (no ChatGPT/OpenAI call of any kind) by parsing `exercise-regeneration.prompt.md`'s two existing-exercise lists programmatically, writing real per-exercise content (name, `exerciseType`, `targetMuscles`, `equipment`, `instructions`) for every distinct movement, then assembling and validating the output with a throwaway build/validation script (not committed — scratch tooling, not a repo artifact; only its output is kept, as the asset below).

**Coverage**: 158 existing rows (30 staging + 128 prod) resolve to 143 unique document ids — 15 ids are used verbatim in both the staging and prod Firestore projects for the same seeded exercise (e.g. `UNpo9QQILw9SQOsWteZW` "Backlash with dumbbells" appears in both lists with the identical id), so one output entry per id covers both environments' overwrite; the true cross-env duplicates that use *different* ids for the same real-world exercise (e.g. Clean and Jerk, Military Press x4, Barbell Glute Bridge x4 — 19 name-clusters, 48 ids total) each got their own entry but with identical content, per the prompt's own duplicate-handling rule. Plus 19 new exercises (`id: null`) covering popular main lifts, powerlifts, an Olympic lift, and functional/conditioning/cardio movements, chosen partly to exercise taxonomy values nothing in the existing 158 used (`TRAP_BAR`, `E-Z_BAR`, `JUMP_ROPE`).

**Output asset**: [exercise-regeneration.output.json](../assets/exercise-regeneration.output.json) — 162 total entries (143 regenerated existing + 19 new). Programmatically validated against `exercise-regeneration.schema.json`'s enums, `minItems`, required fields, and id-uniqueness: 0 errors. All 14 corrupted-`targetMuscle` documents flagged in the prompt were reclassified from scratch per the prompt's instructions, not left as-is.

**What did not change**: the taxonomy, schema, and prompt from ticket 03 stayed the spec — this ticket only swapped the execution mechanism (direct generation vs. ChatGPT hand-off) for producing content that conforms to them. `exercise-regeneration.prompt.md`'s "How to run this" section is now stale (it only describes the ChatGPT/OpenAI paths) but was left as-is since it still accurately documents *a* valid way to run the prompt, just no longer the one used here.

**Next step (human, outside this map)**: review `exercise-regeneration.output.json` for instruction quality/accuracy/safety before anything is persisted — the map's Out of scope section still defers the actual Firestore overwrite/delete to its own careful, human-driven session.

### Addendum: naming-normalization pass + ambiguous-identity correction

Human review caught two problems with the first pass: (1) several original names were dated gym vocabulary that read as awkward or possibly mistranslated even where the generated movement content was already correct, and (2) a handful of genuinely ambiguous names had been guessed from the bare name alone with no source, risking wrong movement content, not just a stale label.

Resolved (1) directly by deciding a naming policy — regenerated names normalize to modern standard terminology rather than preserving legacy labels (names aren't referenced by id, so this is safe) — and applying it to `exercise-regeneration.output.json`: `Army Press`→`Overhead Press` (id `YU0OsilcsOcShRsxBxbS`; the separate new `Overhead Press` entry this made redundant was dropped), `Barbell Full Squat`/`Full Squat with a Barbell`→`Barbell Back Squat` (ids `uwmFYB7iuAB9Md8PZT05`, `20N0Kj06Dt8HNfhytekq`), `Pull Through`→`Cable Pull-Through` (id `KSziWkgJxpZSV3I3VQxt`), `Band Good Morning (Pull Through)`→`Band Good Morning` (id `QuA3rZoMZveje9g0gHL7`), `Romanian Deadlift with Dumbbells`→`Dumbbell Romanian Deadlift` (id `5fxEsLbhvHDzti3Fd4nK`). Total entries now 161 (was 162, minus the one dropped duplicate).

Spun (2) out as its own ticket rather than folding it in here, since it needs external verification, not just a rename: [Verify ambiguous exercise identities before trusting the generated batch](06-verify-ambiguous-exercise-identities.md).
