# Input validation bounds

Type: grilling
Status: resolved
Blocked by: 03

## Question

[Firestore schema & rules](03-firestore-schema-and-rules.md) settled that `isValidProgram()` will not deep-validate the `exerciseBlocks` array's contents (matching the existing `isValidWorkout` precedent of not validating nested `content` items). That means 1RM, reps-at-80%, and Loading Constraint increment bounds — if enforced at all — live at the domain/UI layer, not in `firestore.rules`.

Decide:

1. What are the actual bounds — 1RM (e.g. must be positive, any sane upper limit?), reps achieved on the 80%RM Test (the lookup table only defines bands up to ">10" — is there a practical max?), and Loading Constraint increment (must be positive, any sane range for a "smallest plate jump")?
2. Where do these get enforced — domain-layer validators in the new `program` lib (matching how `libs/exercise/domain`/`libs/workout/domain` validate their own inputs client-side), UI form validation only, or both?
3. What happens on an out-of-bounds value — is it simply un-submittable (form-level block), or does the domain layer need to reject it too (defense against a client bypassing the UI)?

## Answer

**Bounds — positive only, no upper cap, for every numeric weight/rep input in the flow:**

1. **1RM** — must be `> 0`, decimals allowed (kg), no ceiling. No magic sanity cap; trusts the lifter rather than guessing a number that could be wrong for an elite squat/deadlift.
2. **Reps achieved on the 80%RM Test** — must be a positive integer (`>= 1`), no ceiling. The lookup table's top band (`>10`) already absorbs any value above 10, so a cap would add a rule without changing behavior.
3. **Loading Constraint increment** — must be `> 0`, decimals allowed (kg), no ceiling. Also guards the existing `roundToIncrement` divide-by-zero/negative-increment concern in the prototype (`apps/fitness-tracker/src/app/prototype-training-planner/model.ts:113`) — since the UI never lets a non-positive value reach it, that function's `if (!increment || increment <= 0)` fallback becomes defensive-only, never load-bearing in normal use.
4. **Manual Week 5 override** (a fourth numeric weight field, surfaced during grilling — used when a lifter bypasses the Test/table lookup and types the anchor load directly) — same treatment as 1RM: `> 0`, no ceiling. It's the same kind of value (a load in kg), just manually entered instead of computed.

**Enforcement layer — UI form validation only, no domain-layer rejection.** Angular `Validators.min` (plus an integer check for reps) on each form control; an out-of-bounds value is simply un-submittable. This matches the codebase's existing precedent: no domain (`exercise`, `workout`) validates its own numeric inputs today, and `firestore.rules`' `isValidProgram()` was already scoped (ticket 03) to skip deep-validating `exerciseBlocks` contents. Adding domain-layer defense-in-depth here would be a new pattern for this codebase, not a continuation of one — deliberately not introduced.

**`/domain-modeling` check:** this decision is implementation-level (form validation rules), introduces no new shared terminology, and isn't ADR-worthy (reversible, not surprising given existing UI-only-validation precedent, no real architectural trade-off). No `CONTEXT.md` or ADR update made.

Decided in conversation with the user, 2026-08-12.
