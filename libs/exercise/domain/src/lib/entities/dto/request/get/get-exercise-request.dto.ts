import { LanguagesISO } from '@fitness-tracker/shared/i18n/utils';
import { Pagination } from '@fitness-tracker/shared/utils';
import { LanguageCodes } from 'shared-package';

export interface SearchOptions extends Partial<Pagination> {
  sortOrder?: 'desc' | 'asc';
  ids?: string[];
  targetMuscles?: string[];
}

export class GetExerciseRequestDto {
  constructor(
    public readonly searchOptions: SearchOptions,
    public readonly lang: LanguageCodes = LanguagesISO.ENGLISH,
    public readonly refresh: boolean = false,
  ) {}
}
