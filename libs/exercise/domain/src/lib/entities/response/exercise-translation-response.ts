import { Translations, Exercise, LanguageCodes } from 'shared-package';

type ExerciseTranslatableKeys = keyof Pick<
  Exercise,
  'name' | 'benefits' | 'instructions' | 'longDescription' | 'shortDescription'
>;

export type ExerciseTranslationResponse = Translations<
  Pick<Exercise, ExerciseTranslatableKeys>
>[LanguageCodes];
