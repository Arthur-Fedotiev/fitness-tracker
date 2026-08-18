import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';
import { GLOBAL_PATHS, WithPayload } from '@fitness-tracker/shared/utils';
import { UserInfo } from '../../models';
export const authFeatureKey = 'auth';

export interface AuthState {
  user: UserInfo | null;
  destinationURL: string;
  authJwtToken: string | null;
  admin: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  admin: false,
  destinationURL: GLOBAL_PATHS.DEFAULT_LANDING,
  authJwtToken: null,
  error: null,
};

export const reducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => state),
  on(
    AuthActions.loginSuccess,
    (state, { payload: user }: WithPayload<UserInfo>) => ({
      ...state,
      user,
      error: null,
    }),
  ),
  // Starting a fresh attempt clears whatever the last one reported.
  on(
    AuthActions.loginWithGoogle,
    AuthActions.loginWithEmail,
    AuthActions.signUpWithEmail,
    AuthActions.clearAuthError,
    (state) => ({ ...state, error: null }),
  ),
  on(
    AuthActions.loginFailure,
    AuthActions.loginWithGoogleFailure,
    AuthActions.loginWithEmailFailure,
    AuthActions.signUpWithEmailFailure,
    (state, { payload: error }: WithPayload<string>) => ({ ...state, error }),
  ),
  on(AuthActions.logoutSuccess, (state) => ({ ...state, user: null })),
  on(AuthActions.setDestinationURL, (state, { payload: destinationURL }) => ({
    ...state,
    destinationURL,
  })),
  on(AuthActions.setAuthJwtToken, (state, { payload: authJwtToken }) => ({
    ...state,
    authJwtToken,
  })),
  on(AuthActions.setAdmin, (state, { payload: admin }) => ({
    ...state,
    admin,
  })),
);
