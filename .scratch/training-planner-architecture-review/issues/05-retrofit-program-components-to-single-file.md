Type: task
Status: open
Blocked by: 04

## Question

Mechanically apply the convention decided in [[04-single-file-component-convention]] to every `program` component currently split across `.ts`/`.html`/`.scss` (see that ticket's table for the full list and sizes), except whatever `04` explicitly exempted. Fold each component's template and styles inline into its `.ts` file, delete the now-unused sibling files, and update the `@Component` decorator (`template`/`styles` in place of `templateUrl`/`styleUrl`).

Resolved when every non-exempt `program` component is single-file and the workspace still builds/lints clean.
