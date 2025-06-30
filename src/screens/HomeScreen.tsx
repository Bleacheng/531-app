import React, { useRef, useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, Alert, Platform, Dimensions } from 'react-native';
import { Calendar, CheckCircle, Circle, TrendingUp, X, ArrowRight, ArrowLeft, Settings, UserPlus, ChevronDown, BarChart3 } from 'lucide-react-native';
import Modal from 'react-native-modal';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { OneRMGraph } from '../components/OneRMGraph';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { useWorkoutSession } from '../contexts/WorkoutSessionContext';
import { COLORS } from '../constants/colors';
import WorkoutSessionScreen from './WorkoutSessionScreen';

// 1. Define types for exercises and onboarding data
const exercises = ['benchPress', 'squat', 'overheadPress', 'deadlift'] as const;
type Exercise = typeof exercises[number];

interface OnboardingData {
    workoutSchedule: Record<Exercise, string>;
    exerciseProgression: Record<Exercise, string>;
    oneRepMax: Record<Exercise, string>;
    oneRmWeight: Record<Exercise, string>;
    oneRmReps: Record<Exercise, string>;
    trainingMaxPercentage: string;
    bbbVariant: 'none' | 'bbb';
    bbbPercentage: string;
}

export const HomeScreen: React.FC<{ onNavigate?: (screen: 'home' | 'profile' | 'settings') => void }> = ({ onNavigate }) => {
    const { theme } = useTheme();
    const {
        formatWeight,
        workoutSchedule,
        exerciseProgression,
        oneRepMax,
        unit,
        saveScrollPosition,
        getScrollPosition,
        isOnboardingNeeded,
        updateWorkoutDay,
        updateExerciseProgression,
        updateOneRepMax,
        getMissingOnboardingItems,
        getOnboardingProgress,
        updateTrainingMaxPercentage,
        currentCycle,
        currentWeek,
        workingSetPercentages,
        trainingMaxPercentage,
        advanceToNextWeek,
        workoutHistory,
        completeWorkout,
        markWorkoutAsMissed,
        getWorkoutStatus,
        updateWorkoutStatuses,
        setUnit,
        trainingMaxDecreases,
        resetTrainingMaxDecreases,
        undoWorkout,
        bbbSettings,
        updateBbbEnabled,
        updateBbbPercentage,
        warmupSets
    } = useSettings();
    const { workoutSession, startWorkout, completeWorkoutSession, discardWorkoutSession } = useWorkoutSession();
    const isDark = theme === 'dark';
    const scrollViewRef = useRef<ScrollView>(null);

    // Onboarding state
    const [onboardingVisible, setOnboardingVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    // Day selector modal state (like in settings)
    const [daySelectorModalVisible, setDaySelectorModalVisible] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<keyof typeof workoutSchedule | null>(null);

    // Add state for onboarding day selector modal
    const [onboardingDaySelectorModalVisible, setOnboardingDaySelectorModalVisible] = useState(false);
    const [onboardingSelectedExercise, setOnboardingSelectedExercise] = useState<Exercise | null>(null);

    // Add local onboarding unit state
    const [onboardingUnit, setOnboardingUnit] = useState<'kg' | 'lbs'>(unit || 'kg');

    // 2. Update onboardingData state to use new structure
    const [onboardingData, setOnboardingData] = useState<OnboardingData>({
        workoutSchedule: { benchPress: '', squat: '', deadlift: '', overheadPress: '' },
        exerciseProgression: { benchPress: '', squat: '', deadlift: '', overheadPress: '' },
        oneRepMax: { benchPress: '', squat: '', deadlift: '', overheadPress: '' },
        oneRmWeight: { benchPress: '', squat: '', deadlift: '', overheadPress: '' },
        oneRmReps: { benchPress: '', squat: '', deadlift: '', overheadPress: '' },
        trainingMaxPercentage: '90',
        bbbVariant: 'none',
        bbbPercentage: '50',
    });

    // Restore scroll position when component mounts
    useEffect(() => {
        const savedPosition = getScrollPosition('home');
        if (savedPosition > 0) {
            scrollViewRef.current?.scrollTo({ y: savedPosition, animated: false });
        }
    }, []);

    const handleStartWorkout = (exercise: string) => {
        const exerciseKey = Object.keys(exerciseNames).find(key => exerciseNames[key as keyof typeof exerciseNames] === exercise) as keyof typeof workoutSchedule;

        if (exerciseKey) {
            // Generate workout sets
            const sets = [];

            // Add warmup sets if enabled
            if (warmupSets.enabled && currentWeek !== 4) { // No warmups in deload week
                if (warmupSets.set1.percentage > 0) {
                    const weight = roundToNearest2_5((calculateTrainingMax(exerciseKey as keyof typeof oneRepMax, currentCycle) * warmupSets.set1.percentage) / 100);
                    sets.push({
                        weight: formatWeight(weight),
                        reps: warmupSets.set1.reps,
                        amrap: false,
                        type: 'warmup'
                    });
                }
                if (warmupSets.set2.percentage > 0) {
                    const weight = roundToNearest2_5((calculateTrainingMax(exerciseKey as keyof typeof oneRepMax, currentCycle) * warmupSets.set2.percentage) / 100);
                    sets.push({
                        weight: formatWeight(weight),
                        reps: warmupSets.set2.reps,
                        amrap: false,
                        type: 'warmup'
                    });
                }
                if (warmupSets.set3.percentage > 0) {
                    const weight = roundToNearest2_5((calculateTrainingMax(exerciseKey as keyof typeof oneRepMax, currentCycle) * warmupSets.set3.percentage) / 100);
                    sets.push({
                        weight: formatWeight(weight),
                        reps: warmupSets.set3.reps,
                        amrap: false,
                        type: 'warmup'
                    });
                }
            }

            // Add working sets
            const weekKey = `week${currentWeek}` as keyof typeof workingSetPercentages;
            for (let set = 1; set <= 3; set++) {
                const setKey = `set${set}` as keyof typeof workingSetPercentages[typeof weekKey];
                const percentage = workingSetPercentages[weekKey][setKey];
                const weight = calculateWorkoutWeight(exerciseKey as keyof typeof oneRepMax, currentWeek, set as 1 | 2 | 3);
                const isAmrap = set === 3 && currentWeek !== 4; // Last set is AMRAP except in deload week

                sets.push({
                    weight: formatWeight(weight),
                    reps: isAmrap ? 5 : 5, // Will show as 5+ for AMRAP
                    amrap: isAmrap,
                    type: 'working'
                });
            }

            // Add BBB sets if enabled
            if (bbbSettings.enabled && bbbSettings.percentage > 0 && currentWeek !== 4) {
                const bbbWeight = calculateBBBWeight(exerciseKey as keyof typeof oneRepMax);
                for (let i = 0; i < 5; i++) { // 5 sets of 10
                    sets.push({
                        weight: formatWeight(bbbWeight),
                        reps: 10,
                        amrap: false,
                        type: 'bbb'
                    });
                }
            }

            startWorkout({
                exercise: exercise,
                exerciseKey: exerciseKey,
                week: currentWeek,
                sets: sets
            });
        }
    };

    // Day selector functions (like in settings)
    const dayOptions = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ];

    const exerciseNames = {
        benchPress: 'Bench Press',
        squat: 'Squat',
        deadlift: 'Deadlift',
        overheadPress: 'Overhead Press'
    };

    // Helper function to get day order for sorting
    const getDayOrder = (dayName: string): number => {
        const dayMap: { [key: string]: number } = {
            'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4,
            'Friday': 5, 'Saturday': 6, 'Sunday': 7
        };
        return dayMap[dayName] || 0;
    };

    const getAvailableDays = (currentExercise: keyof typeof workoutSchedule) => {
        const currentDay = onboardingData.workoutSchedule[currentExercise];
        return dayOptions.map(day => {
            // Check if any other exercise is using this day
            const conflictingExercise = Object.entries(onboardingData.workoutSchedule).find(([key, scheduledDay]) =>
                key !== currentExercise && scheduledDay === day
            );

            return {
                day,
                isCurrent: day === currentDay,
                hasConflict: !!conflictingExercise,
                conflictingExercise: conflictingExercise ? exerciseNames[conflictingExercise[0] as keyof typeof exerciseNames] : null
            };
        });
    };

    const openDaySelector = (exercise: keyof typeof workoutSchedule) => {
        setSelectedExercise(exercise);
        setDaySelectorModalVisible(true);
    };

    const handleDaySelect = (exercise: keyof typeof workoutSchedule, day: string) => {
        updateOnboardingData('workoutSchedule', exercise, day);
        setDaySelectorModalVisible(false);
        setSelectedExercise(null);
    };

    // Update step count
    const totalSteps = 5;

    // Update step navigation logic
    const handleOnboardingNext = () => {
        if (!isCurrentStepValid()) {
            return;
        }
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleCompleteOnboarding();
        }
    };

    // Update validation logic
    const isCurrentStepValid = () => {
        switch (currentStep) {
            case 0: // Workout Schedule
                return Object.values(onboardingData.workoutSchedule).every(day => day !== '') &&
                    Object.values(onboardingData.workoutSchedule).length === new Set(Object.values(onboardingData.workoutSchedule)).size;
            case 1: // Exercise Progression
                return Object.values(onboardingData.exerciseProgression).every(progression =>
                    progression !== '' && !isNaN(parseFloat(progression)) && parseFloat(progression) > 0
                );
            case 2: // 1 Rep Max
                return Object.values(onboardingData.oneRepMax).every(weight =>
                    weight !== '' && !isNaN(parseFloat(weight)) && parseFloat(weight) > 0
                );
            case 3: // Training Max Percentage
                return onboardingData.trainingMaxPercentage !== '' &&
                    !isNaN(parseFloat(onboardingData.trainingMaxPercentage)) &&
                    parseFloat(onboardingData.trainingMaxPercentage) >= 80 &&
                    parseFloat(onboardingData.trainingMaxPercentage) <= 100;
            case 4: // BBB Settings
                return onboardingData.bbbVariant === 'none' || (
                    onboardingData.bbbVariant === 'bbb' &&
                    onboardingData.bbbPercentage !== '' &&
                    !isNaN(parseFloat(onboardingData.bbbPercentage)) &&
                    parseFloat(onboardingData.bbbPercentage) >= 0 &&
                    parseFloat(onboardingData.bbbPercentage) <= 100
                );
            default:
                return false;
        }
    };
    const handleCompleteOnboarding = async () => {
        // Save all the onboarding data
        Object.entries(onboardingData.workoutSchedule).forEach(([exercise, day]) => {
            if (day) {
                updateWorkoutDay(exercise as Exercise, day);
            }
        });

        Object.entries(onboardingData.exerciseProgression).forEach(([exercise, progression]) => {
            if (progression) {
                updateExerciseProgression(exercise as Exercise, parseFloat(progression));
            }
        });

        Object.entries(onboardingData.oneRepMax).forEach(([exercise, weight]) => {
            if (weight) {
                updateOneRepMax(exercise as Exercise, parseFloat(weight));
            }
        });

        // Save training max percentage
        if (onboardingData.trainingMaxPercentage) {
            updateTrainingMaxPercentage(parseFloat(onboardingData.trainingMaxPercentage));
        }

        // Save unit
        setUnit(onboardingUnit);

        // Save BBB settings
        const bbbEnabled = onboardingData.bbbVariant === 'bbb';
        updateBbbEnabled(bbbEnabled);
        if (bbbEnabled && onboardingData.bbbPercentage) {
            updateBbbPercentage(parseFloat(onboardingData.bbbPercentage));
        }

        // Close modal and reset step
        setOnboardingVisible(false);
        setCurrentStep(0);
    };

    // 3. Update updateOnboardingData to be type-safe
    const updateOnboardingData = (section: keyof OnboardingData, field: Exercise | '', value: string) => {
        setOnboardingData(prev => {
            if (section === 'trainingMaxPercentage') {
                return { ...prev, trainingMaxPercentage: value };
            } else if (field && typeof prev[section] === 'object' && prev[section] !== null) {
                return {
                    ...prev,
                    [section]: {
                        ...(prev[section] as Record<Exercise, string>),
                        [field]: value,
                    },
                };
            } else {
                return prev;
            }
        });
    };

    const getStepTitle = (step: number) => {
        switch (step) {
            case 0: return 'Workout Schedule';
            case 1: return 'Exercise Progression';
            case 2: return '1 Rep Max (1RM)';
            case 3: return 'Training Max Percentage';
            case 4: return 'Big But Boring (BBB) Sets';
            default: return '';
        }
    };

    const getStepDescription = (step: number) => {
        switch (step) {
            case 0: return 'Choose which day each exercise is performed';
            case 1: return 'Set weight progression per cycle for each exercise';
            case 2: return 'Enter your current 1 rep max for each exercise';
            case 3: return 'Enter your training max percentage';
            case 4: return 'Configure BBB sets';
            default: return '';
        }
    };

    // Get missing items for the onboarding card
    const missingItems = getMissingOnboardingItems();
    const onboardingProgress = getOnboardingProgress();

    // Helper function to round weight to nearest 2.5kg
    const roundToNearest2_5 = (weight: number): number => {
        return Math.round(weight / 2.5) * 2.5;
    };

    // Calculate training max for an exercise
    const calculateTrainingMax = (exercise: keyof typeof oneRepMax, cycle: number): number => {
        const baseOneRM = oneRepMax[exercise];
        const trainingMaxPercent = trainingMaxPercentage.percentage / 100;
        const progression = exerciseProgression[exercise];
        const decreases = trainingMaxDecreases[exercise];

        // Training max increases by progression amount each cycle
        const cycleIncrease = progression * (cycle - 1);
        const adjustedOneRM = baseOneRM + cycleIncrease;

        // Apply training max percentage
        let trainingMax = adjustedOneRM * trainingMaxPercent;

        // Apply decreases from failed workouts (10% decrease per failure)
        if (decreases > 0) {
            const decreaseMultiplier = Math.pow(0.9, decreases); // 0.9^decreases = 10% decrease per failure
            trainingMax = trainingMax * decreaseMultiplier;
        }

        return roundToNearest2_5(trainingMax);
    };

    // Calculate workout weight for a specific week and exercise
    const calculateWorkoutWeight = (exercise: keyof typeof oneRepMax, week: number, set: 1 | 2 | 3): number => {
        const trainingMax = calculateTrainingMax(exercise, currentCycle);
        const weekKey = `week${week}` as keyof typeof workingSetPercentages;
        const setKey = `set${set}` as keyof typeof workingSetPercentages[typeof weekKey];
        const percentage = workingSetPercentages[weekKey][setKey];
        return roundToNearest2_5((trainingMax * percentage) / 100);
    };

    // Calculate BBB weight for an exercise
    const calculateBBBWeight = (exercise: keyof typeof oneRepMax): number => {
        if (!bbbSettings.enabled || bbbSettings.percentage <= 0) return 0;
        const trainingMax = calculateTrainingMax(exercise, currentCycle);
        return roundToNearest2_5((trainingMax * bbbSettings.percentage) / 100);
    };

    // Get next occurrence of a day of the week
    const getNextDayOccurrence = (dayName: string, fromDate: Date = new Date()): Date => {
        const dayMap: { [key: string]: number } = {
            'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4,
            'Friday': 5, 'Saturday': 6
        };

        const targetDay = dayMap[dayName];
        const currentDay = fromDate.getDay();

        // If today is the target day, return today
        if (targetDay === currentDay) {
            return new Date(fromDate);
        }

        let daysUntilTarget = (targetDay - currentDay + 7) % 7;
        // If daysUntilTarget is 0, it means we want next week's occurrence
        if (daysUntilTarget === 0) daysUntilTarget = 7;

        const nextDate = new Date(fromDate);
        nextDate.setDate(fromDate.getDate() + daysUntilTarget);
        return nextDate;
    };

    // Memoize today's date to prevent recalculation on every render
    const today = useMemo(() => new Date(), []);

    // Week names for display
    const weekNames = ['5/5/5+', '3/3/3+', '5/3/1+', 'Deload'];

    // Update workout statuses when component mounts or workout history changes
    useEffect(() => {
        updateWorkoutStatuses();
    }, [workoutHistory]);

    // Generate cycle overview with proper dates and weights
    const cycleOverview = useMemo(() => {
        if (isOnboardingNeeded()) {
            return [];
        }

        const cycleData = [];
        const isDeloadWeek = currentWeek === 4;
        const showNextCycle = isDeloadWeek;
        const today = new Date().toISOString().split('T')[0];

        // Generate current cycle weeks
        for (let week = 1; week <= 4; week++) {
            const weekStatus: 'completed' | 'current' | 'upcoming' =
                week < currentWeek ? 'completed' :
                    week === currentWeek ? 'current' : 'upcoming';

            const weekDescriptions = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

            // Calculate week start date based on first workout day
            const firstWorkoutDay = Object.values(workoutSchedule).find(day => day !== '');
            if (!firstWorkoutDay) continue;

            const weekStartDate = getNextDayOccurrence(firstWorkoutDay, new Date());
            weekStartDate.setDate(weekStartDate.getDate() + (week - 1) * 7);

            // Create lifts array and sort by day of week
            const lifts = Object.entries(workoutSchedule)
                .filter(([_, day]) => day !== '') // Only include exercises with scheduled days
                .map(([exercise, day]) => {
                    const exerciseName = exerciseNames[exercise as keyof typeof exerciseNames];
                    const topSet = week === 4 ? '3×5' : '1×5+';

                    let weight: string;
                    if (week === 4) {
                        // Deload week uses 40%, 50%, 60%
                        const deloadWeight = calculateWorkoutWeight(exercise as keyof typeof oneRepMax, 4, 3);
                        weight = formatWeight(deloadWeight);
                    } else {
                        // Regular weeks use the top set percentage
                        const topSetWeight = calculateWorkoutWeight(exercise as keyof typeof oneRepMax, week, 3);
                        weight = formatWeight(topSetWeight);
                    }

                    // Calculate BBB weight if enabled
                    let bbbWeight: string | null = null;
                    if (bbbSettings.enabled && bbbSettings.percentage > 0 && week !== 4) { // No BBB in deload week
                        const bbbWeightValue = calculateBBBWeight(exercise as keyof typeof oneRepMax);
                        bbbWeight = formatWeight(bbbWeightValue);
                    }

                    const scheduledDate = getNextDayOccurrence(day, weekStartDate);
                    const scheduledDateString = scheduledDate.toISOString().split('T')[0];
                    const isToday = scheduledDateString === today;

                    // Get workout status
                    const workoutStatus = getWorkoutStatus(exercise as keyof typeof workoutSchedule, currentCycle, week);
                    let status: 'upcoming' | 'today' | 'completed' | 'missed' = 'upcoming';
                    let reps: number | null = null;
                    let passed: boolean | null = null;

                    if (workoutStatus) {
                        status = workoutStatus.status;
                        reps = workoutStatus.reps || null;
                        passed = reps !== null && reps > 0; // Simple pass/fail logic
                    } else if (isToday) {
                        status = 'today';
                    }

                    return {
                        lift: exerciseName,
                        topSet,
                        weight,
                        reps,
                        passed,
                        scheduledDay: day,
                        scheduledDate,
                        status,
                        exercise: exercise as keyof typeof workoutSchedule,
                        dayOrder: getDayOrder(day), // Add day order for sorting
                        week,
                        bbbWeight
                    };
                })
                .sort((a, b) => a.dayOrder - b.dayOrder); // Sort by day of week

            cycleData.push({
                week,
                name: `${weekNames[week - 1]} - Cycle ${currentCycle}`,
                description: weekDescriptions[week - 1],
                status: weekStatus,
                lifts,
                weekStartDate
            });
        }

        // If in deload week, show next cycle preview
        if (showNextCycle) {
            const nextCycle = currentCycle + 1;

            for (let week = 1; week <= 4; week++) {
                const weekDescriptions = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

                const firstWorkoutDay = Object.values(workoutSchedule).find(day => day !== '');
                if (!firstWorkoutDay) continue;

                const weekStartDate = getNextDayOccurrence(firstWorkoutDay, new Date());
                weekStartDate.setDate(weekStartDate.getDate() + (week - 1) * 7 + 28); // +28 for next cycle

                const lifts = Object.entries(workoutSchedule)
                    .filter(([_, day]) => day !== '') // Only include exercises with scheduled days
                    .map(([exercise, day]) => {
                        const exerciseName = exerciseNames[exercise as keyof typeof exerciseNames];
                        const topSet = week === 4 ? '3×5' : '1×5+';

                        let weight: string;
                        if (week === 4) {
                            const deloadWeight = calculateWorkoutWeight(exercise as keyof typeof oneRepMax, 4, 3);
                            weight = formatWeight(deloadWeight);
                        } else {
                            const topSetWeight = calculateWorkoutWeight(exercise as keyof typeof oneRepMax, week, 3);
                            weight = formatWeight(topSetWeight);
                        }

                        // Calculate BBB weight if enabled
                        let bbbWeight: string | null = null;
                        if (bbbSettings.enabled && bbbSettings.percentage > 0 && week !== 4) { // No BBB in deload week
                            const bbbWeightValue = calculateBBBWeight(exercise as keyof typeof oneRepMax);
                            bbbWeight = formatWeight(bbbWeightValue);
                        }

                        const scheduledDate = getNextDayOccurrence(day, weekStartDate);
                        const scheduledDateString = scheduledDate.toISOString().split('T')[0];
                        const isToday = scheduledDateString === today;

                        return {
                            lift: exerciseName,
                            topSet,
                            weight,
                            reps: null,
                            passed: null,
                            scheduledDay: day,
                            scheduledDate,
                            status: isToday ? 'today' : 'upcoming' as const,
                            exercise: exercise as keyof typeof workoutSchedule,
                            dayOrder: getDayOrder(day), // Add day order for sorting
                            week,
                            bbbWeight
                        };
                    })
                    .sort((a, b) => a.dayOrder - b.dayOrder); // Sort by day of week

                cycleData.push({
                    week,
                    name: `${weekNames[week - 1]} - Cycle ${nextCycle} (Preview)`,
                    description: weekDescriptions[week - 1],
                    status: 'upcoming' as const,
                    lifts,
                    weekStartDate
                });
            }
        }

        return cycleData;
    }, [currentCycle, currentWeek, workoutSchedule, oneRepMax, exerciseProgression, trainingMaxPercentage, workingSetPercentages, isOnboardingNeeded, workoutHistory, bbbSettings]);

    const getStatusIcon = (status: 'completed' | 'current' | 'upcoming') => {
        switch (status) {
            case 'completed':
                return <CheckCircle size={16} color={COLORS.success} />;
            case 'current':
                return <TrendingUp size={16} color={COLORS.primary} />;
            case 'upcoming':
                return <Circle size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />;
        }
    };

    const getStatusColor = (status: 'completed' | 'current' | 'upcoming') => {
        switch (status) {
            case 'completed':
                return COLORS.success;
            case 'current':
                return COLORS.primary;
            case 'upcoming':
                return isDark ? COLORS.textSecondaryDark : COLORS.textSecondary;
        }
    };

    const getPassFailIcon = (passed: boolean | null) => {
        if (passed === null) return null;
        return passed ?
            <CheckCircle size={12} color={COLORS.success} /> :
            <X size={12} color={COLORS.error} />;
    };

    // Memoize formatDate function to prevent recalculation
    const formatDate = (date: Date) => {
        const diffTime = Math.abs(today.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        // For dates more than a week away, show the actual date
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format date for badge display
    const formatDateForBadge = (date: Date) => {
        // Calculate the difference in days between today and the target date
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const targetStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const diffTime = targetStart.getTime() - todayStart.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays === -1) return 'Yesterday';
        if (diffDays > 0 && diffDays < 7) return `${diffDays} days`;
        if (diffDays < 0 && diffDays > -7) return `${Math.abs(diffDays)} days ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    // 1RM tracking data - Empty until real 1RM tracking is implemented
    const oneRMData = useMemo(() => {
        // Return empty array until real 1RM tracking is implemented
        return [] as Array<{
            date: string;
            benchPress: number;
            squat: number;
            deadlift: number;
            overheadPress: number;
        }>;
    }, []);

    const onboardingGetAvailableDays = (currentExercise: Exercise) => {
        return dayOptions.map(day => {
            const isCurrent = onboardingData.workoutSchedule[currentExercise] === day;
            const isUsed = exercises.some(ex => ex !== currentExercise && onboardingData.workoutSchedule[ex] === day);
            return { day, isCurrent, isUsed };
        });
    };

    const onboardingOpenDaySelector = (exercise: Exercise) => {
        setOnboardingSelectedExercise(exercise);
        setOnboardingDaySelectorModalVisible(true);
    };

    const onboardingHandleDaySelect = (exercise: Exercise, day: string) => {
        updateOnboardingData('workoutSchedule', exercise, day);
        setOnboardingDaySelectorModalVisible(false);
        setOnboardingSelectedExercise(null);
    };

    const handleWorkoutComplete = (setStates: Array<{ status: string | null; repsCompleted: string }>) => {
        if (workoutSession.exerciseKey) {
            // Find the AMRAP set (last working set) and get the reps
            const amrapSetIndex = workoutSession.sets.findIndex(set => set.amrap);
            let reps = 0;

            if (amrapSetIndex !== -1 && setStates[amrapSetIndex]?.status === 'success') {
                reps = parseInt(setStates[amrapSetIndex].repsCompleted) || 0;
            }

            // Always mark as completed, even if some sets are failed
            const weight = calculateWorkoutWeight(workoutSession.exerciseKey as keyof typeof oneRepMax, currentWeek, 3);
            completeWorkout(
                workoutSession.exerciseKey as keyof typeof oneRepMax,
                currentCycle,
                currentWeek,
                reps,
                formatWeight(weight)
            );

            // Close workout session
            discardWorkoutSession();
            completeWorkoutSession(setStates);
        }
    };

    const handleWorkoutDiscard = () => {
        discardWorkoutSession();
    };

    return (
        <>
            {workoutSession.visible ? (
                <WorkoutSessionScreen
                    exerciseName={workoutSession.exercise || ''}
                    sets={workoutSession.sets}
                    week={workoutSession.week || 1}
                    cycle={currentCycle}
                    weekName={weekNames[(workoutSession.week || 1) - 1]}
                    onComplete={handleWorkoutComplete}
                    onDiscard={handleWorkoutDiscard}
                    onNavigate={onNavigate}
                />
            ) : (
                <>
                    <Modal
                        isVisible={onboardingVisible}
                        onBackdropPress={() => setOnboardingVisible(false)}
                        style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}
                        backdropOpacity={0.5}
                        useNativeDriver={true}
                        hideModalContentWhileAnimating={true}
                        statusBarTranslucent={true}
                    >
                        <View style={{
                            backgroundColor: isDark ? COLORS.backgroundDark : COLORS.background,
                            borderRadius: 12,
                            padding: 20,
                            width: Platform.OS === 'web' ? 400 : '100%',
                            maxWidth: 400,
                            maxHeight: Dimensions.get('window').height * 0.8,
                            minHeight: 500
                        }}>
                            <ScrollView
                                style={{ flex: 1 }}
                                showsVerticalScrollIndicator={true}
                                contentContainerStyle={{ paddingBottom: 20 }}
                            >
                                {/* Step Indicator */}
                                <Text style={{ fontSize: 16, color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary, textAlign: 'center', marginBottom: 8 }}>
                                    Step {currentStep + 1} of {totalSteps}
                                </Text>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDark ? COLORS.textDark : COLORS.text, textAlign: 'center', marginBottom: 12 }}>
                                    {getStepTitle(currentStep)}
                                </Text>
                                <Text style={{ fontSize: 14, color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary, textAlign: 'center', marginBottom: 20 }}>
                                    {getStepDescription(currentStep)}
                                </Text>
                                {/* Step Content */}
                                {currentStep === 0 && (
                                    // Workout Schedule Step with dropdowns
                                    <View style={{ gap: 12 }}>
                                        {exercises.map((exercise) => (
                                            <View key={exercise} style={{ marginBottom: 8 }}>
                                                <Text style={{ fontWeight: '600', color: isDark ? COLORS.textDark : COLORS.text, marginBottom: 4 }}>
                                                    {exerciseNames[exercise]}
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => onboardingOpenDaySelector(exercise)}
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        borderWidth: 1,
                                                        borderColor: isDark ? COLORS.borderDark : COLORS.border,
                                                        borderRadius: 8,
                                                        padding: 12,
                                                        backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                                    }}
                                                >
                                                    <Text style={{ flex: 1, color: isDark ? COLORS.textDark : COLORS.text }}>
                                                        {onboardingData.workoutSchedule[exercise] || 'Select Day'}
                                                    </Text>
                                                    <ChevronDown size={20} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                        {/* Modal for picking a day */}
                                        <Modal
                                            isVisible={onboardingDaySelectorModalVisible}
                                            onBackdropPress={() => setOnboardingDaySelectorModalVisible(false)}
                                            style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}
                                            backdropOpacity={0.5}
                                            useNativeDriver={true}
                                            hideModalContentWhileAnimating={true}
                                            statusBarTranslucent={true}
                                        >
                                            <View style={{
                                                backgroundColor: isDark ? COLORS.backgroundDark : COLORS.background,
                                                borderRadius: 12,
                                                padding: 20,
                                                width: '100%',
                                                maxWidth: 400,
                                                maxHeight: Dimensions.get('window').height * 0.8,
                                                minHeight: Dimensions.get('window').height * 0.6
                                            }}>
                                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDark ? COLORS.textDark : COLORS.text, textAlign: 'center', marginBottom: 12 }}>
                                                    Select Day
                                                </Text>
                                                <Text style={{ fontSize: 14, color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary, textAlign: 'center', marginBottom: 20 }}>
                                                    Choose which day to perform {onboardingSelectedExercise ? exerciseNames[onboardingSelectedExercise] : ''}
                                                </Text>
                                                <ScrollView
                                                    style={{ flex: 1 }}
                                                    showsVerticalScrollIndicator={true}
                                                    contentContainerStyle={{ paddingBottom: 20 }}
                                                >
                                                    <View style={{ gap: 8 }}>
                                                        {onboardingSelectedExercise && onboardingGetAvailableDays(onboardingSelectedExercise).map(({ day, isCurrent, isUsed }) => (
                                                            <TouchableOpacity
                                                                key={day}
                                                                onPress={() => onboardingHandleDaySelect(onboardingSelectedExercise, day)}
                                                                style={{
                                                                    backgroundColor: isCurrent
                                                                        ? (isDark ? COLORS.primary : COLORS.primaryDark)
                                                                        : isUsed
                                                                            ? (isDark ? COLORS.errorDark + '20' : COLORS.error + '20')
                                                                            : (isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary),
                                                                    borderWidth: 1,
                                                                    borderColor: isCurrent
                                                                        ? (isDark ? COLORS.primary : COLORS.primaryDark)
                                                                        : isUsed
                                                                            ? (isDark ? COLORS.error : COLORS.errorDark)
                                                                            : (isDark ? COLORS.borderDark : COLORS.border),
                                                                    borderRadius: 8,
                                                                    padding: 16,
                                                                    alignItems: 'center',
                                                                    marginBottom: 8,
                                                                }}
                                                                activeOpacity={0.8}
                                                                disabled={isUsed}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        fontSize: 18,
                                                                        fontWeight: '600',
                                                                        color: isCurrent
                                                                            ? 'white'
                                                                            : isUsed
                                                                                ? (isDark ? COLORS.error : COLORS.errorDark)
                                                                                : (isDark ? COLORS.textDark : COLORS.text),
                                                                    }}
                                                                >
                                                                    {day}
                                                                </Text>
                                                                {isCurrent && (
                                                                    <CheckCircle size={20} color="white" style={{ marginTop: 4 }} />
                                                                )}
                                                                {isUsed && (
                                                                    <Text
                                                                        style={{
                                                                            fontSize: 12,
                                                                            color: isDark ? COLORS.error : COLORS.errorDark,
                                                                            marginTop: 4,
                                                                        }}
                                                                    >
                                                                        Already used
                                                                    </Text>
                                                                )}
                                                            </TouchableOpacity>
                                                        ))}
                                                    </View>
                                                </ScrollView>
                                                <TouchableOpacity
                                                    onPress={() => setOnboardingDaySelectorModalVisible(false)}
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        padding: 16,
                                                        borderRadius: 8,
                                                        alignItems: 'center',
                                                        marginTop: 16,
                                                        borderWidth: 1,
                                                        borderColor: isDark ? COLORS.borderDark : COLORS.border,
                                                    }}
                                                    activeOpacity={0.8}
                                                >
                                                    <Text style={{ color: isDark ? COLORS.textDark : COLORS.text, fontSize: 16, fontWeight: '600' }}>
                                                        Cancel
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </Modal>
                                    </View>
                                )}
                                {currentStep === 1 && (
                                    // Exercise Progression Step
                                    <View style={{ gap: 12 }}>
                                        {/* Unit toggle */}
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                                            <Button
                                                variant={onboardingUnit === 'kg' ? 'primary' : 'outline'}
                                                onPress={() => setOnboardingUnit('kg')}
                                                style={{ marginRight: 8 }}
                                            >
                                                kg
                                            </Button>
                                            <Button
                                                variant={onboardingUnit === 'lbs' ? 'primary' : 'outline'}
                                                onPress={() => setOnboardingUnit('lbs')}
                                            >
                                                lbs
                                            </Button>
                                        </View>
                                        <Text style={{ color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary, textAlign: 'center', marginBottom: 8 }}>
                                            Set the weight increment for each lift (per cycle) in {onboardingUnit}.
                                        </Text>
                                        {exercises.map((exercise) => (
                                            <View key={exercise} style={{ marginBottom: 8 }}>
                                                <Text style={{ fontWeight: '600', color: isDark ? COLORS.textDark : COLORS.text, marginBottom: 4 }}>
                                                    {exerciseNames[exercise]}
                                                </Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <TextInput
                                                        style={{
                                                            flex: 1,
                                                            borderWidth: 1,
                                                            borderColor: isDark ? COLORS.borderDark : COLORS.border,
                                                            borderRadius: 8,
                                                            padding: 8,
                                                            color: isDark ? COLORS.textDark : COLORS.text,
                                                            backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                                        }}
                                                        keyboardType="numeric"
                                                        value={onboardingData.exerciseProgression[exercise]}
                                                        onChangeText={(text) => {
                                                            let sanitized = text.replace(/,/g, '.').replace(/[^0-9.]/g, '');
                                                            const firstDot = sanitized.indexOf('.');
                                                            if (firstDot !== -1) {
                                                                sanitized = sanitized.slice(0, firstDot + 1) + sanitized.slice(firstDot + 1).replace(/\./g, '');
                                                            }
                                                            updateOnboardingData('exerciseProgression', exercise, sanitized);
                                                        }}
                                                        placeholder={`e.g. 2.5 or 5`}
                                                    />
                                                    <Text style={{ marginLeft: 8, color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary }}>
                                                        {onboardingUnit}
                                                    </Text>
                                                </View>
                                                <Text style={{ color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary, fontSize: 12, marginTop: 4, textAlign: 'center' }}>
                                                    If you can't see a decimal point, try pasting or using a different keyboard.
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                                {currentStep === 2 && (
                                    // 1RM Calculator Step
                                    <View style={{ gap: 12 }}>
                                        {exercises.map((exercise) => {
                                            const weight = onboardingData.oneRmWeight[exercise];
                                            const reps = onboardingData.oneRmReps[exercise];
                                            // Epley formula
                                            const calc1RM = weight && reps ? Math.round(parseFloat(weight) * (1 + parseFloat(reps) / 30)) : '';
                                            return (
                                                <View key={exercise} style={{ marginBottom: 8 }}>
                                                    <Text style={{ fontWeight: '600', color: isDark ? COLORS.textDark : COLORS.text, marginBottom: 4 }}>
                                                        {exerciseNames[exercise]}
                                                    </Text>
                                                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 4 }}>
                                                        <TextInput
                                                            style={{
                                                                flex: 1,
                                                                borderWidth: 1,
                                                                borderColor: isDark ? COLORS.borderDark : COLORS.border,
                                                                borderRadius: 8,
                                                                padding: 8,
                                                                color: isDark ? COLORS.textDark : COLORS.text,
                                                                backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                                            }}
                                                            keyboardType="numeric"
                                                            value={weight}
                                                            onChangeText={(text) => updateOnboardingData('oneRmWeight', exercise, text.replace(/[^0-9.]/g, ''))}
                                                            placeholder={`Weight (${onboardingUnit})`}
                                                        />
                                                        <TextInput
                                                            style={{
                                                                flex: 1,
                                                                borderWidth: 1,
                                                                borderColor: isDark ? COLORS.borderDark : COLORS.border,
                                                                borderRadius: 8,
                                                                padding: 8,
                                                                color: isDark ? COLORS.textDark : COLORS.text,
                                                                backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                                            }}
                                                            keyboardType="numeric"
                                                            value={reps}
                                                            onChangeText={(text) => updateOnboardingData('oneRmReps', exercise, text.replace(/[^0-9.]/g, ''))}
                                                            placeholder="Reps"
                                                        />
                                                    </View>
                                                    <Text style={{ color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary, marginBottom: 4 }}>
                                                        Calculated 1RM: {calc1RM || '--'} {onboardingUnit}
                                                    </Text>
                                                    <TextInput
                                                        style={{
                                                            borderWidth: 1,
                                                            borderColor: isDark ? COLORS.borderDark : COLORS.border,
                                                            borderRadius: 8,
                                                            padding: 8,
                                                            color: isDark ? COLORS.textDark : COLORS.text,
                                                            backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                                        }}
                                                        keyboardType="numeric"
                                                        value={onboardingData.oneRepMax[exercise]}
                                                        onChangeText={(text) => updateOnboardingData('oneRepMax', exercise, text.replace(/[^0-9.]/g, ''))}
                                                        placeholder={`Override 1RM (${onboardingUnit})`}
                                                    />
                                                    <Text style={{ color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary, fontSize: 12 }}>
                                                        You can override the calculated 1RM above if you know your true 1RM.
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}
                                {currentStep === 3 && (
                                    // Training Max Percentage Step
                                    <View style={{ gap: 12 }}>
                                        <Text style={{ fontWeight: '600', color: isDark ? COLORS.textDark : COLORS.text, marginBottom: 4 }}>
                                            Training Max Percentage
                                        </Text>
                                        <TextInput
                                            style={{
                                                borderWidth: 1,
                                                borderColor: isDark ? COLORS.borderDark : COLORS.border,
                                                borderRadius: 8,
                                                padding: 8,
                                                color: isDark ? COLORS.textDark : COLORS.text,
                                                backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                            }}
                                            keyboardType="numeric"
                                            value={onboardingData.trainingMaxPercentage}
                                            onChangeText={(text) => updateOnboardingData('trainingMaxPercentage', '', text.replace(/[^0-9.]/g, ''))}
                                            placeholder="e.g. 90"
                                        />
                                        <Text style={{ color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary, fontSize: 12 }}>
                                            Enter a value between 80 and 100.
                                        </Text>

                                        {/* Training Max Decreases Summary */}
                                        <View style={{ marginTop: 24, padding: 12, backgroundColor: isDark ? COLORS.errorDark + '10' : COLORS.error + '10', borderRadius: 8 }}>
                                            <Text style={{ fontWeight: '600', color: isDark ? COLORS.error : COLORS.errorDark, marginBottom: 8, fontSize: 16, textAlign: 'center' }}>
                                                Training Max Decreases
                                            </Text>
                                            {exercises.map((exercise) => {
                                                const decreases = trainingMaxDecreases[exercise];
                                                const hasDecreases = decreases > 0;
                                                return (
                                                    <View key={exercise} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                                                        <Text style={{ color: isDark ? COLORS.textDark : COLORS.text, fontSize: 15, fontWeight: '500' }}>
                                                            {exerciseNames[exercise]}
                                                        </Text>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                            <Text style={{ color: hasDecreases ? (isDark ? COLORS.error : COLORS.errorDark) : (isDark ? COLORS.textSecondaryDark : COLORS.textSecondary), fontWeight: '600', fontSize: 14 }}>
                                                                {hasDecreases ? `-${decreases * 10}%` : 'No decrease'}
                                                            </Text>
                                                            <TouchableOpacity
                                                                onPress={() => resetTrainingMaxDecreases(exercise)}
                                                                style={{
                                                                    backgroundColor: hasDecreases ? (isDark ? COLORS.error : COLORS.errorDark) : (isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary),
                                                                    paddingHorizontal: 10,
                                                                    paddingVertical: 4,
                                                                    borderRadius: 6,
                                                                    borderWidth: 1,
                                                                    borderColor: hasDecreases ? (isDark ? COLORS.error : COLORS.errorDark) : (isDark ? COLORS.borderDark : COLORS.border),
                                                                    marginLeft: 8,
                                                                }}
                                                                disabled={!hasDecreases}
                                                            >
                                                                <Text style={{ color: hasDecreases ? 'white' : (isDark ? COLORS.textSecondaryDark : COLORS.textSecondary), fontSize: 12, fontWeight: '600' }}>
                                                                    Reset
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                );
                                            })}
                                            <Text style={{ color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary, fontSize: 12, marginTop: 8, textAlign: 'center' }}>
                                                Failed workouts reduce your training max for the next cycle. You can reset decreases here if needed.
                                            </Text>
                                        </View>
                                    </View>
                                )}
                                {currentStep === 4 && (
                                    <View style={{ gap: 12 }}>
                                        <Text style={{ fontWeight: '600', color: isDark ? COLORS.textDark : COLORS.text, marginBottom: 4 }}>
                                            Assistance Work
                                        </Text>
                                        <Text style={{ color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary, fontSize: 14, marginBottom: 12 }}>
                                            Choose your assistance work variant for the 5/3/1 program.
                                        </Text>

                                        {/* Variant Selector */}
                                        <View style={{ marginBottom: 16 }}>
                                            <Text style={{ fontWeight: '600', color: isDark ? COLORS.textDark : COLORS.text, marginBottom: 8 }}>
                                                Select Variant
                                            </Text>
                                            <View style={{ gap: 8 }}>
                                                <TouchableOpacity
                                                    onPress={() => setOnboardingData(prev => ({ ...prev, bbbVariant: 'none' }))}
                                                    style={{
                                                        backgroundColor: onboardingData.bbbVariant === 'none'
                                                            ? (isDark ? COLORS.primary : COLORS.primaryDark)
                                                            : (isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary),
                                                        borderWidth: 1,
                                                        borderColor: onboardingData.bbbVariant === 'none'
                                                            ? (isDark ? COLORS.primary : COLORS.primaryDark)
                                                            : (isDark ? COLORS.borderDark : COLORS.border),
                                                        borderRadius: 8,
                                                        padding: 16,
                                                        alignItems: 'center',
                                                    }}
                                                    activeOpacity={0.8}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 16,
                                                            fontWeight: '600',
                                                            color: onboardingData.bbbVariant === 'none'
                                                                ? 'white'
                                                                : (isDark ? COLORS.textDark : COLORS.text),
                                                        }}
                                                    >
                                                        Nothing
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            fontSize: 12,
                                                            color: onboardingData.bbbVariant === 'none'
                                                                ? 'white'
                                                                : (isDark ? COLORS.textSecondaryDark : COLORS.textSecondary),
                                                            textAlign: 'center',
                                                            marginTop: 4,
                                                        }}
                                                    >
                                                        No assistance work
                                                    </Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    onPress={() => setOnboardingData(prev => ({ ...prev, bbbVariant: 'bbb' }))}
                                                    style={{
                                                        backgroundColor: onboardingData.bbbVariant === 'bbb'
                                                            ? (isDark ? COLORS.primary : COLORS.primaryDark)
                                                            : (isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary),
                                                        borderWidth: 1,
                                                        borderColor: onboardingData.bbbVariant === 'bbb'
                                                            ? (isDark ? COLORS.primary : COLORS.primaryDark)
                                                            : (isDark ? COLORS.borderDark : COLORS.border),
                                                        borderRadius: 8,
                                                        padding: 16,
                                                        alignItems: 'center',
                                                    }}
                                                    activeOpacity={0.8}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 16,
                                                            fontWeight: '600',
                                                            color: onboardingData.bbbVariant === 'bbb'
                                                                ? 'white'
                                                                : (isDark ? COLORS.textDark : COLORS.text),
                                                        }}
                                                    >
                                                        Big But Boring (BBB)
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            fontSize: 12,
                                                            color: onboardingData.bbbVariant === 'bbb'
                                                                ? 'white'
                                                                : (isDark ? COLORS.textSecondaryDark : COLORS.textSecondary),
                                                            textAlign: 'center',
                                                            marginTop: 4,
                                                        }}
                                                    >
                                                        5 sets of 10 reps at % of training max
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        {/* BBB Percentage Field - Only show when BBB is selected */}
                                        {onboardingData.bbbVariant === 'bbb' && (
                                            <View style={{ marginBottom: 8 }}>
                                                <Text style={{ fontWeight: '600', color: isDark ? COLORS.textDark : COLORS.text, marginBottom: 4 }}>
                                                    BBB Percentage of Training Max
                                                </Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <TextInput
                                                        style={{
                                                            flex: 1,
                                                            borderWidth: 1,
                                                            borderColor: isDark ? COLORS.borderDark : COLORS.border,
                                                            borderRadius: 8,
                                                            padding: 8,
                                                            color: isDark ? COLORS.textDark : COLORS.text,
                                                            backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                                        }}
                                                        keyboardType="numeric"
                                                        value={onboardingData.bbbPercentage}
                                                        onChangeText={text => setOnboardingData(prev => ({ ...prev, bbbPercentage: text.replace(/[^0-9.]/g, '') }))}
                                                        placeholder="e.g. 50"
                                                    />
                                                    <Text style={{ marginLeft: 8, color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary }}>
                                                        %
                                                    </Text>
                                                </View>
                                                <Text style={{ color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary, fontSize: 12 }}>
                                                    Enter a value between 0 and 100.
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </ScrollView>
                            {/* Step Navigation */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
                                <Button onPress={() => setCurrentStep(Math.max(currentStep - 1, 0))} variant="outline" disabled={currentStep === 0} style={{ flex: 1, marginRight: 8 }}>
                                    Back
                                </Button>
                                <Button onPress={handleOnboardingNext} variant="primary" style={{ flex: 1, marginLeft: 8 }}>
                                    {currentStep < totalSteps - 1 ? 'Next' : 'Finish'}
                                </Button>
                            </View>
                            <Button onPress={() => setOnboardingVisible(false)} variant="outline" style={{ marginTop: 16 }}>
                                Cancel
                            </Button>
                        </View>
                    </Modal>
                    <ScrollView
                        ref={scrollViewRef}
                        style={{
                            flex: 1,
                            backgroundColor: isDark ? COLORS.backgroundDark : COLORS.background,
                        }}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                        onScroll={(event) => {
                            const offsetY = event.nativeEvent.contentOffset.y;
                            saveScrollPosition('home', offsetY);
                        }}
                        scrollEventThrottle={16}
                    >
                        {/* Onboarding Button - Show when onboarding is needed */}
                        {isOnboardingNeeded() && (
                            <Card
                                title="Complete Setup"
                                borderColor={isDark ? COLORS.primaryLight : COLORS.primary}
                            >
                                <View style={{ alignItems: 'center', padding: 20 }}>
                                    <UserPlus size={48} color={isDark ? COLORS.primary : COLORS.primaryDark} style={{ marginBottom: 16 }} />
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: '600',
                                            color: isDark ? COLORS.textDark : COLORS.text,
                                            textAlign: 'center',
                                            marginBottom: 12,
                                        }}
                                    >
                                        Complete Your Setup ({onboardingProgress}%)
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                            textAlign: 'center',
                                            marginBottom: 24,
                                            lineHeight: 20,
                                        }}
                                    >
                                        To start your 5/3/1 journey, we need to set up your workout schedule, exercise progression, 1 rep max values, and training max percentage.
                                    </Text>

                                    {/* Progress indicator */}
                                    <View style={{ width: '100%', marginBottom: 20 }}>
                                        <View style={{
                                            width: '100%',
                                            height: 8,
                                            backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                            borderRadius: 4,
                                            overflow: 'hidden'
                                        }}>
                                            <View style={{
                                                width: `${onboardingProgress}%`,
                                                height: '100%',
                                                backgroundColor: isDark ? COLORS.primary : COLORS.primaryDark,
                                                borderRadius: 4
                                            }} />
                                        </View>
                                    </View>

                                    {/* Missing items */}
                                    <View style={{ width: '100%', marginBottom: 24 }}>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                fontWeight: '600',
                                                color: isDark ? COLORS.textDark : COLORS.text,
                                                marginBottom: 8,
                                            }}
                                        >
                                            Still needed:
                                        </Text>
                                        <View style={{ gap: 4 }}>
                                            {missingItems.workoutSchedule && (
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                    <Circle size={12} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                                                    <Text style={{ fontSize: 12, color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary }}>
                                                        Workout Schedule
                                                    </Text>
                                                </View>
                                            )}
                                            {missingItems.exerciseProgression && (
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                    <Circle size={12} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                                                    <Text style={{ fontSize: 12, color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary }}>
                                                        Exercise Progression
                                                    </Text>
                                                </View>
                                            )}
                                            {missingItems.oneRepMax && (
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                    <Circle size={12} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                                                    <Text style={{ fontSize: 12, color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary }}>
                                                        1 Rep Max Values
                                                    </Text>
                                                </View>
                                            )}
                                            {missingItems.trainingMaxPercentage && (
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                    <Circle size={12} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                                                    <Text style={{ fontSize: 12, color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary }}>
                                                        Training Max Percentage
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
                                        <Button
                                            onPress={() => setOnboardingVisible(true)}
                                            variant="primary"
                                            style={{ flex: 1 }}
                                        >
                                            Quick Setup
                                        </Button>
                                        <Button
                                            onPress={() => {
                                                onNavigate?.('settings');
                                            }}
                                            variant="outline"
                                            style={{ flex: 1 }}
                                        >
                                            Go to Settings
                                        </Button>
                                    </View>
                                </View>
                            </Card>
                        )}

                        {/* Week Plan - Only show when onboarding is complete */}
                        {!isOnboardingNeeded() && (
                            <Card
                                title="Week Plan"
                                borderColor={isDark ? COLORS.secondaryLight : COLORS.secondary}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                                    <Calendar size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                                    <Text
                                        style={{
                                            color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                            marginLeft: 8,
                                            fontSize: 16
                                        }}
                                    >
                                        {currentWeek === 4 ? 'Deload Week' : `Week ${currentWeek}`} - Cycle {currentCycle}
                                    </Text>
                                </View>

                                {/* Current Week's Workouts */}
                                {cycleOverview.filter(week => week.status === 'current').map((currentWeek, weekIndex) => {
                                    // Categorize workouts by status
                                    const todaysWorkouts = currentWeek.lifts.filter(lift => lift.status === 'today');
                                    const upcomingWorkouts = currentWeek.lifts.filter(lift => lift.status === 'upcoming');
                                    const completedWorkouts = currentWeek.lifts.filter(lift => lift.status === 'completed');
                                    const missedWorkouts = currentWeek.lifts.filter(lift => lift.status === 'missed');

                                    return (
                                        <View key={weekIndex} style={{ gap: 16 }}>
                                            {/* Today's Workouts */}
                                            {todaysWorkouts.length > 0 && (
                                                <View style={{ gap: 12 }}>
                                                    <Text
                                                        style={{
                                                            fontSize: 14,
                                                            fontWeight: '600',
                                                            color: isDark ? COLORS.primary : COLORS.primaryDark,
                                                            marginBottom: 8
                                                        }}
                                                    >
                                                        Today
                                                    </Text>
                                                    {todaysWorkouts.map((lift, liftIndex) => (
                                                        <View
                                                            key={liftIndex}
                                                            style={{
                                                                backgroundColor: isDark ? COLORS.primaryDark + '20' : COLORS.primary + '20',
                                                                padding: 16,
                                                                borderRadius: 12,
                                                                borderWidth: 1,
                                                                borderColor: isDark ? COLORS.primary : COLORS.primaryDark,
                                                            }}
                                                        >
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                                                <Text
                                                                    style={{
                                                                        fontSize: 16,
                                                                        color: isDark ? COLORS.textDark : COLORS.text,
                                                                        fontWeight: '600'
                                                                    }}
                                                                >
                                                                    {lift.lift}
                                                                </Text>
                                                                <Badge
                                                                    label={`${lift.scheduledDay} - ${formatDateForBadge(lift.scheduledDate)}`}
                                                                    variant="primary"
                                                                />
                                                            </View>
                                                            <View style={{ marginBottom: 12 }}>
                                                                <Text
                                                                    style={{
                                                                        fontSize: 14,
                                                                        color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                                                        marginBottom: 4
                                                                    }}
                                                                >
                                                                    <Text style={{ fontWeight: '600' }}>Date: </Text>
                                                                    {lift.scheduledDate.toLocaleDateString('en-US', {
                                                                        weekday: 'long',
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}
                                                                </Text>
                                                                <Text
                                                                    style={{
                                                                        fontSize: 14,
                                                                        color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary
                                                                    }}
                                                                >
                                                                    Top Set: {lift.weight} × {lift.topSet.replace(/^\d+×/, '')}
                                                                </Text>
                                                                {lift.bbbWeight && (
                                                                    <Text
                                                                        style={{
                                                                            fontSize: 14,
                                                                            color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary
                                                                        }}
                                                                    >
                                                                        BBB: {lift.bbbWeight} × 5 × 10
                                                                    </Text>
                                                                )}
                                                            </View>
                                                            <Button
                                                                onPress={() => handleStartWorkout(lift.lift)}
                                                                variant="primary"
                                                                fullWidth
                                                            >
                                                                Start Workout
                                                            </Button>
                                                        </View>
                                                    ))}
                                                </View>
                                            )}

                                            {/* Upcoming Workouts */}
                                            {upcomingWorkouts.length > 0 && (
                                                <View style={{ gap: 12 }}>
                                                    <Text
                                                        style={{
                                                            fontSize: 14,
                                                            fontWeight: '600',
                                                            color: isDark ? COLORS.textDark : COLORS.text,
                                                            marginBottom: 8
                                                        }}
                                                    >
                                                        Upcoming
                                                    </Text>
                                                    {upcomingWorkouts.map((lift, liftIndex) => (
                                                        <View
                                                            key={liftIndex}
                                                            style={{
                                                                backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                                                padding: 16,
                                                                borderRadius: 12,
                                                                borderWidth: 1,
                                                                borderColor: isDark ? COLORS.borderDark : COLORS.border,
                                                            }}
                                                        >
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                                                <Text
                                                                    style={{
                                                                        fontSize: 16,
                                                                        color: isDark ? COLORS.textDark : COLORS.text,
                                                                        fontWeight: '600'
                                                                    }}
                                                                >
                                                                    {lift.lift}
                                                                </Text>
                                                                <Badge
                                                                    label={`${lift.scheduledDay} - ${formatDateForBadge(lift.scheduledDate)}`}
                                                                    variant="complementary"
                                                                />
                                                            </View>
                                                            <View style={{ marginBottom: 12 }}>
                                                                <Text
                                                                    style={{
                                                                        fontSize: 14,
                                                                        color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                                                        marginBottom: 4
                                                                    }}
                                                                >
                                                                    <Text style={{ fontWeight: '600' }}>Date: </Text>
                                                                    {lift.scheduledDate.toLocaleDateString('en-US', {
                                                                        weekday: 'long',
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}
                                                                </Text>
                                                                <Text
                                                                    style={{
                                                                        fontSize: 14,
                                                                        color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary
                                                                    }}
                                                                >
                                                                    Top Set: {lift.weight} × {lift.topSet.replace(/^\d+×/, '')}
                                                                </Text>
                                                                {lift.bbbWeight && (
                                                                    <Text
                                                                        style={{
                                                                            fontSize: 14,
                                                                            color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary
                                                                        }}
                                                                    >
                                                                        BBB: {lift.bbbWeight} × 5 × 10
                                                                    </Text>
                                                                )}
                                                            </View>
                                                            <Button
                                                                onPress={() => handleStartWorkout(lift.lift)}
                                                                variant="outline"
                                                                fullWidth
                                                            >
                                                                Start Workout
                                                            </Button>
                                                        </View>
                                                    ))}
                                                </View>
                                            )}

                                            {/* Missed Workouts */}
                                            {missedWorkouts.length > 0 && (
                                                <View style={{ gap: 12 }}>
                                                    <Text
                                                        style={{
                                                            fontSize: 14,
                                                            fontWeight: '600',
                                                            color: isDark ? COLORS.error : COLORS.errorDark,
                                                            marginBottom: 8
                                                        }}
                                                    >
                                                        Missed
                                                    </Text>
                                                    {missedWorkouts.map((lift, liftIndex) => (
                                                        <View
                                                            key={liftIndex}
                                                            style={{
                                                                backgroundColor: isDark ? COLORS.errorDark + '20' : COLORS.error + '20',
                                                                padding: 16,
                                                                borderRadius: 12,
                                                                borderWidth: 1,
                                                                borderColor: isDark ? COLORS.error : COLORS.errorDark,
                                                            }}
                                                        >
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                                                <Text
                                                                    style={{
                                                                        fontSize: 16,
                                                                        color: isDark ? COLORS.textDark : COLORS.text,
                                                                        fontWeight: '600'
                                                                    }}
                                                                >
                                                                    {lift.lift}
                                                                </Text>
                                                                <Badge
                                                                    label={`${lift.scheduledDay} - ${formatDateForBadge(lift.scheduledDate)}`}
                                                                    variant="error"
                                                                />
                                                            </View>
                                                            <View style={{ marginBottom: 12 }}>
                                                                <Text
                                                                    style={{
                                                                        fontSize: 14,
                                                                        color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                                                        marginBottom: 4
                                                                    }}
                                                                >
                                                                    <Text style={{ fontWeight: '600' }}>Date: </Text>
                                                                    {lift.scheduledDate.toLocaleDateString('en-US', {
                                                                        weekday: 'long',
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}
                                                                </Text>
                                                                <Text
                                                                    style={{
                                                                        fontSize: 14,
                                                                        color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary
                                                                    }}
                                                                >
                                                                    Top Set: {lift.weight} × {lift.topSet.replace(/^\d+×/, '')}
                                                                </Text>
                                                                {lift.bbbWeight && (
                                                                    <Text
                                                                        style={{
                                                                            fontSize: 14,
                                                                            color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary
                                                                        }}
                                                                    >
                                                                        BBB: {lift.bbbWeight} × 5 × 10
                                                                    </Text>
                                                                )}
                                                            </View>
                                                            <Button
                                                                onPress={() => handleStartWorkout(lift.lift)}
                                                                variant="primary"
                                                                fullWidth
                                                            >
                                                                Start Workout
                                                            </Button>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                                                                <Text
                                                                    style={{
                                                                        fontSize: 12,
                                                                        color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                                                        fontWeight: '500',
                                                                    }}
                                                                >
                                                                    ? Missed
                                                                </Text>
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        Alert.alert(
                                                                            'Undo Missed Workout',
                                                                            `Are you sure you want to undo the missed ${lift.lift} workout?`,
                                                                            [
                                                                                { text: 'Cancel', style: 'cancel' },
                                                                                {
                                                                                    text: 'Undo',
                                                                                    style: 'destructive',
                                                                                    onPress: () => undoWorkout(lift.exercise, currentCycle, lift.week)
                                                                                }
                                                                            ]
                                                                        );
                                                                    }}
                                                                    style={{
                                                                        backgroundColor: isDark ? COLORS.errorDark : COLORS.error,
                                                                        paddingHorizontal: 8,
                                                                        paddingVertical: 4,
                                                                        borderRadius: 4,
                                                                    }}
                                                                >
                                                                    <Text style={{ color: 'white', fontSize: 10, fontWeight: '600' }}>
                                                                        Undo
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    ))}
                                                </View>
                                            )}

                                            {/* Completed Workouts */}
                                            {completedWorkouts.length > 0 && (
                                                <View style={{ gap: 12 }}>
                                                    <Text
                                                        style={{
                                                            fontSize: 14,
                                                            fontWeight: '600',
                                                            color: COLORS.success,
                                                            marginBottom: 8
                                                        }}
                                                    >
                                                        Completed
                                                    </Text>
                                                    {completedWorkouts.map((lift, liftIndex) => (
                                                        <View
                                                            key={liftIndex}
                                                            style={{
                                                                backgroundColor: isDark ? COLORS.successDark + '20' : COLORS.success + '20',
                                                                padding: 16,
                                                                borderRadius: 12,
                                                                borderWidth: 1,
                                                                borderColor: COLORS.success,
                                                                opacity: 0.8,
                                                            }}
                                                        >
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                                                <Text
                                                                    style={{
                                                                        fontSize: 16,
                                                                        color: isDark ? COLORS.textDark : COLORS.text,
                                                                        fontWeight: '600'
                                                                    }}
                                                                >
                                                                    {lift.lift}
                                                                </Text>
                                                                <Badge
                                                                    label={`${lift.scheduledDay} - ${formatDateForBadge(lift.scheduledDate)}`}
                                                                    variant="success"
                                                                />
                                                            </View>
                                                            <View style={{ marginBottom: 12 }}>
                                                                <Text
                                                                    style={{
                                                                        fontSize: 14,
                                                                        color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                                                        marginBottom: 4
                                                                    }}
                                                                >
                                                                    <Text style={{ fontWeight: '600' }}>Date: </Text>
                                                                    {lift.scheduledDate.toLocaleDateString('en-US', {
                                                                        weekday: 'long',
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}
                                                                </Text>
                                                                <Text
                                                                    style={{
                                                                        fontSize: 14,
                                                                        color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary
                                                                    }}
                                                                >
                                                                    Top Set: {lift.weight} × {lift.topSet.replace(/^\d+×/, '')}
                                                                </Text>
                                                                {lift.bbbWeight && (
                                                                    <Text
                                                                        style={{
                                                                            fontSize: 14,
                                                                            color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary
                                                                        }}
                                                                    >
                                                                        BBB: {lift.bbbWeight} × 5 × 10
                                                                    </Text>
                                                                )}
                                                                {lift.reps !== null && (
                                                                    <Text
                                                                        style={{
                                                                            fontSize: 14,
                                                                            color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary
                                                                        }}
                                                                    >
                                                                        Reps: {lift.reps}
                                                                    </Text>
                                                                )}
                                                            </View>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                <Text
                                                                    style={{
                                                                        fontSize: 12,
                                                                        color: COLORS.success,
                                                                        fontWeight: '500',
                                                                    }}
                                                                >
                                                                    ✓ Completed
                                                                </Text>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                                    {lift.reps !== null && (
                                                                        (lift.week === 4 ? lift.reps < 3 : lift.reps < 5)
                                                                            ? <Text style={{ fontSize: 12, color: COLORS.error, fontWeight: '600' }}>✗ Failed</Text>
                                                                            : <Text style={{ fontSize: 12, color: COLORS.success, fontWeight: '600' }}>✓ Passed</Text>
                                                                    )}
                                                                    {lift.reps !== null && (
                                                                        <Text
                                                                            style={{
                                                                                fontSize: 12,
                                                                                color: (lift.week === 4 ? lift.reps < 3 : lift.reps < 5) ? COLORS.error : COLORS.success,
                                                                                fontWeight: '600',
                                                                            }}
                                                                        >
                                                                            {lift.reps}
                                                                        </Text>
                                                                    )}
                                                                    <TouchableOpacity
                                                                        onPress={() => {
                                                                            Alert.alert(
                                                                                'Undo Workout',
                                                                                `Are you sure you want to undo the ${lift.lift} workout?`,
                                                                                [
                                                                                    { text: 'Cancel', style: 'cancel' },
                                                                                    {
                                                                                        text: 'Undo',
                                                                                        style: 'destructive',
                                                                                        onPress: () => undoWorkout(lift.exercise, currentCycle, lift.week)
                                                                                    }
                                                                                ]
                                                                            );
                                                                        }}
                                                                        style={{
                                                                            backgroundColor: isDark ? COLORS.errorDark : COLORS.error,
                                                                            paddingHorizontal: 8,
                                                                            paddingVertical: 4,
                                                                            borderRadius: 4,
                                                                        }}
                                                                    >
                                                                        <Text style={{ color: 'white', fontSize: 10, fontWeight: '600' }}>
                                                                            Undo
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    ))}
                                                </View>
                                            )}

                                            {/* Empty State if no workouts */}
                                            {todaysWorkouts.length === 0 && upcomingWorkouts.length === 0 && completedWorkouts.length === 0 && missedWorkouts.length === 0 && (
                                                <View style={{ alignItems: 'center', padding: 20 }}>
                                                    <Calendar size={48} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} style={{ marginBottom: 16 }} />
                                                    <Text
                                                        style={{
                                                            fontSize: 16,
                                                            fontWeight: '600',
                                                            color: isDark ? COLORS.textDark : COLORS.text,
                                                            textAlign: 'center',
                                                            marginBottom: 8,
                                                        }}
                                                    >
                                                        No Workouts This Week
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            fontSize: 14,
                                                            color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                                            textAlign: 'center',
                                                            lineHeight: 20,
                                                        }}
                                                    >
                                                        Your current week's workouts will appear here.
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    );
                                })}
                            </Card>
                        )}

                        {/* Cycle Overview - Only show when onboarding is complete */}
                        {!isOnboardingNeeded() && (
                            <Card
                                title="Cycle Overview"
                                borderColor={isDark ? COLORS.secondaryLight : COLORS.secondary}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                                    <BarChart3 size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                                    <Text
                                        style={{
                                            color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                            marginLeft: 8,
                                            fontSize: 16
                                        }}
                                    >
                                        Cycle {currentCycle} Progress
                                    </Text>
                                </View>

                                <View style={{ gap: 12 }}>
                                    {cycleOverview.map((week, weekIndex) => (
                                        <View
                                            key={weekIndex}
                                            style={{
                                                backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                                padding: 16,
                                                borderRadius: 12,
                                                borderWidth: 1,
                                                borderColor: getStatusColor(week.status),
                                            }}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                                {getStatusIcon(week.status)}
                                                <Text
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: '600',
                                                        color: isDark ? COLORS.textDark : COLORS.text,
                                                        marginLeft: 8,
                                                        flex: 1
                                                    }}
                                                >
                                                    {weekNames[week.week - 1]}
                                                </Text>
                                                <Badge
                                                    label={week.description}
                                                    variant={week.status === 'completed' ? 'success' : week.status === 'current' ? 'primary' : 'complementary'}
                                                />
                                            </View>

                                            <View style={{ gap: 8 }}>
                                                {week.lifts.map((lift, liftIndex) => {
                                                    // Get workout status for this specific exercise
                                                    const workoutStatus = getWorkoutStatus(lift.exercise, currentCycle, lift.week);
                                                    let exerciseStatus: 'upcoming' | 'completed' | 'failed' = 'upcoming';

                                                    if (workoutStatus && workoutStatus.status === 'completed' && workoutStatus.reps) {
                                                        // Check if failed based on reps
                                                        const isFailed = lift.week === 4 ? workoutStatus.reps < 3 : workoutStatus.reps < 5;
                                                        exerciseStatus = isFailed ? 'failed' : 'completed';
                                                    }

                                                    return (
                                                        <View
                                                            key={liftIndex}
                                                            style={{
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                                paddingVertical: 4,
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    fontSize: 14,
                                                                    color: isDark ? COLORS.textDark : COLORS.text,
                                                                    flex: 1
                                                                }}
                                                            >
                                                                {lift.lift}
                                                            </Text>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                                {exerciseStatus === 'completed' && (
                                                                    <Text style={{ fontSize: 12, color: COLORS.success, fontWeight: '600' }}>✓ Passed</Text>
                                                                )}
                                                                {exerciseStatus === 'failed' && (
                                                                    <Text style={{ fontSize: 12, color: COLORS.error, fontWeight: '600' }}>✗ Failed</Text>
                                                                )}
                                                                <Text
                                                                    style={{
                                                                        fontSize: 14,
                                                                        color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                                                    }}
                                                                >
                                                                    {lift.weight} × {lift.topSet.replace(/^\d+×/, '')}
                                                                </Text>
                                                                {lift.bbbWeight && (
                                                                    <Text
                                                                        style={{
                                                                            fontSize: 14,
                                                                            color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary
                                                                        }}
                                                                    >
                                                                        BBB: {lift.bbbWeight} × 5 × 10
                                                                    </Text>
                                                                )}
                                                                {workoutStatus && workoutStatus.reps !== null && (
                                                                    <Text
                                                                        style={{
                                                                            fontSize: 12,
                                                                            color: exerciseStatus === 'completed' ? COLORS.success : COLORS.error,
                                                                            fontWeight: '600',
                                                                        }}
                                                                    >
                                                                        {workoutStatus.reps}
                                                                    </Text>
                                                                )}
                                                            </View>
                                                        </View>
                                                    );
                                                })}
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </Card>
                        )}
                    </ScrollView>
                </>
            )}
        </>
    );
};