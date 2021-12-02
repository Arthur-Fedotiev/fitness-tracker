import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';
import firebase from 'firebase/compat';
import { WithPayload } from '@fitness-tracker/shared/utils';

export const authFeatureKey = 'auth';

export interface AuthState {
  user: firebase.UserInfo | null;
}

export const initialState: AuthState = {
  user: null,
};

export const reducer = createReducer(
  initialState,

  on(AuthActions.login, state => state),
  on(AuthActions.loginSuccess,
    (state, { payload: user }: WithPayload<firebase.UserInfo | null>) => ({
      ...state,
      user,
    })),
  on(AuthActions.logoutSuccess, (state) => ({ ...state, user: null })),

);
