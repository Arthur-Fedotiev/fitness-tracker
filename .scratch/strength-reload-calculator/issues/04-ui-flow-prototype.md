# UI flow prototype

Type: prototype
Status: resolved
Blocked by: 02

## Question

Build a rough/clickable prototype of the end-to-end flow: create a Program → add one or more Exercise Blocks (each linked to an existing exercise from the library) → enter an 80%RM Test (1RM, reps at 80%) and Loading Constraint (increment, rounding mode) per block → see the auto-suggested Week 5 load with a Manual override toggle → view the generated Reload Cycle table for Weeks 1–8 per Exercise Block.

Reflect the Program lifecycle decided in [Program lifecycle](02-program-lifecycle.md) — in particular whether this is a single-Program view or needs a Program list/picker, and whether editing an existing Program is part of the flow.

## Prototype built — awaiting reaction

Three structurally different variants, live at `http://localhost:4300/prototype/training-planner?variant=A|B|C` (`nx serve fitness-tracker`), code under `apps/fitness-tracker/src/app/prototype-training-planner/`:

- **A — Wizard**: a Program picker (chip row) above a linear 3-step `mat-stepper` (Setup → Tests & Constraints → Review). One Program driven through at a time; no persistent list view.
- **B — Master-detail**: sidebar Program list grouped by `draft`/`active`/`completed` (mirrors the existing workout compose/details pattern) + a detail panel where Exercise Blocks are `mat-accordion` panels — test inputs, constraint, and the generated Week 1–8 table all live inline per block. Program name/status directly editable in the header.
- **C — Tabbed dashboard**: status tabs replace the sidebar; the selected Program's Exercise Blocks render as a dense card grid, each card self-contained (inputs + Generate + table), no accordion/stepper.

All three share `model.ts` (mock exercises, in-memory seed Programs, and `generateCycle` implementing the anchor-model formula from [Weekly Jump / Week 5 formula](01-weekly-jump-week5-formula.md)) and the floating `?variant=` switcher — only layout/information-hierarchy differs, per the prototype skill's "radically different" rule. No persistence; Firestore schema from [Firestore schema & rules](03-firestore-schema-and-rules.md) isn't wired up.

## Answer

**Variant C — tabbed dashboard wins.** Status tabs (`draft`/`active`/`completed`) replace a persistent sidebar; within a tab, Programs of that status are a chip row, and the selected Program's Exercise Blocks render as a card grid — inputs, Generate button, and the Week 1–8 table always visible per card, no accordion/stepper to expand.

Reasoning from the discussion:
- Data density won over Variant B's accordion: B's `mat-expansion-panel`s start collapsed, so despite first impressions ("has all the data I'm interested in at once"), C's always-expanded cards actually show more at once, not less.
- Mobile responsiveness was the deciding factor over B specifically: B needed a bespoke `BreakpointObserver` collapse (single-pane + back button below 767px) to avoid a cramped split-view, which was mocked into the prototype to evaluate. C gets responsiveness close to free — `mat-tab-group`'s built-in horizontal scroll/pagination handles the tab strip, and the card grid (`repeat(auto-fill, minmax(280px,1fr))`) reflows to one column on narrow viewports via plain CSS grid, no custom breakpoint logic needed.
- Confirmed: one tab per `ProgramStatus` in the order `draft` → `active` → `completed`, matching the lifecycle status progression from [Program lifecycle](02-program-lifecycle.md).

Not yet decided: how this folds into real code (component/lib structure, exercise-picker reuse, Firestore wiring) — deliberately left open, the user wants to grill implementation decisions in a follow-up before any real code is written. Prototype code stays at `apps/fitness-tracker/src/app/prototype-training-planner/` as the primary source for now; per the prototype skill it should move to a throwaway branch once the real implementation lands.
