export interface Exercise {
    name: string;
    exerciseType: string;
    targetMuscle: string;
    equipment: string;
    avatarUrl: string;
    avatarSecondaryUrl: string;
    instructions: string[];
    instructionVideo: string | null;
    userId: string | null;
    admin: boolean;
}
