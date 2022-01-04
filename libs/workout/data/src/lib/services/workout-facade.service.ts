import { Injectable } from '@angular/core';
import {
  SerializedWorkout,
  WorkoutBasicInfo,
} from '@fitness-tracker/shared/utils';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  loadWorkoutDetails,
  loadWorkoutPreviews,
} from '../+state/actions/workouts.actions';
import { WorkoutPreview } from '@fitness-tracker/workout/model';
import {
  workoutDetails,
  workoutPreviews,
} from '../+state/selectors/workouts.selectors';

@Injectable({
  providedIn: 'root',
})
export class WorkoutFacadeService {
  public readonly workoutPreviews$: Observable<WorkoutPreview[]> =
    this.store.select(workoutPreviews);

  public readonly workoutDetails$: Observable<SerializedWorkout | null> =
    this.store.select(workoutDetails);
  constructor(private readonly store: Store) {}

  public loadWorkoutPreviews(payload?: WorkoutBasicInfo['muscles']): void {
    this.store.dispatch(loadWorkoutPreviews({ payload }));
  }

  public loadWorkoutDetails(payload: string): void {
    this.store.dispatch(loadWorkoutDetails({ payload }));
  }
}
