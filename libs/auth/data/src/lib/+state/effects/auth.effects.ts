import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import firebase from 'firebase/compat';

import * as AuthActions from '../actions/auth.actions';
import { AUTH_ACTION_NAMES } from '../models/action-name.enum';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { toUserInfo } from '../../../utils/functions';
import { GLOBAL_PATHS } from '@fitness-tracker/shared/utils';

@Injectable()
export class AuthEffects {

  public authState$ = createEffect(() =>
    this.afAuth.authState.pipe(
      map((user: firebase.UserInfo | null) => user
        ? AuthActions.loginSuccess({ payload: toUserInfo(user) })
        : AuthActions.logoutSuccess()),
    ))

  public loginSuccessfully$ = createEffect(() => this.actions$.pipe(
    ofType(AUTH_ACTION_NAMES.LOGIN_SUCCESS),
    tap(() => this.router.navigateByUrl(GLOBAL_PATHS.EXERCISES_LIST))
  ), { dispatch: false });

  public logOut$ = createEffect(() => this.actions$.pipe(
    ofType(AUTH_ACTION_NAMES.LOGOUT),
    tap(() => this.afAuth.signOut()),
  ), { dispatch: false });

  public logOutSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AUTH_ACTION_NAMES.LOGOUT_SUCCESS),
    tap(() => this.router.navigateByUrl(GLOBAL_PATHS.LOGIN))
  ), { dispatch: false });

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private afAuth: AngularFireAuth) { }

}
