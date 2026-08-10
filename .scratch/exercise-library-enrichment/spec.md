Status: needs-triage

# Enrich the exercise library

Deferred during the `/grill-with-docs` session that produced [ADR-0005](../../docs/adr/0005-flatten-exercise-basedata.md) (flatten `Exercise.baseData`). The original idea that kicked off that session was broader — regenerate the whole exercise collection with better/more content, sourced from an LLM. Grilling separated that into two independent projects: ADR-0005 (schema shape, done) and this (content quality/coverage, not started).

## What this is

Adding more `admin: true` exercise documents — and/or improving the `instructions` on existing ones — on top of the now-flat schema (`name`, `exerciseType`, `targetMuscle`, `equipment`, `instructions`, `userId`, `admin`). Purely additive: new documents, or in-place instruction-quality edits to existing ones. Not a wipe-and-reseed — see ADR-0005 for why regenerating the collection was rejected (dangles workout references, loses real ownership data).

## Open questions (why this is `needs-triage`, not `ready-for-agent`)

- What's actually wrong with the current 128 (prod) / 31 (staging) exercises — thin coverage, weak instructions, both, neither?
- If LLM-generated content is used, what review step catches wrong/unsafe exercise instructions before they reach `admin: true` (i.e. visible to every user)?
- New docs only, or also revising existing `instructions` text on current documents?
