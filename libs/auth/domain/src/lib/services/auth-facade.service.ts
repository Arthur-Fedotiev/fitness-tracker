import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  loginFailure,
  loginSuccess,
  logout,
  setDestinationURL,
  loginWithGoogle,
  loginWithEmail,
  signUpWithEmail,
} from '../application/+state/actions/auth.actions';
import {
  selectAuthJwtToken,
  selectDestinationUrl,
  selectIsAdmin,
  selectIsLoggedIn,
  selectIsLoggedOut,
  selectPhotoUrl,
  selectUserInfo,
} from '../application/+state/selectors/auth.selectors';
import { toUserInfo } from '../functions';
import { UserDataQuery } from '@fitness-tracker/shared/models';
import { UserInfo } from '../application/models';
import { AuthFormModel } from '../application/models/auth-form.models';
import { filter, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthFacadeService implements UserDataQuery {
  readonly userInfo = this.store.selectSignal(selectUserInfo);
  readonly isLoggedIn$ = this.store.select(selectIsLoggedIn);
  readonly isLoggedOut$ = this.store.select(selectIsLoggedOut);
  readonly photoUrl$ = this.store.select(selectPhotoUrl);
  readonly destinationUrl$ = this.store.select(selectDestinationUrl);
  readonly authJwtToken$ = this.store.select(selectAuthJwtToken);
  readonly isAdmin$ = this.store.select(selectIsAdmin);
  readonly userId$ = this.store.select(selectUserInfo).pipe(
    filter(Boolean),
    map((userInfo) => userInfo?.uid),
  );

  constructor(private readonly store: Store) {}

  loggedIn(user: UserInfo): void {
    this.store.dispatch(loginSuccess({ payload: toUserInfo(user) }));
  }

  loginErrored(): void {
    this.store.dispatch(loginFailure());
  }

  logOut(): void {
    this.store.dispatch(logout());
  }

  setDestinationURL(payload: string): void {
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
