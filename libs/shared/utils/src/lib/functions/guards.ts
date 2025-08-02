import { map, Observable, pipe, tap, UnaryFunction } from 'rxjs';
import { GLOBAL_PATHS } from '../constants/routing.consts';
import {
  customClaims,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

export const redirectUnauthorizedToLogin = () =>
  redirectUnauthorizedTo(GLOBAL_PATHS.LOGIN);

export const adminOnly: () => UnaryFunction<
  Observable<any>,
  Observable<boolean>
> = () =>
    pipe(
      customClaims,
      tap(console.log),
      map((claims) => {
        // Handle both array and object cases
        if (Array.isArray(claims)) {
          return false; // or handle array case as needed
        }
        return claims?.admin || false;
      }),
      map(Boolean),
    );

export const redirectLoggedInToExercises = () =>
  redirectLoggedInTo(GLOBAL_PATHS.EXERCISES_LIST);
