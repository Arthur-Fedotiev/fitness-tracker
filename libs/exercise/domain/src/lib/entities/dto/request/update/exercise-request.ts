import { ExerciseResponseDto } from '../../../response/exercise-response';

export type ExerciseRequest = ExerciseResponseDto & { id?: string };
