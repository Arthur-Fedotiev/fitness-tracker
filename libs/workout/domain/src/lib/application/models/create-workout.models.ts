import { WorkoutBasicInfo } from '../classes';

export type WorkoutBasicInfoFormModel = Omit<
  WorkoutBasicInfo,
  'id' | 'userId' | 'admin'
>;
