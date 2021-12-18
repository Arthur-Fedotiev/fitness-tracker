import { NgModule } from '@angular/core';
import { canActivate } from '@angular/fire/compat/auth-guard';
import { Route, RouterModule } from '@angular/router';
import { LayoutComponent } from '@fitness-tracker/layout/feature';

import {
  adminOnly,
  redirectLoggedInToExercises,
  redirectUnauthorizedToLogin,
} from '@fitness-tracker/shared/utils';

const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    ...canActivate(redirectUnauthorizedToLogin),
    children: [
      {
        path: 'exercises',
        loadChildren: () =>
          import('@fitness-tracker/exercises/feature').then(
            (m) => m.ExercisesFeatureModule,
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
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
