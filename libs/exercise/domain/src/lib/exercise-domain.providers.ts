import * as fromExercise from './+state/exercise/exercise.reducer';
import { importProvidersFrom } from '@angular/core';
import { ExerciseEffects } from './+state/exercise/exercise.effects';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { EXERCISE_DETAILS_QUERY } from './entities/queries/exercise-details.query';
import { ExerciseFacade } from './application/exercise.facade';
import { IS_LOADING_QUERY } from './entities/queries/is-loading.query';
import { LOAD_EXERCISE_DETAILS_COMMAND } from './entities/commands/load-exercise-details.command';
import {
  EXERCISE_SAVED_COMMAND,
  RELEASE_EXERCISE_DETAILS_COMMAND,
} from './entities/commands';
import { EXERCISE_DESCRIPTORS_PROVIDER } from './application/providers/exercise-descriptors.provider';

export const EXERCISE_DOMAIN_PROVIDERS = [
  importProvidersFrom(
    StoreModule.forFeature(
      fromExercise.EXERCISES_FEATURE_KEY,
      fromExercise.reducer,
    ),
    EffectsModule.forFeature([ExerciseEffects]),
  ),
  EXERCISE_DESCRIPTORS_PROVIDER,
  {
    provide: EXERCISE_DETAILS_QUERY,
    useExisting: ExerciseFacade,
  },
  {
    provide: IS_LOADING_QUERY,
    useExisting: ExerciseFacade,
  },
  {
    provide: LOAD_EXERCISE_DETAILS_COMMAND,
    useExisting: ExerciseFacade,
  },
  {
    provide: RELEASE_EXERCISE_DETAILS_COMMAND,
    useExisting: ExerciseFacade,
  },
  {
    provide: EXERCISE_SAVED_COMMAND,
    useExisting: ExerciseFacade,
  },
];
