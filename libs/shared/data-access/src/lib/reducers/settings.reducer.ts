import { SettingsState } from '@fitness-tracker/shared/utils';
import { Action, createReducer } from '@ngrx/store';

export const settingsFeatureKey = 'settings';

export const initialState: SettingsState = {
  language: 'en',
};

export const settingsReducerImplicit = createReducer(initialState);

export function settingsReducer(
  state: SettingsState | undefined,
  action: Action,
): SettingsState {
  return settingsReducerImplicit(state, action);
}
