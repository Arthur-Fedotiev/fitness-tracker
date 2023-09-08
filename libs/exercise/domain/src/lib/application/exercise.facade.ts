import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import * as ExercisesActions from '../application/+state/exercise.actions';
import * as ExercisesSelectors from '../application/+state/exercise.selectors';
import { Observable, map } from 'rxjs';
import { ExerciseResponseDto } from '../entities/dto/response/exercise-response.dto';
import { SearchOptions } from '../entities/response/exercise-search.interface';
import { IsLoadingQuery } from '../entities/queries/is-loading.query';
import { ExerciseDetailsQuery } from '../entities/queries/exercise-details.query';
import { LoadExerciseDetailsCommand } from '../entities/commands/load-exercise-details.command';
import { ReleaseExerciseDetailsCommand } from '../entities/commands/release-exercise-details.command';
import { ExerciseSavedCommand } from '../entities/commands';
import { Router } from '@angular/router';
import { SaveExerciseCommandModel } from './models/create-update-exercise.models';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class ExerciseFacade
  implements
    IsLoadingQuery,
    ExerciseDetailsQuery,
    LoadExerciseDetailsCommand,
    ReleaseExerciseDetailsCommand,
    ExerciseSavedCommand
{
  private readonly exercisesList$ = this.store
    .select(ExercisesSelectors.getAllExercises)
    .pipe(map((exercises) => exercises.filter(({ name }) => name)));

  public readonly isLoading$ = this.store.select(ExercisesSelectors.getLoading);
  public readonly exercisesList = toSignal(this.exercisesList$, {
    initialValue: [] as ExerciseResponseDto[],
  });
  public readonly selectedExerciseDetails$ = this.store.select(
    ExercisesSelectors.getSelectedExerciseDetails,
  );

  constructor(private readonly store: Store, private readonly router: Router) {}

  public exercisePreviews$(
    ids: Set<string>,
  ): Observable<Pick<ExerciseResponseDto, 'avatarUrl' | 'id' | 'name'>[]> {
    return this.store.select(ExercisesSelectors.selectExercisePreview(ids));
  }

  public getAllExercises(): void {
    this.store.dispatch(ExercisesActions.loadExercises());
  }

  public exerciseSaved(saveExerciseCommand: SaveExerciseCommandModel) {
    this.store.dispatch(
      ExercisesActions.exerciseSaved({
        payload: saveExerciseCommand,
      }),
    );

    this.router.navigate(['exercises', 'all']);
  }

  public loadExerciseDetails(payload: string): void {
    this.store.dispatch(ExercisesActions.loadExerciseDetails({ payload }));
  }

  public releaseExerciseDetails(): void {
    this.store.dispatch(ExercisesActions.releaseExerciseDetails());
  }

  public deleteExercise(payload: string): void {
    this.store.dispatch(ExercisesActions.deleteExercise({ payload }));
  }

  public findExercises(payload: Partial<SearchOptions>): void {
    this.store.dispatch(ExercisesActions.findExercises({ payload }));
  }

  public refreshExercises(payload: Partial<SearchOptions>): void {
    this.store.dispatch(ExercisesActions.refreshExercises({ payload }));
  }

  public emptyExercisesList(): void {
    this.store.dispatch(ExercisesActions.emptyExercisesList());
  }

  public openExerciseDetailsDialog(payload: string): void {
    this.store.dispatch(
      ExercisesActions.openExerciseDetailsDialog({ payload }),
    );
  }
}
