import { Exercise } from 'shared-package';

export interface SaveExerciseCommandModel {
  exercise: Pick<
    Exercise,
    | 'rating'
    | 'avatarUrl'
    | 'avatarSecondaryUrl'
    | 'coverUrl'
    | 'coverSecondaryUrl'
    | 'targetMuscle'
    | 'exerciseType'
    | 'equipment'
    | 'instructionVideo'
    | 'muscleDiagramUrl'
    | 'name'
    | 'benefits'
    | 'instructions'
    | 'shortDescription'
    | 'longDescription'
  >;
  id?: string;
}
