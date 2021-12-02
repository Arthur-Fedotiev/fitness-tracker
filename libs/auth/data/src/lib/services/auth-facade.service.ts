import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { login, loginSuccess, logout } from '../+state/actions/auth.actions';
import { selectIsLoggedIn, selectIsLoggedOut } from '../+state/selectors/auth.selectors';
import firebase from 'firebase/compat';
import { toUserInfo } from '../../utils/functions';

@Injectable()
export class AuthFacadeService {
  public readonly isLoggedIn$ = this.store.select(selectIsLoggedIn)
  public readonly isLoggedOut$ = this.store.select(selectIsLoggedOut)

  constructor(private readonly store: Store) { }

  public loggedIn(user: firebase.UserInfo | null): void {
    this.store.dispatch(loginSuccess({ payload: toUserInfo(user) }));
  }

  public logOut(): void {
    this.store.dispatch(logout())
  }
}
