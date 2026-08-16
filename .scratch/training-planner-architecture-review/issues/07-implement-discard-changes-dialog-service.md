Type: task
Status: resolved
Blocked by: 02

## Question

Implement the decision recorded in [[02-consolidate-scattered-dialog-logic]]: extract a `DiscardChangesDialogService` and rewire its two callers.

1. Create `libs/program/ui/src/lib/discard-changes-dialog/discard-changes-dialog.service.ts`:
   ```ts
   @Injectable({ providedIn: 'root' })
   export class DiscardChangesDialogService {
     private readonly dialog = inject(MatDialog);

     confirm(data: DiscardChangesDialogData): Observable<DiscardChangesDialogResult> {
       return this.dialog.open<DiscardChangesDialogComponent, DiscardChangesDialogData, DiscardChangesDialogResult>(
         DiscardChangesDialogComponent,
         { data },
       ).afterClosed();
     }
   }
   ```
2. Export `DiscardChangesDialogService` from `program/ui`'s public-api barrel, alongside the existing `DiscardChangesDialogComponent`/`DiscardChangesDialogResult`/`DiscardChangesDialogData` exports.
3. Rewire `libs/program/ui/src/lib/program-edit-toggle/program-edit-toggle.component.ts`'s `onCancelClick()`: replace the direct `inject(MatDialog)` + `this.dialog.open(DiscardChangesDialogComponent, { data: {...} })` with `inject(DiscardChangesDialogService)` + `this.discardChangesDialog.confirm({...})`. Keep the `.subscribe(...)` call-site style and the `if (!this.dirty())` short-circuit exactly as today — only the dialog-opening plumbing changes. Remove the now-unused `MatDialog` import if nothing else in the file needs it.
4. Rewire `libs/program/feature-dashboard/src/lib/program-dashboard.component.ts`'s `guardLeavingSession()`: replace `this.dialog.open<DiscardChangesDialogComponent, unknown, DiscardChangesDialogResult>(DiscardChangesDialogComponent, { data: {...} }).afterClosed()` with `this.discardChangesDialog.confirm({...})`. Keep the surrounding `firstValueFrom(...)` wrap and the `switch (result)` branching exactly as today — this ticket does not touch the guard's async/Promise shape (see [[03-state-change-and-side-effect-consistency]], which owns that). Remove `inject(MatDialog)` from the component if nothing else in the file needs it (check — `program-dashboard.component.ts` may have no other `MatDialog` use once this lands).
5. Confirm neither `program-edit-toggle` nor `program-dashboard` needs `MatDialog` for anything else after the rewire; drop the import/injection if unused.
6. Run affected builds/tests: `program/ui`, `program/feature-dashboard` (and anything depending on their public-apis). No behavior change is intended — this is a pure extract-and-rewire, so existing tests should pass unmodified unless they assert on `MatDialog` injection directly (check for that).
7. Manual browser verification (per this map's Notes, out of this ticket's tooling reach the same way ticket 06's was) — flag for the user to click through: Program edit-toggle Cancel-with-unsaved-changes, and navigating away / switching Program or status tab with unsaved changes, to confirm both dialogs still fire correctly post-rewire.

## Answer

Implemented as specified, no deviations.

- Created `DiscardChangesDialogService` at `libs/program/ui/src/lib/discard-changes-dialog/discard-changes-dialog.service.ts` — `providedIn: 'root'`, single `confirm(data: DiscardChangesDialogData): Observable<DiscardChangesDialogResult>` wrapping `MatDialog.open(...).afterClosed()`. Exported from `program/ui`'s `index.ts` barrel next to the existing `DiscardChangesDialogComponent` export.
- `program-edit-toggle.component.ts`'s `onCancelClick()` now injects `DiscardChangesDialogService` instead of `MatDialog`; `.subscribe(...)` call-site style and the `if (!this.dirty())` short-circuit are unchanged. `MatDialog`/`DiscardChangesDialogComponent` imports removed (both now unused in this file).
- `program-dashboard.component.ts`'s `guardLeavingSession()` now calls `this.discardChangesDialog.confirm({...})` instead of `this.dialog.open<DiscardChangesDialogComponent, unknown, DiscardChangesDialogResult>(...)`. The `firstValueFrom(...)` wrap, `async`/`await`, and `switch (result)` branching are byte-for-byte unchanged — this ticket deliberately left that shape for [[03-state-change-and-side-effect-consistency]] to judge. `MatDialog` was the component's only other `MatDialog` use, so `inject(MatDialog)` and its import were removed; `DiscardChangesDialogComponent`/`DiscardChangesDialogResult` imports replaced by `DiscardChangesDialogService`.
- No other consumer in `libs/` or `apps/` referenced `DiscardChangesDialogComponent`/`DiscardChangesDialogResult` directly (verified via grep) — the rewire is fully contained to these two call-sites.
- Verification: `nx run-many -t lint -p program-ui program-feature-dashboard` — clean. No spec files exist for either component (none to run/break). `nx build fitness-tracker --configuration=production` — succeeds, confirming the rewire type-checks across the whole app, not just the two touched libs (neither project has a standalone `build` target).
- **Manual browser verification still needed** (flagged in the ticket, same as ticket 06's precedent — no auth-emulator path in this session): click through Program edit-toggle Cancel-with-unsaved-changes, and navigating away / switching Program or status tab with unsaved changes, to confirm both dialogs still fire correctly post-rewire.
