Type: task
Status: resolved
Blocked by: 04

## Question

Mechanically apply the convention decided in [[04-single-file-component-convention]] (landed as ADR-0008) to every `program` component currently using a sibling `.html` template (see that ticket's table for the full list and sizes). **Templates only** — the resolved decision keeps styles in sibling `.scss` files for now, so `styleUrl`/`.scss` files are untouched. Fold each component's template inline into its `.ts` file as a bare template-literal string on `template`, delete the now-unused `.html` file, and update the `@Component` decorator (`template` in place of `templateUrl`). No component is exempt — even the largest (`program-dashboard.component.ts`, 69-line template) fits under the 100-line threshold.

Resolved when every `program` component with a template ≤100 lines is single-file (template inlined, styles still split) and the workspace still builds/lints clean.

## Answer

Done. All 10 remaining split-template `program` components retrofitted: `program-dashboard.component.ts`, `main-lift-block-form.component.ts`, `program-name-header.component.ts`, `reload-cycle-table.component.ts`, `add-main-lift-block.component.ts`, `program-edit-toggle.component.ts`, `main-lift-block-card.component.ts`, `program-delete-button.component.ts`, `program-status-tabs.component.ts`, `program-chip-list.component.ts`. Each: `templateUrl` → `template` (bare template-literal string), sibling `.html` deleted, `styleUrl`/sibling `.scss` untouched, then reformatted with Prettier (auto-formats the embedded HTML, per ADR-0008's finding). `discard-changes-dialog.component.ts` was already inline, untouched.

Verified: `program-ui` and `program-feature-dashboard` lint clean; `fitness-tracker` production build green; `program-domain`/`program-ui`/`program-feature-dashboard` tests green (`program-ui`/`program-feature-dashboard` have no test files — pre-existing, out of scope per this map's Notes). No manual browser pass — flagged for the user to verify before merge, consistent with State ownership and signals pilot verdict and Consolidate scattered dialog logic's implementation tickets.
