import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import {
  LOAD_EXERCISE_DETAILS_COMMAND,
  LoadExerciseDetailsCommand,
} from '../../entities/commands/load-exercise-details.command';

@Injectable({
  providedIn: 'root',
})
export class ExerciseResolver  {
  private readonly exerciseCommand = inject<LoadExerciseDetailsCommand>(LOAD_EXERCISE_DETAILS_COMMAND);

  resolve(route: ActivatedRouteSnapshot): void {
    const id = route.paramMap.get('id');

    return this.hasIdParam(id)
      ? this.exerciseCommand.loadExerciseDetails(id)
      : void 0;
  }

  private hasIdParam(id: string | null): id is string {
    return Boolean(id);
  }
}
