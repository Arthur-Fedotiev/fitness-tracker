# Project context

## Repository overview

- This is an Nx monorepo for a fitness tracker app.
- The main web app is `apps/fitness-tracker`.
- Shared libs live under `libs/`.
- Firebase-related backend code lives under `functions/`.

## Core domain terms

- `exercise`: a reusable exercise definition used across workouts. Carries no media (no images, no instructional video) — see [ADR-0001](docs/adr/0001-drop-exercise-media.md).
- `workout`: a composed plan of exercises and sets.
- `user`: authenticated app user.
- `create-user`: onboarding flow that provisions a new user profile.

## Working conventions

- Keep changes small and focused.
- Use existing Angular and Nx patterns where possible.
- Prefer tests for new behavior or bug fixes.
- Capture important decisions here when the change affects shared terminology or architecture.
