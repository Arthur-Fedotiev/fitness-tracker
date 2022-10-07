import { Inject, Injectable, Type } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';

import * as ExercisesActions from './exercise.actions';
import { EXERCISES_ACTION_NAMES } from './exercise.actions.enum';
import {
  catchError,
  concatMap,
  forkJoin,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';

import { WithPayload } from '@fitness-tracker/shared/utils';
import { Action, Store } from '@ngrx/store';
import { LanguageCodes } from 'shared-package';
import { TypedAction } from '@ngrx/store/src/models';
import { MatDialog } from '@angular/material/dialog';
import { first, switchMapTo } from 'rxjs/operators';
import { FirebaseExerciseDataService } from '../../infrastructure/exercise.data.service';
import { selectLanguage } from '@fitness-tracker/shared/data-access';
import {
  GetExerciseRequestDto,
  SearchOptions,
} from '../../entities/dto/request/get/get-exercise-request.dto';
import { ExerciseResponseDto } from '../../entities/dto/response/exercise-response.dto';
import { CreateUpdateExerciseRequestDTO } from '../../entities/dto/request/update/exercise-create-update-request.dto';
import { ExerciseDetailsDialogComponent } from '../../application/providers/exercise-details-dialog.provider';

@Injectable()
export class ExerciseEffects {
  public readonly findExercises$ = createEffect(() =>
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
            WithPayload<SearchOptions>,
          LanguageCodes,
        ]) =>
          this.exercisesService
            .findExercises(
              new GetExerciseRequestDto(
                { ...payload },
                language,
                type === EXERCISES_ACTION_NAMES.REFRESH_EXERCISES,
              ),
            )
            .pipe(
              tap((exercises) => {
                console.log(exercises);
              }),
              map((exercises: ExerciseResponseDto[]) =>
                type === EXERCISES_ACTION_NAMES.REFRESH_EXERCISES
                  ? ExercisesActions.refreshExercisesSuccess({
                      payload: exercises,
                    })
                  : ExercisesActions.findExercisesSuccess({
                      payload: { exercises, firstPage: !!payload.firstPage },
                    }),
              ),
              catchError(() => of(ExercisesActions.findExercisesFailure())),
            ),
      ),
    ),
  );

  public readonly saveExercise$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EXERCISES_ACTION_NAMES.EXERCISE_SAVED),
      mergeMap(({ payload }: WithPayload<CreateUpdateExerciseRequestDTO>) =>
        this.exercisesService.createOrUpdateExercise(payload).pipe(
          map(() => ExercisesActions.exerciseSavedSuccess()),
          catchError(() => [ExercisesActions.exerciseSavedFailure()]),
        ),
      ),
    ),
  );

  public readonly deleteExercise$ = createEffect(() =>
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

  public readonly loadExerciseDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EXERCISES_ACTION_NAMES.LOAD_EXERCISE_DETAILS),
      withLatestFrom(this.store.select(selectLanguage)),
      switchMap(
        ([{ payload }, lang]: [
          WithPayload<string>,
          LanguageCodes,
        ]): Observable<Action> =>
          this.exercisesService.getExerciseDetails(payload, lang).pipe(
            map((payload: ExerciseResponseDto) =>
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
        switchMap(({ payload }: WithPayload<ExerciseResponseDto>) =>
          forkJoin([of(payload), this.detailsDialogFactory]),
        ),
        tap(([exercise, component]) =>
          this.dialog.open(component, { data: { exercise } }),
        ),
      ),
    { dispatch: false },
  );

  constructor(
    @Inject(ExerciseDetailsDialogComponent)
    private readonly detailsDialogFactory: Observable<Type<unknown>>,
    private readonly actions$: Actions,
    private readonly exercisesService: FirebaseExerciseDataService,
    private readonly store: Store,
    private readonly dialog: MatDialog,
  ) {}
}
