import { LANG_CODES } from '../constants/translation.consts';
import {
  LanguageCodes,
  TranslatedData,
  Translations,
} from '../models/translation.interfaces';

const identity = <T>(data: T): T => data;

const extractDataForLangCode =
  <T>(
    langCode: LanguageCodes,
    data: TranslatedData<T>,
    transformersMap: Partial<Record<keyof T, (data: any) => any>> = {},
  ) =>
  (acc: T, translatedKey: keyof T): T => {
    const transformer = transformersMap[translatedKey] ?? identity;
    acc[translatedKey] = transformer(data[translatedKey][langCode]);

    return acc;
  };

export const mapTranslatedData = <T extends object>(
  data: TranslatedData<T>,
  transformersMap: Partial<Record<keyof T, (data: any) => any>> = {},
): Translations<T> => {
  const translatedKeys = Object.keys(data) as (keyof T)[];

  return LANG_CODES.reduce((acc: Translations<T>, langCode: LanguageCodes) => {
    acc[langCode] = translatedKeys.reduce(
      extractDataForLangCode<T>(langCode, data, transformersMap),
      {} as T,
    );

    return acc;
  }, {} as Translations<T>);
};
