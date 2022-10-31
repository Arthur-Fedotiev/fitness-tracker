import * as admin from 'firebase-admin';
import { LanguageCodes, LANG_CODES, Translations } from 'shared-package';
import { db } from '../../init';

export const setMetaTranslationsBatch = (
    translations: Translations<any>,
    batch: admin.firestore.WriteBatch,
    collectionName: string,
    nameList: ReadonlyArray<string>,
): void => {
  const refs: ReadonlyArray<[admin.firestore.DocumentReference<admin.firestore.DocumentData>, LanguageCodes]> =
    LANG_CODES.map((langKey: LanguageCodes) => [
      db.doc(`${collectionName}/${langKey}`),
      langKey,
    ]);

  const metaTranslations = LANG_CODES.reduce(
      (acc: any, lang: LanguageCodes) => {
        acc[lang] = translations[lang].benefits
            .split('---')
            .reduce((acc: any, benefitString: string, i: number) => {
              acc[nameList[i]] = benefitString;

              return acc;
            }, {} as any);

        return acc;
      },
      {},
  );

  refs.forEach(([typeRef, langKey]) =>
    batch.set(typeRef, metaTranslations[langKey]),
  );
};
