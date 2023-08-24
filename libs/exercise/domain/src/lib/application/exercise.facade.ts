import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Store } from '@ngrx/store';

import * as ExercisesActions from '../application/+state/exercise.actions';
import * as ExercisesSelectors from '../application/+state/exercise.selectors';
import { Observable } from 'rxjs';
import { ExerciseResponseDto } from '../entities/dto/response/exercise-response.dto';
import { CreateUpdateExerciseRequestDTO } from '../entities/dto/request/update/exercise-create-update-request.dto';
import { SearchOptions } from '../entities/response/exercise-search.interface';
import { IsLoadingQuery } from '../entities/queries/is-loading.query';
import { ExerciseDetailsQuery } from '../entities/queries/exercise-details.query';
import { LoadExerciseDetailsCommand } from '../entities/commands/load-exercise-details.command';
import { ReleaseExerciseDetailsCommand } from '../entities/commands/release-exercise-details.command';
import { ExerciseSavedCommand } from '../entities/commands';
import { Router } from '@angular/router';

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
    private readonly router: Router,
  ) {}

  public exercisePreviews$(
    ids: Set<string>,
  ): Observable<Pick<ExerciseResponseDto, 'avatarUrl' | 'id' | 'name'>[]> {
    return this.store.select(ExercisesSelectors.selectExercisePreview(ids));
  }

  public getAllExercises(): void {
    this.store.dispatch(ExercisesActions.loadExercises());
  }

  public exerciseSaved(exercise: CreateUpdateExerciseRequestDTO) {
    const id = exercise.baseData?.id ?? this.afs.createId();

    // return /error/i.test(exercise.translatableData.name)
    //   ? timer(1_500).pipe(
    //       switchMap(() => throwError(() => 'Opps! Exercise name was "Error"')),
    //     )
    //   : this.exercisesService.createOrUpdateExercise(
    //       exercise.setId(id).serialize(),
    //     );

    this.store.dispatch(
      ExercisesActions.exerciseSaved({
        payload: exercise.setId(id).serialize(),
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
