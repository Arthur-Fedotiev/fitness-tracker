import { WithId } from '@fitness-tracker/shared/utils';
import {
  SerializedWorkoutItem,
  SerializedWorkout,
  WorkoutDetails,
} from '../classes/workout-serializer';

export const getIds = ({ id, children }: SerializedWorkoutItem): any[] =>
  !children?.length ? [id] : children.map(getIds);

export const toIdsFromSerializedWorkout = (workout: SerializedWorkout) => {
  return workout.content.map(getIds).flat(2);
};

export const toExercisesMap = (
  map: Map<string, WithId<unknown>>,
  exercise: WithId<unknown>,
): Map<string, WithId<unknown>> => map.set(exercise.id, exercise);

export const toWorkoutDetailsItem = (
  workoutItem: SerializedWorkoutItem,
  exercisesMap: Map<string, WithId<unknown>>,
): WorkoutDetails['content'][number] =>
  !workoutItem.children?.length
    ? { ...workoutItem, ...exercisesMap.get(workoutItem.id) }
    : {
        ...workoutItem,
        children: workoutItem.children.map((item: SerializedWorkoutItem) =>
          toWorkoutDetailsItem(item, exercisesMap),
        ),
      };

export const toWorkoutDetails = ({
  exercises,
  serializedWorkout,
}: {
  exercises: Map<string, WithId<unknown>>;
  serializedWorkout: SerializedWorkout;
}) => ({
  ...serializedWorkout,
  content: serializedWorkout.content.map((workoutItem: SerializedWorkoutItem) =>
    toWorkoutDetailsItem(workoutItem, exercises),
  ),
});
