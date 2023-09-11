import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  createWorkout,
  deleteWorkout,
  editWorkout,
  loadWorkoutDetails,
  loadWorkoutPreviews,
} from '../+state/actions/workouts.actions';
import { navigatedFromWorkoutCompose } from '../+state/actions/workouts.actions';
import {
  workoutDetails,
  workoutPreviews,
} from '../+state/selectors/workouts.selectors';
import {
  SerializedWorkout,
  WorkoutBasicInfo,
} from '../classes/workout-serializer';

@Injectable({
  providedIn: 'root',
})
export class WorkoutFacadeService {
  public readonly workoutPreviews = this.store.selectSignal(workoutPreviews);

  public readonly workoutDetails$: Observable<SerializedWorkout | null> =
    this.store.select(workoutDetails);
  constructor(private readonly store: Store) {}

  public loadWorkoutPreviews(
    payload?: WorkoutBasicInfo['targetMuscles'],
  ): void {
    this.store.dispatch(loadWorkoutPreviews({ payload }));
  }

  public loadWorkoutDetails(payload: string): void {
    this.store.dispatch(loadWorkoutDetails({ payload }));
  }

  public createWorkout(payload: SerializedWorkout): void {
    this.store.dispatch(createWorkout({ payload }));
  }

  public editWorkout(payload: string): void {
    this.store.dispatch(editWorkout({ payload }));
  }

  public deleteWorkout(payload: string): void {
    this.store.dispatch(deleteWorkout({ payload }));
  }

  public onNavigatedFromWorkoutCompose(): void {
    this.store.dispatch(navigatedFromWorkoutCompose());
  }
}
