import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Store } from '@ngrx/store';

import * as ExercisesActions from '../+state/exercise/exercise.actions';
import * as ExercisesSelectors from '../+state/exercise/exercise.selectors';
import { Observable } from 'rxjs';
import { ExerciseResponseDto } from '../entities/dto/response/exercise-response.dto';
import { UpdateExerciseRequestDTO } from '../entities/dto/request/update/exercise-update-request.dto';
import { SearchOptions } from '../entities/response/exercise-search.interface';

@Injectable({ providedIn: 'root' })
export class ExerciseFacade {
  public readonly loading$ = this.store.select(ExercisesSelectors.getLoading);
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

  public createExercise(exercise: UpdateExerciseRequestDTO): void {
    const id: string = this.afs.createId();

    this.store.dispatch(
      ExercisesActions.createExerciseMeta({
        payload: exercise.setId(id).serialize(),
      }),
    );
  }

  public updateExercise(exercise: UpdateExerciseRequestDTO): void {
    this.store.dispatch(
      ExercisesActions.updateExercise({ payload: exercise.serialize() }),
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
