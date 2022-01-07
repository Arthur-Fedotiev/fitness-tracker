import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';

import * as ExercisesActions from './exercises.actions';
import { EXERCISES_ACTION_NAMES } from './models/exercises.actions.enum';
import {
  catchError,
  concatMap,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import {
  ExerciseCollectionsMeta,
  ExerciseMetaDTO,
  ExerciseRequestDTO,
  ExercisesEntity,
} from '@fitness-tracker/exercises/model';
import { SearchOptions, WithPayload } from '@fitness-tracker/shared/utils';
import { Action, Store } from '@ngrx/store';
import { ExercisesService } from '../exercises.service';
import { Router } from '@angular/router';
import { selectLanguage } from '@fitness-tracker/shared/data-access';
import { LanguageCodes } from 'shared-package';
import { TypedAction } from '@ngrx/store/src/models';
import { MatDialog } from '@angular/material/dialog';
import { ExerciseDetailsComponent } from '@fitness-tracker/shared/dialogs';
import { first, switchMapTo } from 'rxjs/operators';

@Injectable()
export class ExercisesEffects {
  public findExercises$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        EXERCISES_ACTION_NAMES.FIND_EXERCISES,
        EXERCISES_ACTION_NAMES.REFRESH_EXERCISES,
      ),
      withLatestFrom(this.store.select(selectLanguage)),
      concatMap(
        ([{ payload, type }, language]: [
          TypedAction<
            | EXERCISES_ACTION_NAMES.FIND_EXERCISES
            | EXERCISES_ACTION_NAMES.REFRESH_EXERCISES
          > &
            WithPayload<Partial<SearchOptions>>,
          LanguageCodes,
        ]) =>
          this.exercisesService
            .findExercises(
              { ...payload },
              language,
              type === EXERCISES_ACTION_NAMES.REFRESH_EXERCISES,
            )
            .pipe(
              map((payload: ExercisesEntity[]) =>
                type === EXERCISES_ACTION_NAMES.REFRESH_EXERCISES
                  ? ExercisesActions.refreshExercisesSuccess({ payload })
                  : ExercisesActions.findExercisesSuccess({ payload }),
              ),
              catchError(() => of(ExercisesActions.findExercisesFailure())),
            ),
      ),
    ),
  );

  public createExerciseMeta$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EXERCISES_ACTION_NAMES.CREATE_EXERCISE),
        mergeMap(({ payload }: WithPayload<ExerciseMetaDTO>) =>
          this.exercisesService
            .createExercise(payload)
            .pipe
            // tap(() => this.redirectToExerciseList()),
            // map(() => ExercisesActions.createExerciseSuccess()),
            // catchError(() =>
            //   of(
            //     ExercisesActions.createExerciseFailure({
            //       payload: payload.id as string,
            //     }),
            //   ),
            // ),
            (),
        ),
      ),
    { dispatch: false },
  );

  public updateExercise$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EXERCISES_ACTION_NAMES.UPDATE_EXERCISE),
        mergeMap(({ payload }: WithPayload<ExerciseRequestDTO>) =>
          this.exercisesService
            .updateExercise(payload)
            .pipe
            // tap(() => this.redirectToExerciseList()),
            // map(() => ExercisesActions.updateExerciseSuccess()),
            // catchError(() => of(ExercisesActions.updateExerciseFailure())),
            (),
        ),
      ),
    { dispatch: false },
  );

  // public updateExerciseOptimistically$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(EXERCISES_ACTION_NAMES.UPDATE_EXERCISE),
  //     mergeMap(
  //       ({
  //         payload,
  //       }: WithPayload<Partial<ExercisesEntity>>): Observable<Action> =>
  //         this.exercisesService.updateExercise(payload).pipe(
  //           tap(() => this.redirectToExerciseList()),
  //           map(() => ExercisesActions.updateExerciseSuccess()),
  //           catchError(() => of(ExercisesActions.updateExerciseFailure())),
  //         ),
  //     ),
  //   ),
  // );

  public deleteExercise$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EXERCISES_ACTION_NAMES.DELETE_EXERCISE),
      mergeMap(
        ({ payload }: WithPayload<string>): Observable<Action> =>
          this.exercisesService.deleteExercise(payload).pipe(
            map(() => ExercisesActions.deleteExerciseSuccess({ payload })),
            catchError(() => of(ExercisesActions.deleteExerciseFailure())),
          ),
      ),
    ),
  );

  public loadExerciseDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EXERCISES_ACTION_NAMES.LOAD_EXERCISE_DETAILS),
      withLatestFrom(this.store.select(selectLanguage)),
      switchMap(
        ([{ payload }, lang]: [
          WithPayload<string>,
          LanguageCodes,
        ]): Observable<Action> =>
          this.exercisesService.getExerciseDetails(payload, lang).pipe(
            map((payload: ExercisesEntity) =>
              ExercisesActions.loadExerciseDetailsSuccess({ payload }),
            ),
            catchError(() => of(ExercisesActions.loadExerciseDetailsFailure())),
          ),
      ),
    ),
  );

  public readonly showExerciseDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EXERCISES_ACTION_NAMES.OPEN_EXERCISE_DETAILS_DIALOG),
      map(({ payload }) => ExercisesActions.loadExerciseDetails({ payload })),
    ),
  );

  public readonly openExerciseDetailsDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EXERCISES_ACTION_NAMES.OPEN_EXERCISE_DETAILS_DIALOG),
        switchMapTo(
          this.actions$.pipe(
            ofType(
              EXERCISES_ACTION_NAMES.LOAD_EXERCISE_DETAILS_SUCCESS,
              EXERCISES_ACTION_NAMES.LOAD_EXERCISE_DETAILS_FAILURE,
            ),
            first(),
          ),
        ),
        tap(({ payload: exercise }) => {
          this.dialog.open(ExerciseDetailsComponent, { data: { exercise } });
        }),
      ),
    { dispatch: false },
  );

  private redirectToExerciseList(): void {
    this.router.navigate(['exercises', 'all']);
  }

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly exercisesService: ExercisesService,
    private readonly store: Store,
    private readonly dialog: MatDialog,
  ) {}
}
