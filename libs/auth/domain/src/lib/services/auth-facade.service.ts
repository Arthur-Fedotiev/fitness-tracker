import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  loginFailure,
  loginSuccess,
  logout,
  setDestinationURL,
} from '../application/+state/actions/auth.actions';
import {
  selectAuthJwtToken,
  selectDestinationUrl,
  selectIsAdmin,
  selectIsLoggedIn,
  selectIsLoggedOut,
  selectPhotoUrl,
} from '../application/+state/selectors/auth.selectors';
import { toUserInfo } from '../functions';
import { UserInfo } from '../models';
import { UserDataQuery } from '@fitness-tracker/shared/models';

@Injectable({ providedIn: 'root' })
export class AuthFacadeService implements UserDataQuery {
  public readonly isLoggedIn$ = this.store.select(selectIsLoggedIn);
  public readonly isLoggedOut$ = this.store.select(selectIsLoggedOut);
  public readonly photoUrl$ = this.store.select(selectPhotoUrl);
  public readonly destinationUrl$ = this.store.select(selectDestinationUrl);
  public readonly authJwtToken$ = this.store.select(selectAuthJwtToken);
  public readonly isAdmin$ = this.store.select(selectIsAdmin);

  constructor(private readonly store: Store) {}

  public loggedIn(user: UserInfo | null): void {
    this.store.dispatch(loginSuccess({ payload: toUserInfo(user) }));
  }

  public loginErrored(): void {
    this.store.dispatch(loginFailure());
  }

  public logOut(): void {
    this.store.dispatch(logout());
  }

  public setDestinationURL(payload: string): void {
    this.store.dispatch(setDestinationURL({ payload }));
  }
}
