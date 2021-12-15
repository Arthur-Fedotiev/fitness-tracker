import * as fromSettings from '../reducers/settings.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LanguageCodes } from 'shared-package';
import { ComponentNames, Locales } from '@fitness-tracker/shared/utils';

export const selectSettingsState =
  createFeatureSelector<fromSettings.SettingsState>(
    fromSettings.settingsFeatureKey,
  );

export const selectLanguage = createSelector(
  selectSettingsState,
  (state): LanguageCodes => state.language,
);

export const selectLocaleData = createSelector(
  selectSettingsState,
  ({
      localeData,
    }): ((component: ComponentNames) => Locales[ComponentNames] | null) =>
    (component: ComponentNames): Locales[ComponentNames] | null =>
      localeData && localeData[component],
);
