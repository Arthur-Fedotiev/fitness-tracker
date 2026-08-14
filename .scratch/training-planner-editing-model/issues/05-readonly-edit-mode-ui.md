Type: prototype
Status: resolved
Blocked by: 02

## Question

Design the read-only vs. Edit-mode visual treatment for Active and Completed Programs (Draft stays always freely editable, no read-only state), building on the staging mechanism from [Edit-session architecture](02-edit-session-architecture.md).

Resolve:

- What a locked block card / form looks like: disabled form inputs vs. a display-only summary view.
- Where the Edit button lives — a single per-Program toggle (e.g. in the dashboard toolbar) vs. per-card.
- What Cancel/Save affordances appear once Edit is active, and how they read against the "Not yet specified" open question of whether an unsaved-changes guard is needed on navigate-away.
- How this reads across the existing tabbed-dashboard layout (status tabs + Program chips + card grid) from the original [UI flow prototype](../strength-reload-calculator/issues/04-ui-flow-prototype.md) — don't redesign that layout, fit into it.

Build a rough prototype of the read-only and Edit-mode states.

## Answer

Grilled first (9 decisions, all folded into real code regardless of which chrome variant won):

1. **Locked appearance**: disabled Material form inputs (via `form.disable()`/`enable()`), not a separate summary view — one template for both states.
2. **Edit toggle**: single per-Program toggle, not per-card — matches the single `draftProgram` slot's Program-level scope from [Edit-session architecture](02-edit-session-architecture.md).
3. **Completed scope**: full edit session, identical to Active — no restricted "retest only" mode. Resolves the map's "Not yet specified" question on this.
4. **Generate / Add-block / Remove-block**: hidden entirely outside edit mode, not shown-disabled (they're action triggers, not value fields).
5. **Save/Cancel**: replace the Edit button in place (same slot cycles Edit → Save/Cancel → Edit) — no separate toolbar.
6. **Cancel**: opens a confirmation dialog rather than discarding silently, sharing its mechanism with whatever [Unsaved-changes navigation guard](06-unsaved-changes-navigation-guard.md) designs for leaving mid-session (that ticket owns the dialog's exact copy/options for its own trigger).
7. **Block-level button**: relabeled "Apply" (was "Save") to disambiguate from the Program-level Save, which is the one that actually persists.
8. **Cancel confirmation gating**: only fires when the edit session is actually dirty — a no-op Cancel exits immediately.
9. **Completed → Active reversion on Save**: silent, computed like every other status transition — no pre-Save gate.

Then prototyped 3 structurally different variants live on the real `/training-planner` route (`?variant=A|B|C`): **A — Understated** (icon-only toggle + compact dialog), **B — Whole-grid edit frame** (text Edit/Save/Cancel buttons, accent-tinted grid border + "Editing" chip while editing, fuller confirm dialog), **C — Per-card status stripe** (small inline text buttons, colored left-border stripe per card, inline confirm row instead of a dialog).

**Variant B won**, after dropping a pencil icon from its Edit button that visually clashed with the unrelated rename-pencil already in `ProgramNameHeaderComponent`. Folded into real code: `ProgramEditToggleComponent` and `DiscardChangesDialogComponent` (both now in `libs/program/ui/src/lib/`), plus the grid's accent frame/"Editing" chip in `program-dashboard.component.html/scss`. Variants A and C, the switcher, and Variant B's original prototype-only forms are captured on throwaway branch `prototype/05-readonly-edit-mode-ui`, not on this branch.

Reviewing the prototype against the real dashboard also surfaced and fixed two things outside this ticket's own scope: a pre-existing bug where Generate required a prior Apply (contradicted [Generate preview behavior](04-generate-preview-behavior.md)'s already-decided "reads live form values" contract — fixed by dropping a stale `!block().test` guard), and several `main-lift-block-card`/`program-dashboard` CSS issues (title padding clipped by a rounded corner, uneven card heights, the reload-cycle table getting squeezed by `auto-fill`'s column-count-before-content-width behavior — fixed by raising the grid's `minmax` floor to 360px instead of chasing `max-content`/scroll-container workarounds).
