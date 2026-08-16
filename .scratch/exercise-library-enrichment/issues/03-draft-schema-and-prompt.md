Type: prototype
Status: open
Blocked by: 01, 02

# Draft the JSON schema and ChatGPT prompt

## Question

Using the finalized taxonomy from [Finalize the exercise taxonomy](02-finalize-taxonomy.md) and the existing exercise inventories from [Pull existing exercise names (prod + staging)](01-existing-exercise-names.md) (both admin-owned document IDs — needed since regeneration overwrites in place — and names), draft:

1. The per-exercise JSON schema: `name`, `exerciseType`, `targetMuscles: string[]`, `equipment`, `instructions` (matching the live `Exercise` shape from [ADR-0005](../../../docs/adr/0005-flatten-exercise-basedata.md), plus the new `targetMuscles` array). Include the document `id` for regenerated (existing) entries so the eventual overwrite is unambiguous.
2. The actual ChatGPT prompt text. This now targets a **full regeneration** of the admin-owned library (per the map's reseed-in-place redraw), not gap-filling: it should cover every currently-admin-owned exercise (regenerate its content) plus fill in missing popular main lifts, powerlifts, olympic lifts, and functional/conditioning movements; constrain output to the finalized taxonomy values; specify strict JSON output.

Use `/prototype` to produce a concrete draft (schema + prompt + a sample generated batch) for the human to react to and iterate on. This ticket's answer is the finished prompt + schema, ready to run — running it, reviewing the output, and executing the overwrite/delete is the human's next step, outside this map (see the map's Out of scope section).

## Answer
