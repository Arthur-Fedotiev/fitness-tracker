import { ExerciseResponse } from '../../../response/exercise-response';

export type BaseDataRequest = ExerciseResponse['baseData'] & { id?: string };
