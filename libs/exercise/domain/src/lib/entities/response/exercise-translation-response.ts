import { Translations, Exercise, LanguageCodes } from 'shared-package';

type ExerciseTranslatableKeys = keyof Pick<Exercise, 'name' | 'instructions'>;

export type ExerciseTranslationResponse = Translations<
  Pick<Exercise, ExerciseTranslatableKeys>
>[LanguageCodes];
