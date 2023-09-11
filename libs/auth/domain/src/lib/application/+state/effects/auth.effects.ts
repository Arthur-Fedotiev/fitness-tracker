import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, tap, first, withLatestFrom } from 'rxjs/operators';
import * as AuthActions from '../actions/auth.actions';
import { AUTH_ACTION_NAMES } from '../models/action-name.enum';
import { Router } from '@angular/router';
import {
  Auth,
  authState,
  User,
  idToken,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import { GLOBAL_PATHS } from '@fitness-tracker/shared/utils';
import { toUserInfo } from '../../../functions';
import { from } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectDestinationUrl } from '../selectors/auth.selectors';

@Injectable()
export class AuthEffects {
  readonly loginWithGoogle$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginWithGoogle),
        switchMap(() => signInWithPopup(this.afAuth, new GoogleAuthProvider())),
      ),
    { dispatch: false },
  );

  readonly loginWithEmail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginWithEmail),
        switchMap(({ payload }) =>
          signInWithEmailAndPassword(
            this.afAuth,
            payload.email,
            payload.password,
          ),
        ),
      ),
    { dispatch: false },
  );

  readonly signUpWithEmail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signUpWithEmail),
        switchMap(({ payload }) =>
          from(
            createUserWithEmailAndPassword(
              this.afAuth,
              payload.email,
              payload.password,
            ),
          ),
        ),
      ),
    { dispatch: false },
  );

  readonly authJwtToken$ = createEffect(() =>
    idToken(this.afAuth).pipe(
      map((authJwtToken: string | null) =>
        AuthActions.setAuthJwtToken({ payload: authJwtToken }),
      ),
    ),
  );

  readonly authState$ = createEffect(() =>
    authState(this.afAuth).pipe(
      switchMap((user: User | null) =>
        user
          ? from(user.getIdTokenResult()).pipe(
              switchMap((idTokenResults) => [
                AuthActions.loginSuccess({
                  payload: toUserInfo(user),
                }),
                AuthActions.setAdmin({
                  payload: Boolean(idTokenResults?.claims?.admin),
                }),
              ]),
            )
          : [AuthActions.logoutSuccess()],
      ),
    ),
  );

  readonly logOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AUTH_ACTION_NAMES.LOGOUT),
      tap(() => this.afAuth.signOut()),
      map(() =>
        AuthActions.setDestinationURL({ payload: GLOBAL_PATHS.EXERCISES_LIST }),
      ),
    ),
  );

  readonly logOutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => this.router.navigateByUrl(GLOBAL_PATHS.LOGIN)),
      ),
    { dispatch: false },
  );

  readonly redirectOnLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          AuthActions.loginWithEmail,
          AuthActions.loginWithGoogle,
          AuthActions.signUpWithEmail,
        ),
        withLatestFrom(this.store.select(selectDestinationUrl)),
        switchMap(([, destinationUrl]) =>
          this.actions$.pipe(
            ofType(AuthActions.loginSuccess),
            first(),
            map(() => destinationUrl),
          ),
        ),
        tap((destinationUrl) => this.router.navigateByUrl(destinationUrl)),
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly afAuth: Auth,
    private readonly store: Store,
  ) {}
}
