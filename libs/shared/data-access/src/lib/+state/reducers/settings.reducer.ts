import { APP_LOCALE, Locales } from '@fitness-tracker/shared/utils';
import { Action, createReducer, on } from '@ngrx/store';
import { LanguageCodes } from 'shared-package';
import { languageSelected } from '../actions/settings.actions';

export const settingsFeatureKey = 'settings';
export interface SettingsState {
  language: LanguageCodes;
  localeData: Locales | null;
}

export const initialState: SettingsState = {
  language: 'en',
  localeData: null,
};

export const settingsReducerImplicit = createReducer(
  initialState,
  on(languageSelected, (state, { payload: language }) => ({
    ...state,
    language,
    localeData: APP_LOCALE.get(language),
  })),
);

export function settingsReducer(
  state: SettingsState | undefined,
  action: Action,
): SettingsState {
  return settingsReducerImplicit(state, action);
}
