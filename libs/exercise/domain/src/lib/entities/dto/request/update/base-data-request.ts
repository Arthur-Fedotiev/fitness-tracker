import { ExerciseResponseDto } from '../../../response/exercise-response';

export type BaseDataRequest = ExerciseResponseDto['baseData'] & { id?: string };
