import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { loadExercise } from '../+state/exercise/exercise.actions';
import * as fromExercise from '../+state/exercise/exercise.reducer';
import * as ExerciseSelectors from '../+state/exercise/exercise.selectors';

@Injectable({ providedIn: 'root' })
export class CreateAndEditFacade {
  loaded$ = this.store.pipe(select(ExerciseSelectors.getExerciseLoaded));
  exerciseList$ = this.store.pipe(select(ExerciseSelectors.getAllExercise));
  selectedExercise$ = this.store.pipe(select(ExerciseSelectors.getSelected));

  constructor(private store: Store<fromExercise.ExercisePartialState>) {}

  load(): void {
    this.store.dispatch(loadExercise());
  }
}
