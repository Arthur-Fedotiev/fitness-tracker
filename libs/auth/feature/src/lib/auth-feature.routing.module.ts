import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from '@fitness-tracker/auth/ui';

export const authFeatureRoutes: Routes = [
  {
    path: '', children: [
      { path: 'login', component: LoginFormComponent }
    ]
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(authFeatureRoutes),
  ],
  exports: [RouterModule]
})
export class AuthFeatureRoutingModule { }
