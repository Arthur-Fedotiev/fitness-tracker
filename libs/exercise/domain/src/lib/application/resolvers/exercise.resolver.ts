import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { filter, first, Observable, of, tap } from 'rxjs';
import { ExerciseResponseDto } from '../../entities/dto/response/exercise-response.dto';
import { ExerciseFacade } from '../exercise.facade';

@Injectable({
  providedIn: 'root',
})
export class ExerciseResolver implements Resolve<ExerciseResponseDto> {
  constructor(private exerciseFacade: ExerciseFacade) {}
  resolve(route: ActivatedRouteSnapshot): Observable<ExerciseResponseDto> {
    const id = route.paramMap.get('id');

    return this.hasIdParam(id)
      ? this.exerciseFacade.selectedExerciseDetails$.pipe(
          tap(
            (exercise: ExerciseResponseDto | null) =>
              !exercise && this.exerciseFacade.loadExerciseDetails(id),
          ),
          filter(Boolean),
          first(),
        )
      : of({} as ExerciseResponseDto);
  }

  private hasIdParam(id: string | null): id is string {
    return Boolean(id);
  }
}
