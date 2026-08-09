# Remove multilanguage support

The app carried two independent translation systems: an `ngx-translate` UI chrome layer (English/Polish/Ukrainian labels via per-lib JSON asset bundles and a settings-bar switcher) and a separate Firestore-backed `Exercise` content pipeline (a `translations` subcollection per exercise, fanned out by two Cloud Function triggers off a manually-supplied, out-of-repo translation step). Neither justified its complexity: the Firestore pipeline threaded a `lang` parameter through nearly every exercise/workout read in the data-access layer and Cloud Functions for content that only ever originated in English, and the UI switcher served a small, low-traffic personal app. We removed both entirely — full `ngx-translate` rip-out, not just deleting the `pl`/`uk` locale files — since leaving a single-locale shell in place would keep the dependency and the abstraction around for a capability we no longer have.

## Consequences

- Existing `exercises/{id}/translations/{lang}` documents are flattened into the exercise doc's `baseData.{name,instructions}` (English only) and the subcollection is deleted by a one-off migration script (mirrors `functions/scripts/lib/migrate-instructions.ts`), run against the dev project then prod — **before** the code that drops the translation read path is deployed.
- `shared-package` (packed from `libs/packages/shared-utils`) loses `LanguageCodes`, `Translations`, `TranslatedData`, and `COLLECTIONS.TRANSLATIONS`; both the root app and `functions/` need to bump to the rebuilt tarball.
- `functions/src/exercises-translation/functions/create-meta-translations.ts` (`setMetaTranslationsBatch`) is deleted as part of this change — it was already dead code, not wired to any trigger in `functions/src/index.ts`.
- If multilanguage support is wanted again later, it isn't a toggle — the data shape, the functions, and the UI machinery all need to be rebuilt from scratch.
