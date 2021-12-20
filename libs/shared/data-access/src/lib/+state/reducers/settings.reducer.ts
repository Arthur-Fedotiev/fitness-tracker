import { APP_LOCALE, Locales } from '@fitness-tracker/shared/utils';
import { Action, createReducer, on } from '@ngrx/store';
import { LanguageCodes } from 'shared-package';
import { darkModeChanged, languageSelected } from '../actions/settings.actions';

export const settingsFeatureKey = 'settings';
export interface SettingsState {
  language: LanguageCodes;
  localeData: Locales | null;
  isDarkMode: boolean;
}

export const initialState: SettingsState = {
  language: 'en',
  localeData: null,
  isDarkMode: false,
};

export const settingsReducerImplicit = createReducer(
  initialState,
  on(languageSelected, (state, { payload: language }) => ({
    ...state,
    language,
    localeData: APP_LOCALE.get(language),
  })),
  on(darkModeChanged, (state) => ({
    ...state,
    isDarkMode: !state.isDarkMode,
  })),
);

export function settingsReducer(
  state: SettingsState | undefined,
  action: Action,
): SettingsState {
  return settingsReducerImplicit(state, action);
}
