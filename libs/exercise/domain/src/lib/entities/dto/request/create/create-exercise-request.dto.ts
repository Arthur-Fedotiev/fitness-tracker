import { UpdateExerciseRequestDTO } from '../update/exercise-update-request.dto';

export type CreateExerciseRequestDto = Pick<
  UpdateExerciseRequestDTO,
  'baseData' | 'translatableData'
>;
