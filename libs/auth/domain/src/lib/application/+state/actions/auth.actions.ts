import { createAction, props } from '@ngrx/store';
import { AUTH_ACTION_NAMES } from '../models/action-name.enum';
import { WithPayload } from '@fitness-tracker/shared/utils';
import { AuthFormModel, UserInfo } from '../../models';

export const login = createAction(AUTH_ACTION_NAMES.LOGIN);

export const loginSuccess = createAction(
  AUTH_ACTION_NAMES.LOGIN_SUCCESS,
  props<WithPayload<UserInfo>>(),
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

export const loginWithGoogle = createAction(
  AUTH_ACTION_NAMES.LOGIN_WITH_GOOGLE,
);

export const loginWithGoogleSuccess = createAction(
  AUTH_ACTION_NAMES.LOGIN_WITH_GOOGLE_SUCCESS,
);

export const loginWithGoogleFailure = createAction(
  AUTH_ACTION_NAMES.LOGIN_WITH_GOOGLE_FAILURE,
);

export const loginWithEmail = createAction(
  AUTH_ACTION_NAMES.LOGIN_WITH_EMAIL,
  props<WithPayload<AuthFormModel>>(),
);

export const loginWithEmailSuccess = createAction(
  AUTH_ACTION_NAMES.LOGIN_WITH_EMAIL_SUCCESS,
);

export const loginWithEmailFailure = createAction(
  AUTH_ACTION_NAMES.LOGIN_WITH_EMAIL_FAILURE,
);

export const signUpWithEmail = createAction(
  AUTH_ACTION_NAMES.SIGN_UP_WITH_EMAIL,
  props<WithPayload<AuthFormModel>>(),
);

export const signUpWithEmailSuccess = createAction(
  AUTH_ACTION_NAMES.SIGN_UP_WITH_EMAIL_SUCCESS,
);

export const signUpWithEmailFailure = createAction(
  AUTH_ACTION_NAMES.SIGN_UP_WITH_EMAIL_FAILURE,
);
