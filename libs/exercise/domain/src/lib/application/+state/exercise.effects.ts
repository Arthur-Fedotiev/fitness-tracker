import { Injectable, Type, inject } from '@angular/core';
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
import { GetExerciseRequestDto } from '../../entities/dto/request/get/get-exercise-request.dto';
import { CreateUpdateExerciseRequestDTO } from '../../entities/dto/request/update/exercise-create-update-request.dto';
import { ExerciseDetailsDialogComponent } from '../../application/providers/exercise-details-dialog.provider';
import { selectIsAdmin, selectUserInfo } from '@fitness-tracker/auth/domain';
import { tap } from 'rxjs/operators';

@Injectable()
export class ExerciseEffects {
  private readonly detailsDialogFactory = inject<Observable<Type<unknown>>>(ExerciseDetailsDialogComponent);
  private readonly actions$ = inject(Actions);
  private readonly exercisesService = inject(FirebaseExerciseDataService);
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);

  public readonly findExercises$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExercisesActions.findExercises, ExercisesActions.refreshExercises),
      withLatestFrom(
        this.store.select(selectUserInfo).pipe(filter(Boolean)),
        this.store.select(selectIsAdmin),
      ),
      concatMap(([{ payload, type }, { uid: userId }, isAdmin]) =>
        this.exercisesService
          .findExercisesPaginated(
            new GetExerciseRequestDto(
              this.normalizeSearchOptions({ ...payload, userId, isAdmin }),
              type === EXERCISES_ACTION_NAMES.REFRESH_EXERCISES,
            ),
          )
          .pipe(
            map((exercises) =>
              type === EXERCISES_ACTION_NAMES.REFRESH_EXERCISES
                ? ExercisesActions.refreshExercisesSuccess({
                    payload: exercises,
                  })
                : ExercisesActions.findExercisesSuccess({
                    payload: { exercises, firstPage: !!payload.firstPage },
                  }),
            ),
            catchError((payload) =>
              of(
                type === EXERCISES_ACTION_NAMES.REFRESH_EXERCISES
                  ? ExercisesActions.findExercisesFailure({ payload })
                  : ExercisesActions.refreshExercisesFailure({ payload }),
              ),
            ),
          ),
      ),
    ),
  );

  public readonly saveExercise$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExercisesActions.exerciseSaved),
      withLatestFrom(
        this.store.select(selectUserInfo).pipe(filter(Boolean)),
        this.store.select(selectIsAdmin),
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
                  userId: admin ? null : userId,
                  admin,
                },
                id,
              ),
            )
            .pipe(
              map(() => ExercisesActions.exerciseSavedSuccess()),
              catchError((payload) => [
                ExercisesActions.exerciseSavedFailure({ payload }),
              ]),
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
          catchError((payload) =>
            of(ExercisesActions.deleteExerciseFailure({ payload })),
          ),
        ),
      ),
    ),
  );

  public readonly loadExerciseDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExercisesActions.loadExerciseDetails),
      switchMap(({ payload }) =>
        this.exercisesService.getExerciseDetails(payload).pipe(
          map((payload) =>
            ExercisesActions.loadExerciseDetailsSuccess({ payload }),
          ),
          catchError((payload) =>
            of(ExercisesActions.loadExerciseDetailsFailure({ payload })),
          ),
        ),
      ),
    ),
  );

  public readonly loadExerciseDetailsBeforeOpen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExercisesActions.openExerciseDetailsDialog),
      map(({ payload }) => ExercisesActions.loadExerciseDetails({ payload })),
    ),
  );

  public readonly openExerciseDetailsDialog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExercisesActions.openExerciseDetailsDialog),
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
              .open(component, {
                minWidth: '24rem',
                width: 'fit-content',
                height: 'fit-content',
                maxWidth: '80vw',
                data: { exercise },
              })
              .afterClosed()
              .pipe(map(() => ExercisesActions.releaseExerciseDetails())),
          ),
        ),
      ),
    ),
  );

  readonly logErrors$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ExercisesActions.loadExercisesFailure,
          ExercisesActions.findExercisesFailure,
          ExercisesActions.refreshExercisesFailure,
          ExercisesActions.exerciseSavedFailure,
          ExercisesActions.deleteExerciseFailure,
          ExercisesActions.loadExerciseDetailsFailure,
        ),
        tap(({ payload }) => console.error(payload)),
      ),
    { dispatch: false },
  );

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
    isAdmin: boolean;
  }) {
    return {
      ...options,
      sortOrder,
      firstPage,
      pageSize,
    };
  }
}
