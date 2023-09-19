import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import {
  createWorkout,
  deleteWorkout,
  editWorkout,
  loadWorkoutDetails,
  loadWorkoutPreviews,
} from '../+state/actions/workouts.actions';
import { navigatedFromWorkoutCompose } from '../+state/actions/workouts.actions';
import { getAreWorkoutsLoading } from '../+state/selectors/workouts.selectors';
import {
  workoutDetails,
  selectWorkoutPreviewsVM,
} from '../+state/selectors/workouts.selectors';
import {
  SerializedWorkout,
  WorkoutBasicInfo,
} from '../classes/workout-serializer';

@Injectable({
  providedIn: 'root',
})
export class WorkoutFacadeService {
  readonly areWorkoutsLoading = this.store.selectSignal(getAreWorkoutsLoading);
  readonly workoutPreviews = this.store.selectSignal(selectWorkoutPreviewsVM);
  readonly workoutDetails$ = this.store.select(workoutDetails);

  constructor(private readonly store: Store) {}

  loadWorkoutPreviews(payload?: WorkoutBasicInfo['targetMuscles']): void {
    this.store.dispatch(loadWorkoutPreviews({ payload }));
  }

  loadWorkoutDetails(payload: string): void {
    this.store.dispatch(loadWorkoutDetails({ payload }));
  }

  createWorkout(payload: SerializedWorkout): void {
    this.store.dispatch(createWorkout({ payload }));
  }

  editWorkout(payload: string): void {
    this.store.dispatch(editWorkout({ payload }));
  }

  deleteWorkout(payload: string): void {
    this.store.dispatch(deleteWorkout({ payload }));
  }

  onNavigatedFromWorkoutCompose(): void {
    this.store.dispatch(navigatedFromWorkoutCompose());
  }
}
