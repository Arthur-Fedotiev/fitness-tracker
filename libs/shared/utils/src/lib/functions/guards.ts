import { map, Observable, pipe, UnaryFunction } from 'rxjs';
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
    map(({ admin }) => admin),
    map(Boolean),
  );

export const redirectLoggedInToExercises = () =>
  redirectLoggedInTo(GLOBAL_PATHS.EXERCISES_LIST);
