# Firestore schema & rules

Type: grilling
Status: resolved
Blocked by: 01, 02

## Question

Decide the Firestore shape for the new `program` domain:

1. Document/collection structure: a single `programs/{id}` document with Exercise Blocks embedded as an array field, or Exercise Blocks as a subcollection? Weigh against the precedent set by [ADR-0005](../../../docs/adr/0005-flatten-exercise-basedata.md) (flat over nested) and how `libs/workout/domain` structures composed content (including nested Superset composites).
2. Are a Reload Cycle's computed Week 1–8 values stored on write (per the formula decided in [Weekly Jump / Week 5 formula](01-weekly-jump-week5-formula.md)), or recomputed on every read from the stored 1RM/80%RM Test/Loading Constraint inputs? This depends on the editability answers from [Program lifecycle](02-program-lifecycle.md) — a frozen Reload Cycle favors storing, a recomputing one favors deriving.
3. `firestore.rules` ownership rules for the new collection, mirroring the `userId`-based ownership already used by `exercise` and `workout`, consistent with the "Programs are private to the owning user only" decision.

## Answer

**Schema:**

```text
programs/{programId}
  userId, name, status: 'draft'|'active'|'completed', strategy: 'strength-reload',
  createdAt, updatedAt
  exerciseBlocks: [                       // embedded array, may be empty
    {
      exerciseId,                         // reference to exercises/{id}
      test: { oneRepMax, repsAt80Percent } | null,
      loadingConstraint: { increment, roundingMode },
      anchorSource: 'placeholder' | 'table' | 'manual' | null,
      cycle: [ { week, load, sets, reps } ] | null,   // Weeks 1–7; Week 8 has no prescription
      week8Retest: number | null,
    },
    ...
  ]
```

1. **Embedded array, not a subcollection.** Matches how `libs/workout/domain` already stores composed content — including nested Superset composites — as an embedded array field on the parent document, and leans the same direction as ADR-0005's flat-over-nested precedent. Exercise Blocks are few per Program, always read/written as a unit (generate/edit a whole Program), and never queried independently today.

   **Considered and deliberately not chosen now:** a subcollection would earn its keep if (a) a future feature needed cross-Program queries (e.g. `collectionGroup` progression views across a lifter's whole history, or across future non-strength-reload Program types), (b) concurrent per-block writes needed to avoid whole-document contention, or (c) per-block Cycle versioning/history were needed. None of these are live requirements — Programs are private, bounded in count, and edited as a whole — so the simpler embedded shape wins today. A lifetime-progression or personal-records feature was discussed as plausible future work but is explicitly a separate future feature, not something this schema is being pre-shaped for.

   Also discussed: future accessory-lift categories (Horizontal/Vertical Pull, Specialized Variety, Midsection) and a Heavy/Light day split (both already out of scope per the map) would not require breaking this schema — Firestore documents aren't rigidly typed, so new optional fields or a new sibling concept (e.g. an "Accessory Block") can be added later without migrating existing documents. Not designed for now since the accessory-lift formula hasn't been read from the source material yet.

2. **Store the computed values, including the full per-week prescription.** A generated Cycle stores `{ week, load, sets, reps }` for each of Weeks 1–7 — not just `load` with sets/reps left as a derived constant. This is required for the "frozen once generated" behavior from [Program lifecycle](02-program-lifecycle.md) to be total: if sets/reps lived only in application code, a future change to that fixed table would silently alter the displayed prescription on already-"frozen" historical Cycles.

3. **New `programs/{programId}` rules block with its own simplified ownership check** — no `admin` field, no public/shared branch, since Programs are private to the owning user permanently (unlike `exercise`/`workout`'s admin/shared model): `allow read/update/delete: if isKnownUser() && request.auth.uid == resource.data.userId`, plus the create-time equivalent against `request.resource.data.userId`, gated by a new `isValidProgram()` checking `name` (non-empty string), `status`, `strategy`, and `exerciseBlocks is list` (accepting an empty array) — without deep-validating the array's contents, matching how `isValidWorkout` never validates nested `content` items either.

`anchorSource` is stored per Exercise Block (set once a Cycle exists) so the UI can display "manually overridden" vs. "from your 80%RM Test" without reverse-engineering it from the numbers.

Decided in conversation with the user (voice-transcribed answers, 2026-08-12).
