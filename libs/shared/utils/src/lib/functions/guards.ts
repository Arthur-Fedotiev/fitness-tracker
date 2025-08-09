import { User } from '@angular/fire/auth';
import { customClaims, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { map, Observable, pipe, UnaryFunction } from 'rxjs';
import { GLOBAL_PATHS } from '../constants/routing.consts';

export const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(GLOBAL_PATHS.LOGIN);

export const adminOnly: () => UnaryFunction<Observable<User>, Observable<boolean>> = () =>
  pipe(
    customClaims,
    map((claims) => {
      // Handle both array and object cases
      if (Array.isArray(claims)) {
        return false; // or handle array case as needed
      }
      return claims?.admin || false;
    }),
    map(Boolean),
  );

export const redirectLoggedInToExercises = () => redirectLoggedInTo(GLOBAL_PATHS.EXERCISES_LIST);
