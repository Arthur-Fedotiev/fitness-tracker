import { FtState } from '@fitness-tracker/shared/utils';
import { ActionReducer, INIT, UPDATE } from '@ngrx/store';
import { LanguageCodes, LANG_CODES } from 'shared-package';

export const languageMetaReducer = (
  reducer: ActionReducer<FtState>,
): ActionReducer<FtState> => {
  return (state, action) => {
    if (action.type === INIT) {
      const language: LanguageCodes | null = localStorage.getItem(
        'language',
      ) as LanguageCodes;
      state =
        language && LANG_CODES.includes(language)
          ? { ...state, settings: { ...state?.settings, language } }
          : state;
    }

    return reducer(state, action);
  };
};
