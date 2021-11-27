import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as ExercisesActions from './exercises.actions';
import * as ExercisesFeature from './exercises.reducer';
import { EXERCISES_ACTION_NAMES } from './models/exercises.actions.enum';
import { ExercisesService, loadExercisesSuccess } from '@fitness-tracker/exercises/data';
import { catchError, concatMap, EMPTY, from, map, mapTo, mergeMap, Observable, of } from 'rxjs';
import { Exercise, ExercisesEntity } from '@fitness-tracker/exercises/model';
import { WithPayload } from '@fitness-tracker/shared/utils';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Action } from '@ngrx/store';

@Injectable()
export class ExercisesEffects {
  public loadExercises$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EXERCISES_ACTION_NAMES.LOAD_EXERCISES),
      concatMap(() => this.exercisesService.getExercises()),
      map(exercises => loadExercisesSuccess({ exercises })),
    )
  );

  public createExerciseOptimistically$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EXERCISES_ACTION_NAMES.CREATE_EXERCISE),
      mergeMap(({ payload: { id, ...data } }: WithPayload<ExercisesEntity>): Observable<Action> =>
        this.exercisesService.createExercise(data, id).pipe(
          map(() => ExercisesActions.createExercisesSuccess()),
          catchError(() => of(ExercisesActions.createExercisesFailure({ payload: id }))),
        )
      ),
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly exercisesService: ExercisesService) { }
}
