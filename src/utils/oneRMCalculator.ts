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

// Generate sample 1RM progression data
export const generateSampleOneRMData = (baseOneRMs: {
    benchPress: number;
    squat: number;
    deadlift: number;
    overheadPress: number;
}, cycles: number = 3) => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (cycles * 28)); // 4 weeks per cycle

    for (let cycle = 0; cycle <= cycles; cycle++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + (cycle * 28));

        // Simulate realistic progression (small increases with some variation)
        const progressionFactor = 1 + (cycle * 0.02) + (Math.random() * 0.01 - 0.005);

        data.push({
            date: date.toISOString().split('T')[0],
            benchPress: Math.round(baseOneRMs.benchPress * progressionFactor),
            squat: Math.round(baseOneRMs.squat * progressionFactor),
            deadlift: Math.round(baseOneRMs.deadlift * progressionFactor),
            overheadPress: Math.round(baseOneRMs.overheadPress * progressionFactor),
        });
    }

    return data;
}; 