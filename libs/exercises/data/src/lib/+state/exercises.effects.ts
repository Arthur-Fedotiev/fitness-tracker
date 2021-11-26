import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as ExercisesActions from './exercises.actions';
import * as ExercisesFeature from './exercises.reducer';
import { EXERCISES_EXETCION_NAMES } from './models/exercises.actions.enum';
import { ExercisesService, loadExercisesSuccess } from '@fitness-tracker/exercises/data';
import { concatMap, map } from 'rxjs';

@Injectable()
export class ExercisesEffects {
  public loadExercises$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EXERCISES_EXETCION_NAMES.LOAD_EXERCISES),
      concatMap(() => this.exercisesService.getExercises()),
      map(exercises => loadExercisesSuccess({ exercises })),
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly exercisesService: ExercisesService) {}
}
