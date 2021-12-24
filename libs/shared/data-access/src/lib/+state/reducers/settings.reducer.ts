import { Action, createReducer, on } from '@ngrx/store';
import { LanguageCodes } from 'shared-package';
import { darkModeChanged, languageSelected } from '../actions/settings.actions';

export const settingsFeatureKey = 'settings';
export interface SettingsState {
  language: LanguageCodes;
  isDarkMode: boolean;
}

export const initialState: SettingsState = {
  language: 'en',
  isDarkMode: false,
};

export const settingsReducerImplicit = createReducer(
  initialState,
  on(languageSelected, (state, { payload: language }) => ({
    ...state,
    language,
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
