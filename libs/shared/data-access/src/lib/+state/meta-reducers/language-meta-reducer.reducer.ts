import { Action, ActionReducer, INIT } from '@ngrx/store';
import { LanguageCodes } from 'shared-package';
import { FtState } from '../reducers/app.reduce-map';
import {
  LanguagesISO,
  LANG_STORAGE_KEY,
} from '@fitness-tracker/shared/i18n/utils';

export const languageMetaReducer = (
  reducer: ActionReducer<FtState>,
): ActionReducer<FtState> => {
  return (state: FtState | undefined, action: Action) => {
    if (action.type === INIT) {
      const language: LanguageCodes = (localStorage.getItem(LANG_STORAGE_KEY) ??
        LanguagesISO.DEFAULT) as LanguageCodes;

      state = state
        ? {
            ...state,
            settings: {
              ...state.settings,
              language,
            },
          }
        : ({ settings: { language } } as FtState);
    }

    return reducer(state, action);
  };
};
