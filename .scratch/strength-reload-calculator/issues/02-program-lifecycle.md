# Program lifecycle

Type: grilling
Status: resolved

## Question

Decide the lifecycle of a Program once created:

1. Can a lifter have multiple Programs (e.g. one per training block, kept around after completion), or only one at a time?
2. Can a Program, or an Exercise Block within it, be edited or deleted after creation? If the underlying 80%RM Test or Loading Constraint for an Exercise Block changes, what happens to its already-generated Reload Cycle — does it recompute, or is it frozen?
3. The loose spec calls the Week 8 1RM re-test optional. How does entering a post-cycle 1RM feed back — does it start a new Program, update the existing one in place, or just get recorded as informational with no effect on the Program?
4. Does a Program have an explicit status (e.g. draft / active / completed), or is its state always implicit from which week the calendar date falls in?

## Answer

1. **Multiple Programs, kept as history.** The natural cadence — Test → Cycle → retest → next Cycle — is inherently a sequence of Programs over time, not one Program mutated forever. A lifter can look back at completed blocks the same way workout logging keeps history.
2. **Always editable and deletable** (private data, nothing downstream references it per ADR-0007-introduce-program-domain-for-strength-reload — plain CRUD, no locking). Once a Reload Cycle has been generated for an Exercise Block, editing its 80%RM Test or Loading Constraint does **not** auto-recompute it — the Cycle stays frozen at its generated values. Regenerating from edited inputs is an explicit action, not a side effect of editing a field. This is independent of the Manual-override-cascade behavior decided in [Weekly Jump / Week 5 formula](01-weekly-jump-week5-formula.md), which only concerns overriding Week 5 within an already-generated Cycle.
3. **Week 8 retest is recorded on the Exercise Block, informational** — it does not rewrite the Cycle and does not auto-create or update a separate Program. (Whether/how it could later pre-fill a new Program's Test is deferred — see map's Not yet specified.) It does drive completion, per (4).
4. **Explicit status field** on Program: `draft` (created, no Exercise Block has a generated Cycle yet) → `active` (at least one does) → `completed`. A Program completes **automatically once every Exercise Block in it has a saved Week 8 retest**, or **via an explicit "mark complete" action** at any time — the manual path exists because the retest is optional per the original spec, so a Program can't always wait on every block being retested. Status is lifter-driven, never inferred from calendar dates (real training doesn't run on a fixed schedule).

Decided in conversation with the user (voice-transcribed answers, 2026-08-11).
