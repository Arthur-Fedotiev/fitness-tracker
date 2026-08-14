Type: prototype
Status: resolved
Blocked by: 02

## Question

Design the exercise-picker interaction so selecting an exercise from the autocomplete immediately shows a staged Main Lift Block card, instead of today's flow where a separate "Add" button click (`AddMainLiftBlockComponent.onAdd()`) is required after selection. Use the staging mechanism landed by [Edit-session architecture](02-edit-session-architecture.md).

Resolve:

- Does the picker reset/clear itself immediately, ready for the next selection, or close after staging a block?
- Can a just-staged (unsaved) block be removed with a lighter-weight affordance than the removal flow for already-persisted blocks (e.g. an instant local discard vs. the staged-removal-takes-effect-at-Save flow for persisted blocks)?
- Does `AddMainLiftBlockComponent`'s shape change (autocomplete-only, "Add" button removed entirely) or does the button remain as a secondary confirm step?

Build a rough prototype of the picker-to-staged-card flow.

## Answer

Prototyped three structurally different variants on the real Training Planner dashboard (`?variant=A|B|C`), then picked **Variant B — toggle trigger, closes after pick**:

- **Resting state**: `AddMainLiftBlockComponent` shows a plain `+ Add Main Lift Block` button, not a permanently-open picker card.
- **Picking**: clicking the button opens the autocomplete inline; selecting an exercise (`(optionSelected)`) commits immediately — no separate "Add" confirm click — and closes the picker back to the button in one motion.
- **Removal affordance**: no differentiation between staged and persisted blocks' Remove controls. This isn't a compromise — [Edit-session architecture](02-edit-session-architecture.md)'s Answer already settled that *all* block removal stages into `draftProgram` and only takes effect at Save, with Cancel reverting either way. There's no risk differential left between "removing a just-staged block" and "removing a persisted one" to signal with a different affordance, so Variant B's uniform treatment is the correct one, not an untested guess.
- **`AddMainLiftBlockComponent`'s shape**: changes. The autocomplete-plus-secondary-"Add"-button pattern is gone; picking an option is the commit.

**Why B over A and C:**

- **A** (always-open picker card, instant-stage, picker never leaves the grid) doesn't scale: its resting state is a full-height card permanently occupying grid space. The user is about to add more exercise categories beyond Main Lift (midsection, horizontal/vertical pull, etc. — still fog, not yet specified), and each would need its own always-visible picker card under A's shape. B's collapsed-button resting state absorbs new categories as more compact buttons (or a category step inside one popover) without permanent grid cost.
- **C** (segregated staging tray of lightweight chips above the grid) was dropped: a chip only carries an exercise name, but ticket 02 requires a staged block's Rep Max Test + Loading Constraint form to be usable immediately, not deferred to Save. The chip had no path to becoming that form — a real gap, not a stylistic one — so C doesn't survive contact with ticket 02's Answer.

**Folded into real code**: `libs/program/ui/src/lib/add-main-lift-block/add-main-lift-block.component.ts` (+ `.html`/`.scss`) now implement Variant B directly — `pickerOpen` signal, `openPicker()`, `onOptionSelected()` emits `add` and closes. The `add` output's signature (`string` exerciseId) is unchanged, so `program-dashboard.component.ts`'s `onAddBlock()` needed no changes.

**Asset**: the full set of all three variants + the floating switcher, as actually prototyped, is preserved on throwaway branch `prototype/03-block-picker-auto-stage-flow` (commit `bf6c9e1`) — not folded into main.
