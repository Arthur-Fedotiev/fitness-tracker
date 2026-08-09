import { createAction } from '@ngrx/store';
import { SETTINGS_ACTIONS_NAMES } from './action-names.enum';

export const darkModeChanged = createAction(
  SETTINGS_ACTIONS_NAMES.DARK_MODE_CHANGED,
);
