import { WorkoutPageComponent } from './workout-page/workout-page.component';
import { Routes } from '@angular/router';
import { workoutDataProviders } from '@fitness-tracker/workout-domain';
import { workoutDetailsProviders } from './workout-details/workout-details.providers';

export const WORKOUT_ROUTES = [
  {
    path: '',
    component: WorkoutPageComponent,
    providers: [workoutDataProviders],
    children: [
      {
        path: 'all',
        loadComponent: () =>
          import('./workouts-display/workouts-display.component').then(
            (m) => m.WorkoutsDisplayComponent,
          ),
      },

      {
        path: ':id',
        loadComponent: () =>
          import('./workout-details/workout-details.component').then(
            (m) => m.WorkoutDetailsComponent,
          ),
        providers: [workoutDetailsProviders],
      },
    ],
  },
] satisfies Routes;
