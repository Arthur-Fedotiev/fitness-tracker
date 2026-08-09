export interface Exercise {
  name: string;
  exerciseType: string;
  targetMuscle: string;
  equipment: string;
  instructions: string[];
  userId: string | null;
  admin: boolean;
}
