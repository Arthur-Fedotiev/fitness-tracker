import { Routes } from '@angular/router';
import { canActivate } from '@angular/fire/compat/auth-guard';
import { ExerciseResolver } from '@fitness-tracker/exercise/domain';
import { adminOnly } from '@fitness-tracker/shared/utils';

export const EXERCISE_ROUTES: Routes = [
  {
    path: 'all',
    loadChildren: () =>
      import('@fitness-tracker/exercise/feature-display').then(
        (m) => m.ExerciseFeatureDisplayModule,
      ),
  },
  {
    path: 'create',
    loadChildren: () =>
      import('@fitness-tracker/exercise/feature-create-and-edit').then(
        (m) => m.ExerciseFeatureCreateAndEditModule,
      ),
    ...canActivate(adminOnly),
  },
  {
    path: ':id',
    resolve: {
      exercise: ExerciseResolver,
    },
    children: [
      { path: 'view', redirectTo: '/exercises/all' },
      {
        path: 'edit',
        loadChildren: () =>
          import('@fitness-tracker/exercise/feature-create-and-edit').then(
            (m) => m.ExerciseFeatureCreateAndEditModule,
          ),
        ...canActivate(adminOnly),
      },
    ],
  },
];
