import { Inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import {
  LOAD_EXERCISE_DETAILS_COMMAND,
  LoadExerciseDetailsCommand,
} from '../../entities/commands/load-exercise-details.command';

@Injectable({
  providedIn: 'root',
})
export class ExerciseResolver implements Resolve<void> {
  constructor(
    @Inject(LOAD_EXERCISE_DETAILS_COMMAND)
    private readonly exerciseCommand: LoadExerciseDetailsCommand,
  ) {}
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
