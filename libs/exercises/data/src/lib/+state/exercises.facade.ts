import { Injectable } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as ExercisesActions from './exercises.actions';
import * as ExercisesFeature from './exercises.reducer';
import * as ExercisesSelectors from './exercises.selectors';

@Injectable()
export class ExercisesFacade {
  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(ExercisesSelectors.getExercisesLoaded));
  allExercises$ = this.store.pipe(select(ExercisesSelectors.getAllExercises));
  selectedExercises$ = this.store.pipe(select(ExercisesSelectors.getSelected));

  constructor(private readonly store: Store) {}

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(ExercisesActions.init());
  }
}
