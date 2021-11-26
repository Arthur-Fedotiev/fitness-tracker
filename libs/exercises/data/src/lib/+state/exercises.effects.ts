import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as ExercisesActions from './exercises.actions';
import * as ExercisesFeature from './exercises.reducer';

@Injectable()
export class ExercisesEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExercisesActions.init),
      fetch({
        run: (action) => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          return ExercisesActions.loadExercisesSuccess({ exercises: [] });
        },
        onError: (action, error) => {
          console.error('Error', error);
          return ExercisesActions.loadExercisesFailure({ error });
        },
      })
    )
  );

  constructor(private readonly actions$: Actions) {}
}
