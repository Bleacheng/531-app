import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Unit = 'kg' | 'lbs';

interface WorkoutSchedule {
    benchPress: string;
    squat: string;
    deadlift: string;
    overheadPress: string;
}

interface ExerciseProgression {
    benchPress: number;
    squat: number;
    deadlift: number;
    overheadPress: number;
}

// 5/3/1 Program Settings
interface OneRepMax {
    benchPress: number;
    squat: number;
    deadlift: number;
    overheadPress: number;
}

interface TrainingMaxPercentage {
    percentage: number;
}

interface WorkingSetPercentages {
    week1: {
        set1: number; // 65%
        set2: number; // 75%
        set3: number; // 85%
    };
    week2: {
        set1: number; // 70%
        set2: number; // 80%
        set3: number; // 90%
    };
    week3: {
        set1: number; // 75%
        set2: number; // 85%
        set3: number; // 95%
    };
    week4: {
        set1: number; // 40%
        set2: number; // 50%
        set3: number; // 60%
    };
}

interface WarmupSets {
    set1: {
        percentage: number; // 40%
        reps: number; // 5
    };
    set2: {
        percentage: number; // 50%
        reps: number; // 5
    };
    set3: {
        percentage: number; // 60%
        reps: number; // 3
    };
    enabled: boolean; // true for weeks 1-3, false for week 4
}

interface ScrollPositions {
    home: number;
    history: number;
    settings: number;
}

interface SettingsContextType {
    unit: Unit;
    setUnit: (unit: Unit) => void;
    toggleUnit: () => void;
    formatWeight: (weight: number) => string;
    workoutSchedule: WorkoutSchedule;
    setWorkoutSchedule: (schedule: WorkoutSchedule) => void;
    updateWorkoutDay: (exercise: keyof WorkoutSchedule, day: string) => void;
    updateWorkoutScheduleBulk: (schedule: WorkoutSchedule) => void;
    exerciseProgression: ExerciseProgression;
    setExerciseProgression: (progression: ExerciseProgression) => void;
    updateExerciseProgression: (exercise: keyof ExerciseProgression, progression: number) => void;
    // 5/3/1 Program Settings
    oneRepMax: OneRepMax;
    setOneRepMax: (oneRepMax: OneRepMax) => void;
    updateOneRepMax: (exercise: keyof OneRepMax, weight: number) => void;
    trainingMaxPercentage: TrainingMaxPercentage;
    setTrainingMaxPercentage: (percentage: TrainingMaxPercentage) => void;
    updateTrainingMaxPercentage: (percentage: number) => void;
    workingSetPercentages: WorkingSetPercentages;
    setWorkingSetPercentages: (percentages: WorkingSetPercentages) => void;
    updateWorkingSetPercentages: (week: keyof WorkingSetPercentages, set: keyof WorkingSetPercentages['week1'], percentage: number) => void;
    warmupSets: WarmupSets;
    setWarmupSets: (warmupSets: WarmupSets) => void;
    updateWarmupSet: (set: 'set1' | 'set2' | 'set3', field: 'percentage' | 'reps', value: number) => void;
    toggleWarmupEnabled: () => void;
    scrollPositions: ScrollPositions;
    saveScrollPosition: (screen: keyof ScrollPositions, position: number) => void;
    getScrollPosition: (screen: keyof ScrollPositions) => number;
    isLoading: boolean;
    // Onboarding
    isOnboardingNeeded: () => boolean;
    completeOnboarding: () => void;
    getMissingOnboardingItems: () => {
        workoutSchedule: boolean;
        exerciseProgression: boolean;
        oneRepMax: boolean;
        trainingMaxPercentage: boolean;
    };
    getOnboardingProgress: () => number;
}

const defaultSchedule: WorkoutSchedule = {
    benchPress: '',
    squat: '',
    deadlift: '',
    overheadPress: '',
};

const defaultProgression: ExerciseProgression = {
    benchPress: 0,
    squat: 0,
    deadlift: 0,
    overheadPress: 0,
};

// Default 5/3/1 Program Settings
const defaultOneRepMax: OneRepMax = {
    benchPress: 0,
    squat: 0,
    deadlift: 0,
    overheadPress: 0,
};

const defaultTrainingMaxPercentage: TrainingMaxPercentage = {
    percentage: 0,
};

const defaultWorkingSetPercentages: WorkingSetPercentages = {
    week1: {
        set1: 65,
        set2: 75,
        set3: 85,
    },
    week2: {
        set1: 70,
        set2: 80,
        set3: 90,
    },
    week3: {
        set1: 75,
        set2: 85,
        set3: 95,
    },
    week4: {
        set1: 40,
        set2: 50,
        set3: 60,
    },
};

const defaultWarmupSets: WarmupSets = {
    set1: {
        percentage: 40,
        reps: 5,
    },
    set2: {
        percentage: 50,
        reps: 5,
    },
    set3: {
        percentage: 60,
        reps: 3,
    },
    enabled: true,
};

const defaultScrollPositions: ScrollPositions = {
    home: 0,
    history: 0,
    settings: 0,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

interface SettingsProviderProps {
    children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
    const [unit, setUnit] = useState<Unit>('kg');
    const [workoutSchedule, setWorkoutSchedule] = useState<WorkoutSchedule>(defaultSchedule);
    const [exerciseProgression, setExerciseProgression] = useState<ExerciseProgression>(defaultProgression);
    const [oneRepMax, setOneRepMax] = useState<OneRepMax>(defaultOneRepMax);
    const [trainingMaxPercentage, setTrainingMaxPercentage] = useState<TrainingMaxPercentage>(defaultTrainingMaxPercentage);
    const [workingSetPercentages, setWorkingSetPercentages] = useState<WorkingSetPercentages>(defaultWorkingSetPercentages);
    const [warmupSets, setWarmupSets] = useState<WarmupSets>(defaultWarmupSets);
    const [scrollPositions, setScrollPositions] = useState<ScrollPositions>(defaultScrollPositions);
    const [isLoading, setIsLoading] = useState(true);

    // Load settings from AsyncStorage on app start
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const [unitData, scheduleData, progressionData, oneRepMaxData, trainingMaxData, workingSetData, warmupData, scrollData] = await Promise.all([
                AsyncStorage.getItem('settings_unit'),
                AsyncStorage.getItem('settings_workoutSchedule'),
                AsyncStorage.getItem('settings_exerciseProgression'),
                AsyncStorage.getItem('settings_oneRepMax'),
                AsyncStorage.getItem('settings_trainingMaxPercentage'),
                AsyncStorage.getItem('settings_workingSetPercentages'),
                AsyncStorage.getItem('settings_warmupSets'),
                AsyncStorage.getItem('settings_scrollPositions'),
            ]);

            if (unitData) {
                setUnit(JSON.parse(unitData));
            }
            if (scheduleData) {
                setWorkoutSchedule(JSON.parse(scheduleData));
            }
            if (progressionData) {
                setExerciseProgression(JSON.parse(progressionData));
            }
            if (oneRepMaxData) {
                setOneRepMax(JSON.parse(oneRepMaxData));
            }
            if (trainingMaxData) {
                setTrainingMaxPercentage(JSON.parse(trainingMaxData));
            }
            if (workingSetData) {
                setWorkingSetPercentages(JSON.parse(workingSetData));
            }
            if (warmupData) {
                setWarmupSets(JSON.parse(warmupData));
            }
            if (scrollData) {
                setScrollPositions(JSON.parse(scrollData));
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Save unit setting
    const saveUnit = async (newUnit: Unit) => {
        try {
            await AsyncStorage.setItem('settings_unit', JSON.stringify(newUnit));
            setUnit(newUnit);
        } catch (error) {
            console.error('Error saving unit setting:', error);
        }
    };

    // Save workout schedule
    const saveWorkoutSchedule = async (schedule: WorkoutSchedule) => {
        try {
            await AsyncStorage.setItem('settings_workoutSchedule', JSON.stringify(schedule));
            setWorkoutSchedule(schedule);
        } catch (error) {
            console.error('Error saving workout schedule:', error);
        }
    };

    // Save exercise progression
    const saveExerciseProgression = async (progression: ExerciseProgression) => {
        try {
            await AsyncStorage.setItem('settings_exerciseProgression', JSON.stringify(progression));
            setExerciseProgression(progression);
        } catch (error) {
            console.error('Error saving exercise progression:', error);
        }
    };

    // Save 1RM
    const saveOneRepMax = async (oneRepMax: OneRepMax) => {
        try {
            await AsyncStorage.setItem('settings_oneRepMax', JSON.stringify(oneRepMax));
            setOneRepMax(oneRepMax);
        } catch (error) {
            console.error('Error saving 1RM:', error);
        }
    };

    // Save training max percentage
    const saveTrainingMaxPercentage = async (percentage: TrainingMaxPercentage) => {
        try {
            await AsyncStorage.setItem('settings_trainingMaxPercentage', JSON.stringify(percentage));
            setTrainingMaxPercentage(percentage);
        } catch (error) {
            console.error('Error saving training max percentage:', error);
        }
    };

    // Save working set percentages
    const saveWorkingSetPercentages = async (percentages: WorkingSetPercentages) => {
        try {
            await AsyncStorage.setItem('settings_workingSetPercentages', JSON.stringify(percentages));
            setWorkingSetPercentages(percentages);
        } catch (error) {
            console.error('Error saving working set percentages:', error);
        }
    };

    // Save warmup sets
    const saveWarmupSets = async (warmupSets: WarmupSets) => {
        try {
            await AsyncStorage.setItem('settings_warmupSets', JSON.stringify(warmupSets));
            setWarmupSets(warmupSets);
        } catch (error) {
            console.error('Error saving warmup sets:', error);
        }
    };

    // Save scroll positions
    const saveScrollPositions = async (positions: ScrollPositions) => {
        try {
            await AsyncStorage.setItem('settings_scrollPositions', JSON.stringify(positions));
            setScrollPositions(positions);
        } catch (error) {
            console.error('Error saving scroll positions:', error);
        }
    };

    const toggleUnit = () => {
        const newUnit = unit === 'kg' ? 'lbs' : 'kg';
        saveUnit(newUnit);
    };

    const formatWeight = (weight: number): string => {
        if (unit === 'kg') {
            return `${weight} kg`;
        } else {
            // Convert kg to lbs (1 kg = 2.20462 lbs)
            const lbs = Math.round(weight * 2.20462);
            return `${lbs} lbs`;
        }
    };

    const updateWorkoutDay = (exercise: keyof WorkoutSchedule, day: string) => {
        // Check if another exercise is already scheduled for this day
        const conflictingExercise = Object.entries(workoutSchedule).find(
            ([key, scheduledDay]) => key !== exercise && scheduledDay === day
        );

        if (conflictingExercise) {
            // Move the conflicting exercise to the day that was previously occupied by the current exercise
            const currentExerciseDay = workoutSchedule[exercise];
            const newSchedule = {
                ...workoutSchedule,
                [exercise]: day,
                [conflictingExercise[0]]: currentExerciseDay
            };
            saveWorkoutSchedule(newSchedule);
        } else {
            const newSchedule = {
                ...workoutSchedule,
                [exercise]: day
            };
            saveWorkoutSchedule(newSchedule);
        }
    };

    const updateWorkoutScheduleBulk = (newSchedule: WorkoutSchedule) => {
        // Direct bulk update without conflict resolution for drag and drop
        saveWorkoutSchedule(newSchedule);
    };

    const updateExerciseProgression = (exercise: keyof ExerciseProgression, progression: number) => {
        const newProgression = {
            ...exerciseProgression,
            [exercise]: progression
        };
        saveExerciseProgression(newProgression);
    };

    // Update 1RM for a specific exercise
    const updateOneRepMax = (exercise: keyof OneRepMax, weight: number) => {
        const newOneRepMax = {
            ...oneRepMax,
            [exercise]: weight
        };
        saveOneRepMax(newOneRepMax);
    };

    // Update training max percentage for a specific exercise
    const updateTrainingMaxPercentage = (percentage: number) => {
        saveTrainingMaxPercentage({ percentage });
    };

    // Update working set percentages for a specific week and set
    const updateWorkingSetPercentages = (week: keyof WorkingSetPercentages, set: keyof WorkingSetPercentages['week1'], percentage: number) => {
        const newPercentages = {
            ...workingSetPercentages,
            [week]: {
                ...workingSetPercentages[week],
                [set]: percentage
            }
        };
        saveWorkingSetPercentages(newPercentages);
    };

    // Update warmup set for a specific set
    const updateWarmupSet = (set: 'set1' | 'set2' | 'set3', field: 'percentage' | 'reps', value: number) => {
        const newWarmupSets = {
            ...warmupSets,
            [set]: {
                ...warmupSets[set],
                [field]: value
            }
        };
        saveWarmupSets(newWarmupSets);
    };

    // Toggle warmup enabled for all sets
    const toggleWarmupEnabled = () => {
        const newWarmupSets = {
            ...warmupSets,
            enabled: !warmupSets.enabled
        };
        saveWarmupSets(newWarmupSets);
    };

    const saveScrollPosition = (screen: keyof ScrollPositions, position: number) => {
        const newPositions = {
            ...scrollPositions,
            [screen]: position
        };
        saveScrollPositions(newPositions);
    };

    const getScrollPosition = (screen: keyof ScrollPositions): number => {
        return scrollPositions[screen];
    };

    // Check if onboarding is needed
    const isOnboardingNeeded = (): boolean => {
        // Check if workout schedule is empty
        const hasSchedule = Object.values(workoutSchedule).every(day => day !== '');

        // Check if progression values are set
        const hasProgression = Object.values(exerciseProgression).every(value => value > 0);

        // Check if 1RM values are set
        const hasOneRepMax = Object.values(oneRepMax).every(value => value > 0);

        // Check if training max percentage is set (default is 90, so we check if it's not 0)
        const hasTrainingMaxPercentage = trainingMaxPercentage.percentage > 0;

        return !hasSchedule || !hasProgression || !hasOneRepMax || !hasTrainingMaxPercentage;
    };

    // Complete onboarding by setting default values
    const completeOnboarding = async () => {
        const defaultSchedule: WorkoutSchedule = {
            benchPress: 'Monday',
            squat: 'Tuesday',
            deadlift: 'Thursday',
            overheadPress: 'Friday',
        };

        const defaultProgression: ExerciseProgression = {
            benchPress: 2.5,
            squat: 5,
            deadlift: 5,
            overheadPress: 2.5,
        };

        const defaultOneRepMax: OneRepMax = {
            benchPress: 100,
            squat: 140,
            deadlift: 180,
            overheadPress: 70,
        };

        const defaultTrainingMaxPercentage: TrainingMaxPercentage = {
            percentage: 90,
        };

        // Save all default values
        await Promise.all([
            saveWorkoutSchedule(defaultSchedule),
            saveExerciseProgression(defaultProgression),
            saveOneRepMax(defaultOneRepMax),
            saveTrainingMaxPercentage(defaultTrainingMaxPercentage),
        ]);
    };

    const getMissingOnboardingItems = (): {
        workoutSchedule: boolean;
        exerciseProgression: boolean;
        oneRepMax: boolean;
        trainingMaxPercentage: boolean;
    } => {
        // Check if workout schedule is empty
        const hasSchedule = Object.values(workoutSchedule).every(day => day !== '');

        // Check if progression values are set
        const hasProgression = Object.values(exerciseProgression).every(value => value > 0);

        // Check if 1RM values are set
        const hasOneRepMax = Object.values(oneRepMax).every(value => value > 0);

        // Check if training max percentage is set (default is 90, so we check if it's not 0)
        const hasTrainingMaxPercentage = trainingMaxPercentage.percentage > 0;

        return {
            workoutSchedule: !hasSchedule,
            exerciseProgression: !hasProgression,
            oneRepMax: !hasOneRepMax,
            trainingMaxPercentage: !hasTrainingMaxPercentage,
        };
    };

    const getOnboardingProgress = (): number => {
        const missingItems = getMissingOnboardingItems();
        const totalItems = 4; // workoutSchedule, exerciseProgression, oneRepMax, trainingMaxPercentage
        const completedItems = totalItems - Object.values(missingItems).filter(Boolean).length;
        return Math.round((completedItems / totalItems) * 100);
    };

    const value = {
        unit,
        setUnit: saveUnit,
        toggleUnit,
        formatWeight,
        workoutSchedule,
        setWorkoutSchedule: saveWorkoutSchedule,
        updateWorkoutDay,
        updateWorkoutScheduleBulk,
        exerciseProgression,
        setExerciseProgression: saveExerciseProgression,
        updateExerciseProgression,
        // 5/3/1 Program Settings
        oneRepMax,
        setOneRepMax: saveOneRepMax,
        updateOneRepMax,
        trainingMaxPercentage,
        setTrainingMaxPercentage: saveTrainingMaxPercentage,
        updateTrainingMaxPercentage,
        workingSetPercentages,
        setWorkingSetPercentages: saveWorkingSetPercentages,
        updateWorkingSetPercentages,
        warmupSets,
        setWarmupSets: saveWarmupSets,
        updateWarmupSet,
        toggleWarmupEnabled,
        scrollPositions,
        saveScrollPosition,
        getScrollPosition,
        isLoading,
        // Onboarding
        isOnboardingNeeded,
        completeOnboarding,
        getMissingOnboardingItems,
        getOnboardingProgress,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}; 