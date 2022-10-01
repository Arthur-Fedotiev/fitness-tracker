import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Store } from '@ngrx/store';

import * as ExercisesActions from '../+state/exercise/exercise.actions';
import * as ExercisesSelectors from '../+state/exercise/exercise.selectors';
import { Observable } from 'rxjs';
import { ExerciseResponseDto } from '../entities/dto/response/exercise-response.dto';
import { CreateUpdateExerciseRequestDTO } from '../entities/dto/request/update/exercise-create-update-request.dto';
import { SearchOptions } from '../entities/response/exercise-search.interface';
import { IsLoadingQuery } from '../entities/queries/is-loading.query';
import { ExerciseDetailsQuery } from '../entities/queries/exercise-details.query';
import { LoadExerciseDetailsCommand } from '../entities/commands/load-exercise-details.command';
import { ReleaseExerciseDetailsCommand } from '../entities/commands/release-exercise-details.command';
import { ExerciseSavedCommand } from '../entities/commands';

@Injectable({ providedIn: 'root' })
export class ExerciseFacade
  implements
    IsLoadingQuery,
    ExerciseDetailsQuery,
    LoadExerciseDetailsCommand,
    ReleaseExerciseDetailsCommand,
    ExerciseSavedCommand
{
  public readonly isLoading$ = this.store.select(ExercisesSelectors.getLoading);
  public readonly exercisesList$ = this.store.select(
    ExercisesSelectors.getAllExercises,
  );
  public readonly selectedExerciseDetails$ = this.store.select(
    ExercisesSelectors.getSelectedExerciseDetails,
  );

  constructor(
    private readonly store: Store,
    private readonly afs: AngularFirestore,
  ) {}

  public exercisePreviews$(
    ids: Set<string>,
  ): Observable<Pick<ExerciseResponseDto, 'avatarUrl' | 'id' | 'name'>[]> {
    return this.store.select(ExercisesSelectors.selectExercisePreview(ids));
  }

  public getAllExercises(): void {
    this.store.dispatch(ExercisesActions.loadExercises());
  }

  public exerciseSaved(exercise: CreateUpdateExerciseRequestDTO): void {
    const id: string = exercise.baseData?.id ?? this.afs.createId();

    this.store.dispatch(
      ExercisesActions.exerciseSaved({
        payload: exercise.setId(id).serialize(),
      }),
    );
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
