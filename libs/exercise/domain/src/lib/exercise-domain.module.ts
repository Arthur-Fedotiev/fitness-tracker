import * as fromExercise from './+state/exercise/exercise.reducer';
import * as fromExercise from './+state/exercise/exercise.reducer';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseEffects } from './+state/exercise/exercise.effects';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromExercise.EXERCISE_FEATURE_KEY,
      fromExercise.reducer,
    ),
    EffectsModule.forFeature([ExerciseEffects]),
    StoreModule.forFeature(
      fromExercise.EXERCISE_FEATURE_KEY,
      fromExercise.reducer,
    ),
    EffectsModule.forFeature([ExerciseEffects]),
  ],
})
export class ExerciseDomainModule {}
