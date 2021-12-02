import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, tap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import firebase from 'firebase/compat';

import * as AuthActions from '../actions/auth.actions';
import { AUTH_ACTION_NAMES } from '../models/action-name.enum';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { toUserInfo } from '../../../utils/functions';



@Injectable()
export class AuthEffects {

  public authState$ = createEffect(() =>
    this.afAuth.authState.pipe(
      map((user: firebase.UserInfo | null) => user
        ? AuthActions.loginSuccess({ payload: toUserInfo(user) })
        : AuthActions.logoutSuccess()),
      tap(console.log)
    ))

  public loginSuccessfully$ = createEffect(() => this.actions$.pipe(
    ofType(AUTH_ACTION_NAMES.LOGIN_SUCCESS),
    tap(console.log),
    tap(() => this.router.navigate(['exercises', 'all']))
  ), { dispatch: false });

  public logOut$ = createEffect(() => this.actions$.pipe(
    ofType(AUTH_ACTION_NAMES.LOGOUT),
    tap(console.log),
    tap(() => this.afAuth.signOut()),
  ), { dispatch: false });

  public logOutSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AUTH_ACTION_NAMES.LOGOUT),
    tap(console.log),
    tap(() => this.router.navigate(['auth', 'login']))
  ), { dispatch: false });

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private afAuth: AngularFireAuth) { }

}
