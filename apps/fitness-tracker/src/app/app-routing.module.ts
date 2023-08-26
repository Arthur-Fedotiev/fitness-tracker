import { HttpClient } from '@angular/common/http';
import { NgModule, importProvidersFrom } from '@angular/core';
import { canActivate } from '@angular/fire/compat/auth-guard';
import { Route, RouterModule } from '@angular/router';
import { DISPLAY_PAGE_PROVIDERS } from '@fitness-tracker/exercise/public-api';
import { LayoutComponent } from '@fitness-tracker/layout/feature';
import { MissingTranslationService } from '@fitness-tracker/shared/i18n';

import {
  adminOnly,
  redirectLoggedInToExercises,
  redirectUnauthorizedToLogin,
  translationsLoaderFactory,
} from '@fitness-tracker/shared/utils';
import { workoutDataProviders } from '@fitness-tracker/workout-domain';
import {
  TranslateModule,
  TranslateLoader,
  MissingTranslationHandler,
} from '@ngx-translate/core';

const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'exercises/all' },
  {
    path: '',
    component: LayoutComponent,
    ...canActivate(redirectUnauthorizedToLogin),
    children: [
      {
        path: 'exercises',
        loadChildren: () =>
          import('@fitness-tracker/exercise/shell').then(
            (m) => m.EXERCISE_ROUTES,
          ),
        providers: [DISPLAY_PAGE_PROVIDERS, workoutDataProviders],
      },
      {
        path: 'workouts',
        // providers: [
        //   importProvidersFrom(
        //     TranslateModule.forChild({
        //       loader: {
        //         provide: TranslateLoader,
        //         useFactory: translationsLoaderFactory('assets/i18n/workout/'),
        //         deps: [HttpClient],
        //       },
        //       missingTranslationHandler: {
        //         provide: MissingTranslationHandler,
        //         useClass: MissingTranslationService,
        //       },
        //       isolate: false,
        //       extend: true,
        //     }),
        //   ),
        // ],
        loadChildren: () =>
          import('@fitness-tracker/workout/shell').then((m) => m.workoutRoutes),
      },
      {
        path: 'create-user',
        loadChildren: () =>
          import('@fitness-tracker/create-user/feature').then(
            (m) => m.CreateUserFeatureModule,
          ),
        ...canActivate(adminOnly),
      },
    ],
  },
  {
    path: 'auth',
    ...canActivate(redirectLoggedInToExercises),
    loadChildren: () =>
      import('@fitness-tracker/auth/shell').then((m) => m.authFeatureRoutes),
  },
  { path: '**', redirectTo: 'exercises/all' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      enableTracing: false,
      initialNavigation: 'enabledNonBlocking',
      bindToComponentInputs: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
