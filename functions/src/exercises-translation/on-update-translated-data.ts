import { logger, Change, firestore, EventContext } from 'firebase-functions';
import { db } from '../init';

import * as admin from 'firebase-admin';
import {
  COLLECTIONS,
  TranslatedData,
  Exercise,
  LanguageCodes,
  LANG_CODES,
  Translations,
  mapTranslatedData,
} from 'shared-package';
import { instructionsTransformer } from './functions/mappers/instructions.transformer';

export default async (
    change: Change<firestore.QueryDocumentSnapshot>,
    context: EventContext,
): Promise<
  admin.firestore.WriteResult | admin.firestore.WriteResult[] | undefined | void
> => {
  logger.log(
      `Running update exercise trigger for exerciseId ${context.params.exerciseId}`,
  );

  const exerciseId: string = context.params.exerciseId;
  const newTranslatedData: TranslatedData<Exercise> | undefined =
    change.after.data().translatedData;

  if (!newTranslatedData) return;

  try {
    logger.log(
        ` Run translation collection updates for exercise with id ${context.params.exerciseId}`,
    );
    const translations: Translations<Exercise> = mapTranslatedData<Exercise>(
        newTranslatedData,
        {
          instructions: instructionsTransformer,
        },
    );
    const exerciseRef = db.doc(`${COLLECTIONS.EXERCISES}/${exerciseId}`);

    logger.log(`translations ${JSON.stringify(translations)}`);

    const batch: admin.firestore.WriteBatch = db.batch();
    const langRefs: ReadonlyArray<
      [
        admin.firestore.DocumentReference<admin.firestore.DocumentData>,
        LanguageCodes,
      ]
    > = LANG_CODES.map((langKey: LanguageCodes) => [
      db.doc(
          `${COLLECTIONS.EXERCISES}/${exerciseId}/${COLLECTIONS.TRANSLATIONS}/${langKey}`,
      ),
      langKey,
    ]);

    langRefs.forEach(
        ([langRef, langKey]: [
        admin.firestore.DocumentReference<admin.firestore.DocumentData>,
        LanguageCodes,
      ]) =>
          batch.set(langRef, translations[langKey], {
            merge: true,
          }),
    );

    batch.update(exerciseRef, { translatedData: null });

    logger.log(
        `Updated translation is ${translations}. Intermediary translated data removed.`,
    );

    return batch.commit();
  } catch (error) {
    logger.debug(`Updated translations failed with error: ${error}`);
  }
};
