import { createAction, props } from '@ngrx/store';
import { AUTH_ACTION_NAMES } from '../models/action-name.enum';
import { WithPayload } from '@fitness-tracker/shared/utils';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure } from 'firebaseui-angular';
import firebase from 'firebase/compat';

export const login = createAction(
  AUTH_ACTION_NAMES.LOGIN
);

export const loginSuccess = createAction(
  AUTH_ACTION_NAMES.LOGIN_SUCCESS,
  props<WithPayload<firebase.UserInfo | null>>()
);

export const loginFailure = createAction(
  AUTH_ACTION_NAMES.LOGIN_FAILURE,
);

export const logout = createAction(
  AUTH_ACTION_NAMES.LOGOUT
);

export const logoutSuccess = createAction(
  AUTH_ACTION_NAMES.LOGOUT_SUCCESS
);
