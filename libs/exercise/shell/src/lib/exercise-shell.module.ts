import { Routes } from '@angular/router';
import { canActivate } from '@angular/fire/auth-guard';
import { ExerciseResolver } from '@fitness-tracker/exercise/domain';
import { adminOnly } from '@fitness-tracker/shared/utils';

export const EXERCISE_ROUTES: Routes = [
  {
    path: 'all',
    loadComponent: () =>
      import('@fitness-tracker/exercise/feature-display').then(
        (m) => m.DisplayPageComponent,
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('@fitness-tracker/exercise/feature-create-and-edit').then(
        (m) => m.CreateAndEditComponent,
      ),
    ...canActivate(adminOnly),
  },
  {
    path: ':id',
    resolve: {
      exercise: ExerciseResolver,
    },
    providers: [ExerciseResolver],
    children: [
      { path: 'view', redirectTo: '/exercises/all' },
      {
        path: 'edit',
        loadComponent: () =>
          import('@fitness-tracker/exercise/feature-create-and-edit').then(
            (m) => m.CreateAndEditComponent,
          ),
        ...canActivate(adminOnly),
      },
    ],
  },
];
