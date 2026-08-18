# Excel export for a Training Planner Program

Status: ready-for-agent

Add a "Download Excel" action to the Training Planner dashboard that generates and downloads an `.xlsx` workbook for one Program, entirely client-side.

Every decision below is settled. This spec is the output of a wayfinding effort; the reasoning behind each choice is preserved in the artifacts linked at the bottom.

## Scope

- One Program per download. No bulk/export-all.
- Client-side only. No backend, no SSR (this app has neither).
- Single worksheet.

## Library

`write-excel-file` — see [ADR-0009](../../docs/adr/0009-adopt-write-excel-file.md). Not yet added to `package.json`.

Fallback is `exceljs` (pinned) only if the schema API can't express a needed shape. Never SheetJS `xlsx`.

The layout below stays inside what the library does for free: bold, background fill, column widths, numeric cells. No merged cells, no wrapped text, no row-height overrides.

## Architecture

Workbook construction is a **pure function in `libs/program/domain`**, following `generateReloadCycle`'s precedent — takes the Program plus resolved exercise names, returns the sheet data. `program-dashboard.component.ts` stays a thin trigger for the Blob/anchor side effect.

All `libs/program/*` carry the `domain:program` tag, so `feature-dashboard` imports it directly. No new `public-api` lib is needed.

Exercise names are not on `MainLiftBlock` (which holds `exerciseId`); the dashboard already resolves them via `exerciseNameById()` from `EXERCISE_PICKER_QUERY`. Pass resolved names into the pure function rather than reaching for the exercise domain inside `program/domain`.

## Worksheet layout

One sheet. Weeks run across as columns, one row per Main Lift Block.

```
Row 1   A: <Program name>                                          (bold, larger)
Row 2   A: Status  B: Active   D: Exported  E: 2026-08-18 14:30    (labels bold)
Row 3   A: All loads in kg                                         (italic/muted)
Row 4   (blank)
Row 5   Exercise | 1RM (kg) | Reps @ 80% | W1 | W2 | ... | W8      (bold header)
Row 6   Sets × Reps |  |  | 5×5 | 5×5 | 5×5 | 5×5 | 5×5 | 3×3 | 2×2 | 1RM retest
                                                                   (bold + filled band)
Row 7+  <exercise> | <1RM> | <reps> | <W1..W7 loads> | <retest or —>   one per block
Row n   (blank)
Row n+1 Not exported: <names> — no Reload Cycle generated           (italic/muted)
```

11 columns (A–K). Widths: A 22, B–C 14, D–K 10.

### Rules

- **Blocks appear in Program order**, one row each.
- **A block with no generated Reload Cycle (`cycle === null`) is skipped**, and named in the trailing footnote. Omit the footnote row entirely when nothing was skipped.
- **Sets × Reps is stated once** in row 6, not per block — it is fixed by the method (`SETS_AND_REPS` in `derive-cycle.ts`) and identical for every block.
- **Loads are numeric cells**, so Excel can sum and chart them. The unit is declared once in row 3.
- **Week 8** carries `week8Retest` when set, otherwise an em dash — matching `reload-cycle-table.component.ts`'s own `row.load ?? '—'`.
- **A null `load` within Weeks 1–7** (possible under the placeholder anchor, see `anchor-resolution.ts`) renders as an em dash too.
- **Omitted deliberately**: rounding mode, anchor source, and the Loading Constraint's increment. All are gym configuration or app internals — their effect is already visible in the loads themselves. Do not add them back without reopening this.

## Filename

`<sanitised program name>_<timestamp>.xlsx` — e.g. `Reload-Aug-2026_20260818-143000.xlsx`.

- Program name: non-alphanumerics collapsed to a single hyphen, hyphens trimmed from both ends.
- Timestamp: local time, `YYYYMMDD-HHmmss`. Same-day re-exports never collide.

## Trigger

Leftmost in the `.actions` group of the name row in `program-dashboard.component.ts` — before `ft-program-edit-toggle` and `ft-program-delete-button`, read-only action ahead of the mutating ones.

```html
<button mat-flat-button color="primary" (click)="onDownloadExcel()">
  <mat-icon>download</mat-icon>
  Download Excel
</button>
```

No `matTooltip` and no `aria-label` — the visible label already says what it does and serves as the accessible name. Both would be redundant.

**Visible only when the Program is `active` or `completed` and no edit session is active** (`readOnly()` is true). Never on a `draft`.

Note the existing toolbar is *not* icon-only in read-only mode: `ft-program-edit-toggle` renders a labelled `mat-stroked-button` there. A labelled Download is what matches the row.

## Responsive layout

Below 600px the name row stacks, giving the Program name the full width and dropping the actions onto their own line. Same controls at both sizes — no separate mobile trigger.

```scss
// program-dashboard.component.scss
.name-row {
  @media (max-width: 599.98px) {
    flex-direction: column;
    align-items: stretch;

    .actions { justify-content: flex-end; }
  }
}
```

This is a container-level flex change, so the editing-state toolbar (Save/Cancel) inherits the wrap for free and needs no restructuring.

## Out of scope

- Bulk / multi-program export.
- Server-side generation.
- Adding a real weight-unit field to the domain. The export assumes kg; see the **Weight units** note in `CONTEXT.md`.

## Provenance

Decisions came from a wayfinding effort (map now closed). Primary sources kept on throwaway branches:

- `research/excel-library-selection` (`5d8b98e`) — library comparison, `docs/research/excel-export-library-selection.md`.
- `prototype/excel-worksheet-layout` (`26de29e`) — sheet-layout variants, `docs/prototypes/excel-export-worksheet-layout.html`. Open it and use `?variant=FINAL`.
- `prototype/excel-download-trigger` (`44077f6`) — trigger and responsive-layout variants, live on `/training-planner`. Run `env -u NX_WORKSPACE_ROOT_PATH NX_DAEMON=false npx nx serve fitness-tracker` from that branch.
