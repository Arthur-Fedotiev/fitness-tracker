export interface Exercise {
    name: string;
    exerciseType: string;
    targetMuscles: string[];
    equipment: string;
    instructions: string[];
    userId: string | null;
    admin: boolean;
}
