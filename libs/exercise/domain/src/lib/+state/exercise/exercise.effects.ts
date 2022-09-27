import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as ExerciseActions from './exercise.actions';
import { ExerciseDataService } from '../../infrastructure/exercise.data.service';

@Injectable()
export class ExerciseEffects {
  loadExercise$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExerciseActions.loadExercise),
      switchMap((action) =>
        this.exerciseDataService.load().pipe(
          map((exercise) => ExerciseActions.loadExerciseSuccess({ exercise })),
          catchError((error) =>
            of(ExerciseActions.loadExerciseFailure({ error })),
          ),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private exerciseDataService: ExerciseDataService,
  ) {}
}
