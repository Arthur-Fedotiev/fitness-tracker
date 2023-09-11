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
  withLatestFrom,
  first,
  filter,
} from 'rxjs';

import {
  DEFAULT_PAGINATION_STATE,
  ORDER_BY,
} from '@fitness-tracker/shared/utils';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseExerciseDataService } from '../../infrastructure/exercise.data.service';
import { selectLanguage } from '@fitness-tracker/shared/data-access';
import { GetExerciseRequestDto } from '../../entities/dto/request/get/get-exercise-request.dto';
import { ExerciseResponseModel } from '../models/exercise-response.model';
import { CreateUpdateExerciseRequestDTO } from '../../entities/dto/request/update/exercise-create-update-request.dto';
import { ExerciseDetailsDialogComponent } from '../../application/providers/exercise-details-dialog.provider';
import { selectIsAdmin, selectUserInfo } from '@fitness-tracker/auth/domain';
import { Firestore } from '@angular/fire/firestore';

@Injectable()
export class ExerciseEffects {
  public readonly findExercises$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExercisesActions.findExercises, ExercisesActions.refreshExercises),
      withLatestFrom(
        this.store.select(selectLanguage),
        this.store.select(selectUserInfo).pipe(filter(Boolean)),
      ),
      concatMap(([{ payload, type }, language, { uid: userId }]) =>
        this.exercisesService
          .findExercisesPaginated(
            new GetExerciseRequestDto(
              this.normalizeSearchOptions({ ...payload, userId }),
              language,
              type === EXERCISES_ACTION_NAMES.REFRESH_EXERCISES,
            ),
          )
          .pipe(
            map((exercises: ExerciseResponseModel[]) =>
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
      ofType(ExercisesActions.exerciseSaved),
      withLatestFrom(
        this.store.select(selectUserInfo).pipe(filter(Boolean)),
        this.store.select(selectIsAdmin).pipe(filter(Boolean)),
      ),
      mergeMap(
        ([
          {
            payload: { exercise, id },
          },
          { uid: userId },
          admin,
        ]) =>
          this.exercisesService
            .createOrUpdateExercise(
              new CreateUpdateExerciseRequestDTO(
                {
                  ...exercise,
                  userId: this.getExerciseUserId(userId, admin),
                  admin,
                },
                id,
              ).serialize(),
            )
            .pipe(
              map(() => ExercisesActions.exerciseSavedSuccess()),
              catchError(() => [ExercisesActions.exerciseSavedFailure()]),
            ),
      ),
    ),
  );

  public readonly deleteExercise$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExercisesActions.deleteExercise),
      mergeMap(({ payload }) =>
        this.exercisesService.deleteExercise(payload).pipe(
          map(() => ExercisesActions.deleteExerciseSuccess({ payload })),
          catchError(() => of(ExercisesActions.deleteExerciseFailure())),
        ),
      ),
    ),
  );

  public readonly loadExerciseDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExercisesActions.loadExerciseDetails),
      withLatestFrom(this.store.select(selectLanguage)),
      switchMap(([{ payload }, lang]) =>
        this.exercisesService.getExerciseDetails(payload, lang).pipe(
          map((payload) =>
            ExercisesActions.loadExerciseDetailsSuccess({ payload }),
          ),
          catchError(() => of(ExercisesActions.loadExerciseDetailsFailure())),
        ),
      ),
    ),
  );

  public readonly loadExerciseDetailsBeforeOpen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EXERCISES_ACTION_NAMES.OPEN_EXERCISE_DETAILS_DIALOG),
      map(({ payload }) => ExercisesActions.loadExerciseDetails({ payload })),
    ),
  );

  public readonly openExerciseDetailsDialog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EXERCISES_ACTION_NAMES.OPEN_EXERCISE_DETAILS_DIALOG),
      switchMap(() =>
        this.actions$.pipe(
          ofType(ExercisesActions.loadExerciseDetailsSuccess),
          first(),
        ),
      ),
      switchMap(({ payload }) =>
        forkJoin([of(payload), this.detailsDialogFactory]).pipe(
          switchMap(([exercise, component]) =>
            this.dialog
              .open(component, { data: { exercise } })
              .afterClosed()
              .pipe(map(() => ExercisesActions.releaseExerciseDetails())),
          ),
        ),
      ),
    ),
  );

  constructor(
    @Inject(ExerciseDetailsDialogComponent)
    private readonly detailsDialogFactory: Observable<Type<unknown>>,
    private readonly actions$: Actions,
    private readonly exercisesService: FirebaseExerciseDataService,
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly afs: Firestore,
  ) {}

  private normalizeSearchOptions({
    sortOrder = ORDER_BY.DESC,
    firstPage = DEFAULT_PAGINATION_STATE.firstPage,
    pageSize = DEFAULT_PAGINATION_STATE.pageSize,
    ...options
  }: {
    userId: string;
    sortOrder?: ORDER_BY;
    ids?: string[];
    targetMuscles?: string[];
    firstPage?: boolean;
    pageSize?: number;
  }) {
    return {
      ...options,
      sortOrder,
      firstPage,
      pageSize,
    };
  }

  private getExerciseUserId(userId: string, admin: boolean) {
    return admin ? null : userId ?? null;
  }
}
