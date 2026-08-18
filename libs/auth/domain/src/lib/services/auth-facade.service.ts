import { Injectable, inject } from '@angular/core';
import { UserDataQuery } from '@fitness-tracker/shared/models';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';
import {
  clearAuthError,
  loginFailure,
  loginSuccess,
  loginWithEmail,
  loginWithGoogle,
  logout,
  setDestinationURL,
  signUpWithEmail,
} from '../application/+state/actions/auth.actions';
import {
  selectAuthError,
  selectAuthJwtToken,
  selectDestinationUrl,
  selectIsAdmin,
  selectIsLoggedIn,
  selectIsLoggedOut,
  selectPhotoUrl,
  selectUserInfo,
} from '../application/+state/selectors/auth.selectors';
import { UserInfo } from '../application/models';
import { AuthFormModel } from '../application/models/auth-form.models';
import { toUserInfo } from '../functions';

@Injectable({ providedIn: 'root' })
export class AuthFacadeService implements UserDataQuery {
  private readonly store = inject(Store);

  readonly userInfo = this.store.selectSignal(selectUserInfo);
  readonly isLoggedIn$ = this.store.select(selectIsLoggedIn);
  readonly isLoggedOut$ = this.store.select(selectIsLoggedOut);
  readonly photoUrl$ = this.store.select(selectPhotoUrl);
  readonly destinationUrl$ = this.store.select(selectDestinationUrl);
  readonly authJwtToken$ = this.store.select(selectAuthJwtToken);
  readonly isAdmin$ = this.store.select(selectIsAdmin);
  readonly authError = this.store.selectSignal(selectAuthError);
  readonly userId$ = this.store.select(selectUserInfo).pipe(
    filter(Boolean),
    map((userInfo) => userInfo?.uid),
  );

  loggedIn(user: UserInfo): void {
    this.store.dispatch(loginSuccess({ payload: toUserInfo(user) }));
  }

  loginErrored(payload: string): void {
    this.store.dispatch(loginFailure({ payload }));
  }

  clearAuthError(): void {
    this.store.dispatch(clearAuthError());
  }

  logOut(): void {
    this.store.dispatch(logout());
  }

  setDestinationUrl(payload: string): void {
    this.store.dispatch(setDestinationURL({ payload }));
  }

  loginWithGoogle() {
    this.store.dispatch(loginWithGoogle());
  }

  loginWithEmail(payload: AuthFormModel) {
    this.store.dispatch(loginWithEmail({ payload }));
  }

  signUpWithEmail(payload: AuthFormModel) {
    this.store.dispatch(signUpWithEmail({ payload }));
  }
}
