import React, { useRef, useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Calendar, CheckCircle, Circle, TrendingUp, X, ArrowRight, ArrowLeft, Settings, UserPlus, ChevronDown, BarChart3 } from 'lucide-react-native';
import Modal from 'react-native-modal';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { OneRMGraph } from '../components/OneRMGraph';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { COLORS } from '../constants/colors';

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
        completeOnboarding,
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
        updateWorkoutStatuses
    } = useSettings();
    const isDark = theme === 'dark';
    const scrollViewRef = useRef<ScrollView>(null);

    // Onboarding state
    const [onboardingVisible, setOnboardingVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [onboardingData, setOnboardingData] = useState({
        workoutSchedule: {
            benchPress: '',
            squat: '',
            deadlift: '',
            overheadPress: '',
        },
        exerciseProgression: {
            benchPress: '',
            squat: '',
            deadlift: '',
            overheadPress: '',
        },
        oneRepMax: {
            benchPress: '',
            squat: '',
            deadlift: '',
            overheadPress: '',
        },
        trainingMaxPercentage: '90'
    });

    // Day selector modal state (like in settings)
    const [daySelectorModalVisible, setDaySelectorModalVisible] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<keyof typeof workoutSchedule | null>(null);

    // Restore scroll position when component mounts
    useEffect(() => {
        const savedPosition = getScrollPosition('home');
        if (savedPosition > 0) {
            scrollViewRef.current?.scrollTo({ y: savedPosition, animated: false });
        }
    }, []);

    const handleStartWorkout = (exercise: string) => {
        // For now, we'll simulate completing the workout
        // In a real app, this would open a workout tracking screen
        const exerciseKey = Object.keys(exerciseNames).find(key => exerciseNames[key as keyof typeof exerciseNames] === exercise) as keyof typeof workoutSchedule;

        if (exerciseKey) {
            // Simulate completing the workout with random reps (5-10)
            const reps = Math.floor(Math.random() * 6) + 5;
            const weight = calculateWorkoutWeight(exerciseKey, currentWeek, 3);

            completeWorkout(exerciseKey, currentCycle, currentWeek, reps, formatWeight(weight));

            Alert.alert(
                'Workout Completed!',
                `${exercise} completed with ${reps} reps at ${formatWeight(weight)}`,
                [{ text: 'OK' }]
            );
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

    // Onboarding functions
    const handleOnboardingNext = () => {
        // Validate current step before proceeding
        if (!isCurrentStepValid()) {
            return;
        }

        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            handleCompleteOnboarding();
        }
    };

    const handleOnboardingBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Validation functions for each step
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
            default:
                return false;
        }
    };

    const getStepValidationError = () => {
        switch (currentStep) {
            case 0: // Workout Schedule
                if (!Object.values(onboardingData.workoutSchedule).every(day => day !== '')) {
                    return 'Please select a day for all exercises';
                }
                if (Object.values(onboardingData.workoutSchedule).length !== new Set(Object.values(onboardingData.workoutSchedule)).size) {
                    return 'Each exercise must be on a different day';
                }
                return null;
            case 1: // Exercise Progression
                const invalidProgression = Object.entries(onboardingData.exerciseProgression).find(([exercise, progression]) =>
                    progression === '' || isNaN(parseFloat(progression)) || parseFloat(progression) <= 0
                );
                if (invalidProgression) {
                    return `Please enter a valid progression for ${invalidProgression[0]}`;
                }
                return null;
            case 2: // 1 Rep Max
                const invalidWeight = Object.entries(onboardingData.oneRepMax).find(([exercise, weight]) =>
                    weight === '' || isNaN(parseFloat(weight)) || parseFloat(weight) <= 0
                );
                if (invalidWeight) {
                    return `Please enter a valid 1RM for ${invalidWeight[0]}`;
                }
                return null;
            case 3: // Training Max Percentage
                if (onboardingData.trainingMaxPercentage === '') {
                    return 'Please enter a training max percentage';
                }
                if (isNaN(parseFloat(onboardingData.trainingMaxPercentage))) {
                    return 'Please enter a valid number';
                }
                const percentage = parseFloat(onboardingData.trainingMaxPercentage);
                if (percentage < 80 || percentage > 100) {
                    return 'Training max must be between 80% and 100%';
                }
                return null;
            default:
                return null;
        }
    };

    const handleCompleteOnboarding = async () => {
        // Save all the onboarding data
        Object.entries(onboardingData.workoutSchedule).forEach(([exercise, day]) => {
            if (day) {
                updateWorkoutDay(exercise as keyof typeof workoutSchedule, day);
            }
        });

        Object.entries(onboardingData.exerciseProgression).forEach(([exercise, progression]) => {
            if (progression) {
                updateExerciseProgression(exercise as keyof typeof exerciseProgression, parseFloat(progression));
            }
        });

        Object.entries(onboardingData.oneRepMax).forEach(([exercise, weight]) => {
            if (weight) {
                updateOneRepMax(exercise as keyof typeof oneRepMax, parseFloat(weight));
            }
        });

        // Save training max percentage
        if (onboardingData.trainingMaxPercentage) {
            updateTrainingMaxPercentage(parseFloat(onboardingData.trainingMaxPercentage));
        }

        // Complete onboarding
        await completeOnboarding();
        setOnboardingVisible(false);
        setCurrentStep(0);
    };

    const updateOnboardingData = (section: keyof typeof onboardingData, field: string, value: string) => {
        if (section === 'trainingMaxPercentage') {
            setOnboardingData(prev => ({
                ...prev,
                trainingMaxPercentage: value
            }));
        } else {
            setOnboardingData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        }
    };

    const getStepTitle = (step: number) => {
        switch (step) {
            case 0: return 'Workout Schedule';
            case 1: return 'Exercise Progression';
            case 2: return '1 Rep Max (1RM)';
            case 3: return 'Training Max Percentage';
            default: return '';
        }
    };

    const getStepDescription = (step: number) => {
        switch (step) {
            case 0: return 'Choose which day each exercise is performed';
            case 1: return 'Set weight progression per cycle for each exercise';
            case 2: return 'Enter your current 1 rep max for each exercise';
            case 3: return 'Enter your training max percentage';
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

        // Training max increases by progression amount each cycle
        const cycleIncrease = progression * (cycle - 1);
        const adjustedOneRM = baseOneRM + cycleIncrease;
        const trainingMax = adjustedOneRM * trainingMaxPercent;

        return roundToNearest2_5(trainingMax);
    };

    // Calculate workout weight for a specific week and exercise
    const calculateWorkoutWeight = (exercise: keyof typeof oneRepMax, week: number, set: 1 | 2 | 3): number => {
        const trainingMax = calculateTrainingMax(exercise, currentCycle);
        const weekPercentages = workingSetPercentages[`week${week}` as keyof typeof workingSetPercentages];
        const percentage = weekPercentages[`set${set}` as keyof typeof weekPercentages];

        const weight = (trainingMax * percentage) / 100;
        return roundToNearest2_5(weight);
    };

    // Get next occurrence of a day of the week
    const getNextDayOccurrence = (dayName: string, fromDate: Date = new Date()): Date => {
        const dayMap: { [key: string]: number } = {
            'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4,
            'Friday': 5, 'Saturday': 6, 'Sunday': 0
        };

        const targetDay = dayMap[dayName];
        const currentDay = fromDate.getDay();
        const daysUntilTarget = (targetDay - currentDay + 7) % 7;

        const nextDate = new Date(fromDate);
        nextDate.setDate(fromDate.getDate() + daysUntilTarget);
        return nextDate;
    };

    // Memoize today's date to prevent recalculation on every render
    const today = useMemo(() => new Date(), []);

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

            const weekNames = ['5/5/5+', '3/3/3+', '5/3/1+', 'Deload'];
            const weekDescriptions = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

            // Calculate week start date based on first workout day
            const firstWorkoutDay = Object.values(workoutSchedule).find(day => day !== '');
            if (!firstWorkoutDay) continue;

            const weekStartDate = getNextDayOccurrence(firstWorkoutDay, new Date());
            weekStartDate.setDate(weekStartDate.getDate() + (week - 1) * 7);

            const lifts = Object.entries(workoutSchedule).map(([exercise, day]) => {
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
                    exercise: exercise as keyof typeof workoutSchedule
                };
            });

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
                const weekNames = ['5/5/5+', '3/3/3+', '5/3/1+', 'Deload'];
                const weekDescriptions = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

                const firstWorkoutDay = Object.values(workoutSchedule).find(day => day !== '');
                if (!firstWorkoutDay) continue;

                const weekStartDate = getNextDayOccurrence(firstWorkoutDay, new Date());
                weekStartDate.setDate(weekStartDate.getDate() + (week - 1) * 7 + 28); // +28 for next cycle

                const lifts = Object.entries(workoutSchedule).map(([exercise, day]) => {
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
                        exercise: exercise as keyof typeof workoutSchedule
                    };
                });

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
    }, [currentCycle, currentWeek, workoutSchedule, oneRepMax, exerciseProgression, trainingMaxPercentage, workingSetPercentages, isOnboardingNeeded, workoutHistory]);

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

    return (
        <>
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
                                                            label={`${lift.scheduledDay} - ${formatDate(lift.scheduledDate)}`}
                                                            variant="primary"
                                                        />
                                                    </View>
                                                    <View style={{ marginBottom: 12 }}>
                                                        <Text
                                                            style={{
                                                                fontSize: 14,
                                                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary
                                                            }}
                                                        >
                                                            Top Set: {lift.topSet}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                fontSize: 14,
                                                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary
                                                            }}
                                                        >
                                                            Weight: {lift.weight}
                                                        </Text>
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
                                                            label={`${lift.scheduledDay} - ${formatDate(lift.scheduledDate)}`}
                                                            variant="complementary"
                                                        />
                                                    </View>
                                                    <View style={{ marginBottom: 12 }}>
                                                        <Text
                                                            style={{
                                                                fontSize: 14,
                                                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary
                                                            }}
                                                        >
                                                            Top Set: {lift.topSet}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                fontSize: 14,
                                                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary
                                                            }}
                                                        >
                                                            Weight: {lift.weight}
                                                        </Text>
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
                                                            label={`${lift.scheduledDay} - ${formatDate(lift.scheduledDate)}`}
                                                            variant="error"
                                                        />
                                                    </View>
                                                    <View style={{ marginBottom: 12 }}>
                                                        <Text
                                                            style={{
                                                                fontSize: 14,
                                                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary
                                                            }}
                                                        >
                                                            Top Set: {lift.topSet} @ {lift.weight}
                                                        </Text>
                                                    </View>
                                                    <Text
                                                        style={{
                                                            fontSize: 12,
                                                            color: isDark ? COLORS.error : COLORS.errorDark,
                                                            fontWeight: '500'
                                                        }}
                                                    >
                                                        ✗ Missed
                                                    </Text>
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
                                                            label={`${lift.scheduledDay} - ${formatDate(lift.scheduledDate)}`}
                                                            variant="success"
                                                        />
                                                    </View>
                                                    <View style={{ marginBottom: 12 }}>
                                                        <Text
                                                            style={{
                                                                fontSize: 14,
                                                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary
                                                            }}
                                                        >
                                                            Top Set: {lift.topSet} @ {lift.weight}
                                                        </Text>
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
                                                    <Text
                                                        style={{
                                                            fontSize: 12,
                                                            color: COLORS.success,
                                                            fontWeight: '500'
                                                        }}
                                                    >
                                                        ✓ Completed
                                                    </Text>
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
            </ScrollView>
        </>
    );
};