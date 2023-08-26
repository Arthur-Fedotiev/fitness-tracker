import {
  ActivatedRouteSnapshot,
  ResolveFn,
  Router,
  UrlTree,
} from '@angular/router';
import { ComposeWorkoutData, WorkoutExercise } from '../compose-workout.models';
import { inject } from '@angular/core';
import { SerializerStrategy } from '@fitness-tracker/shared/utils';
import { filter, map } from 'rxjs';
import {
  SerializeWorkoutItem,
  ConcreteSingleWorkoutItemInstruction,
} from '../classes';
import { WorkoutFacadeService } from '../services/workout-facade.service';

const deserialize = (
  items: SerializeWorkoutItem[],
  deserializer: SerializerStrategy,
) =>
  items.map((exercise: WorkoutExercise) =>
    deserializer.deserialize({
      ...exercise,
      ...new ConcreteSingleWorkoutItemInstruction(),
    }),
  );

const resolveExistingWorkoutData = (
  workoutId: string,
  deserializer: SerializerStrategy,
) => {
  const facade = inject(WorkoutFacadeService);
  facade.loadWorkoutDetails(workoutId);

  return facade.workoutDetails$.pipe(
    filter(Boolean),
    map(({ content, ...basicInfo }) => ({
      workoutContent: deserialize(content, deserializer),
      workoutBasicInfo: basicInfo,
    })),
  );
};

export const composedWorkoutDataResolver: ResolveFn<
  ComposeWorkoutData | UrlTree
> = (route: ActivatedRouteSnapshot) => {
  const { workoutExercisesList, workoutBasicInfo } =
    inject(Router).getCurrentNavigation()?.extras?.state ?? {};
  const workoutId = route.queryParamMap.get('workoutId');
  const deserializer = inject(SerializerStrategy);

  if (!workoutId && !workoutExercisesList) {
    console.error(
      'No workoutId or workoutExercisesList provided to compose workout',
    );

    return inject(Router).createUrlTree(['/workout/all']);
  }

  return workoutId
    ? resolveExistingWorkoutData(workoutId, deserializer)
    : {
        workoutContent: deserialize(workoutExercisesList, deserializer),
        workoutBasicInfo,
      };
};
