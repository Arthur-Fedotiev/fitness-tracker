## Agent skills

### Issue tracker

Issues and specs live as markdown files under `.scratch/<feature-slug>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context. One root `CONTEXT.md` + `docs/adr/`. See `docs/agents/domain.md`.

## Prose style

Every piece of prose written for a human reader goes through the `unslop` skill
first: chat replies, markdown docs, ADRs, issue files under `.scratch/`, commit
messages, PR titles and bodies, and code comments. Read
`.claude/skills/unslop/SKILL.md`, apply its 31 checks, then send or save the
text. Code identifiers, test fixtures, and tool output are exempt.
