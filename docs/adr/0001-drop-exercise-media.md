# Drop media from Exercise

`Exercise` used to carry a primary and secondary image (`avatarUrl`/`avatarSecondaryUrl`, shown on the exercise card and a couple of other card renderings) and an instructional video (`instructionVideo`, shown in the exercise details dialog). All three were sourced by a manual script that scrapes a third-party site and writes straight to prod Firestore. As part of simplifying the codebase, we removed all three end-to-end — domain model, DTOs, forms, mappers, the scraper, and every rendering site — rather than just hiding the `<img>`/`<video>` tags in templates, since leaving the fields live in the model/forms/scraper would have kept the complexity this change was meant to remove.

Values already stored on existing Firestore documents were left in place as inert, unread fields rather than migrated out, since a migration would be a production write with no functional upside once nothing reads those fields.

## Consequences

- `Workout.avatarUrl` (a workout's own cover image, `WorkoutBasicInfo.avatarUrl`) is a distinct field on a different entity and was **not** touched by this decision, despite the shared name.
- `ImgFallbackDirective` (`ftWithFallback`) and its non-exercise fallback constants stay — they're also used by `workout-preview.component`.
