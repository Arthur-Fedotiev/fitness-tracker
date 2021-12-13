import * as functions from 'firebase-functions';
import { db } from '../init';

import { firestore } from 'firebase-admin/lib/firestore';
import { COLLECTIONS, LanguageCodes, LANG_CODES } from 'shared-package';

export default async (
    context: functions.EventContext,
): Promise<
  firestore.WriteResult | firestore.WriteResult[] | undefined | void
> => {
  const exerciseId: string = context.params.exerciseId;

  try {
    const batch = db.batch();

    functions.logger.log(
        `Run function for translation collection deletion
        after exercise document with id: ${context.params.exerciseId} was deleted`,
    );

    LANG_CODES.forEach((lang: LanguageCodes) =>
      batch.delete(
          db.doc(
              `${COLLECTIONS.EXERCISES}/${exerciseId}/${COLLECTIONS.TRANSLATIONS}/${lang}`,
          ),
      ),
    );

    return batch.commit();
  } catch (error) {
    functions.logger.debug(
        `Removal of translations failed with error: ${error}`,
    );
  }
};
