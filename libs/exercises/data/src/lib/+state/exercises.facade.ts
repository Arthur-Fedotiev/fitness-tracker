import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Exercise, ExercisesEntity } from '@fitness-tracker/exercises/model';
import { select, Store, Action } from '@ngrx/store';

import * as ExercisesActions from './exercises.actions';
import * as ExercisesFeature from './exercises.reducer';
import * as ExercisesSelectors from './exercises.selectors';

@Injectable()
export class ExercisesFacade {
  loaded$ = this.store.pipe(select(ExercisesSelectors.getExercisesLoaded));
  public readonly allExercises$ = this.store.pipe(select(ExercisesSelectors.getAllExercises));
  selectedExercises$ = this.store.pipe(select(ExercisesSelectors.getSelected));

  constructor(
    private readonly store: Store,
    private readonly afs: AngularFirestore,
  ) { }

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    console.log('[INIT] ExercisesFacade')
  }

  public getAllExercises(): void {
    this.store.dispatch(ExercisesActions.loadExercises())
  }

  public createExercise(exercise: Exercise): void {
    const id: string = this.afs.createId();
    const payload: ExercisesEntity = {
      ...exercise,
      id
    };

    this.store.dispatch(ExercisesActions.createExercise({ payload }))
  }



}
