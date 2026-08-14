# Strength Reload Calculator

Label: wayfinder:map

## Destination

An implementation-ready spec for the Strength Reload Calculator: a new `program` domain (nav-labeled "Training Planner") where a lifter creates a Program of Exercise Blocks linked to existing exercises, enters an 80%RM Test and Loading Constraint per block, and gets a generated Reload Cycle (Weeks 1–8) via the Strength Reload Strategy. Firestore-persisted, standalone from workout logging, at a new top-level route. The map closes once every ticket below resolves — the last step is compiling those decisions into the spec document.

## Notes

- Core terminology (Program, Exercise Block, 80%RM Test, Weekly Jump, Ramp-up Baseline, Loading Constraint, Reload Cycle, Strategy) is recorded in root `CONTEXT.md` under "Training Planner (Strength Reload)". Read it before using any of these terms.
- Architectural decisions (new `program` domain, Firestore persistence, exercise linkage, no plugin architecture, no workout-log integration) are recorded in [ADR-0007](../../docs/adr/0007-introduce-program-domain-for-strength-reload.md).
- This feature is modeled directly on Pavel Tsatsouline & Fabio Zonin's published _Reload: Your Barbell Strength Blueprint_ (StrongFirst) — consult that source (Appendix B tables) before inventing calculation logic from scratch.
- Default every ticket to `/grilling` + `/domain-modeling` unless its `Type:` line says otherwise.
- Match existing domain patterns: `libs/exercise/domain`, `libs/workout/domain` (Firestore data-access, facade/state pattern, Nx lib layout of `domain/feature-*/ui/shell`) — **except state management**, superseded by [Real implementation architecture](issues/08-real-implementation-architecture.md): `program` pilots `@ngrx/signals`' `signalStore` with async/await Firestore I/O instead of classic NgRx `+state`/Effects.
- Programs are private to the owning user only — no admin/shared visibility, unlike exercises.

## Decisions so far

- [Weekly Jump / Week 5 formula](issues/01-weekly-jump-week5-formula.md) — Week 5 is the cycle's anchor (from Option A pre-Test, table-driven post-Test, or Manual); Weeks 1–4 derive backward, Weeks 6–7 derive upward, both by the same Weekly Jump; Manual override on Week 5 cascades to the whole cycle; lookup table confirmed exact against StrongFirst's own Appendix B (first band corrected from a "≥5" transcription typo to "≤5" during spec compilation, matching the working prototype code).
- [Program lifecycle](issues/02-program-lifecycle.md) — multiple Programs kept as history; always editable/deletable but a generated Reload Cycle is frozen (edits don't auto-recompute); Week 8 retest is informational per block; Program has explicit `draft`/`active`/`completed` status, completing automatically once every block is retested or via explicit manual completion.
- [Firestore schema & rules](issues/03-firestore-schema-and-rules.md) — Exercise Blocks embedded as an array on `programs/{id}` (not a subcollection); generated Cycles store the full `{week, load, sets, reps}` prescription, not just load; `programs` gets its own simplified user-only ownership rule (no `admin` field).
- [Module boundary constraints](issues/07-module-boundary-constraints.md) — added a `domain:program` lint constraint (mirroring a newly-added `domain:workout` one, closing a pre-existing gap); public-api surfaces expose narrow Query/Command interfaces via `InjectionToken`, never a whole facade (Interface Segregation) — documented in `CONTEXT.md`'s new "Architecture conventions". Executed directly, not left as a ticket.
- [UI flow prototype](issues/04-ui-flow-prototype.md) — tabbed dashboard wins over a wizard and a sidebar master-detail: status tabs (draft/active/completed) + Program chips + a card grid of always-expanded Exercise Blocks, chosen for both data density and near-free mobile responsiveness (native tab scroll + CSS grid reflow, no bespoke breakpoint collapse needed).
- [Real implementation architecture](issues/08-real-implementation-architecture.md) — lean Nx split (`program-domain`/`program-feature-dashboard`/`program-shell`, no `public-api`/`ui-components` yet); `program-domain` pilots `@ngrx/signals`' `signalStore` with async/await Firestore I/O (no Observables/Effects), diverging from `exercise`/`workout`'s classic NgRx pattern — safe since domain internals stay private behind `public-api`; exercise picker gets its own lean `{id,name}` query off `exercise/public-api`; explicit Save throughout, Generate persists immediately; routed at `/training-planner` with a preload resolver.
- [Testing/QA approach for the calculation engine](issues/05-testing-approach-calculation-engine.md) — spec mandates a concrete 14-case minimum test checklist for the Strength Reload Strategy (6 table-boundary cutoffs, 3 anchor-source convergence cases, 1 Manual-override-cascades-the-cycle case, 3 rounding-mode cases, 1 rounding-collision-is-tolerated case), stated in `spec.md` as acceptance criteria _and_ required as an actual unit test suite in `program-domain`, not documentation alone.
- [Input validation bounds](issues/06-input-validation-bounds.md) — 1RM, Loading Constraint increment, and Manual Week 5 override are each positive-only with no upper cap; reps-at-80%RM is a positive integer with no upper cap; enforced via UI form validation (Angular `Validators.min`) only, no domain-layer rejection — matches existing codebase precedent of UI-only numeric validation.

## Not yet specified

- Whether a second generation Strategy is ever added beyond Strength Reload — deliberately deferred until one is actually proposed; `Program.strategy` exists as a discriminator but nothing more.
- Whether/how a completed Exercise Block's Week 8 retest 1RM pre-fills the 80%RM Test on a lifter's next Program — deferred as a convenience, not decided now.

**Destination reached.** All eight tickets resolved (see Decisions so far), compiled into [spec.md](spec.md), status `ready-for-agent`. Map closed — no further tickets.

## Out of scope

- Accessory lift categories (Horizontal Pull, Vertical Pull, Specialized Variety, Midsection) and the Heavy/Light day weekly split from the source Reload method — this feature implements only the main-lift progression table per Exercise Block.
- Integration with workout logging (`libs/workout/*`) — Reload Cycles are standalone reference plans, not linked to logged workout sessions.
- A pluggable strategy interface/registry for multiple generation strategies — Strategy is named for future extension but no plugin architecture is being built now.
- Admin-authored or shared Programs — Programs are private to the owning user only, unlike the exercise library's admin/shared model.
