import { createAction, props } from '@ngrx/store';
import { SETTINGS_ACTIONS_NAMES } from './action-names.enum';
import { WithPayload } from '@fitness-tracker/shared/utils';
import { LanguageCodes } from 'shared-package';

export const languageSelected = createAction(
  SETTINGS_ACTIONS_NAMES.LANGUAGE_SELECTED,
  props<WithPayload<LanguageCodes>>(),
);

export const darkModeChanged = createAction(
  SETTINGS_ACTIONS_NAMES.DARK_MODE_CHANGED,
);

export const languageSelectedSuccess = createAction(
  SETTINGS_ACTIONS_NAMES.LANGUAGE_SELECTED_SUCCESS,
  props<WithPayload<LanguageCodes>>(),
);
