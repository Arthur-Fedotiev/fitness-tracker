import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { loginFailure, loginSuccess, logout, setDestinationURL } from '../+state/actions/auth.actions';
import { selectDestinationUrl, selectIsLoggedIn, selectIsLoggedOut, selectPhotoUrl } from '../+state/selectors/auth.selectors';
import { toUserInfo } from '../../utils/functions';
import { UserInfo } from '@fitness-tracker/auth/model'

@Injectable()
export class AuthFacadeService {
  public readonly isLoggedIn$ = this.store.select(selectIsLoggedIn);
  public readonly isLoggedOut$ = this.store.select(selectIsLoggedOut);
  public readonly photoUrl$ = this.store.select(selectPhotoUrl);
  public readonly destinationUrl$ = this.store.select(selectDestinationUrl);

  constructor(private readonly store: Store) { }

  public loggedIn(user: UserInfo | null): void {
    this.store.dispatch(loginSuccess({ payload: toUserInfo(user) }));
  }

  public loginErrored(): void {
    this.store.dispatch(loginFailure())
  }

  public logOut(): void {
    this.store.dispatch(logout())
  }

  public setDestinationURL(payload: string): void {
    this.store.dispatch(setDestinationURL({ payload }))
  }
}
