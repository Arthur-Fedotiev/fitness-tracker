import { SearchOptions } from '@fitness-tracker/shared/utils';
import { LOAD_EXERCISES_ACTIONS } from '..';
import {
  ExerciseBaseData,
  Exercise,
  ExerciseTranslatableData,
} from './exercise-model';

export class ExerciseRequestDTO {
  public baseData!: ExerciseBaseData;
  public translatableData!: ExerciseTranslatableData;

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
    }: Exercise,
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

  public setId(id: string): ExerciseRequestDTO {
    this.baseData.id = id;

    return this;
  }

  public serialize(): ExerciseMetaDTO {
    return { ...this };
  }
}

export type ExerciseMetaDTO = Pick<
  ExerciseRequestDTO,
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
