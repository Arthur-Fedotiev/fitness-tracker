import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateExerciseComponent } from './create-exercise/create-exercise.component';
import { ExerciseListComponent } from './exercise-list/exercise-list.component';
import { ExercisesPageComponent } from './exercises-page/exercises-page.component';

const exercisesFeatureRoutes: Routes = [
  {
    path: '', component: ExercisesPageComponent, children: [
      {
        path: 'all',
        component: ExerciseListComponent
      },
      {
        path: ':id',
        children: [
          { path: 'view', redirectTo: '/exercises/all'},
          { path: 'edit', component: CreateExerciseComponent}
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
