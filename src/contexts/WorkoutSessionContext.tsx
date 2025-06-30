import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WorkoutSet {
    weight: string;
    reps: number;
    amrap: boolean;
}

interface WorkoutSessionState {
    visible: boolean;
    exercise: string | null;
    exerciseKey: string | null;
    week: number | null;
    sets: WorkoutSet[];
}

interface WorkoutSessionContextType {
    workoutSession: WorkoutSessionState;
    startWorkout: (session: Omit<WorkoutSessionState, 'visible'>) => void;
    completeWorkoutSession: (setStates: Array<{ status: string | null; repsCompleted: string }>) => void;
    discardWorkoutSession: () => void;
}

const WorkoutSessionContext = createContext<WorkoutSessionContextType | undefined>(undefined);

export const WorkoutSessionProvider = ({ children }: { children: ReactNode }) => {
    const [workoutSession, setWorkoutSession] = useState<WorkoutSessionState>({
        visible: false,
        exercise: null,
        exerciseKey: null,
        week: null,
        sets: [],
    });

    const startWorkout = (session: Omit<WorkoutSessionState, 'visible'>) => {
        setWorkoutSession({ ...session, visible: true });
    };

    const completeWorkoutSession = (_setStates: Array<{ status: string | null; repsCompleted: string }>) => {
        setWorkoutSession(prev => ({ ...prev, visible: false }));
    };

    const discardWorkoutSession = () => {
        setWorkoutSession(prev => ({ ...prev, visible: false }));
    };

    return (
        <WorkoutSessionContext.Provider value={{ workoutSession, startWorkout, completeWorkoutSession, discardWorkoutSession }}>
            {children}
        </WorkoutSessionContext.Provider>
    );
};

export const useWorkoutSession = () => {
    const ctx = useContext(WorkoutSessionContext);
    if (!ctx) throw new Error('useWorkoutSession must be used within a WorkoutSessionProvider');
    return ctx;
}; 