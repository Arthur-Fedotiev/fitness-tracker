import * as fromSettings from '../reducers/settings.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LanguageCodes } from 'shared-package';

export const selectSettingsState =
  createFeatureSelector<fromSettings.SettingsState>(
    fromSettings.settingsFeatureKey,
  );

export const selectLanguage = createSelector(
  selectSettingsState,
  (state): LanguageCodes => state.language,
);

export const selectIsDarkMode = createSelector(
  selectSettingsState,
  (state): boolean => state.isDarkMode,
);
