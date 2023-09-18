export interface WorkoutPreviewVM {
  id: string;
  name: string;
  img: string;
  level: string;
  targetMuscles: string[];
  hasPriority: boolean;
  canDelete: boolean;
  canEdit: boolean;
}
