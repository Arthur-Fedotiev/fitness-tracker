import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  map,
  switchMap,
  tap,
  first,
  withLatestFrom,
  catchError,
} from 'rxjs/operators';
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
import { GLOBAL_PATHS, WithPayload } from '@fitness-tracker/shared/utils';
import { toUserInfo } from '../../../functions';
import { toAuthErrorMessage } from '../../../auth-error-message';
import { EMPTY, Observable, from, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { selectDestinationUrl } from '../selectors/auth.selectors';

/**
 * Firebase rejects the sign-in promise on failure. Without this the rejection
 * escapes the effect entirely and only ever reaches the console, so translate it
 * into the matching failure action; a user-cancelled popup reports nothing.
 */
const reportAs =
  (failureAction: (props: WithPayload<string>) => Action) =>
  (error: unknown): Observable<Action> => {
    const message = toAuthErrorMessage(error);

    return message ? of(failureAction({ payload: message })) : EMPTY;
  };

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly router = inject(Router);
  private readonly afAuth = inject(Auth);
  private readonly store = inject(Store);

  readonly loginWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginWithGoogle),
      switchMap(() =>
        from(signInWithPopup(this.afAuth, new GoogleAuthProvider())).pipe(
          map(() => AuthActions.loginWithGoogleSuccess()),
          catchError(reportAs(AuthActions.loginWithGoogleFailure)),
        ),
      ),
    ),
  );

  readonly loginWithEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginWithEmail),
      switchMap(({ payload }) =>
        from(
          signInWithEmailAndPassword(
            this.afAuth,
            payload.email,
            payload.password,
          ),
        ).pipe(
          map(() => AuthActions.loginWithEmailSuccess()),
          catchError(reportAs(AuthActions.loginWithEmailFailure)),
        ),
      ),
    ),
  );

  readonly signUpWithEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signUpWithEmail),
      switchMap(({ payload }) =>
        from(
          createUserWithEmailAndPassword(
            this.afAuth,
            payload.email,
            payload.password,
          ),
        ).pipe(
          map(() => AuthActions.signUpWithEmailSuccess()),
          catchError(reportAs(AuthActions.signUpWithEmailFailure)),
        ),
      ),
    ),
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
        AuthActions.setDestinationURL({ payload: GLOBAL_PATHS.DEFAULT_LANDING }),
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

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
}
