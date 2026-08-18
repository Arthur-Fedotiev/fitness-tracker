# Adopt `write-excel-file` for client-side .xlsx generation

The Training Planner needs to export a Program as a genuine `.xlsx` workbook — one that opens cleanly in Excel and Sheets with real cells and basic formatting, not CSV wearing an `.xlsx` extension. This app has no Angular Universal/SSR setup and no backend involvement in the feature, so generation has to run entirely in the browser. The repo had no existing excel/csv/file-saver dependency, making this a from-scratch pick.

We're adopting **`write-excel-file`**. It was the only candidate clearing every constraint at once:

- **Maintained.** Releases into 2026, against `exceljs` stalled since Oct 2023 and SheetJS `xlsx`'s npm distribution frozen since Mar 2022.
- **No peer-dependency footprint.** Zero `peerDependencies` and one small runtime dependency (`fflate`, advisory-free). Nothing to reconcile against Angular 21 / Nx 22 tooling.
- **No Node-core polyfills.** Its `/browser` entry point needs no Node-only APIs, so the Angular build needs no `resolve.fallback` shims — which `exceljs` does require.
- **Smallest.** ~1.8 MB unpacked, against ~7.5–21.8 MB for the alternatives.
- **Download without a helper.** Hands back a ready `.toFile()` "Save As" trigger or a raw `.toBlob()`; no `file-saver` dependency.
- **Bold and column widths are free.** The export's formatting needs (bold header rows, a filled band, column widths) are all covered natively.

## Considered Options

- **`exceljs`** — richer native styling and no unresolved advisories against its current version, but unmaintained upstream (so it would need pinning), and it costs a one-time Webpack polyfill workaround (`@angular-builders/custom-webpack` plus `resolve.fallback` for `fs`/`stream`) to run in the browser. **Retained as the fallback** if `write-excel-file`'s schema-based API turns out not to express a needed shape — multi-sheet or streaming output being the likely triggers.
- **SheetJS `xlsx` (community build)** — the highest download count of the three and therefore the obvious default, but rejected outright. The only npm-installable version carries two unresolved HIGH-severity advisories that were never patched on the registry, and the free tier paywalls cell styling behind SheetJS Pro — which is precisely the feature set the export needs. Do not fall back to this one.

## Consequences

- The export's formatting ceiling is whatever `write-excel-file` does cheaply: bold, background fill, column widths, numeric cells, and custom number formats. The worksheet layout was designed against that ceiling and deliberately uses no merged cells, no wrapped text and no row-height overrides.
- Number formats carry the weight unit (`General" kg"`) so load cells display as `90 kg` while staying real `Number` cells that Excel can sum and chart. Baking a unit into a cell's _value_ would make it a string and lose that — don't. Use `General` rather than a digit-placeholder code like `0.##`: a format code always emits its decimal separator even with no digits after it, which renders whole numbers as `70.`, or `70,` in comma-separator locales.
- The export is a **sink**, and the whole concern lives in `libs/program/domain`. `entities/excel-export/` decides what the sheet says, as a pure function over a vendor-neutral `Workbook` model; `infrastructure/program-excel-export.service.ts` is the single file that imports this library and triggers the browser download. Feature components inject that service and know nothing about the file format. `libs/program/*` all carry the `domain:program` tag, so `feature-dashboard` can import it directly — no new `public-api` lib is needed.
- That seam is what keeps the `exceljs` fallback above cheap: swapping the writer rewrites one adapter file, because no layout rule names a library. Do not let a vendor type leak back into `entities/` or the domain's public barrel.
- Adding a second, unrelated Excel dependency later should reopen this ADR rather than sit alongside it.
- Full comparison, sourcing and maintenance data: `docs/research/excel-export-library-selection.md` on branch `research/excel-library-selection` (commit `5d8b98e`).
