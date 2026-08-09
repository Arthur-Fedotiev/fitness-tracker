import * as admin from 'firebase-admin';
import { COLLECTIONS } from 'shared-package';

const ENGLISH = 'en';
// The 5.2.0 shared-package tarball these scripts depend on predates
// INSTRUCTIONS_DELIMITER's addition to the package, so it's inlined here.
const INSTRUCTIONS_DELIMITER = '___';

const fromTranslatedData = (translatedData: any) => {
  const name = translatedData?.name?.[ENGLISH];
  const instructions = translatedData?.instructions?.[ENGLISH];

  if (!name || !instructions) return null;

  return {
    name,
    instructions: instructions
        .split(INSTRUCTIONS_DELIMITER)
        .map((instruction: string) => instruction.trim()),
  };
};

const certPath = process.argv[2] ?? './sa.json';

admin.initializeApp({
  credential: admin.credential.cert(certPath),
});

const db = admin.firestore();

export async function flattenExerciseTranslations() {
  try {
    await db.runTransaction(async (transaction) => {
      const exercisesSnapshot = await transaction.get(
        db.collection(COLLECTIONS.EXERCISES),
      );

      const translationSnapshots = await Promise.all(
        exercisesSnapshot.docs.map((doc) =>
          transaction.get(doc.ref.collection(COLLECTIONS.TRANSLATIONS)),
        ),
      );

      exercisesSnapshot.docs.forEach((doc, i) => {
        const translationDocs = translationSnapshots[i].docs;
        const englishTranslation = translationDocs.find(
          (translationDoc) => translationDoc.id === ENGLISH,
        );

        const englishContent = englishTranslation
          ? (({ name, instructions }) => ({ name, instructions }))(englishTranslation.data())
          : fromTranslatedData(doc.data().translatedData);

        if (!englishContent) {
          console.warn(`No English content for exercise ${doc.id}, skipping.`);
          return;
        }

        console.log(
            `Flattening exercise ${doc.id}: ${englishContent.name}` +
            (englishTranslation ? '' : ' (recovered from translatedData)'),
        );

        transaction.update(doc.ref, {
          baseData: {
            ...doc.data().baseData,
            ...englishContent,
          },
          translatedData: admin.firestore.FieldValue.delete(),
        });

        translationDocs.forEach((translationDoc) =>
          transaction.delete(translationDoc.ref),
        );
      });
    });

    console.log('done');
  } catch (err) {
    console.error(err);
  }
}

flattenExerciseTranslations();
