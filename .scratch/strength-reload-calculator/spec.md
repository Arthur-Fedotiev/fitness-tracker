# Strength Reload Calculator

Status: ready-for-agent

Nav-labeled **Training Planner**. A lifter builds a Program of Main Lift Blocks, each generating an 8-week Reload Cycle from an 80%RM Test, per Pavel Tsatsouline & Fabio Zonin's published method (_Reload: Your Barbell Strength Blueprint_, StrongFirst, Appendix B). New `program` domain, Firestore-persisted, standalone from workout logging. See [ADR-0007](../../docs/adr/0007-introduce-program-domain-for-strength-reload.md) for why this is its own domain, and root `CONTEXT.md`'s "Training Planner (Strength Reload)" section for canonical terminology (Program, Main Lift Block, 80%RM Test, Weekly Jump, Ramp-up Baseline, Loading Constraint, Reload Cycle, Strategy) — read that before this spec; terms below assume it.

This spec was compiled from the [Strength Reload Calculator map](map.md) — every decision below traces to one of its eight closed tickets, linked inline. Zoom into a ticket for the full reasoning; this document states the *what*, not the *why*.

## Domain model

- **Program** — `draft` → `active` → `completed`. Multiple Programs per lifter, kept as history (not one Program mutated forever). Always editable/deletable (private data, plain CRUD). Auto-completes once every Main Lift Block has a saved Week 8 retest, or via an explicit "mark complete" action. Status is lifter-driven, never inferred from calendar dates.
- **Main Lift Block** — one exercise's entry within a Program, linking to an existing `exercise` document by id. Carries an 80%RM Test, a Loading Constraint, and (once generated) a frozen Reload Cycle.
- **80%RM Test** — `{ oneRepMax, repsAt80Percent }`. Looks up Weekly Jump % and Ramp-up Baseline % from the fixed table below.
- **Loading Constraint** — `{ increment, roundingMode }` (`nearest` / `down` / `up`), the gym-specific "smallest plate jump" rounding rule.
- **Reload Cycle** — the generated Week 1–8 table for one Main Lift Block.

Full detail: [Program lifecycle](issues/02-program-lifecycle.md), [Weekly Jump / Week 5 formula](issues/01-weekly-jump-week5-formula.md).

## Calculation engine

### Lookup table

| Reps @ 80%1RM | Weekly Jump (%1RM) | Ramp-up Baseline (%1RM) |
|---|---|---|
| ≤5 | 5% | 60% |
| 6–8 | 4% | 65% |
| 9–10 | 3% | 70% |
| >10 | 2% | 75% |

Confirmed exact against StrongFirst's own Appendix B. Source of truth: [Weekly Jump / Week 5 formula](issues/01-weekly-jump-week5-formula.md).

### Anchor model

Week 5 is the Reload Cycle's single anchor load, sourced from one of three places, in order of precedence as the Main Lift Block's data fills in:

1. **Placeholder** (`anchorSource: 'placeholder'`) — before an 80%RM Test exists: `Week5 = roundToIncrement(oneRepMax × 0.85)`.
2. **Table-driven** (`anchorSource: 'table'`) — once the Test exists: `Week5 = roundToIncrement(oneRepMax × (RampUpBaseline% + 4 × WeeklyJump%))`, looked up from the table above by `repsAt80Percent`. Permanently supersedes the placeholder.
3. **Manual** (`anchorSource: 'manual'`) — a lifter-entered override of Week 5.

**Implementation note (added during build-out):** the `test` field's two inner values fill in independently rather than atomically — `oneRepMax` alone (no `repsAt80Percent` yet) is what actually produces the placeholder anchor above; once `repsAt80Percent` is entered too, the table-driven anchor takes over. This matches the source-of-truth ticket's framing ("before an 80%RM Test exists") without requiring a separate top-level field for a bare 1RM.

All three feed the **identical** derivation for the rest of the cycle — there is no per-source branching downstream of Week 5:

- **Weeks 1–4** derive **backward**: `Week(n) = Week5 − (5−n) × WeeklyJump`, i.e. Week 4 = Week5 − 1×Jump, … Week 1 = Week5 − 4×Jump.
- **Weeks 6–7** derive **upward**: `Week(n) = Week5 + (n−5) × WeeklyJump`, i.e. Week 6 = Week5 + 1×Jump, Week 7 = Week5 + 2×Jump.
- **Week 8** has no prescribed load — it's a 1RM re-test, recorded as `week8Retest`, informational only (see Program lifecycle above).
- **Manual override on Week 5 cascades**: typing a new Week 5 value replaces the anchor outright and recomputes Weeks 1–4 and 6–7 relative to it. There is no single-cell-only mode.

Sets×reps per week are fixed by the source method, independent of load:

| Week | Sets × Reps |
|---|---|
| 1–4 | 5×5 |
| 5 | 5×5 |
| 6 | 3×3 |
| 7 | 2×2 |
| 8 | 1RM re-test (no prescription) |

Every computed load is passed through `roundToIncrement(value, loadingConstraint.increment, loadingConstraint.roundingMode)`. Two adjacent weeks landing on the same displayed load after rounding is **acceptable, not a bug** — no artificial minimum-delta rule prevents it (see Testing below).

Full detail, including the Week 6–7 "counting forward" sourcing: [Weekly Jump / Week 5 formula](issues/01-weekly-jump-week5-formula.md).

## Data model (Firestore)

```text
programs/{programId}
  userId, name, status: 'draft'|'active'|'completed', strategy: 'strength-reload',
  createdAt, updatedAt
  mainLiftBlocks: [                       // embedded array, may be empty
    {
      id,                                 // client-generated, addresses this block within the array
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

- **Embedded array, not a subcollection** — Main Lift Blocks are few per Program, always read/written as a unit; matches `libs/workout/domain`'s existing nested-composite pattern and ADR-0005's flat-over-nested precedent.
- **Computed values are stored, including the full per-week `{week, load, sets, reps}` prescription** — required for "frozen once generated" to be total; sets/reps can't live only in application code or a future table change would silently alter already-frozen historical Cycles.
- **`firestore.rules`**: new `programs/{programId}` block, simplified user-only ownership (no `admin` field, no shared/public branch): `allow read/update/delete: if isKnownUser() && request.auth.uid == resource.data.userId`, plus the create-time equivalent against `request.resource.data.userId`. Gated by `isValidProgram()` checking `name` (non-empty string), `status`, `strategy`, `mainLiftBlocks is list` (empty array accepted) — **does not deep-validate `mainLiftBlocks` contents**, matching the existing `isValidWorkout` precedent.

Full detail: [Firestore schema & rules](issues/03-firestore-schema-and-rules.md).

## Input validation bounds

Enforced at the **UI form layer only** (Angular `Validators.min` + integer check for reps) — no domain-layer rejection, matching this codebase's existing precedent (no domain here validates its own numeric inputs server-side, and `isValidProgram()` deliberately skips deep validation).

| Field | Bound |
|---|---|
| 1RM | `> 0`, decimals allowed, no ceiling |
| Reps achieved on 80%RM Test | positive integer (`>= 1`), no ceiling |
| Loading Constraint increment | `> 0`, decimals allowed, no ceiling |
| Manual Week 5 override | `> 0`, decimals allowed, no ceiling |

Full detail: [Input validation bounds](issues/06-input-validation-bounds.md).

## UI flow

**Variant C — tabbed dashboard**, chosen over a wizard and a sidebar master-detail after building and comparing all three as clickable prototypes (`apps/fitness-tracker/src/app/prototype-training-planner/`, still live at `/prototype/training-planner?variant=A|B|C` until the real implementation replaces it — move to a throwaway branch once it does).

- One tab per `ProgramStatus`, in order `draft` → `active` → `completed`.
- Within a tab: Programs of that status as a chip row.
- Selected Program's Main Lift Blocks render as a card grid (`repeat(auto-fill, minmax(280px,1fr))`) — inputs (Test, Loading Constraint), a Generate/Regenerate button, and the Week 1–8 table always visible per card, no accordion/stepper to expand into.
- Reflows to one column on narrow viewports via plain CSS grid; `mat-tab-group`'s built-in horizontal scroll/pagination handles the tab strip on mobile — no bespoke `BreakpointObserver` collapse needed (unlike the rejected sidebar variant).

Full detail and rejected alternatives: [UI flow prototype](issues/04-ui-flow-prototype.md).

## Architecture

- **Nx lib split — start lean**: `program-domain`, `program-feature-dashboard` (the tabbed dashboard screen), `program-shell` (lazy-loaded routes). No `program-public-api`/`program-ui-components` until an actual second consumer needs them.
- **State management — `@ngrx/signals`' `signalStore`**, not classic NgRx Store/Effects. First domain in the repo to use it; safe pilot because `program`'s internals stay private behind its module boundary. `exercise`/`workout` are untouched, staying on classic NgRx.
- **Firestore I/O — plain `async`/`await`** on the modular SDK (`getDocs`, `addDoc`, `setDoc`, `deleteDoc`) directly inside `signalStore`'s `withMethods`, `patchState()` on resolution. No Observables/`rxMethod`/`@ngrx/effects` for this domain — nothing in this codebase uses realtime Firestore listeners today, and Programs have no live-sync requirement.
- **Exercise picker** — a new narrow query minted off `exercise/public-api` (its own `InjectionToken`, not the whole `ExerciseFacade`, per the module-boundary convention below), returning `{id, name}` for a simple name-filtered dropdown. Not the full filterable/paginated picker the exercise library page has.
- **Save cadence** — explicit Save, matching `exercise`/`workout` exactly; no autosave-on-keystroke.
- **Generate Reload Cycle persists immediately**, scoped to that Main Lift Block, rather than waiting on a Program-level Save — it's a frozen event, not draft data safe to lose to a refresh.
- **Routing** — `/training-planner`, lazy-loaded via `loadChildren` in `app.routes.ts`, plus a resolver preloading the Program list before the dashboard renders (mirroring `workout`'s `composedWorkoutDataResolver`).

Full detail: [Real implementation architecture](issues/08-real-implementation-architecture.md).

### Module boundaries (already done)

`.eslintrc.json`'s `@nx/enforce-module-boundaries` already has a `domain:program` constraint (`["domain:program", "domain:shared", "domain:exercise/api-public"]`), added alongside closing a pre-existing gap where `domain:workout` had no constraint at all. Cross-domain consumption goes only through narrow Query/Command interfaces + `InjectionToken`s exported from a domain's `public-api` — never a whole facade (Interface Segregation) — documented in root `CONTEXT.md`'s "Architecture conventions". This was executed directly rather than left as an implementation step; nothing further to do here before scaffolding `libs/program/*`.

Full detail: [Module boundary constraints](issues/07-module-boundary-constraints.md).

## Testing / acceptance criteria

The `program-domain` implementation **must ship an actual unit test suite** for the Strength Reload Strategy satisfying every row below — spec text alone is not sufficient.

| # | Requirement | Min. cases |
|---|---|---|
| 1 | Table boundary cutoffs — explicit cases at reps = 5, 6, 8, 9, 10, 11 | 6 |
| 2 | Anchor-source convergence — one case per source (placeholder, table-driven, manual), all feeding identical derivation | 3 |
| 3 | Manual override on Week 5 recomputes Weeks 1–4 and 6–7, not just Week 5 | 1 |
| 4 | Rounding modes (nearest/down/up) interacting with the derivation | 3 |
| 5 | Rounding-collision (two adjacent weeks computing to the same displayed load) is tolerated, not a bug | 1 |

**14 minimum test cases**, each traceable to one requirement above. Full detail: [Testing/QA approach for the calculation engine](issues/05-testing-approach-calculation-engine.md).

## Out of scope

- Accessory lift categories (Horizontal Pull, Vertical Pull, Specialized Variety, Midsection) and the Heavy/Light day weekly split from the source Reload method — only the main-lift progression table per Main Lift Block is implemented.
- Integration with workout logging (`libs/workout/*`) — Reload Cycles are standalone reference plans, not linked to logged workout sessions.
- A pluggable strategy interface/registry for multiple generation strategies — `Program.strategy` is named for future extension but no plugin architecture is built now.
- Admin-authored or shared Programs — Programs are private to the owning user only, unlike the exercise library's admin/shared model.

## Deliberately deferred (not in this build)

- Whether a second generation Strategy is ever added beyond Strength Reload — revisit only if one is actually proposed.
- Whether/how a completed Main Lift Block's Week 8 retest 1RM pre-fills the 80%RM Test on a lifter's next Program — a convenience, not decided.

## References

- [Strength Reload Calculator map](map.md) — the wayfinder map this spec was compiled from.
- [ADR-0007](../../docs/adr/0007-introduce-program-domain-for-strength-reload.md) — why `program` is its own domain.
- Root `CONTEXT.md` — "Training Planner (Strength Reload)" terminology, "Architecture conventions".
- `apps/fitness-tracker/src/app/prototype-training-planner/` — throwaway prototype code (Variant C is the reference UI; `model.ts`'s `generateCycle` is a reference implementation of the calculation engine above, not production code).
