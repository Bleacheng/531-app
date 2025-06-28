// 1RM Calculator using Epley Formula
// 1RM = weight × (1 + reps/30)

export const calculateOneRM = (weight: number, reps: number): number => {
    if (reps <= 0 || weight <= 0) return 0;
    if (reps === 1) return weight;

    return weight * (1 + reps / 30);
};

// Calculate estimated max reps from 1RM
export const calculateMaxReps = (oneRM: number, weight: number): number => {
    if (weight <= 0 || oneRM <= 0) return 0;
    if (weight >= oneRM) return 1;

    return Math.round((oneRM / weight - 1) * 30);
};

// Calculate weight for target reps
export const calculateWeightForReps = (oneRM: number, targetReps: number): number => {
    if (targetReps <= 0 || oneRM <= 0) return 0;

    return oneRM / (1 + targetReps / 30);
}; 