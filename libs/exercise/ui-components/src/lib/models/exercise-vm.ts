export interface ExerciseVM {
  id: string;
  name: string;
  equipment: string;
  exerciseType: string;
  targetMuscles: string[];
  canEdit: boolean;
  canDelete: boolean;
  isSelected: boolean;
  userId: string | null;
}
