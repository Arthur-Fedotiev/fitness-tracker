export interface WorkoutPreview {
  id: string;
  name: string;
  img: string;
  level: string;
  targetMuscles: string[];
  userId: string | null;
  admin: boolean;
}
