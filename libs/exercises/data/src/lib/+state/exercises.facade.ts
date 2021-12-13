import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  Exercise,
  ExerciseMetaDTO,
  ExerciseRequestDTO,
  ExercisesEntity,
} from '@fitness-tracker/exercises/model';
import { SearchOptions } from '@fitness-tracker/shared/utils';
import { select, Store } from '@ngrx/store';

import * as ExercisesActions from './exercises.actions';
import * as ExercisesSelectors from './exercises.selectors';

@Injectable()
export class ExercisesFacade {
  public readonly loading$ = this.store.pipe(
    select(ExercisesSelectors.getLoading),
  );
  public readonly allExercises$ = this.store.pipe(
    select(ExercisesSelectors.getAllExercises),
  );
  public readonly selectedExerciseDetails$ = this.store.pipe(
    select(ExercisesSelectors.getSelectedExerciseDetails),
  );

  constructor(
    private readonly store: Store,
    private readonly afs: AngularFirestore,
  ) {}

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    console.log('[INIT] ExercisesFacade');
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

  public emptyExercisesList(): void {
    this.store.dispatch(ExercisesActions.emptyExercisesList());
  }
}
