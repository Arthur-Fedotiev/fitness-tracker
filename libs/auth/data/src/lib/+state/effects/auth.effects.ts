import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { TokenResult, UserInfo } from '@fitness-tracker/auth/model';

import * as AuthActions from '../actions/auth.actions';
import { AUTH_ACTION_NAMES } from '../models/action-name.enum';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { toUserInfo } from '../../../utils/functions';
import { GLOBAL_PATHS } from '@fitness-tracker/shared/utils';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthEffects {
  public authJwtToken$ = createEffect(() =>
    this.afAuth.idToken.pipe(
      map((authJwtToken: string | null) =>
        AuthActions.setAuthJwtToken({ payload: authJwtToken }),
      ),
    ),
  );

  public authRole$ = createEffect(() =>
    this.afAuth.idTokenResult.pipe(
      tap(console.log),
      map((idTokenResults: TokenResult | null = {} as TokenResult) => ({
        payload: Boolean(idTokenResults?.claims?.admin),
      })),
      map(AuthActions.setAdmin),
    ),
  );

  public authState$ = createEffect(() =>
    this.afAuth.authState.pipe(
      map((user: UserInfo | null) =>
        user
          ? AuthActions.loginSuccess({ payload: toUserInfo(user) })
          : AuthActions.logoutSuccess(),
      ),
    ),
  );

  public logOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AUTH_ACTION_NAMES.LOGOUT),
      tap(() => this.afAuth.signOut()),
      map(() =>
        AuthActions.setDestinationURL({ payload: GLOBAL_PATHS.EXERCISES_LIST }),
      ),
    ),
  );

  public logOutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AUTH_ACTION_NAMES.LOGOUT_SUCCESS),
        tap(() => this.router.navigateByUrl(GLOBAL_PATHS.LOGIN)),
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly store: Store,
    private readonly afAuth: AngularFireAuth,
  ) {}
}
