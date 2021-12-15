import { ComponentNames } from '../models/components-names-enum';

export const ru = {
  [ComponentNames.NavigationBarComponent]: {
    exercisesLink: 'Упражнения',
    createExerciseLink: 'Создать упражнение',
    createUserLink: 'Создать пользователя',
    loginLink: 'Войти',
  } as const,
} as const;

export type RU_LOCALE = typeof ru;
