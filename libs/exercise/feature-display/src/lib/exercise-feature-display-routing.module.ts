import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayPageComponent } from './display.component';

const routes: Routes = [
  {
    path: '',
    component: DisplayPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExerciseFeatureDisplayRoutingModule {}
