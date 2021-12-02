import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from '../reducers/auth.reducer';

export const selectAuthState = createFeatureSelector<fromAuth.AuthState>(
  fromAuth.authFeatureKey
);

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state): boolean => Boolean(state.user),
)

export const selectIsLoggedOut = createSelector(
  selectIsLoggedIn,
  (isLoggedIn: boolean): boolean => !isLoggedIn,
)
