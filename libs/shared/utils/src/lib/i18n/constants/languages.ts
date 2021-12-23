export const LANGUAGES_LABELS_LIST = [
  { value: 'en', label: 'English' },
  { value: 'it', label: 'Italiano' },
  { value: 'ru', label: 'Русский' },
  { value: 'uk', label: 'Українська' },
  { value: 'be', label: 'Беларуская' },
  { value: 'nl', label: 'Nederlands' },
  { value: 'fr', label: 'français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'pl', label: 'polski' },
  { value: 'pt', label: 'Português' },
  { value: 'es', label: 'español' },
] as const;

export const TRANSLATION_ASSET_FORMAT = 'json';
export const LANG_STORAGE_KEY = 'language';

export type Languages = typeof LANGUAGES_LABELS_LIST;
export type Language = typeof LANGUAGES_LABELS_LIST[number];
