import { LANG_CODES } from '../constants/translation.consts';
import { Exercise } from './exercises.interfaces';

export type TranslatedData<T> = {
  [Property in keyof T]: { [langKey in LanguageCodes]: T[Property] };
};

export type Translations<T> = {
  [langKey in LanguageCodes]: T;
};

export type TranslatedExercise = TranslatedData<Exercise>;
export type ExerciseTranslations = Translations<Exercise>;
export type extractedKey = keyof TranslatedExercise;

export type ExtractedTranslation<
  P,
  T extends LanguageCodes,
> = Translations<P>[T];

export type LanguageCodes = typeof LANG_CODES[number];
