import { en, ru } from '..';
import { LanguagesISO } from '../models/lang-iso';

export const APP_LOCALE = new Map()
  .set(LanguagesISO.ENGLISH, en)
  .set(LanguagesISO.RUSSIAN, ru)
  .set(LanguagesISO.DEFAULT, en);
