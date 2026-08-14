Type: grilling
Status: resolved
Blocked by: 02

## Question

Generate is confirmed to become a pure, non-persisting computation: it reads a block's current live (possibly-unsaved) form values and computes/displays the Reload Cycle table as a preview, with no Firestore write and no status change, freely repeatable while iterating block-by-block. Resolve the remaining interaction details, building on the staging mechanism from [Edit-session architecture](02-edit-session-architecture.md):

- Does the previewed Reload Cycle table auto-recompute reactively as the user keeps editing inputs after clicking Generate, or does it go stale/hidden until Generate is clicked again?
- The Manual Week 5 override and its resulting `anchorSource` are, today, generation inputs that are never persisted as their own field — only their effect on the computed cycle is. Confirm this still holds under the new model, where Generate never persists at all.
- When the user re-opens Edit on a Program that already has a persisted cycle (from a prior Save) and changes a block's inputs without clicking Generate again, does the stale persisted cycle stay displayed until a fresh Generate+Save, or does editing inputs immediately hide/invalidate the old cycle from view?

## Answer

**Fact-check on the premise.** `anchorSource` is *not* an unpersisted generation input today — it's already a persisted field on `MainLiftBlock` (`program.store.ts:98,160`), and ticket 02 already confirmed it keeps being staged/persisted (`stageGeneratedCycle(blockId, cycle, anchorSource)`). The only thing genuinely never persisted today is the raw manual override *number* — that's what the second question actually turned on, and its answer overturns the ticket's original premise (see below).

**1. Staleness mechanism.** Generate stays an explicit, click-triggered snapshot — no reactive per-keystroke recompute. `MainLiftBlockFormComponent`'s `generate` output keeps firing from `onGenerate()` on click, unchanged. Further edits to any input after a Generate don't recompute the table; they mark it stale instead.

**2. Manual Week 5 becomes a persisted field.** `MainLiftBlock` gains `manualWeek5: number | null`, staged into `draftProgram` alongside `anchorSource`/`cycle` and committed at Save via the same mechanism ticket 02 established. Reopening a block that used a manual override is now genuinely recoverable, not just labeled — worth the one-field addition given the feature is still mid-build and Firestore has no rigid schema to migrate.

**3. Rehydration.** `MainLiftBlockFormComponent`'s constructor `effect` (currently only patches `test`/`loadingConstraint` from the block, `main-lift-block-form.component.ts:59-70`) is extended to also patch `manualOverride` (on) and `manualWeek5` (the persisted value) whenever the reopened block's `anchorSource === 'manual'`.

**4. Clearing.** Regenerating without the override — `anchorSource` comes back `'table'`/`'placeholder'` — nulls `manualWeek5` in the same write. Same instinct as ticket 02's plain-filter/no-tombstone rule for block removal: don't carry a stale number nobody asked to keep.

**5. Reopening Edit on a Program with an already-persisted cycle.** Same staleness rule as (1), applied uniformly — it doesn't matter whether the last-shown cycle came from this session's Generate click or a prior Save. The moment any input changes, the displayed table (new or previously-persisted) is marked stale; it stays visible, just flagged, until the next Generate click.

**6. Staleness display.** Must be unmistakable via both distinct wording (e.g. "outdated — click Generate to refresh") *and* color, not color alone. Exact copy/color values are left to implementation (this ticket is `grilling`, not `prototype`); the constraint is that the signal can't rely on color alone.
