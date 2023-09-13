export interface ExerciseVM {
  id: string;
  name: string;
  avatarUrl: string;
  avatarSecondaryUrl: string;
  equipment: string;
  exerciseType: string;
  targetMuscle: string;
  canEdit: boolean;
  canDelete: boolean;
  isSelected: boolean;
  userId: string | null;
}
