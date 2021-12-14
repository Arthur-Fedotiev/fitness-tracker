import { state } from '@angular/animations';
import { SettingsState } from '@fitness-tracker/shared/utils';
import { Action, createReducer, on } from '@ngrx/store';
import { languageSelected } from '../../actions/settings.actions';

export const settingsFeatureKey = 'settings';

export const initialState: SettingsState = {
  language: 'en',
};

export const settingsReducerImplicit = createReducer(
  initialState,
  on(languageSelected, (state, { payload: language }) => ({
    ...state,
    language,
  })),
);

export function settingsReducer(
  state: SettingsState | undefined,
  action: Action,
): SettingsState {
  return settingsReducerImplicit(state, action);
}
