import { createAction, props } from '@ngrx/store';
import { AUTH_ACTION_NAMES } from '../models/action-name.enum';
import { WithPayload } from '@fitness-tracker/shared/utils';
import { UserInfo } from '../../models';

export const login = createAction(AUTH_ACTION_NAMES.LOGIN);

export const loginSuccess = createAction(
  AUTH_ACTION_NAMES.LOGIN_SUCCESS,
  props<WithPayload<UserInfo | null>>(),
);

export const loginFailure = createAction(AUTH_ACTION_NAMES.LOGIN_FAILURE);

export const logout = createAction(AUTH_ACTION_NAMES.LOGOUT);

export const logoutSuccess = createAction(AUTH_ACTION_NAMES.LOGOUT_SUCCESS);

export const setDestinationURL = createAction(
  AUTH_ACTION_NAMES.SET_DESTINATION_URL,
  props<WithPayload<string>>(),
);

export const setAuthJwtToken = createAction(
  AUTH_ACTION_NAMES.SET_JWT_TOKEN,
  props<WithPayload<string | null>>(),
);

export const setAdmin = createAction(
  AUTH_ACTION_NAMES.SET_ADMIN,
  props<WithPayload<boolean>>(),
);
