import * as admin from 'firebase-admin';
import { COLLECTIONS } from 'shared-package';

admin.initializeApp({
  credential: admin.credential.cert('./sa.json'),
});

const db = admin.firestore();

export async function migrateInstructions() {
  try {
    await db.runTransaction(async (transaction) => {
      const exerciseCollectionSnapshot = await transaction.get(
        db.collection(COLLECTIONS.EXERCISES),
      );

      await Promise.all(
        exerciseCollectionSnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log(data.translatableData.instructions);

          if (typeof data.translatableData.instructions === 'string') {
            // split buy number and dot, trim
            const instructions = (data.translatableData.instructions as string)
              .split(/\d+\./)
              .map((instruction) => instruction.trim())
              .filter((instruction) => instruction.length > 0);

            transaction.update(doc.ref, {
              translatableData: {
                ...data.translatableData,
                instructions,
              },
            });
          }
        }),
      );
    });

    console.log('done');
  } catch (err) {
    console.error(err);
  }
}

migrateInstructions();
