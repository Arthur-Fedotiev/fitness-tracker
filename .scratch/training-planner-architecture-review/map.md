# Training Planner Architecture Review

Label: wayfinder:map

## Destination

A decided refactor plan for the Training Planner feature (`libs/program/*` — domain, ui, feature-dashboard, shell — plus its app-level wiring) covering four things the user flagged after browser-verifying the feature: a critical verdict on the `@ngrx/signals` pilot and where local component state should live; consolidation of scattered confirmation/discard-dialog logic; consistency of state-change/side-effect patterns; and a repo-wide single-file-component convention retrofitted onto this feature. Each ticket resolves to a decision, and where the decision implies code changes, a ready-for-agent implementation ticket. Test/e2e coverage is explicitly out of scope (tracked separately, not by this map).

## Notes

- Domain: `libs/program/{domain,ui,feature-dashboard,shell}` plus app-level wiring (`apps/fitness-tracker/src/app/app.routes.ts`, nav-bar entry). Read `CONTEXT.md` and `docs/adr/0007-introduce-program-domain-for-strength-reload.md` for the domain's vocabulary before resolving any ticket.
- Every session should invoke `/grilling` and `/domain-modeling` when resolving a `grilling`-type ticket here.
- User's standing lens for ticket 01: they like reactive/unidirectional patterns (Redux-style) and are *not* trying to minimize state management for its own sake — the question is whether each piece of state is pulling its weight, not "less state is always better." The verdict may legitimately conclude "keep the current split as-is."
- The code under review was just committed at `22cfe90` on local branch `feature/training-planner` (not pushed) — a fresh checkpoint taken specifically so this review has stable ground to work from. `refactor/domain-module-boundaries` (now merged to `main` as `abc6f71`) is unrelated and untouched.
- Two prior Wayfinder maps built this feature and are now closed, referenced for context but not reopened by this one: `.scratch/strength-reload-calculator/` (initial build) and `.scratch/training-planner-editing-model/` (draft/save edit-session model). This map is a critical review of what they produced, not a continuation of unfinished work from either.

## Decisions so far

- [State ownership and signals pilot verdict](issues/01-state-ownership-and-signals-pilot-verdict.md) — `@ngrx/signals` pilot confirmed working well as-is; `selectedProgramId` and edit-session-active state move into `ProgramStore`, `activeStatus`/`blockValidity` stay component-local; Draft Programs lose their implicit always-in-session editing (now explicit "Start Editing" for every status, auto-started only right after creation). Implementation spec: [Implement state-ownership changes](issues/06-implement-state-ownership-changes.md).
- [Implement state-ownership changes](issues/06-implement-state-ownership-changes.md) — landed: `ProgramStore` gained `selectedProgramId`/`sessionActive`/`selectProgram`/`clearSelection`; dashboard component's local signals and auto-session effect deleted. Build + domain/ui/feature-dashboard tests green; manual browser pass skipped (no auth-emulator path) — flagged for the user to verify before merge.
- [Consolidate scattered dialog logic](issues/02-consolidate-scattered-dialog-logic.md) — `ConfirmationDialogService` untouched (it's cross-domain, workout uses it too); the two `DiscardChangesDialogComponent` call-sites merge into a new thin `DiscardChangesDialogService` (Observable-returning, single `confirm()` method) in `program/ui`; `guardLeavingSession`'s Promise/`firstValueFrom` shape deliberately left alone for ticket 03 to judge. Implementation spec: [Implement DiscardChangesDialogService consolidation](issues/07-implement-discard-changes-dialog-service.md).
- [Implement DiscardChangesDialogService consolidation](issues/07-implement-discard-changes-dialog-service.md) — landed: new `DiscardChangesDialogService` in `program/ui`, both call-sites (`program-edit-toggle`'s `onCancelClick()`, `program-dashboard`'s `guardLeavingSession()`) rewired to it, `MatDialog` no longer injected directly by either. Lint clean, full app production build green; manual browser pass flagged for the user (no auth-emulator path).

## Not yet specified

- Whether the single-file-component convention (ticket 04) should be enforced by a lint rule going forward, or stay as written ADR guidance only — sharpens once ticket 04 decides the convention itself.
- Whether to adopt `@ngrx/signals/events` (`withReducer`/`withEffects` — Redux-style events/reducers/effects with Store DevTools visibility) for `ProgramStore`'s action-level tracing. Confirmed viable and already installed (`@ngrx/signals@21.1.1` ships the `./events` subpath) during ticket 01 — deliberately not adopted in this pass; revisit after MVP release.

## Out of scope

- Unit/e2e test coverage for the Training Planner feature — user will handle as a separate future effort.
- Extending the `@ngrx/signals` pattern to `exercise`/`workout` (classic NgRx today), even if ticket 01's verdict favors the pilot — a repo-wide state-management migration is a separately-scoped effort.
- Auditing `exercise`/`workout` for similar scattered-dialog patterns — this map is confined to the Training Planner feature.
