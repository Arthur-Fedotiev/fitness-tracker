import { Routes } from '@angular/router';
import { AuthComponent } from '@fitness-tracker/auth/feature';

export const authFeatureRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        loadChildren: () =>
          import('../../../feature/src/lib/login/login.module').then(
            (m) => m.LoginModule,
          ),
      },
    ],
  },
];
