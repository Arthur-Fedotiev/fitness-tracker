import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { filter, first, Observable, of, tap } from 'rxjs';
import { ExercisesFacade } from '@fitness-tracker/exercises/data';
import { ExercisesEntity } from '@fitness-tracker/exercises/model';

@Injectable()
export class ExerciseResolver implements Resolve<ExercisesEntity> {
  constructor(private exerciseFacade: ExercisesFacade) {

  }
  resolve(route: ActivatedRouteSnapshot): Observable<ExercisesEntity> {
    const id = (route.paramMap.get('id'));

    return this.hasIdParam(id)
      ? this.exerciseFacade.selectedExerciseDetails$.pipe(
        tap((exercise: ExercisesEntity | null) => !exercise && this.exerciseFacade.loadExerciseDetails(id)),
        filter(Boolean),
        first(),
      )
      : of({} as ExercisesEntity)
  }

  private hasIdParam(id: string | null): id is string {
    return Boolean(id);
  }
}
