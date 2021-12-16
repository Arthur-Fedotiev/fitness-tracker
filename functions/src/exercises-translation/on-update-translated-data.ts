import * as functions from 'firebase-functions';
import { db } from '../init';

import { firestore } from 'firebase-admin/lib/firestore';
import {
  COLLECTIONS,
  TranslatedData,
  Exercise,
  LanguageCodes,
  LANG_CODES,
  Translations,
  mapTranslatedData,
} from 'shared-package';

export default async (
    change: functions.Change<functions.firestore.QueryDocumentSnapshot>,
    context: functions.EventContext,
): Promise<
  firestore.WriteResult | firestore.WriteResult[] | undefined | void
> => {
  functions.logger.log(
      `Running update exercise trigger for exerciseId ${context.params.exerciseId}`,
  );

  const exerciseId: string = context.params.exerciseId;
  const newTranslatedData: TranslatedData<Exercise> | undefined =
    change.after.data().translatedData;

  if (!newTranslatedData) return;

  try {
    functions.logger.log(
        ` Run translation collection updates for exercise with id ${context.params.exerciseId}`,
    );
    const translations: Translations<Exercise> =
      mapTranslatedData<Exercise>(newTranslatedData);
    const exerciseRef = db.doc(`${COLLECTIONS.EXERCISES}/${exerciseId}`);

    functions.logger.log(`translations ${JSON.stringify(translations)}`);

    const batch: firestore.WriteBatch = db.batch();
    const langRefs: ReadonlyArray<
      [firestore.DocumentReference<firestore.DocumentData>, LanguageCodes]
    > = LANG_CODES.map((langKey: LanguageCodes) => [
      db.doc(
          `${COLLECTIONS.EXERCISES}/${exerciseId}/${COLLECTIONS.TRANSLATIONS}/${langKey}`,
      ),
      langKey,
    ]);

    langRefs.forEach(
        ([langRef, langKey]: [
        firestore.DocumentReference<firestore.DocumentData>,
        LanguageCodes,
      ]) =>
          batch.set(langRef, translations[langKey], {
            merge: true,
          }),
    );

    batch.update(exerciseRef, { translatedData: null });

    functions.logger.log(
        `Updated translation is ${translations}. Intermediary translated data removed.`,
    );

    return batch.commit();
  } catch (error) {
    functions.logger.debug(`Updated translations failed with error: ${error}`);
  }
};
