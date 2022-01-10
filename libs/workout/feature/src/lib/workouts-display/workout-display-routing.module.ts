import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkoutsDisplayComponent } from './workouts-display.component';

const routes: Routes = [
  {
    path: '',
    component: WorkoutsDisplayComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutDisplayRoutingModule {}
