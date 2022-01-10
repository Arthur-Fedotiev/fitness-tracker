import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { WorkoutsEffects } from './+state/effects/workouts.effects';
import {
  workoutsFeatureKey,
  reducer,
} from './+state/reducers/workouts.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(workoutsFeatureKey, reducer),
    EffectsModule.forFeature([WorkoutsEffects]),
  ],
})
export class WorkoutDataModule {}
