import * as fromSettings from '../reducers/settings.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectSettingsState =
  createFeatureSelector<fromSettings.SettingsState>(
    fromSettings.settingsFeatureKey,
  );

export const selectIsDarkMode = createSelector(
  selectSettingsState,
  (state): boolean => state.isDarkMode,
);
