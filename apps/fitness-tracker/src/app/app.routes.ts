import { canActivate, AuthGuard } from '@angular/fire/auth-guard';
import {
  ActivatedRouteSnapshot,
  Route,
  RouterStateSnapshot,
} from '@angular/router';
import { DISPLAY_PAGE_PROVIDERS } from '@fitness-tracker/exercise/public-api';
import { LayoutComponent } from '@fitness-tracker/layout/feature';

import {
  adminOnly,
  redirectUnauthorizedToLogin,
} from '@fitness-tracker/shared/utils';
import { workoutDataProviders } from '@fitness-tracker/workout-domain';
import { inject } from '@angular/core';
import { AuthFacadeService } from '@fitness-tracker/auth/domain';

export const APP_ROUTES: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'exercises/all' },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [
      (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => (
        inject(AuthFacadeService).setDestinationUrl(state.url),
        inject(AuthGuard).canActivate(next, state)
      ),
    ],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    children: [
      {
        path: 'exercises',
        loadChildren: () =>
          import('@fitness-tracker/exercise/shell').then(
            (m) => m.EXERCISE_ROUTES,
          ),
        providers: [DISPLAY_PAGE_PROVIDERS, workoutDataProviders],
      },
      {
        path: 'workouts',
        loadChildren: () =>
          import('@fitness-tracker/workout/shell').then((m) => m.workoutRoutes),
      },
      {
        path: 'create-user',
        loadChildren: () =>
          import('@fitness-tracker/create-user/feature').then(
            (m) => m.CreateUserFeatureModule,
          ),
        ...canActivate(adminOnly),
      },
    ],
  },
  {
    path: 'auth',
    // ...canActivate(redirectLoggedInToExercises),
    loadChildren: () =>
      import('@fitness-tracker/auth/shell').then((m) => m.authFeatureRoutes),
  },
  { path: '**', redirectTo: 'exercises/all' },
];
