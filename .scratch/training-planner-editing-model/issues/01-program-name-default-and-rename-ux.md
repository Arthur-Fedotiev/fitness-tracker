Type: prototype
Status: resolved

## Question

`Program.name` already exists in the domain model but is hardcoded to `'New Program'` at creation with no rename UI anywhere in `libs/program/ui`. The default-name computation is already settled (see map Notes): `Strength Cycle <Mon> - <Mon> <Year>`, where the start month is `createdAt` and the end month is `createdAt + 8 weeks`.

Resolve and prototype the remaining rename UX:

- Where does renaming live — an inline-editable title in the dashboard toolbar/header, a pencil-icon-triggered field, or a rename dialog?
- Exact string formatting for the default (e.g. `"Strength Cycle Jun - Aug 2026"` — confirm month abbreviation style and separator).
- Is renaming available at any time in Draft (already always-editable), and does it also need to hook into the Edit-session mechanics that [Edit-session architecture](02-edit-session-architecture.md) will define for Active/Completed Programs? Note the dependency but don't block on it — the rename surface itself (where it lives, how it looks) can be prototyped independently of the persistence mechanics.

Build a rough prototype of the naming/rename interaction area of the dashboard.

## Answer

Resolved via `/grilling` (placement, format, validation, creation-time computation) then `/prototype` (three UI variants — sub-shape A, mounted on the real `training-planner` dashboard route via `?variant=`; full set kept as primary source on throwaway branch `prototype/program-name-header-variants`, commit `9e7741d`):

- **Placement**: new section header above the Main Lift Block grid (`program-dashboard.component.html`), scoped to the currently-selected program. Not in the toolbar (global "New Program" create action) or the status-tabs list (only displays names).
- **Interaction**: pencil icon toggles the static title into an inline `matInput` field in place — commit on blur/Enter, cancel on Escape. No modal dialog; no existing inline-edit precedent existed in this codebase before this.
- **Default name format**: `Strength Cycle <Mon> - <Mon> <Year>` — 3-letter months, `" - "` separator, single trailing year when start/end share a year, both years shown when the cycle crosses a year boundary (e.g. `Strength Cycle Dec 2026 - Feb 2027`).
- **Validation**: required non-empty after trim (silently reverts on empty blur), max 60 chars.
- **Creation-time**: default name computed client-side via `Date.now()` at `createProgram()` — no more `'New Program'` placeholder flash.
- **Winning variant**: A — minimal inline (bare title + always-visible pencil, no extra metadata). Variants B (card + status chip/date-range subtitle) and C (hero heading, hover-reveal pencil, char counter) were built and rejected; kept as the primary source on the throwaway branch above.

**Folded into real code** (not just decided — this ticket's ticket type calls for running `/prototype` fully, per the map's Notes):

- `computeDefaultProgramName(createdAt)` — new pure fn, `libs/program/domain/src/lib/entities/program-naming.ts`, exported via `program/domain`'s public surface.
- `ProgramNameHeaderComponent` — new presentational component, `libs/program/ui/src/lib/program-name-header/`, exported via `program/ui`.
- `ProgramDashboardComponent` — `onCreateProgram()` now passes `computeDefaultProgramName(Date.now())` instead of the `'New Program'` literal; renders the new header above the grid; rename events stage into an in-memory `nameOverrides` signal (no store write — `ProgramStore` has no rename/staging method yet, that's [Edit-session architecture](02-edit-session-architecture.md)'s implementation, not this ticket's).
