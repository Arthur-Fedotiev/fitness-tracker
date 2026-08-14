# Project context

## Repository overview

- This is an Nx monorepo for a fitness tracker app.
- The main web app is `apps/fitness-tracker`.
- Shared libs live under `libs/`.
- Firebase-related backend code lives under `functions/`.

## Core domain terms

- `exercise`: a reusable exercise definition used across workouts. Carries no media (no images, no instructional video) — see [ADR-0001](docs/adr/0001-drop-exercise-media.md). Content (`name`, `instructions`) is English-only, stored directly on the exercise document — no per-language translation — see [ADR-0002](docs/adr/0002-remove-multilanguage-support.md). Its fields (`name`, `exerciseType`, `targetMuscle`, `equipment`, `instructions`, `userId`, `admin`) sit flat on the document root, not nested under a `baseData` wrapper — see [ADR-0005](docs/adr/0005-flatten-exercise-basedata.md).
- `workout`: a composed plan of exercises and sets.
- `user`: authenticated app user.
- `create-user`: onboarding flow that provisions a new user profile.

## Architecture conventions

- Each domain (`exercise`, `workout`, `program`, ...) is a bounded context — a horizontal slice that exposes as little as possible to the others. Cross-domain consumption happens only through a domain's `<domain>/public-api` lib; a domain never reaches directly into another domain's `domain`, `ui-components`, or `feature-*` libs.
- This boundary is lint-enforced, not just conventional: `@nx/enforce-module-boundaries`'s `domain:*` tag constraints in `.eslintrc.json` restrict each domain to itself, `domain:shared`, and the other domains' `*/api-public` tags.
- A domain's public-api never re-exports its whole facade. Each capability another domain needs is its own narrow Query or Command interface (e.g. `OpenExerciseDetailsDialogCommand`) with its own `InjectionToken`, wired to the concrete facade via `useExisting` in that domain's `_DOMAIN_PROVIDERS`. Consumers inject the narrow token, never the facade class — Interface Segregation Principle applied at the public-api seam, matching the pre-existing `ExerciseDetailsQuery`/`LoadExerciseDetailsCommand`-style pattern in `libs/exercise/domain/src/lib/entities`.

## Working conventions

- Keep changes small and focused.
- Use existing Angular and Nx patterns where possible.
- Prefer tests for new behavior or bug fixes.
- Capture important decisions here when the change affects shared terminology or architecture.
