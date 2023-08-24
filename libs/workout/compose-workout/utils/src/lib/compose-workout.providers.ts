import { SerializerStrategy } from '@fitness-tracker/shared/utils';
import { ConcreteWorkoutItemSerializer } from '@fitness-tracker/workout-domain';
import { COMPOSE_WORKOUT_DIALOG_FACTORY } from './compose-workout-dialog-config.factory';
import { CreateComposeWorkoutDialog } from './create-dialog.factory';
import { EXERCISE_DESCRIPTORS_PROVIDER } from '@fitness-tracker/exercise/domain';

export const COMPOSE_WORKOUT_PROVIDERS = [
  {
    provide: SerializerStrategy,
    useExisting: ConcreteWorkoutItemSerializer,
  },
  EXERCISE_DESCRIPTORS_PROVIDER,
  {
    provide: COMPOSE_WORKOUT_DIALOG_FACTORY,
    useClass: CreateComposeWorkoutDialog,
  },
];
