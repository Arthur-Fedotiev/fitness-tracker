import { canActivate, AuthGuard } from '@angular/fire/auth-guard';
import {
  ActivatedRouteSnapshot,
  Route,
  RouterStateSnapshot,
} from '@angular/router';
import { LayoutComponent } from '@fitness-tracker/layout/feature';

import {
  adminOnly,
  GLOBAL_PATHS,
  redirectLoggedInToTrainingPlanner,
  redirectUnauthorizedToLogin,
} from '@fitness-tracker/shared/utils';
import { inject } from '@angular/core';
import { AuthFacadeService } from '@fitness-tracker/auth/domain';

export const APP_ROUTES: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: GLOBAL_PATHS.DEFAULT_LANDING },
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
      },
      {
        path: 'workouts',
        loadChildren: () =>
          import('@fitness-tracker/workout/shell').then((m) => m.workoutRoutes),
      },
      {
        path: 'training-planner',
        loadChildren: () =>
          import('@fitness-tracker/program/shell').then((m) => m.programRoutes),
      },
      {
        path: 'create-user',
        loadChildren: () =>
          import('@fitness-tracker/create-user/feature').then(
            (m) => m.createUserFeatureRoutes,
          ),
        ...canActivate(adminOnly),
      },
    ],
  },
  {
    path: 'auth',
    ...canActivate(redirectLoggedInToTrainingPlanner),
    loadChildren: () =>
      import('@fitness-tracker/auth/shell').then((m) => m.authFeatureRoutes),
  },
  { path: '**', redirectTo: GLOBAL_PATHS.DEFAULT_LANDING },
];
