import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from '../reducers/auth.reducer';
import { UserInfo } from '../../models';

export const selectAuthState = createFeatureSelector<fromAuth.AuthState>(
  fromAuth.authFeatureKey,
);

export const selectUserInfo = createSelector(
  selectAuthState,
  (state): UserInfo | null => state.user,
);

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state): boolean => Boolean(state.user),
);

export const selectIsLoggedOut = createSelector(
  selectIsLoggedIn,
  (isLoggedIn: boolean): boolean => !isLoggedIn,
);

export const selectPhotoUrl = createSelector(
  selectAuthState,
  (state: fromAuth.AuthState): string | null => state.user?.photoURL ?? null,
);

export const selectDestinationUrl = createSelector(
  selectAuthState,
  (state: fromAuth.AuthState): string => state.destinationURL,
);

export const selectAuthJwtToken = createSelector(
  selectAuthState,
  (state: fromAuth.AuthState): string | null => state.authJwtToken,
);

export const selectIsAdmin = createSelector(
  selectAuthState,
  (state: fromAuth.AuthState): boolean => state.admin,
);
