import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';

import * as ExercisesActions from './exercises.actions';
import { EXERCISES_ACTION_NAMES } from './models/exercises.actions.enum';
import { catchError, concatMap, map, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { ExercisesEntity } from '@fitness-tracker/exercises/model';
import { WithPayload } from '@fitness-tracker/shared/utils';
import { Action } from '@ngrx/store';
import { loadExercisesSuccess } from './exercises.actions';
import { ExercisesService } from '../exercises.service';
import { Router } from '@angular/router';

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
          tap(() => this.redirectToExerciseList()),
          map(() => ExercisesActions.createExerciseSuccess()),
          catchError(() => of(ExercisesActions.createExerciseFailure({ payload: id }))),
        )
      ),
    )
  );

  public updateExerciseOptimistically$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EXERCISES_ACTION_NAMES.UPDATE_EXERCISE),
      mergeMap(({ payload }: WithPayload<Partial<ExercisesEntity>>): Observable<Action> =>
        this.exercisesService.updateExercise(payload).pipe(
          tap(() => this.redirectToExerciseList()),
          map(() => ExercisesActions.updateExerciseSuccess()),
          catchError(() => of(ExercisesActions.updateExerciseFailure())),
        )
      ),
    )
  );

  public deleteExercise$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EXERCISES_ACTION_NAMES.DELETE_EXERCISE),
      mergeMap(({ payload }: WithPayload<string>): Observable<Action> =>
        this.exercisesService.deleteExercise(payload).pipe(
          map(() => ExercisesActions.deleteExerciseSuccess({ payload })),
          catchError(() => of(ExercisesActions.deleteExerciseFailure())),
        )
      ),
    )
  );

  public loadExerciseDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EXERCISES_ACTION_NAMES.LOAD_EXERCISE_DETAILS),
      switchMap(({ payload }: WithPayload<string>): Observable<Action> =>
        this.exercisesService.getExerciseDetails(payload).pipe(
          map((payload: ExercisesEntity) => ExercisesActions.loadExerciseDetailsSuccess({ payload })),
          catchError(() => of(ExercisesActions.loadExerciseDetailsFailure())),
        )
      )
    )
  );

  private redirectToExerciseList(): void {
    this.router.navigate(['exercises', 'all']);
  }

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly exercisesService: ExercisesService) { }
}
