Type: grilling
Status: resolved

## Question

[Edit-session architecture](02-edit-session-architecture.md) settled where staged edit-session state lives (a single-slot `draftProgram` on `ProgramStore`) and how it's discarded (`store.cancelEditSession`, explicit Cancel). That leaves the map's original open question sharp enough to resolve now: does navigating away from an in-progress edit session — switching Program/status tab, closing the browser tab, or otherwise leaving the dashboard — need an unsaved-changes guard, or is silently losing the staged draft acceptable?

Resolve:

- Is a guard needed at all? Weigh against how cheap/frequent edit sessions are expected to be (Draft Programs are *always* in one) versus the cost of silently losing entered Rep Max Test / Loading Constraint / retest data.
- If needed, what mechanism: an Angular `CanDeactivate`-style guard on route/tab change, a `beforeunload` listener for tab-close/refresh, both, or something else given this is a single-route dashboard (tab/Program switches are in-component state changes, not route navigations) — check `apps/fitness-tracker/src/app/app.routes.ts` for whether the Training Planner dashboard is even routed in a way `CanDeactivate` could apply to.
- If a confirmation prompt is shown, what are its options — Save-and-leave, Discard-and-leave, Stay — and does "Save" from that prompt run the same `store.saveProgram()` as the explicit Save button?
- Does this apply uniformly to Draft (always-in-session) and Active/Completed (explicit Edit) sessions, or only when there's actually a diff between `draftProgram` and the last-persisted Program (i.e., don't prompt if nothing was actually changed)?

## Answer

A guard is needed: Draft Programs are *always* in an edit session, so without one, silent data loss (Test/Loading Constraint/retest entries) would be routine, not an edge case.

Three leave-surfaces exist here, confirmed against `apps/fitness-tracker/src/app/app.routes.ts` and `libs/program/shell/src/lib/program.routes.ts` (Training Planner is a single flat route with no children) and `program-dashboard.component.ts` (Program/status-tab switching is in-component signal state, not router navigation):

- **Route nav away** (to Exercises/Workouts, or anywhere else in-app) — an Angular `CanDeactivate` guard on the `training-planner` route.
- **Tab close/refresh** — a `beforeunload` listener. Limited to the browser's native leave-prompt: no custom copy, no save option, since nothing async can run mid-unload.
- **In-page Program switch or status-tab switch while dirty** — not a route transition, so it needs its own interception in the component's switch handlers (`onSelectProgram` / status-tab change), separate from the router-level guard.

For the two surfaces where a real dialog is possible (route nav-away, in-page switch), the confirmation is a three-option dialog — **Save & leave / Discard & leave / Stay** — reusing `DiscardChangesDialogComponent` (built for ticket 05's Cancel-confirm flow). Save & leave awaits `store.saveProgram()` before completing the navigation/switch. The `beforeunload` surface has no Save option; it's just `event.preventDefault(); event.returnValue = ''` when dirty.

"Dirty" is a structural diff of `draftProgram` against the last-persisted `Program`, not a sticky touched-flag (the current prototype's `dirty` signal, set once on first mutation and never reconsidered, would false-positive if a user adds then removes a block and ends up back at the original state). Applied uniformly to both Draft and Active/Completed edit sessions once ticket 02's real `draftProgram` lands — a freshly created, untouched Draft shouldn't prompt just because it's technically "in a session."

No new domain terms surfaced beyond what [Edit-session architecture](02-edit-session-architecture.md) already established.
