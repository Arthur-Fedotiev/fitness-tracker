import { Action, createReducer, on } from '@ngrx/store';
import { darkModeChanged } from '../actions/settings.actions';

export const settingsFeatureKey = 'settings';
export interface SettingsState {
  isDarkMode: boolean;
}

export const initialState: SettingsState = {
  isDarkMode: true,
};

export const settingsReducerImplicit = createReducer(
  initialState,
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
