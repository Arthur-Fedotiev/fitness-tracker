import { LANG_CODES } from '../constants/translation.consts';
import { Exercise } from './exercises.interfaces';
export declare type TranslatedData<T> = {
    [Property in keyof T]: {
        [langKey in LanguageCodes]: T[Property];
    };
};
export declare type Translations<T> = {
    [langKey in LanguageCodes]: T;
};
export declare type TranslatedExercise = TranslatedData<Exercise>;
export declare type ExerciseTranslations = Translations<Exercise>;
export declare type extractedKey = keyof TranslatedExercise;
export declare type ExtractedTranslation<P, T extends LanguageCodes> = Translations<P>[T];
export declare type LanguageCodes = typeof LANG_CODES[number];
