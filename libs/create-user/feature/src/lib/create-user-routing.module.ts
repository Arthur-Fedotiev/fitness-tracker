import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CreateUserDisplayComponent } from './create-user-display/create-user-display.component';

export const createUserFeatureRoutes: Routes = [
  {
    path: '', component: CreateUserDisplayComponent,
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(createUserFeatureRoutes),
  ],
  exports: [RouterModule]
})
export class AuthFeatureRoutingModule { }
