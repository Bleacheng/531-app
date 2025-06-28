import AsyncStorage from '@react-native-async-storage/async-storage';

// Types for the export/import data structure
export interface WorkoutSet {
    weight: number;
    reps: number;
    completed: boolean;
    notes?: string;
}

export interface WorkoutExercise {
    name: string;
    sets: WorkoutSet[];
    notes?: string;
}

export interface WorkoutSession {
    id: string;
    date: string; // ISO string
    workoutType: '5/5/5+' | '3/3/3+' | '5/3/1+' | 'deload';
    week: number;
    cycle: number;
    exercises: WorkoutExercise[];
    notes?: string;
    completed: boolean;
}

export interface PersonalRecord {
    exercise: string;
    weight: number;
    reps: number;
    date: string; // ISO string
    workoutId: string;
}

export interface TrainingMax {
    benchPress: number;
    squat: number;
    deadlift: number;
    overheadPress: number;
    lastUpdated: string; // ISO string
}

export interface WorkoutSchedule {
    benchPress: string;
    squat: string;
    deadlift: string;
    overheadPress: string;
}

export interface ExerciseProgression {
    benchPress: number;
    squat: number;
    deadlift: number;
    overheadPress: number;
}

export interface AppSettings {
    unit: 'kg' | 'lbs';
    theme: 'system' | 'light' | 'dark';
    workoutSchedule: WorkoutSchedule;
    exerciseProgression: ExerciseProgression;
}

export interface AppData {
    version: string;
    exportDate: string; // ISO string
    settings: AppSettings;
    trainingMaxes: TrainingMax[];
    personalRecords: PersonalRecord[];
    workoutHistory: WorkoutSession[];
    currentCycle: number;
    currentWeek: number;
}

// Default data structure
const defaultAppData: AppData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    settings: {
        unit: 'kg',
        theme: 'system',
        workoutSchedule: {
            benchPress: '',
            squat: '',
            deadlift: '',
            overheadPress: '',
        },
        exerciseProgression: {
            benchPress: 0,
            squat: 0,
            deadlift: 0,
            overheadPress: 0,
        },
    },
    trainingMaxes: [],
    personalRecords: [],
    workoutHistory: [],
    currentCycle: 1,
    currentWeek: 1,
};

// Export all app data
export const exportAppData = async (): Promise<AppData> => {
    try {
        // Get all data from AsyncStorage
        const [
            unitData,
            themeData,
            workoutScheduleData,
            exerciseProgressionData,
            trainingMaxesData,
            personalRecordsData,
            workoutHistoryData,
            currentCycleData,
            currentWeekData,
        ] = await Promise.all([
            AsyncStorage.getItem('settings_unit'),
            AsyncStorage.getItem('settings_theme'),
            AsyncStorage.getItem('settings_workoutSchedule'),
            AsyncStorage.getItem('settings_exerciseProgression'),
            AsyncStorage.getItem('workout_trainingMaxes'),
            AsyncStorage.getItem('workout_personalRecords'),
            AsyncStorage.getItem('workout_history'),
            AsyncStorage.getItem('workout_currentCycle'),
            AsyncStorage.getItem('workout_currentWeek'),
        ]);

        const exportData: AppData = {
            version: '1.0.0',
            exportDate: new Date().toISOString(),
            settings: {
                unit: unitData ? JSON.parse(unitData) : defaultAppData.settings.unit,
                theme: themeData ? JSON.parse(themeData) : defaultAppData.settings.theme,
                workoutSchedule: workoutScheduleData
                    ? JSON.parse(workoutScheduleData)
                    : defaultAppData.settings.workoutSchedule,
                exerciseProgression: exerciseProgressionData
                    ? JSON.parse(exerciseProgressionData)
                    : defaultAppData.settings.exerciseProgression,
            },
            trainingMaxes: trainingMaxesData ? JSON.parse(trainingMaxesData) : [],
            personalRecords: personalRecordsData ? JSON.parse(personalRecordsData) : [],
            workoutHistory: workoutHistoryData ? JSON.parse(workoutHistoryData) : [],
            currentCycle: currentCycleData ? JSON.parse(currentCycleData) : 1,
            currentWeek: currentWeekData ? JSON.parse(currentWeekData) : 1,
        };

        return exportData;
    } catch (error) {
        console.error('Error exporting app data:', error);
        throw new Error('Failed to export app data');
    }
};

// Import app data
export const importAppData = async (data: AppData): Promise<void> => {
    try {
        // Validate the data structure
        if (!data.version || !data.settings) {
            throw new Error('Invalid data format');
        }

        // Save all data to AsyncStorage
        await Promise.all([
            AsyncStorage.setItem('settings_unit', JSON.stringify(data.settings.unit)),
            AsyncStorage.setItem('settings_theme', JSON.stringify(data.settings.theme)),
            AsyncStorage.setItem('settings_workoutSchedule', JSON.stringify(data.settings.workoutSchedule)),
            AsyncStorage.setItem('settings_exerciseProgression', JSON.stringify(data.settings.exerciseProgression)),
            AsyncStorage.setItem('workout_trainingMaxes', JSON.stringify(data.trainingMaxes || [])),
            AsyncStorage.setItem('workout_personalRecords', JSON.stringify(data.personalRecords || [])),
            AsyncStorage.setItem('workout_history', JSON.stringify(data.workoutHistory || [])),
            AsyncStorage.setItem('workout_currentCycle', JSON.stringify(data.currentCycle || 1)),
            AsyncStorage.setItem('workout_currentWeek', JSON.stringify(data.currentWeek || 1)),
        ]);
    } catch (error) {
        console.error('Error importing app data:', error);
        throw new Error('Failed to import app data');
    }
};

// Generate a backup filename with timestamp
export const generateBackupFilename = (): string => {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').split('T')[0];
    return `531-workout-backup-${timestamp}.json`;
};

// Validate imported data
export const validateImportData = (data: any): data is AppData => {
    try {
        // Basic structure validation
        if (!data || typeof data !== 'object') return false;
        if (!data.version || typeof data.version !== 'string') return false;
        if (!data.settings || typeof data.settings !== 'object') return false;
        if (!data.exportDate || typeof data.exportDate !== 'string') return false;

        // Settings validation
        const { settings } = data;
        if (!settings.unit || !['kg', 'lbs'].includes(settings.unit)) return false;
        if (!settings.theme || !['system', 'light', 'dark'].includes(settings.theme)) return false;
        if (!settings.workoutSchedule || typeof settings.workoutSchedule !== 'object') return false;
        if (!settings.exerciseProgression || typeof settings.exerciseProgression !== 'object') return false;

        // Arrays validation
        if (!Array.isArray(data.trainingMaxes)) return false;
        if (!Array.isArray(data.personalRecords)) return false;
        if (!Array.isArray(data.workoutHistory)) return false;

        // Numbers validation
        if (typeof data.currentCycle !== 'number' || data.currentCycle < 1) return false;
        if (typeof data.currentWeek !== 'number' || data.currentWeek < 1 || data.currentWeek > 4) return false;

        return true;
    } catch (error) {
        console.error('Data validation error:', error);
        return false;
    }
};

// Get data summary for preview
export const getDataSummary = (data: AppData): {
    totalWorkouts: number;
    totalPRs: number;
    oldestWorkout: string | null;
    newestWorkout: string | null;
    currentProgress: {
        cycle: number;
        week: number;
    };
} => {
    const totalWorkouts = data.workoutHistory.length;
    const totalPRs = data.personalRecords.length;

    let oldestWorkout: string | null = null;
    let newestWorkout: string | null = null;

    if (data.workoutHistory.length > 0) {
        const dates = data.workoutHistory.map(w => new Date(w.date)).sort((a, b) => a.getTime() - b.getTime());
        oldestWorkout = dates[0].toLocaleDateString();
        newestWorkout = dates[dates.length - 1].toLocaleDateString();
    }

    return {
        totalWorkouts,
        totalPRs,
        oldestWorkout,
        newestWorkout,
        currentProgress: {
            cycle: data.currentCycle,
            week: data.currentWeek,
        },
    };
}; 