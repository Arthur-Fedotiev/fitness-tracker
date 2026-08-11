# Angular + Nx major-version migration: fact-finding research

Status: research (not a spec/decision — no recommendations below)
Date compiled: 2026-08-10
Scope: fact-finding only, per the six questions below. All claims cited with full URLs to primary sources (npm registry, angular.dev, nx.dev, official blogs, GitHub).

## Compact version table

| Package | Repo has | Latest stable (2026-08-10) | Released | Major jump |
|---|---|---|---|---|
| `@angular/core` | 20.1.4 | **22.1.1** | 2026-08-07 | 20 → 21 → 22 (2 majors) |
| `@angular/cli` | ~20.1.0 | **22.1.3** | 2026-08-05 | 20 → 21 → 22 (2 majors) |
| `nx` / `@nx/*` | 21.3.11 | **23.1.1** | 2026-07-30 | 21 → 22 → 23 (2 majors) |
| `typescript` | 5.8.2 | 7.0.2 (Angular 22 needs `>=6.0 <6.1`) | 6.0.2: 2026-03-23 | Angular caps you at TS 6.0.x, not 7 |
| `rxjs` | 7.8.1 | 7.8.2 | — | peer range unchanged (`^6.5.3 \|\| ^7.4.0`) |
| `zone.js` | 0.15.1 | 0.16.2 | 2025-11-19 (0.16.0) | now optional peer on Angular 22 |
| `@ngrx/*` | ^20.0.0 | 21.1.1 stable (22.0.0-rc.0 in flight) | 21.1.1: 2026-06-08 | peers on `@angular/core ^21.0.0` |
| `@angular-eslint/*` | ^20.1.1 | 22.1.0 | — | dropped ESLint 8 support |
| `@typescript-eslint/*` | ^8.8.0 | 8.66.0 | — | still same major (8.x) |
| `eslint` | ^8.57.1 (legacy `.eslintrc.json`) | 10.8.1 | 10.0.0: 2026-02-06 | v10 **removed** eslintrc entirely |
| `jest` | ^29.7.0 | 30.4.2 | — | major jump 29 → 30 |
| `jest-preset-angular` | ^14.2.0 | 17.0.0 | — | peers `@angular/core >=20.0.0 <23.0.0` |
| `cypress` | ^13.15.0 | 15.20.0 | — | major jump 13 → 15 |
| `cypress-firebase` | ^2.2.5 | 4.4.0 | 2026-06-11 | major jump 2 → 4 |
| `@angular/fire` | 20.0.1 | **still 20.0.1** (latest `next` tag is `21.0.0-rc.0`, stuck in RC since 2025-11-26) | 20.0.1: 2025-06-12 | **no stable release for Angular 21/22 as of today** |
| `firebase` | ^10.14.0 | 12.17.1 | 12.0.0: 2025-07-17 | major jump 10 → 12 |
| `@angular-architects/ddd` | 20.0.1 | 22.0.0 | 2026-06-07 | peers `@angular/core ^22.0.0`, tracks Angular majors |
| `node` | v22.18.0 (`.nvmrc`) | Angular 22 requires `^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0` | — | **22.18.0 does not satisfy `^22.22.3`** |

Sources for the table are inline in the numbered sections below; the two flagged risk rows (Node version, `@angular/fire`) are called out again in the summary.

---

## 1. Actual latest stable versions today

- **`@angular/core` latest stable: `22.1.1`**, published **2026-08-07T16:45:57Z**. Source: [registry.npmjs.org/@angular/core](https://registry.npmjs.org/@angular/core) (`dist-tags.latest`). `21-lts` dist-tag is `21.2.19` (2026-07-29).
- **`@angular/cli` latest stable: `22.1.3`**, published **2026-08-05T08:19:13Z**. Source: [registry.npmjs.org/@angular/cli](https://registry.npmjs.org/@angular/cli).
- **`nx` latest stable: `23.1.1`**, published **2026-07-30T22:40:12Z**. Source: [registry.npmjs.org/nx](https://registry.npmjs.org/nx) (`dist-tags.latest`; `dist-tags.previous` = `22.7.8`, confirming 22 is the prior major line).
- Major-version boundary release dates (from the same registry `time` objects):
  - `@angular/core@21.0.0`: 2025-11-19T18:07:38Z; `@angular/core@22.0.0`: 2026-06-03T13:04:10Z.
  - `@angular/cli@21.0.0`: 2025-11-19T19:14:53Z; `@angular/cli@22.0.0`: 2026-06-03T13:34:54Z.
  - `nx@22.0.0`: 2025-10-22T16:24:27Z; `nx@23.0.0`: 2026-06-16T16:06:46Z.
- Official announcement posts (secondary confirmation of the registry dates): [Announcing Angular v21](https://blog.angular.dev/announcing-angular-v21-57946c34f14b) (Nov 19, 2025), [Announcing Angular v22](https://blog.angular.dev/announcing-angular-v22-c52bb83a4664) (Jun 3, 2026), [Nx 22 Release](https://nx.dev/blog/nx-22-release) (Oct 23, 2025), [Nx 23 Release](https://nx.dev/blog/nx-23-release) (Jun 17, 2026), [Nx 23.1 Release](https://nx.dev/blog/nx-23-1-release) (Jul 15, 2026).

Note: `@angular/cli` patch versions currently run slightly ahead of `@angular/core` patch versions (22.1.3 vs 22.1.1) — both are on the same `22.1.x` minor line, this is just a publishing-cadence offset, not a version-range mismatch.

## 2. Is this a multi-major jump, and what does the tooling/docs say about it?

**Yes — both are two-major jumps.** Angular: 20 (repo) → 21 → 22 (latest). Nx: 21 (repo) → 22 → 23 (latest).

**Angular:** the official [Update Guide](https://angular.dev/update-guide) is version-range-driven (pick "from" and "to"), and `ng update` itself is restricted to adjacent majors: `ng update` can only be used "provided that the version you want to update *from* is within one major version of the version you want to upgrade to" — per [angular.dev/reference/releases](https://angular.dev/reference/releases), which lays out the explicit walk-through example "to update from version 10 to version 12: 1. Update from version 10 to version 11. 2. Update from version 11 to version 12." There is no automatic multi-major mode in `ng update` — each hop must be run and committed sequentially.

**Nx:** [nx.dev's Advanced Update guide](https://nx.dev/docs/guides/tips-n-tricks/advanced-update) states "The recommended process is to update, at most, one major version at a time," and explicitly escalates this for Angular workspaces: *"If your workspace uses Angular, this becomes a requirement rather than a recommendation."* Unlike `ng update`, `nx migrate` **does** detect multi-major jumps and prompts interactively; the flag `--multi-major-mode` can be set non-interactively to `gradual` (step through the latest release of your current major first — the recommended path) or `direct` (jump straight to the target version, skipping intermediate major migrations). The documented sequential pattern for a 22→23 jump is:
  1. `nx migrate 22.7.5` (latest patch in current major)
  2. `nx migrate --run-migrations`
  3. `nx migrate 23.0.0`
  4. `nx migrate --run-migrations`
  Source: [nx.dev/docs/guides/tips-n-tricks/advanced-update](https://nx.dev/docs/guides/tips-n-tricks/advanced-update).

Given this repo is both an Nx workspace *and* an Angular workspace, both official docs converge on the same guidance: sequential, one major at a time, not a direct jump.

## 3. Breaking changes / deprecations per major Angular version (20 → 21 → 22)

All version-range facts below come from the npm registry `peerDependencies`/`engines` fields of `@angular/core`, `@angular/cli`, and `@angular/compiler-cli` at each major boundary version, cross-checked against the official announcement posts and [angular.dev/reference/versions](https://angular.dev/reference/versions).

### Angular v21 (released 2025-11-19)

Source: [Announcing Angular v21](https://blog.angular.dev/announcing-angular-v21-57946c34f14b) (blog.angular.dev, Nov 19, 2025).

- **Zoneless**: "Zoneless change detection, introduced experimentally in v18, progressed through Developer Preview in v20, and reached stability in v20.2." In v21, **new applications no longer include zone.js by default**. Zoneless is not yet the universal application default at this point — that flips fully in v22 (see below) — but v21 is where zone.js stops being auto-included for new apps.
- **Signal Forms**: launched as **experimental** in v21 ("We're launching experimental Signal Forms").
- **Angular Aria**: launched in **Developer Preview**.
- **Test runner**: Vitest promoted to the Angular CLI's new **default, stable** test runner (`ng test` now scaffolds Vitest for new projects). Karma/Jasmine remain fully supported, no forced migration. The blog explicitly flags: *"With Vitest support being stable we decided to deprecate the experimental support for Web Test Runner and Jest and plan to remove them in v22."* (This is about the Angular CLI's own experimental Jest builder, not the community `jest-preset-angular` package used by this repo, which the post explicitly calls out as a continuing option: *"For teams that want to continue to use Jest, consider ... [jest-preset-angular](https://github.com/thymikee/jest-preset-angular) and the [Nx Jest plugin](https://nx.dev/docs/technologies/test-tools/jest/introduction)."*)
- **RxJS**: peer range unchanged, `^6.5.3 || ^7.4.0` (confirmed via `registry.npmjs.org/@angular/core/21.0.0`).
- **zone.js peer**: unchanged, `~0.15.0`.
- **TypeScript**: `@angular/compiler-cli@21.0.0` requires `>=5.9 <6.0` (registry data). Confirmed on [angular.dev/reference/versions](https://angular.dev/reference/versions): Angular 21.0.x–21.2.x → TypeScript `>=5.9.0 <6.0.0`.
- **Node.js**: `^20.19.0 || ^22.12.0 || >=24.0.0` — unchanged from v20 (registry `engines`, `@angular/core@21.0.0` / `@angular/cli@21.0.0`).
- **Migrations added**: standalone-migration schematic gained `CommonModule` support; new migration for deprecated `RouterTestingModule`. Source: same v21 blog post.

### Angular v22 (released 2026-06-03)

Source: [Announcing Angular v22](https://blog.angular.dev/announcing-angular-v22-c52bb83a4664) (blog.angular.dev, Jun 3, 2026).

- **Zoneless is now the default and declared stable/production-ready.** Quote: *"Zoneless change detection ... reached stability in v20.2 ... In 2024, more than half of the brand new Angular applications inside Google were built with the Zoneless change detection strategy and we made it the default mid-2024 ... New applications will automatically use Zoneless."* zone.js became a fully optional peer as of this release (confirmed in registry data: `@angular/core@22.0.0` peer widened to `~0.15.0 || ~0.16.0`, i.e. still installable but no longer required by default scaffolding).
- **Change-detection default rename**: `OnPush` is now the default `changeDetection` for new components (no longer needs to be specified), and the previous default `ChangeDetectionStrategy.Default` was **renamed to `ChangeDetectionStrategy.Eager`**.
- **Signal Forms, Angular Aria, and the Asynchronous Reactivity APIs all graduate to stable/production-ready** in this release (all three were experimental/dev-preview in v21).
- **New `@Service` decorator** introduced as a lighter-weight alternative to `@Injectable({providedIn: 'root'})`.
- **Builder/Webpack deprecation**: *"Webpack support, `@angular-devkit/build-angular` builders, `@ngtools/webpack`, etc. is deprecated in v22. We're focusing on TSGo support in the application builder."* — i.e. the esbuild/Vite-based application builder is the sole forward path; Webpack-based builders are now formally deprecated (not yet removed).
- **RxJS**: peer range unchanged, still `^6.5.3 || ^7.4.0` (registry data, `@angular/core@22.1.1`).
- **zone.js**: peer widened to `~0.15.0 || ~0.16.0` (registry data).
- **TypeScript**: `@angular/compiler-cli@22.0.0`/`22.1.1` requires **`>=6.0 <6.1`** — a full TypeScript major bump from v21's `5.9.x` requirement. Confirmed on [angular.dev/reference/versions](https://angular.dev/reference/versions): Angular 22.0.x → TypeScript `>=6.0.0 <6.1.0`. TypeScript itself: v6.0 was announced by the TypeScript team as *"the last release based on the current JavaScript codebase ... a stepping-stone release ... to help align and prepare for adopting TypeScript 7.0"* — source: [Announcing TypeScript 6.0](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) (devblogs.microsoft.com, Mar 23, 2026). TypeScript 6.0.2 published to npm 2026-03-23; latest TS overall today is `7.0.2` (2026-07-08), but Angular 22 caps you at the `6.0.x` line, not TS 7.
- **Node.js**: `engines.node` jumped to **`^22.22.3 || ^24.15.0 || >=26.0.0`** (registry data, `@angular/core@22.0.0`/`@angular/cli@22.0.0`) — a materially narrower/newer range than v20/v21's `^20.19.0 || ^22.12.0 || >=24.0.0`. **Node 20.x is no longer supported at all**, and within the Node 22 line, only `>=22.22.3` qualifies.
- **New `@boundary` template error-boundary API**: announced as an upcoming **Developer Preview in Q3 2026**, not yet shipped in 22.1.1.
- Full changelog reference pointed to by the post: [github.com/angular/angular/blob/main/CHANGELOG.md](https://github.com/angular/angular/blob/main/CHANGELOG.md).

### Standalone-by-default / NgModule trajectory

Neither the v21 nor v22 announcement posts declare NgModules removed or a hard end-of-life date; the v21 post only mentions the *standalone migration schematic* gaining broader `CommonModule` support (an incremental migration-tooling improvement, not a breaking removal). No primary source found stating NgModules are removed or scheduled for removal in v21 or v22.

## 4. Ecosystem package compatibility with latest Angular 22 / Nx 23

All peer-dependency data pulled live from `registry.npmjs.org/<package>/<version>` on 2026-08-10.

| Package | Latest version | Peer/compat notes | Source |
|---|---|---|---|
| `@ngrx/store` | **21.1.1** (stable, 2026-06-08); `22.0.0-rc.0` in prerelease (2026-08-06) | peers `@angular/core: ^21.0.0`, `rxjs: ^6.5.3 \|\| ^7.5.0` — **21.1.1 does not declare peer support for Angular 22**; the still-prerelease 22.0.0 line is what tracks Angular 22 | [registry.npmjs.org/@ngrx/store/21.1.1](https://registry.npmjs.org/@ngrx/store/21.1.1) |
| `@angular-eslint/eslint-plugin` | **22.1.0** | peers `eslint: ^9.0.0 \|\| ^10.0.0` — **no longer supports ESLint 8** (the repo's current `eslint ^8.57.1`). By contrast, the repo's current `@angular-eslint@20.1.1` still supports `eslint: ^8.57.0 \|\| ^9.0.0`. | [registry.npmjs.org/@angular-eslint/eslint-plugin/22.1.0](https://registry.npmjs.org/@angular-eslint/eslint-plugin/22.1.0) vs [.../20.1.1](https://registry.npmjs.org/@angular-eslint/eslint-plugin/20.1.1) |
| `@typescript-eslint/eslint-plugin` | **8.66.0** | peers `eslint: ^8.57.0 \|\| ^9.0.0 \|\| ^10.0.0`, `typescript: >=4.8.4 <6.1.0` — still on major `8.x` (same major the repo already pins `^8.8.0` to), and its TS ceiling (`<6.1.0`) lines up with Angular 22's TS requirement | [registry.npmjs.org/@typescript-eslint/eslint-plugin/8.66.0](https://registry.npmjs.org/@typescript-eslint/eslint-plugin/8.66.0) |
| `eslint` | **10.8.1** | v10 (released 2026-02-06) **completely removed** the legacy `.eslintrc.*`/eslintrc config system — see Q5 below. The repo is currently two majors behind (8 → 9 → 10) | [registry.npmjs.org/eslint](https://registry.npmjs.org/eslint); [ESLint v10.0.0 released](https://eslint.org/blog/2026/02/eslint-v10.0.0-released/) (eslint.org, official blog) |
| `zone.js` | **0.16.2** | no declared peerDependencies (it's a leaf runtime dep); Angular 22's peer range accepts both `~0.15.0` and `~0.16.0` | [registry.npmjs.org/zone.js/0.16.2](https://registry.npmjs.org/zone.js/0.16.2) |
| `rxjs` | **7.8.2** | Angular's peer range (`^6.5.3 \|\| ^7.4.0`) is unchanged across v20/21/22, so no forced RxJS major bump is required by Angular itself | [registry.npmjs.org/@angular/core/22.1.1](https://registry.npmjs.org/@angular/core/22.1.1) |
| `jest-preset-angular` | **17.0.0** | peers `@angular/core: ">=20.0.0 <23.0.0"`, `@angular/compiler-cli: ">=20.0.0 <23.0.0"`, `@angular/platform-browser: ">=20.0.0 <23.0.0"`, `jest: "^30.0.0"`, `typescript: ">=5.8"` — **already covers Angular 22** and requires **Jest major 30** (repo currently pins `jest ^29.7.0`) | [registry.npmjs.org/jest-preset-angular/17.0.0](https://registry.npmjs.org/jest-preset-angular/17.0.0) |
| `jest` | **30.4.2** | major jump from repo's `^29.7.0`; required transitively by `jest-preset-angular@17` | [registry.npmjs.org/jest](https://registry.npmjs.org/jest) |
| `cypress` | **15.20.0** | repo pins `^13.15.0`; Nx 23's own release notes (see Q6) bump the `@nx/cypress` integration to Cypress `15.14` specifically for Vite 8 support | [registry.npmjs.org/cypress](https://registry.npmjs.org/cypress); [nx.dev/blog/nx-23-release](https://nx.dev/blog/nx-23-release) |
| `cypress-firebase` | **4.4.0** (2026-06-11) | peers only `firebase-admin: ">=11.0.0"` — repo currently pins a much older `^2.2.5`, a two-major gap | [registry.npmjs.org/cypress-firebase](https://registry.npmjs.org/cypress-firebase) |
| `@angular/fire` | **20.0.1 is still `dist-tags.latest`** | peers `@angular/core: ^20.0.0` and `rxjs: ~7.8.0` — **`@angular/fire` has no stable release supporting Angular 21 or 22.** Its `next`/`canary` dist-tags point at `21.0.0-rc.0`, first published **2025-11-26** and still an RC as of 2026-08-10 (>8 months in release-candidate status, most recent canary build 2026-08-06). This is the single package in this repo's dependency set most clearly lagging the Angular release train. | [registry.npmjs.org/@angular/fire](https://registry.npmjs.org/@angular/fire) (`dist-tags`, `time`) |
| `firebase` | **12.17.1** | major jump from repo's `^10.14.0` (10 → 11 → 12); firebase 11.0.0 released 2024-10-21, firebase 12.0.0 released 2025-07-17 | [registry.npmjs.org/firebase](https://registry.npmjs.org/firebase) |
| `@angular-architects/ddd` | **22.0.0** (2026-06-07) | peers `@angular/core: ^22.0.0`, `@nx/angular: ">=21.7.0 <24.0.0"` — actively tracks Angular's major version and already supports both Angular 22 and Nx 23 | [registry.npmjs.org/@angular-architects/ddd/22.0.0](https://registry.npmjs.org/@angular-architects/ddd/22.0.0) |
| `@nx/angular` | **23.1.1** | peers `@angular/build`/`@schematics/angular`/`@angular-devkit/*`: `">= 20.0.0 < 23.0.0"` — i.e. **Nx 23.1.1 supports Angular 20, 21, and 22, but not yet a hypothetical Angular 23**; also newly peers on `@nx/cypress` and `@nx/playwright` at matching `23.1.1` | [registry.npmjs.org/@nx/angular/23.1.1](https://registry.npmjs.org/@nx/angular/23.1.1) |

**Flagged as lagging / needing attention (facts only, no recommendation):**

- `@angular/fire` — no stable release for Angular 21+; only an 8+ month stale RC exists.
- `@ngrx/store` — latest **stable** release (21.1.1) peers only `@angular/core: ^21.0.0`; Angular-22 support is only in the `22.0.0-rc.0` prerelease as of 2026-08-06.
- `eslint` / `@angular-eslint` — the repo's legacy ESLint 8 + `.eslintrc.json` setup is incompatible with the latest `@angular-eslint` (which requires ESLint 9 or 10).
- `jest` / `jest-preset-angular` / `cypress` / `cypress-firebase` — all sit 1–2 majors behind their respective latest versions.

## 5. Does latest Nx still support legacy `.eslintrc.json`, or does it require flat `eslint.config.js`?

**As of Nx 23.1 (2026-07-15), Nx has moved from "supports both" to actively mandating flat config via its own migration tooling.**

- Nx has supported flat config since v16.8.0, with an automated conversion generator: **`nx generate @nx/eslint:convert-to-flat-config`** (exact command). This generator "converts existing ESLint projects using `@nx/eslint:lint` executor to use `@nx/eslint/plugin`" and rewrites the base `.eslintrc.json`/`.eslintignore`. Source: [nx.dev/technologies/eslint/api/generators/convert-to-flat-config](https://nx.dev/technologies/eslint/api/generators/convert-to-flat-config); guide: [nx.dev/docs/technologies/eslint/guides/flat-config](https://nx.dev/docs/technologies/eslint/guides/flat-config).
- The **Nx 23.1 release notes are explicit**: *"Nx 23.1 drops ESLint v8 and mandates ESLint v9 with typescript-eslint v8. The migration adjusts dropped and modified rules automatically and installs `angular-eslint` when converting Angular projects to flat config."* Source: [nx.dev/blog/nx-23-1-release](https://nx.dev/blog/nx-23-1-release) (Jul 15, 2026).
- Concretely, Nx ships an automatic **migration** as part of `nx migrate --run-migrations` when moving to 23.1.0: `update-23-1-0-convert-to-flat-config`, described in the migration metadata as converting "remaining ESLint configs to flat config for ESLint v9 and keep the workspace lint-passing, disabling rules whose preset defaults changed," with a minimum ESLint version requirement of `>=9.0.0`. Companion migrations `update-23-1-0-remove-removed-typescript-eslint-extension-rules` and `update-23-1-0-migrate-ban-types-rule` handle knock-on `typescript-eslint` v8 rule renames. Source: [nx.dev/docs/technologies/eslint/migrations](https://nx.dev/docs/technologies/eslint/migrations).
- This aligns with upstream ESLint itself: **ESLint v10.0.0 (released 2026-02-06) completely removed the eslintrc config system** — "the CLI no longer supports eslintrc-specific arguments (`--no-eslintrc`, `--env`, `--resolve-plugins-relative-to`, `--rulesdir`, `--ignore-path`), and `.eslintrc.*` and `.eslintignore` files will no longer be honored," and the `ESLINT_USE_FLAT_CONFIG` env var and the `configType: "eslintrc"` Linter option are both gone. Source: [ESLint v10.0.0 released](https://eslint.org/blog/2026/02/eslint-v10.0.0-released/) (eslint.org).

**Net: legacy `.eslintrc.json` is not merely deprecated but actively converted away from by Nx's own 23.1.0 migration, and is unusable at all with ESLint ≥10.** An official codemod exists both as a standalone generator (`nx g @nx/eslint:convert-to-flat-config`) and as an automatic step inside `nx migrate --run-migrations` for the 23.1.0 boundary.

## 6. Other cross-cutting Nx breaking changes (21.3.11 → 23.1.1)

### Nx 22 (released 2025-10-23)

Source: [nx.dev/blog/nx-22-release](https://nx.dev/blog/nx-22-release).

- **Database-backed caching becomes mandatory** — the `NX_DISABLE_DB` environment variable was removed; all workspaces now use database-backed caching unconditionally.
- **`createNodesV2` required** for plugin authors — the older `CreateNodes` (v1) API is deprecated.
- **`useLegacyTypescriptPlugin` now defaults to `false`.**
- **Removed options**: `deleteOutputPath` and `sassImplementation` executor options eliminated (use native build-tool config instead); `simpleName` removed from generators; old framework-specific Storybook generators removed.
- **`nx.json` `release` config restructure**: flat `releaseTag*`-prefixed options are now nested under a `releaseTag` object; the old flat properties "remain supported until Nx 23" (i.e. Nx 22 is a deprecation-with-grace-period step, Nx 23 is where it's finally removed — see below).
- **npm legacy-peer-deps behavior changed**: Nx no longer forces `--legacy-peer-deps`; must be configured explicitly via `.npmrc` if still wanted.
- New inferred-plugin auto-detection added for Storybook (`watch-deps`/`build-deps`), Maven, and .NET — additive, doesn't force this repo's explicit `targetDefaults`/`generators`-based `nx.json` config to change.

### Nx 23.0 (released 2026-06-16 per registry; blog dated 2026-06-17)

Source: [nx.dev/blog/nx-23-release](https://nx.dev/blog/nx-23-release).

- **Node.js**: minimum bumped to **Node 22** (Node 20 dropped to "maintenance"/unsupported).
- **`nx.json` `release` config**: the flat `releaseTagPattern`/`releaseTagPrefix` properties (deprecated-but-supported since Nx 22, see above) are **removed**, fully consolidated into the nested `release.releaseTagPattern` object.
- **New `targetDefaults` spread-token syntax (`...`)**: lets a project-level `targetDefaults` entry *extend* an inherited default instead of wholesale-replacing it — directly relevant to a workspace like this one that leans on explicit `nx.json` `targetDefaults`.
- **Executor-to-plugin migration path formalized**: Jest, Cypress, Playwright, Webpack, Storybook, Remix, Next, and ESLint *executors* are deprecated in favor of *inferred plugins*; the migration command is **`nx g convert-to-inferred`**.
- **Vitest split out**: `@nx/vite`'s Vitest support was spun off into a standalone **`@nx/vitest`** plugin, with an automated migration.
- **Cypress bumped to 15.14** (within the `@nx/cypress` integration) specifically to support Vite 8 component testing.
- **Removed generators/options**: `@nx/angular:ngrx`, `@nx/angular:move`, and the `setup-tailwind` generators across `@nx/angular`/`@nx/react`/`@nx/next` were removed; the `js` option across React/Expo/React-Native/Next component generators was removed (components now always generate TypeScript); deprecated stylesheet options (`styled-jsx`, `styled-module`, etc.) removed across React/Next/Vue/Nuxt generators.
- **Caching/task correctness**: new task **sandboxing** validates declared inputs/outputs and flags undeclared file reads/writes as violations; `@nx/webpack` and `@nx/rollup` now correctly hash the root `tsconfig.json` for cache keys (a cache-correctness fix); new **worktree-aware caching** avoids unnecessary rebuilds when switching git worktrees.
- **Performance**: Nx daemon memory footprint reduced ~7x (1.5GB → ~200MB); large-workspace cache replay improved (17s → 1.16s for 1,110 tasks, per Nx's own benchmark).
- **Nx Agents / Nx Cloud**: claimed "4x faster, 30% cheaper than GitHub Actions" on Nx's internal monorepo benchmarks (self-reported by Nx, no independent source verified here).

### Nx 23.1 (released 2026-07-15)

Source: [nx.dev/blog/nx-23-1-release](https://nx.dev/blog/nx-23-1-release).

- **Angular 19 support dropped** (`nx migrate` handles the version bump automatically as part of the upgrade).
- **Full Angular 22 support added** (Signal Forms stability, OnPush-default components, `@Service` decorator, `injectAsync`, Angular Aria stable).
- **TypeScript 6 compatibility work**: the migration runs a typecheck pass after upgrading (to surface issues during migration rather than later in CI); preserves `esModuleInterop`; restores pre-6 default type-loading behavior; pins `rootDir` on composite `tsconfig` configs. Note: *"TypeScript 7 can run alongside v6 since v7 lacks the programmatic API required by Nx and third-party tools"* — i.e. Nx (and by extension this workspace) cannot move to TS 7 yet regardless of what Angular allows, because Nx's own tooling depends on the TS 6.x-and-earlier programmatic compiler API.
- **ESLint 8 fully dropped, ESLint 9 mandated** (detailed in Q5 above), with an automatic conversion migration (`update-23-1-0-convert-to-flat-config`) that also **installs `angular-eslint`** when converting Angular projects to flat config.
- **`targetDefaults` becomes an ordered array with `filter`**: entries can now be scoped by `filter` to specific plugins/projects/executors, with later array entries overriding earlier ones and unfiltered entries acting as a baseline — a direct, additive enhancement to the exact `nx.json` `targetDefaults` mechanism this repo already uses explicitly (not an inferred-plugin migration forced on this workspace).
- Additional items: 90+ bug fixes; a per-run performance report (duration, cache-hit rate, critical path, recovery recommendations) now shown after every run; mouse support in the Nx terminal UI; upgrade paths for Rspack 2.x, Vite, Expo SDK 56, and Next 14→15.

---

## Sources index (all fetched live 2026-08-10)

- npm registry: `@angular/core`, `@angular/cli`, `@angular/compiler-cli`, `nx`, `@nx/angular`, `@nx/eslint`, `@ngrx/store`, `@angular-eslint/eslint-plugin`, `@typescript-eslint/eslint-plugin`, `eslint`, `zone.js`, `rxjs`, `jest`, `jest-preset-angular`, `cypress`, `cypress-firebase`, `@angular/fire`, `firebase`, `@angular-architects/ddd`, `typescript` — all via `https://registry.npmjs.org/<pkg>[/<version>]`.
- [blog.angular.dev/announcing-angular-v21-57946c34f14b](https://blog.angular.dev/announcing-angular-v21-57946c34f14b)
- [blog.angular.dev/announcing-angular-v22-c52bb83a4664](https://blog.angular.dev/announcing-angular-v22-c52bb83a4664)
- [angular.dev/reference/versions](https://angular.dev/reference/versions)
- [angular.dev/reference/releases](https://angular.dev/reference/releases)
- [angular.dev/update-guide](https://angular.dev/update-guide)
- [devblogs.microsoft.com/typescript/announcing-typescript-6-0](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/)
- [nx.dev/blog/nx-22-release](https://nx.dev/blog/nx-22-release)
- [nx.dev/blog/nx-23-release](https://nx.dev/blog/nx-23-release)
- [nx.dev/blog/nx-23-1-release](https://nx.dev/blog/nx-23-1-release)
- [nx.dev/docs/guides/tips-n-tricks/advanced-update](https://nx.dev/docs/guides/tips-n-tricks/advanced-update)
- [nx.dev/technologies/eslint/api/generators/convert-to-flat-config](https://nx.dev/technologies/eslint/api/generators/convert-to-flat-config)
- [nx.dev/docs/technologies/eslint/guides/flat-config](https://nx.dev/docs/technologies/eslint/guides/flat-config)
- [nx.dev/docs/technologies/eslint/migrations](https://nx.dev/docs/technologies/eslint/migrations)
- [eslint.org/blog/2026/02/eslint-v10.0.0-released](https://eslint.org/blog/2026/02/eslint-v10.0.0-released/)
