import {
  ExerciseDetailsDialogComponent,
  EXERCISE_DESCRIPTORS_PROVIDER,
  EXERCISE_DOMAIN_PROVIDERS,
} from '@fitness-tracker/exercise/domain';
import { from, map } from 'rxjs';

export const exerciseDetailsDialogProvider = {
  provide: ExerciseDetailsDialogComponent,
  useFactory: () =>
    from(import('@fitness-tracker/exercise/ui-components')).pipe(
      map((module) => module.ExerciseDetailsComponent),
    ),
};

export const DISPLAY_PAGE_PROVIDERS = [
  EXERCISE_DESCRIPTORS_PROVIDER,
  EXERCISE_DOMAIN_PROVIDERS,
  exerciseDetailsDialogProvider,
];
