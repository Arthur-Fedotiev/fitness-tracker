import { Pagination } from '@fitness-tracker/shared/utils';
import { TargetMuscles } from './exercises.consts';

export interface SearchOptions extends Pagination {
  sortOrder: 'desc' | 'asc';
  ids: string[];
  targetMuscles: TargetMuscles;
}
