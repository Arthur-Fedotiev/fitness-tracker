import { InjectionToken } from '@angular/core';

export interface ReleaseExerciseDetailsCommand {
  releaseExerciseDetails(): void;
}

export const RELEASE_EXERCISE_DETAILS_COMMAND =
  new InjectionToken<ReleaseExerciseDetailsCommand>(
    'ReleaseExerciseDetailsCommand',
  );
