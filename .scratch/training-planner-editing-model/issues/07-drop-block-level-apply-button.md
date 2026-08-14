Type: grilling
Status: resolved
Blocked by: 02

## Question

[Read-only/Edit-mode UI](05-readonly-edit-mode-ui.md) kept an explicit block-level "Apply" click (relabeled from "Save" to disambiguate from the Program-level Save that actually persists) as the trigger that stages a block's Rep Max Test + Loading Constraint into `draftProgram`. Reconsider that call: can the block-level Apply button be dropped entirely, with block inputs staging reactively (e.g. on blur/valueChanges) straight into the draft, leaving Program Save as the only explicit commit action in the block area?

Resolve:

- What Apply currently buys beyond disambiguation — does anything (validation gating, Generate's read path, a later ticket) actually depend on staging happening only on an explicit click rather than continuously?
- If staging goes reactive, how does an invalid/in-progress block input (e.g. a required field left blank) interact with the draft and with Program Save's status-transition rules (ticket 02's "Save on a Draft where at least one block has a cycle", etc.) — does Save need to gate on every visible block form being valid, not just the ones that got an Apply click?
- Whether dropping Apply changes anything about Cancel's re-seed behavior (ticket 02) or the dirty-check powering the unsaved-changes guard (ticket 06).

## Answer

**Drop the block-level Apply button entirely.** A block's Rep Max Test + Loading Constraint stage into `draftProgram` automatically on blur, but only when the block's form is valid at that moment — the same effective gate the old `[disabled]="form.invalid"` Apply button had, just automatic instead of click-triggered. Program Save becomes the sole persist action anywhere in the editing UI, resolving the map's "single Save button" premise the user pushed for.

**Program Save gates on validity.** The Save button is disabled whenever any visible block's form is currently invalid — mirroring the old per-block Apply gate, just scoped to the whole grid instead of one block at a time. This overturns this ticket's initial framing (Save "proceeds regardless of any block's current validity") — the user explicitly wants Save blocked, not silently using stale staged data, while a block is mid-edit and invalid.

**No new "staged" affordance.** Nothing new gets built to confirm a field was remembered into the draft. The existing per-field validation errors (already shown under invalid inputs, e.g. `mat-error`) plus the disabled Program Save button together are the signal: valid + no error shown = staged; invalid = visibly flagged and blocking Save.

**Facts confirmed, not reopened**: Generate already reads live form values directly and never depended on Apply (ticket 04/05); Cancel's re-seed (ticket 02) and the dirty-check behind the unsaved-changes guard (ticket 06, a structural diff of `draftProgram` vs. last-persisted) are indifferent to whether staging happens via click or blur — neither needed to change.
