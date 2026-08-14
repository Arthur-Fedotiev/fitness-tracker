Type: grilling
Status: resolved

## Question

Design the client-side staged/edit-session state that replaces today's immediate-persist-per-action pattern in `program/domain` (every `ProgramStore` method currently does an immediate whole-document `setDoc` via `ProgramService.updateProgram`, sourced from `store.programs()`).

The confirmed destination: Draft Programs are always in an implicit edit session (no Edit button). Active/Completed Programs are read-only by default; an Edit button opens the session. Inside a session, Program name, Main Lift Block additions/removals, and each block's Rep Max Test + Loading Constraint inputs stage locally. A single Program Save commits everything — name, staged block adds/removals/input edits, and whichever Reload Cycle was last previewed per block (Generate is a separate, non-persisting preview — see [Generate preview behavior](04-generate-preview-behavior.md), resolve that ticket independently but keep its contract in mind here: Generate reads live form values and never writes to Firestore).

Resolve:

- Where staged state lives: extend `ProgramStore` with a parallel "draft" slice, keep it as local component state in `program-dashboard.component.ts` / the card components, or introduce a new dedicated store. Weigh against the module-boundary conventions in `CONTEXT.md`'s "Architecture conventions" section and the existing `signalStore` pattern.
- What Program Save actually writes: one `setDoc` with name + all staged block adds/removals/input edits + last-previewed cycle per block. Confirm this reconciles with Firestore's whole-document overwrite semantics without silently dropping concurrent immediate writes (Week 8 Retest stays immediate and outside the session per the map's Notes — confirm Save can't clobber a Retest that landed mid-session).
- How entering Edit on an Active/Completed Program seeds staging (copy last-persisted Program into the draft slice).
- How Cancel discards staged changes and reverts to last-persisted state.
- Whether a brand-new Program (via "New Program") is persisted immediately as an empty draft document (today's behavior, just with the new default name from [Program name default and rename UX](01-program-name-default-and-rename-ux.md)), or held fully local with no Firestore doc until the first Save.
- Exactly when the Draft → Active status transition now fires, since Generate no longer persists (moved from Generate-time to Save-time) — state the precise rule (e.g. "Program flips to active on a Save where at least one block has a cycle").
- How block removal participates in staging — confirmed to stage and take effect only at Save (not immediate like today) — work out the mechanics (e.g. does a removed-but-unsaved block still round-trip through Cancel).

Don't re-litigate: Week 8 Retest is confirmed to stay an immediate, always-available action outside the edit session, unchanged from today.

> **Superseded during resolution**: this "don't re-litigate" note was itself reopened and overturned — see the Answer below. Retest turned out to belong in the staged model after all, for consistency.

## Answer

**1. Where staged state lives.** Extend `ProgramStore` with a single-slot draft: `draftProgram: Program | null`. A single slot, not a map keyed by `programId` — the dashboard only ever shows one selected Program at a time, so a map would hold state the UI can never exercise.

**2. Seeding.** A new `store.beginEditSession(programId)` copies the current live Program from `store.programs()` into `draftProgram`. Called uniformly whenever `selectedProgramId` changes: automatically for Draft Programs (always implicitly in-session), only on explicit Edit click for Active/Completed.

**3. What stages vs. what stays immediate.**
- **Staged** (patches `draftProgram` locally, no Firestore write until Save): Program name (rename); Main Lift Block add/remove; each block's Rep Max Test + Loading Constraint (staged on the existing explicit per-block `(save)` click in `MainLiftBlockFormComponent` — the control is unchanged, just redirected from an immediate write to a local patch); each block's Week 8 Retest (staged on the existing per-keystroke `(retestChange)` in `ReloadCycleTableComponent`, same redirect — **this reopens and overturns the map's original "retest stays immediate" note**, adopted instead for one consistent commit model with zero special-cased fields); manual "Mark Complete" (not yet wired to any UI — folds into the staged model too, as a flag on the draft, available independent of whether every block has a retest, since retest is optional and completion can't always wait on it).
- **Stays immediate, untouched by this ticket**: creating a new Program (`store.createProgram` still does an immediate `addDoc` of an empty draft-status doc with the new default name — a real Firestore `id` is needed to seed/anchor the draft slot at all) and deleting a whole Program (`store.deleteProgram` — whole-entity removal, not a field Save owns, orthogonal to editing).

**4. Generate's hook into staging.** Generate ([Generate preview behavior](04-generate-preview-behavior.md)) stays a pure computation reading live form values, but its resulting cycle/`anchorSource` needs to land in `draftProgram` for Save to persist it — structurally identical to how test/loadingConstraint/retest stage (e.g. a `store.stageGeneratedCycle(blockId, cycle, anchorSource)` patch, no Firestore write). The remaining behavioral questions (auto-recompute vs. staleness, whether an old persisted cycle stays visible while inputs are re-edited) are left for ticket 04 to resolve — this only confirms Generate writes into the same draft slot, never into `store.programs()`.

**5. Block removal.** Plain filter, no tombstone: removing a block during a session removes it from `draftProgram.mainLiftBlocks` immediately. A block added and removed within the same session nets to a no-op; a previously-persisted block removed this way just doesn't appear in Save's payload. No special-case bookkeeping needed for Cancel, since Cancel re-seeds the whole draft from scratch anyway (see below).

**6. Cancel.** `store.cancelEditSession(programId)` clears `draftProgram` and re-seeds it from current `store.programs()`. One uniform operation regardless of status — Draft and Active/Completed both just revert to last-persisted state. Draft *does* get a Cancel affordance now that its edits also stage-until-Save; whether/how the button differs visually between Draft and Active/Completed is a [Read-only/Edit-mode UI](05-readonly-edit-mode-ui.md) concern, not this ticket's.

**7. Program Save.** `store.saveProgram(programId)` writes `draftProgram` via one `setDoc` (through `ProgramService.updateProgram`) — name, block adds/removals, staged test/loadingConstraint, staged generated cycle, staged retest, staged manual-completion flag, plus the two computed status rules below. Because retest and manual-completion are now staged fields on the same draft as everything else, the concurrent-write race that originally motivated a special-case merge (a mid-session immediate retest getting clobbered by a stale draft snapshot) no longer exists — there's only one write path into `status`/`week8Retest` now, not two.

**8. Status transition rules**, both evaluated against the draft at Save time, replacing today's immediate flips inside `generateReloadCycle`/`saveWeek8Retest`:
- **Draft → Active**: confirmed verbatim — "Program flips to `active` on a Save where at least one block has a cycle."
- **Active/Draft → Completed**: two independent paths — "Program flips to `completed` on a Save where either (a) every staged block has a retest, or (b) the staged manual-completion flag is set."

**Superseded**: the original plan to keep `week8Retest` immediate and reconcile it specially at Save time (read live, not from the draft snapshot) is moot — retest is a plain staged field like every other now, so there's nothing to reconcile.
