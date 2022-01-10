import { ExercisesEntity } from '@fitness-tracker/exercises/model';
import { SerializedWorkout, SerializeWorkoutItem, WorkoutDetails } from '../..';

export const getIds = ({ id, children }: SerializeWorkoutItem): any[] =>
  !children?.length ? [id] : children.map(getIds);

export const toIdsFromSerializedWorkout = (workout: SerializedWorkout) => {
  return workout.content.map(getIds).flat(2);
};

export const toExercisesMap = (
  map: Map<string, ExercisesEntity>,
  exercise: ExercisesEntity,
): Map<string, ExercisesEntity> => map.set(exercise.id, exercise);

export const toWorkoutDetailsItem = (
  workoutItem: SerializeWorkoutItem,
  exercisesMap: Map<string, ExercisesEntity>,
): WorkoutDetails['content'][number] =>
  !workoutItem.children?.length
    ? { ...workoutItem, ...exercisesMap.get(workoutItem.id) }
    : {
        ...workoutItem,
        children: workoutItem.children.map((item: SerializeWorkoutItem) =>
          toWorkoutDetailsItem(item, exercisesMap),
        ),
      };

export const toWorkoutDetails = ({
  exercises,
  serializedWorkout,
}: {
  exercises: Map<string, ExercisesEntity>;
  serializedWorkout: SerializedWorkout;
}) => ({
  ...serializedWorkout,
  content: serializedWorkout.content.map((workoutItem: SerializeWorkoutItem) =>
    toWorkoutDetailsItem(workoutItem, exercises),
  ),
});
