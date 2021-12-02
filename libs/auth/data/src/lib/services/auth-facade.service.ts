import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { loginFailure, loginSuccess, logout } from '../+state/actions/auth.actions';
import { selectIsLoggedIn, selectIsLoggedOut, selectPhotoUrl } from '../+state/selectors/auth.selectors';
import firebase from 'firebase/compat';
import { toUserInfo } from '../../utils/functions';

@Injectable()
export class AuthFacadeService {
  public readonly isLoggedIn$ = this.store.select(selectIsLoggedIn);
  public readonly isLoggedOut$ = this.store.select(selectIsLoggedOut);
  public readonly photoUrl$ = this.store.select(selectPhotoUrl);

  constructor(private readonly store: Store) { }

  public loggedIn(user: firebase.UserInfo | null): void {
    this.store.dispatch(loginSuccess({ payload: toUserInfo(user) }));
  }

  public loginErrored(): void {
    this.store.dispatch(loginFailure())
  }

  public logOut(): void {
    this.store.dispatch(logout())
  }
}
