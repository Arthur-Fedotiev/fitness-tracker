import * as fromExercise from './+state/exercise/exercise.reducer';
import { NgModule } from '@angular/core';
import { ExerciseEffects } from './+state/exercise/exercise.effects';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    StoreModule.forFeature(
      fromExercise.EXERCISES_FEATURE_KEY,
      fromExercise.reducer,
    ),
    EffectsModule.forFeature([ExerciseEffects]),
  ],
})
export class ExerciseDomainModule {}
