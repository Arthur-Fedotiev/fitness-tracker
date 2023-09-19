import { HttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { ExerciseResolver } from '@fitness-tracker/exercise/domain';
import { translationsLoaderFactory } from '@fitness-tracker/shared/i18n/domain';
import { MissingTranslationService } from '@fitness-tracker/shared/i18n/utils';
import {
  TranslateModule,
  TranslateLoader,
  MissingTranslationHandler,
} from '@ngx-translate/core';

const i18nAssetsPath = 'assets/i18n/exercises/';

const i18nProviders = [
  importProvidersFrom(
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: translationsLoaderFactory(i18nAssetsPath),
        deps: [HttpClient],
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MissingTranslationService,
      },
      isolate: false,
      extend: true,
    }),
  ),
];

export const EXERCISE_ROUTES: Routes = [
  {
    path: '',
    providers: [i18nProviders],
    children: [
      {
        path: 'all',
        loadComponent: () =>
          import('@fitness-tracker/exercise/feature-display').then(
            (m) => m.DisplayPageComponent,
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('@fitness-tracker/exercise/feature-create-and-edit').then(
            (m) => m.CreateAndEditComponent,
          ),
      },
      {
        path: ':id',
        resolve: {
          exercise: ExerciseResolver,
        },
        providers: [ExerciseResolver],
        children: [
          { path: 'view', redirectTo: '/exercises/all' },
          {
            path: 'edit',
            loadComponent: () =>
              import('@fitness-tracker/exercise/feature-create-and-edit').then(
                (m) => m.CreateAndEditComponent,
              ),
            // TODO: can activate if exercise belongs to user or if exercise is created by admin and user is admin
            // ...canActivate(adminOnly),
          },
        ],
      },
    ],
  },
];
