Status: resolved

## Summary

Implementation spec for the decisions in [State ownership and signals pilot verdict](01-state-ownership-and-signals-pilot-verdict.md) — see that ticket's `## Answer` for the full rationale. This is a pure refactor: no new user-facing capability beyond the one confirmed behavior change in step 3.

## Changes

### 1. `libs/program/domain/src/lib/application/program.store.ts`

Add two fields to `ProgramsState` (with doc comments matching the file's existing style):

```ts
/** Which Program the dashboard is currently showing — UI selection, not persisted. */
selectedProgramId: string | null;
/** Whether the selected Program's edit session is currently active (Save/Cancel visible vs. read-only). Single-slot, like `draftProgram` — only ever describes the selected Program. */
sessionActive: boolean;
```

Add to `initialState`: `selectedProgramId: null, sessionActive: false`.

Add a new method:

```ts
/** Selects a Program for viewing; always ends any active session for whatever was previously selected. */
selectProgram(programId: string): void {
  patchState(store, { selectedProgramId: programId, sessionActive: false });
}
```

Update `beginEditSession`, `cancelEditSession`, and `saveProgram` to also patch `sessionActive`:
- `beginEditSession`: add `sessionActive: true` to its `patchState` call.
- `cancelEditSession`: add `sessionActive: false` to its `patchState` call.
- `saveProgram`: add `sessionActive: false` to its `patchState` call.

Invariant to preserve: `selectProgram` must always reset `sessionActive: false` in the same `patchState` call, so a session for a previously-selected Program can never leak into the newly-selected one.

### 2. `libs/program/feature-dashboard/src/lib/program-dashboard.component.ts`

Delete:
- The local `selectedProgramId` signal.
- The local `activeEditSession` signal (and its doc comment — no longer accurate once Draft loses its implicit-session special case).
- The constructor `effect()` that auto-begins a Draft's edit session, and the `untracked` import if it becomes otherwise unused.

Update computeds to read `store.selectedProgramId()` / `store.sessionActive()` instead of the deleted local signals:

```ts
private readonly livePersistedProgram = computed(
  () => this.store.programs().find((program) => program.id === this.store.selectedProgramId()) ?? null,
);

protected readonly selectedProgram = computed(() => {
  const persisted = this.livePersistedProgram();
  if (!persisted || persisted.status !== this.activeStatus()) {
    return null;
  }
  if (this.store.sessionActive()) {
    const draft = this.store.draftProgram();
    return draft && draft.id === persisted.id ? draft : persisted;
  }
  return persisted;
});

protected readonly readOnly = computed(() => {
  const persisted = this.livePersistedProgram();
  return !!persisted && !this.store.sessionActive();
});

protected readonly otherProgramNames = computed(() =>
  this.store
    .programs()
    .filter((program) => program.id !== this.store.selectedProgramId())
    .map((program) => program.name),
);
```

(`saveDisabled` is unchanged — still combines `this.selectedProgram()` with the local `blockValidity`.)

Update handlers:

```ts
protected async onCreateProgram(): Promise<void> {
  if (!(await this.guardLeavingSession())) {
    return;
  }
  const userId = this.auth.userInfo()?.uid;
  if (!userId) {
    return;
  }
  const name = ensureUniqueProgramName(
    computeDefaultProgramName(Date.now()),
    this.store.programs().map((program) => program.name),
  );
  const program = await this.store.createProgram(userId, name);
  this.activeStatus.set('draft');
  this.store.selectProgram(program.id);
  this.store.beginEditSession(program.id); // auto-start — see ticket 01 point 3
  this.blockValidity.set({});
}

protected async onSelectProgram(program: { id: string }): Promise<void> {
  if (!(await this.guardLeavingSession())) {
    return;
  }
  this.store.selectProgram(program.id);
  this.blockValidity.set({});
}

protected async onStatusTabChange(status: ProgramStatus): Promise<void> {
  const previous = this.activeStatus();
  if (previous === status) {
    return;
  }
  this.activeStatus.set(status);
  if (!(await this.guardLeavingSession())) {
    this.activeStatus.set(previous);
    return;
  }
  this.store.cancelEditSession();
}

protected startEdit(programId: string): void {
  this.store.beginEditSession(programId);
  this.blockValidity.set({});
}

protected async saveProgram(): Promise<void> {
  await this.store.saveProgram();
  this.notify('Saved');
}

protected cancelEdit(): void {
  this.store.cancelEditSession();
}
```

In `guardLeavingSession()`, delete the now-redundant `this.activeEditSession.set(false)` lines in both the `'save'` and `'discard'` branches — `store.saveProgram()`/`store.cancelEditSession()` already patch `sessionActive` internally.

In `onDeleteProgram`, replace the two local-signal resets with the store equivalent where the deleted Program was selected — reads become `this.store.selectedProgramId()`; since there's no Program left to select, patch `{ selectedProgramId: null, sessionActive: false }` directly (or add a small `store.clearSelection()` method if that reads better than reaching into `patchState` from the component — implementer's call, no direct `patchState` access from outside the store either way, so this likely wants a store method).

### 3. `libs/program/ui/src/lib/program-edit-toggle/program-edit-toggle.component.ts`

Update the class doc comment — drop "(Draft Programs are always editable and never render this)"; the component now applies uniformly to every status. No behavioral/template change needed (confirmed it already renders purely off `readOnly`/`startEdit`/`save`/`cancelEditing` inputs/outputs).

## Out of scope for this ticket

- The dialog-consolidation and guard-shape work — [[02-consolidate-scattered-dialog-logic]] and [[03-state-change-and-side-effect-consistency]] own that, and depend on this ticket landing first since the call sites they judge shift here.
- Adopting `@ngrx/signals/events` — logged as map fog, not this pass.

## Verification

- `nx test program-domain`, `nx test program-feature-dashboard`, `nx test program-ui` (adjust project names to match actual Nx targets).
- Manual pass in the browser: create a Program (should land in an active session immediately), switch away and back to a Draft (should now show read-only until "Start Editing" is clicked — this is the confirmed behavior change), switch Programs/status tabs mid-edit to confirm the guard dialog still fires correctly, confirm the block-validity `saveDisabled` gating still works after adding/removing blocks and switching Programs.

## Answer

Implemented as specified, all three files:

1. `libs/program/domain/src/lib/application/program.store.ts` — added `selectedProgramId`/`sessionActive` to `ProgramsState` and `initialState`; added `selectProgram(programId)`; added `beginEditSession`/`cancelEditSession`/`saveProgram` patches for `sessionActive`. Also added a small `clearSelection()` method (the ticket left this as implementer's call) so the component never reaches into `patchState` directly.
2. `libs/program/feature-dashboard/src/lib/program-dashboard.component.ts` — deleted the local `selectedProgramId`/`activeEditSession` signals and the auto-begin-session `effect()` (plus the now-unused `effect`/`untracked` imports); `livePersistedProgram`/`selectedProgram`/`readOnly`/`otherProgramNames` now read `store.selectedProgramId()`/`store.sessionActive()`; handlers updated to match the spec exactly, including `onDeleteProgram` calling the new `store.clearSelection()`. One addition beyond the ticket text: `program-dashboard.component.html` still bound `[selectedProgramId]="selectedProgramId()"` to the now-deleted local signal — updated to `store.selectedProgramId()` so the app actually compiles (the ticket's file list didn't mention the template, but this follows mechanically from deleting the signal).
3. `libs/program/ui/src/lib/program-edit-toggle/program-edit-toggle.component.ts` — doc comment updated, no behavioral change, as specified.

Verification:

- `nx test program-domain` (14/14 passing), `nx test program-feature-dashboard` and `nx test program-ui` (no test files exist for either yet — ran clean, nothing to catch a regression).
- `nx lint program-feature-dashboard` and `nx lint program-ui` both clean. `nx lint program-domain` fails, but only on 38 pre-existing `no-unsafe-call` errors in `generate-reload-cycle.spec.ts`, a file untouched by this change — part of the repo's known-red lint baseline, not a regression.
- `nx build fitness-tracker` succeeds — full AOT compile, which type-checks every template binding across the app, including the ones this change touched.
- Manual browser pass **not done**: the app only supports real Google popup sign-in against production Firebase (`signInWithPopup` in `auth.effects.ts`) with no auth emulator wired into the app code despite `firebase.json` defining emulator ports, so there's no headless path to drive it as a user without live credentials. Flagging this rather than claiming it — the user should manually verify the four scenarios verification calls out (auto-session on create, Draft going read-only on reselect, guard dialog firing on mid-edit switch, `saveDisabled` gating across block add/remove and Program switches) before merging.
