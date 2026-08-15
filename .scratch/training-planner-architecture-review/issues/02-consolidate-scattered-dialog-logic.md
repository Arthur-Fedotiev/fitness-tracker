Type: grilling
Status: open
Blocked by: 01

## Question

Confirmation-dialog handling is split across three call-sites with two different patterns:

- `libs/program/ui/src/lib/program-delete-button/program-delete-button.component.ts` uses the generic, repo-standard `ConfirmationDialogService` (from `@fitness-tracker/shared/ui/components`) — a binary confirm/cancel dialog, RxJS-based (`.pipe(takeUntilDestroyed()).subscribe(...)`).
- `libs/program/feature-dashboard/src/lib/program-dashboard.component.ts`'s `guardLeavingSession()` opens `DiscardChangesDialogComponent` directly via `inject(MatDialog)`, wrapped in `firstValueFrom(...)` for `async`/`await` use, handling a three-way result (`'save' | 'discard' | undefined`).
- `libs/program/ui/src/lib/program-edit-toggle/program-edit-toggle.component.ts`'s `onCancelClick()` opens the *same* `DiscardChangesDialogComponent` again, independently, via its own `inject(MatDialog)` + `.afterClosed().subscribe(...)`, handling a two-way result (`'discard' | undefined` — no save option in this caller).

Both `DiscardChangesDialogComponent` call-sites duplicate the `MatDialog.open(...)` config shape and hand-roll their own result-branching, one Promise-style and one Observable-style, for what is conceptually the same "confirm before discarding" action.

Decide: should this consolidate into one shared abstraction — e.g. extending `ConfirmationDialogService` to support a three-way save/discard/cancel result so all three call-sites share one service, or a new small dedicated service/helper wrapping `DiscardChangesDialogComponent` specifically, used by both its callers, left separate from `ConfirmationDialogService`'s binary case? Pick a direction and produce a ready-for-agent implementation ticket (or do the edit directly if trivial enough once decided).

Depends on [[01-state-ownership-and-signals-pilot-verdict]]: if that ticket moves `activeEditSession`/session-guard logic into the store, the natural home for the consolidated dialog call may shift with it.

**Resolved — carry forward when picking this up.** [[01-state-ownership-and-signals-pilot-verdict]] landed: `selectedProgramId` and `activeEditSession` (now `sessionActive`) moved into `ProgramStore` — see its `## Answer` and the [implementation ticket](06-implement-state-ownership-changes.md). `guardLeavingSession()` itself did **not** move into the store and structurally can't: `libs/program/domain` is Nx-tagged `type:domain-logic`, `libs/program/ui` (home of `DiscardChangesDialogComponent`) is tagged `type:ui`, and `.eslintrc.json`'s `@nx/enforce-module-boundaries` forbids `type:domain-logic` → `type:ui` (verified `.eslintrc.json:54-55`). The store can expose `dirty()`-style predicates and transition methods; the dialog step stays in `program/feature-dashboard` or a shared UI-layer service. Re-read `program-dashboard.component.ts` fresh once ticket 06 lands — the exact call sites this ticket judges will have shifted.
