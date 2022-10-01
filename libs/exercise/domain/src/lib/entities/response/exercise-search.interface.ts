import { Pagination } from '@fitness-tracker/shared/utils';
import { ExerciseDescriptors } from '../exercise-descriptors/exercise-descriptors.token';

export interface SearchOptions extends Pagination {
  readonly sortOrder: 'desc' | 'asc';
  readonly ids: string[];
  readonly targetMuscles: ExerciseDescriptors['muscles'];
}
