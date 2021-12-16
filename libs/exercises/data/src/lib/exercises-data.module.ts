import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromExercises from './+state/exercises.reducer';
import { ExercisesEffects } from './+state/exercises.effects';
import { ExerciseResolver } from './resolvers/exercise.resolver';

@NgModule({
  imports: [
    StoreModule.forFeature(
      fromExercises.EXERCISES_FEATURE_KEY,
      fromExercises.reducer,
    ),
    EffectsModule.forFeature([ExercisesEffects]),
  ],
  providers: [ExerciseResolver],
})
export class ExercisesDataModule {}
