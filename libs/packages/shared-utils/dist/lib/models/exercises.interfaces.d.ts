export interface Exercise {
    name: string;
    exerciseType: string;
    targetMuscle: string;
    equipment: string;
    rating: number;
    avatarUrl: string;
    avatarSecondaryUrl: string;
    coverUrl: string;
    coverSecondaryUrl: string;
    shortDescription: string;
    longDescription: string;
    instructions: string;
    instructionVideo: string;
    muscleDiagramUrl: string;
    benefits: string;
    userId: string | null;
    admin: boolean;
}
