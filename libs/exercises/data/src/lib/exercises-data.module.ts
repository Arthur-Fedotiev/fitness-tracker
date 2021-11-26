import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromExercises from './+state/exercises.reducer';
import { ExercisesEffects } from './+state/exercises.effects';
import { ExercisesFacade } from './+state/exercises.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromExercises.EXERCISES_FEATURE_KEY,
      fromExercises.reducer
    ),
    EffectsModule.forFeature([ExercisesEffects]),
  ],
  providers: [ExercisesFacade],
})
export class ExercisesDataModule {}
