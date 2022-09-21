import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, tap, withLatestFrom } from 'rxjs/operators';
import { EMPTY, Observable, of, pipe, switchMap, UnaryFunction } from 'rxjs';

import { WorkoutActionNames } from '../actions/workout-action-names';
import {
  createWorkoutFailure,
  createWorkoutSuccess,
  loadWorkoutDetailsFailure,
  loadWorkoutDetailsSuccess,
  loadWorkoutPreviewsSuccess,
} from '../actions/workouts.actions';
import { WorkoutService } from '../../services/workout.service';
import { WorkoutPreview } from '@fitness-tracker/workout/model';
import {
  ConcreteWorkoutItemSerializer,
  SerializedWorkout,
  SerializeWorkoutItem,
  toExercisesMap,
  toIdsFromSerializedWorkout,
  toWorkoutDetails,
  WithPayload,
  WorkoutDetails,
} from '@fitness-tracker/shared/utils';
import { Store } from '@ngrx/store';
import { selectLanguage } from '@fitness-tracker/shared/data-access';
import {
  ExercisesService,
  loadExerciseDetailsFailure,
} from '@fitness-tracker/exercises/data';
import { ExercisesEntity } from '@fitness-tracker/exercises/model';
import { LanguageCodes } from 'shared-package';
import { MatDialog } from '@angular/material/dialog';
import {
  ComposeWorkoutComponent,
  getDialogConfig,
} from '@fitness-tracker/shared/dialogs';

@Injectable()
export class WorkoutsEffects {
  public readonly createWorkout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkoutActionNames.CREATE_WORKOUT),
      switchMap(({ payload }: WithPayload<SerializedWorkout>) =>
        this.workoutAPI.createWorkout(payload).pipe(
          map((payload) => createWorkoutSuccess()),
          catchError((error) => of(createWorkoutFailure())),
        ),
      ),
    ),
  );

  public readonly loadWorkouts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkoutActionNames.LOAD_WORKOUT_PREVIEWS),
      switchMap(({ payload }) =>
        this.workoutAPI.getWorkoutPreviews(payload).pipe(
          map((payload: WorkoutPreview[]) =>
            loadWorkoutPreviewsSuccess({ payload }),
          ),
          catchError((error) => of(loadExerciseDetailsFailure())),
        ),
      ),
    ),
  );

  public readonly editWorkout = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WorkoutActionNames.EDIT_WORKOUT),
        this.getWorkoutDetailsLocalized$(),
        tap(console.log),
        map(({ content, ...basicInfo }: WorkoutDetails) =>
          this.dialog.open(
            ComposeWorkoutComponent,
            getDialogConfig(
              content.map((item) => this.workoutSerializer.deserialize(item)),
              basicInfo,
            ),
          ),
        ),
        catchError((err: any) => {
          console.error(err);
          return EMPTY;
        }),
      ),
    { dispatch: false },
  );

  public readonly loadWorkoutDetails = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkoutActionNames.LOAD_WORKOUT_DETAILS),
      this.getWorkoutDetailsLocalized$(),
      map((payload: WorkoutDetails) => loadWorkoutDetailsSuccess({ payload })),
      catchError((err) => {
        console.log(err);
        return of(loadWorkoutDetailsFailure());
      }),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly workoutAPI: WorkoutService,
    private readonly exercisesService: ExercisesService,
    private readonly dialog: MatDialog,
    private readonly workoutSerializer: ConcreteWorkoutItemSerializer,
  ) {}

  private getWorkoutDetailsLocalized$(): UnaryFunction<
    Observable<WithPayload<string>>,
    Observable<WorkoutDetails>
  > {
    return pipe(
      withLatestFrom(this.store.select(selectLanguage)),
      switchMap(([{ payload }, lang]: [WithPayload<string>, LanguageCodes]) =>
        this.workoutAPI.getWorkout(payload).pipe(
          map((serializedWorkout) => ({
            serializedWorkout,
            ids: toIdsFromSerializedWorkout(serializedWorkout),
          })),
          switchMap(
            ({
              ids,
              serializedWorkout,
            }: {
              ids: string[];
              serializedWorkout: SerializedWorkout;
            }) =>
              this.exercisesService.findExercisesForWorkout({ ids }, lang).pipe(
                map((exercises: ExercisesEntity[]) => ({
                  exercises: exercises.reduce(
                    toExercisesMap,
                    new Map<string, ExercisesEntity>(),
                  ),
                  serializedWorkout,
                })),
              ),
          ),
          map(toWorkoutDetails),
        ),
      ),
    );
  }
}
