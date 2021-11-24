import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

const appRoutes: Route[] = [{
  path: '',
  children: [
    { path: 'auth', loadChildren: () => import('@fitness-tracker/auth/feature').then(m => m.AuthFeatureModule)}
  ]
}];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
