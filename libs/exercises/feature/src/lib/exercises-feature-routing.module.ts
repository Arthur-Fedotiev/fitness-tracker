import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateExerciseComponent, ExerciseListComponent } from '@fitness-tracker/exercises/ui';

const exercisesFeatureRoutes: Routes = [
  {
    path: '', children: [
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
