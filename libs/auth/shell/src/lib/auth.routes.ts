import { Routes } from '@angular/router';

export const authFeatureRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('@fitness-tracker/auth/feature').then((m) => m.AuthComponent),
  },
];
