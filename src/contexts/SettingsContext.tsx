import React, { createContext, useContext, useState } from 'react';

export type Unit = 'kg' | 'lbs';

interface WorkoutSchedule {
    benchPress: string;
    squat: string;
    deadlift: string;
    overheadPress: string;
}

interface SettingsContextType {
    unit: Unit;
    setUnit: (unit: Unit) => void;
    toggleUnit: () => void;
    formatWeight: (weight: number) => string;
    workoutSchedule: WorkoutSchedule;
    setWorkoutSchedule: (schedule: WorkoutSchedule) => void;
    updateWorkoutDay: (exercise: keyof WorkoutSchedule, day: string) => void;
}

const defaultSchedule: WorkoutSchedule = {
    benchPress: 'Monday',
    squat: 'Tuesday',
    deadlift: 'Thursday',
    overheadPress: 'Friday',
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

    const toggleUnit = () => {
        setUnit(prev => prev === 'kg' ? 'lbs' : 'kg');
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
        setWorkoutSchedule(prev => ({
            ...prev,
            [exercise]: day
        }));
    };

    const value = {
        unit,
        setUnit,
        toggleUnit,
        formatWeight,
        workoutSchedule,
        setWorkoutSchedule,
        updateWorkoutDay,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}; 