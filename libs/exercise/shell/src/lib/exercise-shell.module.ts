import { Routes } from '@angular/router';
import { ExerciseResolver } from '@fitness-tracker/exercise/domain';

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
        // TODO: can activate if exercise belongs to user or if exercise is created by admin and user is admin
        // ...canActivate(adminOnly),
      },
    ],
  },
];
