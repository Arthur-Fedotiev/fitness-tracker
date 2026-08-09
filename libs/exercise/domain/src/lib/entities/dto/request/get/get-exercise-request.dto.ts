import { ORDER_BY, Pagination } from '@fitness-tracker/shared/utils';

export interface SearchOptionsDto extends Pagination {
  readonly sortOrder: ORDER_BY;
  readonly targetMuscles?: string[];
  readonly userId: string;
  readonly isAdmin: boolean;
}

export class GetExerciseRequestDto {
  readonly type = ExerciseSearchType.ExerciseSearch;

  constructor(
    public readonly searchOptions: SearchOptionsDto,
    public readonly refresh: boolean = false,
  ) {}
}

export interface WorkoutExercisesSearchOptions {
  readonly ids: string[];
  readonly userId: string;
  readonly isAdmin: boolean;
}

export class GetWorkoutExercisesRequestDto {
  readonly type = ExerciseSearchType.WorkoutExerciseSearch;

  constructor(public readonly searchOptions: WorkoutExercisesSearchOptions) {}
}

export enum ExerciseSearchType {
  ExerciseSearch = 'exercise-search',
  WorkoutExerciseSearch = 'workout-exercises-search',
}

export type GetExerciseRequest =
  | GetExerciseRequestDto
  | GetWorkoutExercisesRequestDto;
