import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LayoutComponent } from '@fitness-tracker/layout/feature';

const appRoutes: Route[] = [{
  path: '',
  component: LayoutComponent,
  children: [
    { path: 'auth', loadChildren: () => import('@fitness-tracker/auth/feature').then(m => m.AuthFeatureModule) }
  ],
},
{ path: '**', redirectTo: '' }];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
