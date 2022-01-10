import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';
import { GLOBAL_PATHS, WithPayload } from '@fitness-tracker/shared/utils';
import { UserInfo } from '@fitness-tracker/auth/model';

export const authFeatureKey = 'auth';

export interface AuthState {
  user: UserInfo | null;
  destinationURL: string;
  authJwtToken: string | null;
  admin: boolean;
}

export const initialState: AuthState = {
  user: null,
  admin: false,
  destinationURL: GLOBAL_PATHS.EXERCISES_LIST,
  authJwtToken: null,
};

export const reducer = createReducer(
  initialState,
  on(AuthActions.login, state => state),
  on(AuthActions.loginSuccess,
    (state, { payload: user }: WithPayload<UserInfo | null>) => ({
      ...state,
      user,
    })),
  on(AuthActions.logoutSuccess, (state) => ({ ...state, user: null })),
  on(AuthActions.setDestinationURL, (state, { payload: destinationURL }) => ({ ...state, destinationURL })),
  on(AuthActions.setAuthJwtToken, (state, { payload: authJwtToken }) => ({ ...state, authJwtToken })),
  on(AuthActions.setAdmin, (state, { payload: admin }) => ({ ...state, admin })),
);
