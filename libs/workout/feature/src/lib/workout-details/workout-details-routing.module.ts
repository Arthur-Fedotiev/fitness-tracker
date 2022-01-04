import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkoutDetailsComponent } from './workout-details.component';

const routes: Routes = [
  {
    path: '',
    component: WorkoutDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutDetailsRoutingModule {}
