import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateExerciseComponent, ExerciseListComponent } from '@fitness-tracker/exercises/ui';
import { ExercisesPageComponent } from './exercises-page/exercises-page.component';

const exercisesFeatureRoutes: Routes = [
  {
    path: '', component: ExercisesPageComponent, children: [
      {
        path: 'all',
        component: ExerciseListComponent
      },
      {
        path: 'create',
        component: CreateExerciseComponent
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
