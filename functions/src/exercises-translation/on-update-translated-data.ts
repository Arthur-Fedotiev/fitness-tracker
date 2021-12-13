/* eslint-disable @typescript-eslint/no-unused-vars */
import * as functions from 'firebase-functions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as _ from 'lodash';

import { db } from '../init';

import { firestore } from 'firebase-admin/lib/firestore';
// import FieldValue = firestore.FieldValue;
import {
  Exercise,
  LanguageCodes,
  LANG_CODES,
  TranslatedData,
  Translations,
} from './models/exercises-translations.interface';
import { mapTranslatedData } from './functions/mapTranslatedData';

export default async (
    change: functions.Change<functions.firestore.QueryDocumentSnapshot>,
    context: functions.EventContext,
): Promise<
  firestore.WriteResult | firestore.WriteResult[] | undefined | void
> => {
  functions.logger.debug(
      `Running update exercise trigger for exerciseId ${context.params.exerciseId}`,
  );

  const exerciseId: string = context.params.exerciseId;
  const newTranslatedData: TranslatedData<Exercise> | undefined =
    change.after.data().translatedData;
  const oldTranslatedData: TranslatedData<Exercise> | undefined =
    change.before.data().translatedData;

  try {
    if (_.isEqual(newTranslatedData, oldTranslatedData)) return;

    if (!newTranslatedData && oldTranslatedData) {
      functions.logger.log(
          `New translated data is empty.
      For exercise with id ${context.params.exerciseId} translation data clean-up is being performed`,
      );

      const batch = db.batch();

      for (const lang of LANG_CODES) {
        const langRef = db.doc(`exercises/${exerciseId}/translations/${lang}`);

        batch.delete(langRef);
      }

      return batch.commit();
    }

    if (newTranslatedData) {
      functions.logger.log(
          ` Run translation collection updates for exercise with id ${context.params.exerciseId}`,
      );
      const translations: Translations<Exercise> =
        mapTranslatedData<Exercise>(newTranslatedData);

      functions.logger.log(`translations ${JSON.stringify(translations)}`);

      // const exerciseTranslatedKeys = Object.keys(newTranslatedData);
      const batch = db.batch();
      const langRefs: [
        firestore.DocumentReference<firestore.DocumentData>,
        LanguageCodes,
      ][] = LANG_CODES.map((langKey: LanguageCodes) => [
        db.doc(`exercises/${exerciseId}/translations/${langKey}`),
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

      functions.logger.log(`Updated translation is ${translations}`);

      return batch.commit();
    }
  } catch (error) {
    functions.logger.debug(`Updated translations failed with error: ${error}`);
  }
};
