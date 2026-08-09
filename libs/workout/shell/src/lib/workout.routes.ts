import { Routes } from '@angular/router';
import {
  EXERCISE_DESCRIPTORS_PROVIDER,
  EXERCISE_DOMAIN_PROVIDERS,
  exerciseDetailsDialogProvider,
} from '@fitness-tracker/exercise/public-api';
import { SerializerStrategy } from '@fitness-tracker/shared/utils';

import {
  ConcreteWorkoutItemSerializer,
  workoutDataProviders,
  composedWorkoutDataResolver,
} from '@fitness-tracker/workout-domain';

export const workoutRoutes = [
  {
    path: '',
    providers: [workoutDataProviders, EXERCISE_DESCRIPTORS_PROVIDER],
    children: [
      {
        path: 'all',
        loadComponent: () =>
          import('@fitness-tracker/workout/feature-details').then(
            (m) => m.WorkoutsDisplayComponent,
          ),
      },
      {
        path: 'compose',
        providers: [
          EXERCISE_DOMAIN_PROVIDERS,
          exerciseDetailsDialogProvider,
          {
            provide: SerializerStrategy,
            useExisting: ConcreteWorkoutItemSerializer,
          },
        ],
        resolve: {
          resolvedComposedWorkoutData: composedWorkoutDataResolver,
        },
        loadComponent: () =>
          import('@fitness-tracker/workout/feature-compose-workout').then(
            (m) => m.ComposeWorkoutComponent,
          ),
      },
      {
        providers: [EXERCISE_DOMAIN_PROVIDERS, exerciseDetailsDialogProvider],
        path: 'details/:id',
        loadComponent: () =>
          import('@fitness-tracker/workout/feature-details').then(
            (m) => m.WorkoutDetailsComponent,
          ),
      },
    ],
  },
] satisfies Routes;
