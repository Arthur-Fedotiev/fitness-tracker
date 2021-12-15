import {
  APP_LOCALE,
  LanguagesISO,
  LANG_STORAGE_KEY,
} from '@fitness-tracker/shared/utils';
import { Action, ActionReducer, INIT } from '@ngrx/store';
import { LanguageCodes } from 'shared-package';
import { FtState } from '../reducers/app.reduce-map';

export const languageMetaReducer = (
  reducer: ActionReducer<FtState>,
): ActionReducer<FtState> => {
  return (state: FtState | undefined, action: Action) => {
    if (action.type === INIT) {
      const languageStored: LanguageCodes = (localStorage.getItem(
        LANG_STORAGE_KEY,
      ) ?? LanguagesISO.DEFAULT) as LanguageCodes;
      const language: LanguageCodes = APP_LOCALE.has(languageStored)
        ? languageStored
        : LanguagesISO.DEFAULT;

      const localeData = APP_LOCALE.get(language);

      state = { settings: { language, localeData } };
    }

    return reducer(state, action);
  };
};
