import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';
import { GLOBAL_PATHS, WithPayload } from '@fitness-tracker/shared/utils';
import { UserInfo } from '@fitness-tracker/auth/model';

export const authFeatureKey = 'auth';

export interface AuthState {
  user: UserInfo | null;
  destinationURL: string;
}

export const initialState: AuthState = {
  user: null,
  destinationURL: GLOBAL_PATHS.EXERCISES_LIST,
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
);
