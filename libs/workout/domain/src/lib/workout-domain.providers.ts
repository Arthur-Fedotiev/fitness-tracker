import { importProvidersFrom } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { WorkoutsEffects } from './application/+state/effects/workouts.effects';
import {
  workoutsFeatureKey,
  reducer,
} from './application/+state/reducers/workouts.reducer';

export const workoutDataProviders = [
  importProvidersFrom(
    StoreModule.forFeature(workoutsFeatureKey, reducer),
    EffectsModule.forFeature([WorkoutsEffects]),
  ),
];
