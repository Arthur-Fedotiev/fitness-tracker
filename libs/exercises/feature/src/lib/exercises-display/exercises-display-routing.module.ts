import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExercisesDisplayComponent } from './exercises-display.component';

const routes: Routes = [
  {
    path: '', component: ExercisesDisplayComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExercisesDisplayRoutingModule { }
