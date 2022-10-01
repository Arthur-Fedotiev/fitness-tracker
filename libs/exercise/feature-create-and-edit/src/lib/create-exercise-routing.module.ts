import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAndEditComponent } from './create-and-edit.component';

const routes: Routes = [
  {
    path: '',
    component: CreateAndEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateAndEditExerciseRoutingModule {}
