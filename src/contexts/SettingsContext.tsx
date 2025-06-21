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

interface SettingsContextType {
    unit: Unit;
    setUnit: (unit: Unit) => void;
    toggleUnit: () => void;
    formatWeight: (weight: number) => string;
    workoutSchedule: WorkoutSchedule;
    setWorkoutSchedule: (schedule: WorkoutSchedule) => void;
    updateWorkoutDay: (exercise: keyof WorkoutSchedule, day: string) => void;
    exerciseProgression: ExerciseProgression;
    setExerciseProgression: (progression: ExerciseProgression) => void;
    updateExerciseProgression: (exercise: keyof ExerciseProgression, progression: number) => void;
    isLoading: boolean;
}

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
    const [isLoading, setIsLoading] = useState(true);

    // Load settings from AsyncStorage on app start
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const [unitData, scheduleData, progressionData] = await Promise.all([
                AsyncStorage.getItem('settings_unit'),
                AsyncStorage.getItem('settings_workoutSchedule'),
                AsyncStorage.getItem('settings_exerciseProgression'),
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
        const newSchedule = {
            ...workoutSchedule,
            [exercise]: day
        };
        saveWorkoutSchedule(newSchedule);
    };

    const updateExerciseProgression = (exercise: keyof ExerciseProgression, progression: number) => {
        const newProgression = {
            ...exerciseProgression,
            [exercise]: progression
        };
        saveExerciseProgression(newProgression);
    };

    const value = {
        unit,
        setUnit: saveUnit,
        toggleUnit,
        formatWeight,
        workoutSchedule,
        setWorkoutSchedule: saveWorkoutSchedule,
        updateWorkoutDay,
        exerciseProgression,
        setExerciseProgression: saveExerciseProgression,
        updateExerciseProgression,
        isLoading,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}; 