import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { authRoutes } from '@fitness-tracker/auth';

const appRoutes: Route[] = [
  {path: 'auth', children: authRoutes}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
