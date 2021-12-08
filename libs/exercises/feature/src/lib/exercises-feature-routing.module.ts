import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExercisesPageComponent } from './exercises-page/exercises-page.component';
import { ExerciseResolver } from '@fitness-tracker/exercises/data';
import { canActivateAdmin } from '@fitness-tracker/shared/utils';

const exercisesFeatureRoutes: Routes = [
  {
    path: '', component: ExercisesPageComponent, children: [
      {
        path: 'all',
        loadChildren: () => import('./exercises-display/exercises-display.module').then(m => m.ExercisesDisplayModule)
      },
      {
        path: 'create',
        loadChildren: () => import('./create-exercise/create-exercise.module').then(m => m.CreateExerciseModule),
        ...canActivateAdmin,
      },
      {
        path: ':id',
        resolve: {
          exercise: ExerciseResolver
        },
        children: [
          { path: 'view', redirectTo: '/exercises/all' },
          {
            path: 'edit', loadChildren: () => import('./create-exercise/create-exercise.module').then(m => m.CreateExerciseModule),
            ...canActivateAdmin,
          }
        ]
      }
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(exercisesFeatureRoutes)
  ],
  exports: [RouterModule]
})
export class ExercisesFeatureRoutingModule { }
