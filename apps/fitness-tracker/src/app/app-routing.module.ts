import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AuthGuard } from '@fitness-tracker/auth/data';
import { LayoutComponent } from '@fitness-tracker/layout/feature';

const appRoutes: Route[] = [{
  path: '',
  component: LayoutComponent,
  canActivate: [AuthGuard],
  children: [
    { path: 'exercises', loadChildren: () => import('@fitness-tracker/exercises/feature').then(m => m.ExercisesFeatureModule) }
  ],
},
{ path: 'auth', loadChildren: () => import('@fitness-tracker/auth/feature').then(m => m.AuthFeatureModule) },
{ path: '**', redirectTo: 'exercises/all' }];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
