import {
  InstructionType,
  SerializedWorkoutItem,
  WorkoutDetails,
} from '../classes';
import { WorkoutDetailsVm } from './models';

const ONE_REP_DURATION_SEC = 3;

const calcNodeTotalSets = (node: SerializedWorkoutItem): number =>
  node.children?.length
    ? node.totalSets *
      node.children.reduce((sum, child) => sum + calcNodeTotalSets(child), 0)
    : node.totalSets;

const calcWorkoutTotalSets = (workout: SerializedWorkoutItem[]): number =>
  workout.reduce((sum, node) => sum + calcNodeTotalSets(node), 0);

const calculateExerciseReps = (exercise: SerializedWorkoutItem) =>
  exercise.type === InstructionType.REPS ? exercise.load! : 1;

const calculateTotalReps = (workoutContent: WorkoutDetails['content']) =>
  workoutContent.reduce((totalReps, node) => {
    if (node.children?.length) {
      const totalChildReps = node.children.reduce(
        (total, child) => total + calculateExerciseReps(child),
        0,
      );
      return totalReps + totalChildReps * node.totalSets;
    }

    return totalReps + calculateExerciseReps(node) * node.totalSets;
  }, 0);

const calculateTotalExercises = (workoutContent: WorkoutDetails['content']) =>
  workoutContent.reduce(
    (totalExercises, node) => totalExercises + (node.children?.length ?? 1),
    0,
  );

const calculateTotalRestTimeSec = (workoutContent: WorkoutDetails['content']) =>
  workoutContent.reduce(
    (totalRestTime, node) =>
      totalRestTime +
      (node.children?.length
        ? node.children.length * node.restPauseBetween +
          node.restPauseAfterComplete
        : node.restPauseBetween),
    0,
  );

const calculateTotalTimeForDurationExercisesSec = (
  workoutContent: WorkoutDetails['content'],
) =>
  workoutContent
    .flatMap((node) =>
      node.children
        ? node.children?.filter(
            (child) => child.type === InstructionType.DURATION,
          )
        : node.type === InstructionType.DURATION
        ? node
        : [],
    )
    .reduce((sum, node) => sum + node.load!, 0);

export const toWorkoutDetailsVm = (workoutDetails: WorkoutDetails) => {
  const totalSets = calcWorkoutTotalSets(workoutDetails.content);
  const totalReps = calculateTotalReps(workoutDetails.content);
  const totalExercises = calculateTotalExercises(workoutDetails.content);
  const totalRestTime = calculateTotalRestTimeSec(workoutDetails.content);
  const totalTimeForDurationExercises =
    calculateTotalTimeForDurationExercisesSec(workoutDetails.content);

  const estimatedDurationMin = Math.round(
    (totalRestTime +
      totalTimeForDurationExercises +
      totalReps * ONE_REP_DURATION_SEC) /
      60,
  );

  return {
    ...workoutDetails,
    totalSets,
    totalReps,
    totalExercises,
    estimatedDurationMin,
  } satisfies WorkoutDetailsVm;
};
