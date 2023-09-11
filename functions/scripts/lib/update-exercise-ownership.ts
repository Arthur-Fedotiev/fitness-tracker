import * as admin from 'firebase-admin';
import { COLLECTIONS } from 'shared-package';

admin.initializeApp({
  credential: admin.credential.cert('./sa.json'),
});

const db = admin.firestore();

export async function updateExerciseOwnership() {
  try {
    await db.runTransaction(async (transaction) => {
      const exerciseCollectionSnapshot = await transaction.get(
        db.collection(COLLECTIONS.EXERCISES),
      );

      await Promise.all(
        exerciseCollectionSnapshot.docs.map((doc) => {
          const data = doc.data();
          if (
            data.baseData.userId === undefined ||
            data.baseData.admin === undefined
          ) {
            transaction.update(doc.ref, {
              baseData: {
                ...data.baseData,
                userId: null,
                admin: true,
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

updateExerciseOwnership();
