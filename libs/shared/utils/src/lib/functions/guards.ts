import { map, Observable, pipe, UnaryFunction } from 'rxjs';
import {
  customClaims,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

export const redirectUnauthorizedToLogin = () =>
  redirectUnauthorizedTo(['auth', 'login']);
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
  redirectLoggedInTo(['exercises', 'all']);
