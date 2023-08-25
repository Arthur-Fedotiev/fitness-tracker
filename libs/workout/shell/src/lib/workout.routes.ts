import { HttpClient } from '@angular/common/http';
import { importProvidersFrom, inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { EXERCISE_DESCRIPTORS_PROVIDER } from '@fitness-tracker/exercise/domain';
import { MissingTranslationService } from '@fitness-tracker/shared/i18n';
import { Store, StoreModule } from '@ngrx/store';
import {
  SerializerStrategy,
  translationsLoaderFactory,
} from '@fitness-tracker/shared/utils';

import {
  ConcreteWorkoutItemSerializer,
  WorkoutExercise,
  ConcreteSingleWorkoutItemInstruction,
  workoutDataProviders,
} from '@fitness-tracker/workout-domain';

import {
  TranslateModule,
  TranslateLoader,
  MissingTranslationHandler,
} from '@ngx-translate/core';

const i18nAssetsPath = 'assets/i18n/workout-details/';

export const workoutRoutes = [
  {
    path: '',
    providers: [
      workoutDataProviders,
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
      EXERCISE_DESCRIPTORS_PROVIDER,
    ],
    children: [
      {
        path: 'all',
        loadComponent: () =>
          import('@fitness-tracker/workout/feature-details').then(
            (m) => m.WorkoutsDisplayComponent,
          ),
      },
      {
        path: 'compose',
        providers: [
          {
            provide: SerializerStrategy,
            useExisting: ConcreteWorkoutItemSerializer,
          },
        ],
        resolve: {
          resolvedComposedWorkoutData: () => {
            const { workoutExercisesList, workoutBasicInfo } =
              inject(Router).getCurrentNavigation()?.extras?.state ?? {};

            return {
              workoutContent: workoutExercisesList.map(
                (exercise: WorkoutExercise) =>
                  inject(SerializerStrategy).deserialize({
                    ...exercise,
                    ...new ConcreteSingleWorkoutItemInstruction(),
                  }),
              ),
              workoutBasicInfo,
            };
          },
        },
        loadComponent: () =>
          import('@fitness-tracker/workout/feature-compose-workout').then(
            (m) => m.ComposeWorkoutComponent,
          ),
      },

      {
        path: ':id',
        loadComponent: () =>
          import('@fitness-tracker/workout/feature-details').then(
            (m) => m.WorkoutDetailsComponent,
          ),
      },
    ],
  },
] satisfies Routes;
