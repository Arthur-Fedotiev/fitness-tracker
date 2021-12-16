import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './login/auth.component';

export const authFeatureRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        loadChildren: () =>
          import('./login/login.module').then((m) => m.LoginModule),
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(authFeatureRoutes)],
  exports: [RouterModule],
})
export class AuthFeatureRoutingModule {}
