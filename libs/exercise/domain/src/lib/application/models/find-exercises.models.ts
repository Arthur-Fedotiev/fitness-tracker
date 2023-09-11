import { SearchOptionsDto } from '../../entities/dto/request/get/get-exercise-request.dto';

export enum LOAD_EXERCISES_ACTIONS {
  'EXERCISE_PAGINATION' = 'EXERCISE_PAGINATION',
  'EXERCISE_QUERY_CHANGE' = 'EXERCISE_PAGE_QUERY_CHANGE',
}
export type FindExercisesSearchOptions = Partial<
  Omit<SearchOptionsDto, 'userId' | 'ids'>
>;

export class ExercisePagination {
  public readonly type = LOAD_EXERCISES_ACTIONS.EXERCISE_PAGINATION;
  constructor(
    public payload: Pick<SearchExercisesState, 'pageSize' | 'firstPage'>,
  ) {}
}

export class ExerciseListQueryChange {
  public readonly type = LOAD_EXERCISES_ACTIONS.EXERCISE_QUERY_CHANGE;
  constructor(public payload: Pick<SearchExercisesState, 'targetMuscles'>) {}
}

export interface SearchExercisesState {
  pageSize: number;
  firstPage: boolean;
  targetMuscles: string[];
}
