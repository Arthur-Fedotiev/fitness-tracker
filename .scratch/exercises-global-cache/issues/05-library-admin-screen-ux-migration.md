Type: prototype
Status: open
Blocked by: 01

## Question

The exercise library/admin screen (`libs/exercise/feature-display/src/lib/display.component.ts`) currently drives its list via server-side cursor pagination (`findExercisesPaginated`) plus a server-side `targetMuscles array-contains-any` filter. Once the full visible set lives in the global in-memory cache, how should this screen behave?

Specifically resolve, via a rough prototype to react to:

- Does pagination stay (now computed client-side by slicing the in-memory array) or go away entirely in favor of showing/virtual-scrolling the full list, given the dataset is small (31 dev / 128 prod)?
- Does the target-muscle filter move to a client-side computed signal/selector over the cached set?
- Any other server-side query behavior (e.g. `admin`-only queries) that needs a client-side equivalent once this screen reads from the shared global cache instead of issuing its own queries?

## Notes for this ticket

Blocked by Ticket 01 — needs the actual store API shape to prototype against. Use the `/prototype` skill: a cheap, rough, concrete artifact (stub or working code) is more useful here than describing the UX in prose.
