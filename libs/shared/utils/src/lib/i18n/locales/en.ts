import { ComponentNames } from '../models/components-names-enum';

export const en = {
  [ComponentNames.NavigationBarComponent]: {
    exercisesLink: 'Exercises',
    createExerciseLink: 'Create exercise',
    createUserLink: 'Create User',
    loginLink: 'Login',
  } as const,
} as const;

export type EN_LOCALE = typeof en;
