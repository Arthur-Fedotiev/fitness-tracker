export const LANG_CODES = [
  'en',
  'ru',
  'uk',
  'be',
  'nl',
  'fr',
  'de',
  'it',
  'pl',
  'pt',
  'es',
] as const;

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

export interface Exercise {
  name: string;
  exerciseType: string;
  targetMuscle: string;
  equipment: string;
  rating: number;
  avatarUrl: string;
  coverUrl: string;
  shortDescription: string;
  longDescription: string;
  instructions: string[];
  benefits: string[];
}

export type LanguageCodes = typeof LANG_CODES[number];
