import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import {
  createWorkout,
  deleteWorkout,
  editWorkout,
  loadWorkoutDetails,
  loadWorkoutPreviews,
} from '../+state/actions/workouts.actions';
import {
  navigatedFromWorkoutCompose,
  navigatedFromWorkoutDisplay,
} from '../+state/actions/workouts.actions';
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

  loadWorkoutPreviews(payload?: WorkoutBasicInfo['targetMuscles']) {
    this.store.dispatch(loadWorkoutPreviews({ payload }));
  }

  loadWorkoutDetails(payload: string) {
    this.store.dispatch(loadWorkoutDetails({ payload }));
  }

  createWorkout(payload: SerializedWorkout) {
    this.store.dispatch(createWorkout({ payload }));
  }

  editWorkout(payload: string) {
    this.store.dispatch(editWorkout({ payload }));
  }

  deleteWorkout(payload: string) {
    this.store.dispatch(deleteWorkout({ payload }));
  }

  onNavigatedFromWorkoutCompose() {
    this.store.dispatch(navigatedFromWorkoutCompose());
  }

  releaseWorkoutDisplayResources() {
    this.store.dispatch(navigatedFromWorkoutDisplay());
  }
}
