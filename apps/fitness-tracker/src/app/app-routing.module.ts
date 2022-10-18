import { NgModule } from '@angular/core';
import { canActivate } from '@angular/fire/compat/auth-guard';
import { Route, RouterModule } from '@angular/router';
import { DISPLAY_PAGE_PROVIDERS } from '@fitness-tracker/exercise/feature-display';
import { LayoutComponent } from '@fitness-tracker/layout/feature';

import {
  adminOnly,
  redirectLoggedInToExercises,
  redirectUnauthorizedToLogin,
} from '@fitness-tracker/shared/utils';

const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'exercises/all' },
  {
    path: '',
    component: LayoutComponent,
    ...canActivate(redirectUnauthorizedToLogin),
    children: [
      {
        path: 'exercises',
        loadChildren: () =>
          import('@fitness-tracker/exercise/shell').then(
            (m) => m.EXERCISE_ROUTES,
          ),
        providers: DISPLAY_PAGE_PROVIDERS,
      },
      {
        path: 'workouts',
        loadChildren: () =>
          import('@fitness-tracker/workout-details-feature').then(
            (m) => m.WorkoutFeatureModule,
          ),
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
    ...canActivate(redirectLoggedInToExercises),
    loadChildren: () =>
      import('@fitness-tracker/auth/feature').then((m) => m.AuthFeatureModule),
  },
  { path: '**', redirectTo: 'exercises/all' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      enableTracing: false,
      initialNavigation: 'enabledNonBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
