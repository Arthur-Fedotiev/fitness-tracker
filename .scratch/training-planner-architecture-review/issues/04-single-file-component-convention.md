Type: grilling
Status: open

## Question

Decide a repo-wide convention: for small-to-average components, template (and likely styles) should live inline in the `.ts` file rather than split into sibling `.html`/`.scss` files. This repo currently uses the split three-file convention everywhere. Current `program` component sizes (ts / html / scss line counts) as a concrete reference point for "small-to-average":

| Component | ts | html | scss |
|---|---|---|---|
| `program-dashboard.component.ts` | 302 | 69 | 55 |
| `main-lift-block-form.component.ts` | 155 | 45 | 17 |
| `program-name-header.component.ts` | 70 | 27 | 35 |
| `reload-cycle-table.component.ts` | 54 | 46 | 49 |
| `add-main-lift-block.component.ts` | 58 | 31 | 25 |
| `program-edit-toggle.component.ts` | 56 | 19 | 5 |
| `main-lift-block-card.component.ts` | 49 | 27 | 11 |
| `program-delete-button.component.ts` | 42 | 3 | 3 |
| `discard-changes-dialog.component.ts` | 45 | (already inline) | — |
| `program-status-tabs.component.ts` | 36 | 13 | 3 |
| `program-chip-list.component.ts` | 17 | 7 | 3 |

Settle:

1. Where the line is — a rough LOC threshold (combined, or per-file?) past which splitting back out is still acceptable, and whether `program-dashboard.component.ts` (by far the largest, already a facade over a lot of coordination logic — see [[01-state-ownership-and-signals-pilot-verdict]]) is an explicit exception or should still inline.
2. Inline syntax preference — template literal with backticks vs Angular's array-form `styles: []`, and any formatting/prettier implications.
3. Where this gets codified — an ADR under `docs/adr/` per this repo's domain-docs convention (`docs/agents/domain.md`), referenced from `CONTEXT.md` or a repo-wide agent doc.

Produces the ADR (or a ready-for-agent ticket to write it) plus the concrete threshold that [[05-retrofit-program-components-to-single-file]] applies.
