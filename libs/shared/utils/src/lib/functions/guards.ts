import { map, Observable, pipe, pluck, UnaryFunction } from 'rxjs';
import {
  customClaims,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';

export const redirectUnauthorizedToLogin = () =>
  redirectUnauthorizedTo(['auth', 'login']);
export const adminOnly: () => UnaryFunction<
  Observable<any>,
  Observable<boolean>
> = () => pipe(customClaims, pluck('admin'), map(Boolean));
export const redirectLoggedInToExercises = () =>
  redirectLoggedInTo(['exercises', 'all']);
