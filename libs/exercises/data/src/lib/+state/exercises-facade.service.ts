import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  ExerciseRequestDTO,
  ExercisesEntity,
} from '@fitness-tracker/exercises/model';
import { SearchOptions } from '@fitness-tracker/shared/utils';
import { Store } from '@ngrx/store';

import * as ExercisesActions from './exercises.actions';
import * as ExercisesSelectors from './exercises.selectors';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ExercisesFacade {
  public readonly loading$ = this.store.select(ExercisesSelectors.getLoading);
  public readonly exercisesList$ = this.store.select(
    ExercisesSelectors.getAllExercises,
  );
  public readonly selectedExerciseDetails$ = this.store.select(
    ExercisesSelectors.getSelectedExerciseDetails,
  );

  constructor(
    private readonly store: Store,
    private readonly afs: AngularFirestore,
  ) {}

  public exercisePreviews$(
    ids: Set<string>,
  ): Observable<Pick<ExercisesEntity, 'avatarUrl' | 'id' | 'name'>[]> {
    return this.store.select(ExercisesSelectors.selectExercisePreview(ids));
  }

  public getAllExercises(): void {
    this.store.dispatch(ExercisesActions.loadExercises());
  }

  public createExercise(exercise: ExerciseRequestDTO): void {
    const id: string = this.afs.createId();

    this.store.dispatch(
      ExercisesActions.createExerciseMeta({
        payload: exercise.setId(id).serialize(),
      }),
    );
  }

  public updateExercise(exercise: ExerciseRequestDTO): void {
    this.store.dispatch(
      ExercisesActions.updateExercise({ payload: exercise.serialize() }),
    );
  }

  public loadExerciseDetails(payload: string): void {
    this.store.dispatch(ExercisesActions.loadExerciseDetails({ payload }));
  }

  public releaseExerciseDetails(): void {
    this.store.dispatch(ExercisesActions.releaseExerciseDetails());
  }

  public deleteExercise(payload: string): void {
    this.store.dispatch(ExercisesActions.deleteExercise({ payload }));
  }

  public findExercises(payload: Partial<SearchOptions>): void {
    this.store.dispatch(ExercisesActions.findExercises({ payload }));
  }

  public refreshExercises(payload: Partial<SearchOptions>): void {
    this.store.dispatch(ExercisesActions.refreshExercises({ payload }));
  }

  public emptyExercisesList(): void {
    this.store.dispatch(ExercisesActions.emptyExercisesList());
  }

  public openExerciseDetailsDialog(payload: string): void {
    this.store.dispatch(
      ExercisesActions.openExerciseDetailsDialog({ payload }),
    );
  }
}
