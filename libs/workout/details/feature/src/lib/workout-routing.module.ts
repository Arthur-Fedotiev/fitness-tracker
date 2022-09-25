import { NgModule } from '@angular/core';
import { WorkoutPageComponent } from './workout-page/workout-page.component';
import { Routes, RouterModule } from '@angular/router';

const workoutRoutes: Routes = [
  {
    path: '',
    component: WorkoutPageComponent,
    children: [
      {
        path: 'all',
        loadChildren: () =>
          import('./workouts-display/workouts-display.module').then(
            (m) => m.WorkoutsDisplayModule,
          ),
      },
      // {
      //   path: 'create',
      //   loadChildren: () =>
      //     import('./create-exercise/create-exercise.module').then(
      //       (m) => m.CreateExerciseModule,
      //     ),
      //   ...canActivate(adminOnly),
      // },
      {
        path: ':id',
        loadChildren: () =>
          import('./workout-details/workout-details.module').then(
            (m) => m.WorkoutDetailsModule,
          ),
        // resolve: {
        //   exercise: ExerciseResolver,
        // },
      },
      //   children: [
      //     { path: 'view', redirectTo: '/exercises/all' },
      //     {
      //       path: 'edit',
      //       loadChildren: () =>
      //         import('./create-exercise/create-exercise.module').then(
      //           (m) => m.CreateExerciseModule,
      //         ),
      //       ...canActivate(adminOnly),
      //     },
      //   ],
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(workoutRoutes)],
  exports: [RouterModule],
})
export class WorkoutRoutingModule {}
