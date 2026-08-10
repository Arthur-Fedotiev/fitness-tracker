import * as admin from 'firebase-admin';
import { COLLECTIONS } from 'shared-package';

// Read-only survey. Does not write, update, or delete anything.
const certPath = process.argv[2] ?? './sa.json';

admin.initializeApp({
  credential: admin.credential.cert(certPath),
});

const db = admin.firestore();

/**
 * Read-only audit of the `exercises` collection's legacy translation shapes.
 *
 * Written to de-risk the ADR-0002 (remove multilanguage support) deploy: the
 * app reads `baseData.name`/`baseData.instructions` directly, but
 * `flatten-exercise-translations.ts` only recovers content from a
 * `translations` subcollection or a `translatedData` field — and in
 * practice neither ever matched live data. Some documents instead carry an
 * even older `translatableData` field that script never looks at. This
 * reports, per document, which shapes are actually present, so a deploy can
 * be confirmed safe (or a real gap found and patched) before it ships.
 *
 * Usage: `node dist/lib/survey-exercise-shapes.js <path-to-service-account-json>`
 * Every call is `.get()` — makes no writes.
 */
async function surveyExerciseShapes() {
  const exercisesSnapshot = await db.collection(COLLECTIONS.EXERCISES).get();

  let total = 0;
  let hasSubcollection = 0;
  let hasTranslatedData = 0;
  let hasTranslatableData = 0;
  let baseDataComplete = 0;
  let baseDataMissingName = 0;
  let baseDataMissingInstructions = 0;
  let noRecoverableContent = 0;

  const incompleteIds: string[] = [];

  for (const doc of exercisesSnapshot.docs) {
    total++;
    const data: any = doc.data();
    const baseData = data.baseData ?? {};

    const translationsSnap = await doc.ref.collection(COLLECTIONS.TRANSLATIONS).get();
    const hasSubcollectionDocs = !translationsSnap.empty;
    if (hasSubcollectionDocs) hasSubcollection++;

    if (data.translatedData != null) hasTranslatedData++;
    if (data.translatableData != null) hasTranslatableData++;

    const hasName = typeof baseData.name === 'string' && baseData.name.length > 0;
    const hasInstructions = Array.isArray(baseData.instructions) && baseData.instructions.length > 0;

    if (hasName && hasInstructions) {
      baseDataComplete++;
    } else {
      if (!hasName) baseDataMissingName++;
      if (!hasInstructions) baseDataMissingInstructions++;

      const recoverableFromScript = hasSubcollectionDocs || Boolean(data.translatedData?.name?.en);
      if (!recoverableFromScript) noRecoverableContent++;

      incompleteIds.push(
        `${doc.id} — name:${hasName} instructions:${hasInstructions} subcollection:${hasSubcollectionDocs} translatedData:${data.translatedData != null} translatableData:${data.translatableData != null}`,
      );
    }
  }

  console.log('--- Incomplete docs ---');
  incompleteIds.forEach((line) => console.log(line));

  console.log('\n--- Survey summary ---');
  console.log(
    JSON.stringify(
      {
        total,
        hasSubcollection,
        hasTranslatedData,
        hasTranslatableData,
        baseDataComplete,
        baseDataMissingName,
        baseDataMissingInstructions,
        noRecoverableContent,
      },
      null,
      2,
    ),
  );
}

surveyExerciseShapes()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
