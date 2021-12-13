import {
  LanguageCodes,
  LANG_CODES,
  TranslatedData,
  Translations,
} from '../models/exercises-translations.interface';

const extractDataForLangCode =
  <T>(langCode: LanguageCodes, data: TranslatedData<T>) =>
    (acc: T, translatedKey: keyof T): T => {
      acc[translatedKey] = data[translatedKey][langCode];

      return acc;
    };

// eslint-disable-next-line @typescript-eslint/ban-types
export const mapTranslatedData = <T extends object>(
  data: TranslatedData<T>,
): Translations<T> => {
  const translatedKeys = Object.keys(data) as (keyof T)[];

  return LANG_CODES.reduce((acc: Translations<T>, langCode: LanguageCodes) => {
    acc[langCode] = translatedKeys.reduce(
        extractDataForLangCode<T>(langCode, data),
      {} as T,
    );

    return acc;
  }, {} as Translations<T>);
};
