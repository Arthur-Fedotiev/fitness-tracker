export const LANGUAGES_LABELS_LIST = [
  { value: 'en', label: 'English' },
  { value: 'uk', label: 'Українська' },
  { value: 'pl', label: 'polski' },
] as const;

export const TRANSLATION_ASSET_FORMAT = 'json';
export const LANG_STORAGE_KEY = 'language';

export type Languages = typeof LANGUAGES_LABELS_LIST;
export type Language = (typeof LANGUAGES_LABELS_LIST)[number];
