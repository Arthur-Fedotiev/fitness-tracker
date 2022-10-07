import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ExerciseDomainModule,
  EXERCISE_DESCRIPTORS_PROVIDER,
} from '@fitness-tracker/exercise/domain';
import { DisplayPageComponent } from './display.component';
import { ExerciseFeatureDisplayRoutingModule } from './exercise-feature-display-routing.module';
import { ExerciseUiComponentsModule } from '@fitness-tracker/exercise/ui-components';
import { HttpClient } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RolesModule } from '@fitness-tracker/auth/feature';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { MissingTranslationService } from '@fitness-tracker/shared/i18n';
import {
  translationsLoaderFactory,
  SerializerStrategy,
} from '@fitness-tracker/shared/utils';
import { WorkoutComposeWorkoutUtilsModule } from '@fitness-tracker/workout-compose-workout-utils';
import { ConcreteWorkoutItemSerializer } from '@fitness-tracker/workout/data';
import { ComposeWorkoutModule } from '@fitness-tracker/workout/public-api';
import { WorkoutFiltersModule } from '@fitness-tracker/workout/ui';
import {
  TranslateModule,
  TranslateLoader,
  MissingTranslationHandler,
} from '@ngx-translate/core';

const i18nAssetsPath = 'assets/i18n/exercise-display/';

@NgModule({
  declarations: [DisplayPageComponent],
  imports: [
    CommonModule,
    ExerciseFeatureDisplayRoutingModule,
    ExerciseDomainModule,
    ExerciseUiComponentsModule,
    FlexLayoutModule,
    MaterialModule,
    ComposeWorkoutModule,
    RolesModule,
    WorkoutFiltersModule,
    WorkoutComposeWorkoutUtilsModule,
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
  ],
  providers: [
    EXERCISE_DESCRIPTORS_PROVIDER,
    {
      provide: SerializerStrategy,
      useExisting: ConcreteWorkoutItemSerializer,
    },
  ],
})
export class ExerciseFeatureDisplayModule {}
