import { LOAD_EXERCISES_ACTIONS } from '../../../exercise.enums';
import { SearchOptions } from '../get/get-exercise-request.dto';
import { BaseDataRequest } from './base-data-request';
import { TranslatableExerciseDataRequest } from './translatable-data-request';

export class UpdateExerciseRequestDTO {
  public baseData!: BaseDataRequest;
  public translatableData!: TranslatableExerciseDataRequest;

  constructor(
    {
      rating,
      avatarUrl,
      avatarSecondaryUrl,
      coverUrl,
      coverSecondaryUrl,
      targetMuscle,
      exerciseType,
      equipment,
      instructionVideo,
      muscleDiagramUrl,
      ...translatableData
    }: BaseDataRequest & TranslatableExerciseDataRequest,
    id?: string,
  ) {
    this.baseData = {
      rating,
      coverUrl,
      coverSecondaryUrl,
      avatarUrl,
      avatarSecondaryUrl,
      targetMuscle,
      exerciseType,
      equipment,
      id,
      instructionVideo,
      muscleDiagramUrl,
    };
    this.translatableData = translatableData;
  }

  public setId(id: string): UpdateExerciseRequestDTO {
    this.baseData.id = id;

    return this;
  }

  public serialize(): ExerciseMetaDTO {
    return { ...this };
  }
}

export type ExerciseMetaDTO = Pick<
  UpdateExerciseRequestDTO,
  'baseData' | 'translatableData'
>;

export class ExercisePagination {
  public readonly type = LOAD_EXERCISES_ACTIONS.EXERCISE_PAGINATION;
  constructor(public payload: Pick<SearchOptions, 'pageSize' | 'firstPage'>) {}
}

export class ExerciseListQueryChange {
  public readonly type = LOAD_EXERCISES_ACTIONS.EXERCISE_PAGE_QUERY_CHANGE;
  constructor(public payload: Pick<SearchOptions, 'targetMuscles'>) {}
}
