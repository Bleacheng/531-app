import React, { useRef, useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Calendar, CheckCircle, Circle, TrendingUp, X, ArrowRight, ArrowLeft, Settings, UserPlus } from 'lucide-react-native';
import Modal from 'react-native-modal';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { COLORS } from '../constants/colors';

export const HomeScreen: React.FC = () => {
    const { theme } = useTheme();
    const {
        formatWeight,
        workoutSchedule,
        exerciseProgression,
        oneRepMax,
        saveScrollPosition,
        getScrollPosition,
        isOnboardingNeeded,
        completeOnboarding,
        updateWorkoutDay,
        updateExerciseProgression,
        updateOneRepMax
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
        }
    });

    // Restore scroll position when component mounts
    useEffect(() => {
        const savedPosition = getScrollPosition('home');
        if (savedPosition > 0) {
            scrollViewRef.current?.scrollTo({ y: savedPosition, animated: false });
        }
    }, []);

    const handleStartWorkout = (exercise: string) => {
        console.log(`Start ${exercise} workout pressed`);
        // TODO: Navigate to workout screen
    };

    // Onboarding functions
    const handleOnboardingNext = () => {
        if (currentStep < 2) {
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

        // Complete onboarding
        await completeOnboarding();
        setOnboardingVisible(false);
        setCurrentStep(0);
    };

    const updateOnboardingData = (section: keyof typeof onboardingData, field: string, value: string) => {
        setOnboardingData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const getStepTitle = (step: number) => {
        switch (step) {
            case 0: return 'Workout Schedule';
            case 1: return 'Exercise Progression';
            case 2: return '1 Rep Max (1RM)';
            default: return '';
        }
    };

    const getStepDescription = (step: number) => {
        switch (step) {
            case 0: return 'Choose which day each exercise is performed';
            case 1: return 'Set weight progression per cycle for each exercise';
            case 2: return 'Enter your current 1 rep max for each exercise';
            default: return '';
        }
    };

    // Helper function to calculate workout weight based on progression
    const calculateWorkoutWeight = (exercise: string, baseWeight: number, cycle: number) => {
        const progressionMap: { [key: string]: number } = {
            'Bench Press': exerciseProgression.benchPress,
            'Squat': exerciseProgression.squat,
            'Deadlift': exerciseProgression.deadlift,
            'Overhead Press': exerciseProgression.overheadPress,
        };

        const progression = progressionMap[exercise] || 2.5;
        return baseWeight + (progression * (cycle - 1));
    };

    // Example usage:
    // const benchWeight = calculateWorkoutWeight('Bench Press', 80, 3); // 80 + (2.5 * 2) = 85kg

    // Get current week's start date (Monday)
    const getWeekStart = () => {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const monday = new Date(now);
        monday.setDate(now.getDate() - daysToMonday);
        return monday;
    };

    const weekStart = getWeekStart();

    // Helper function to get day offset
    const getDayOffset = (day: string) => {
        const dayMap: { [key: string]: number } = {
            'Monday': 0,
            'Tuesday': 1,
            'Wednesday': 2,
            'Thursday': 3,
            'Friday': 4,
            'Saturday': 5,
            'Sunday': 6
        };
        return dayMap[day] || 0;
    };

    // Memoize today's date to prevent recalculation on every render
    const today = useMemo(() => new Date(), []);

    // This week's workouts (Week 3 - 5/3/1+)
    const thisWeeksWorkouts = useMemo(() => [
        {
            lift: 'Bench Press',
            topSet: '5/3/1+',
            weight: '85kg',
            day: workoutSchedule.benchPress,
            date: new Date(weekStart.getTime() + getDayOffset(workoutSchedule.benchPress) * 24 * 60 * 60 * 1000),
            completed: true
        },
        {
            lift: 'Squat',
            topSet: '5/3/1+',
            weight: '120kg',
            day: workoutSchedule.squat,
            date: new Date(weekStart.getTime() + getDayOffset(workoutSchedule.squat) * 24 * 60 * 60 * 1000),
            completed: true
        },
        {
            lift: 'Deadlift',
            topSet: '5/3/1+',
            weight: '160kg',
            day: workoutSchedule.deadlift,
            date: new Date(weekStart.getTime() + getDayOffset(workoutSchedule.deadlift) * 24 * 60 * 60 * 1000),
            completed: false
        },
        {
            lift: 'Overhead Press',
            topSet: '5/3/1+',
            weight: '60kg',
            day: workoutSchedule.overheadPress,
            date: new Date(weekStart.getTime() + getDayOffset(workoutSchedule.overheadPress) * 24 * 60 * 60 * 1000),
            completed: false
        },
    ], [workoutSchedule, weekStart]);

    // Memoize today's workout to prevent recalculation
    const todaysWorkout = useMemo(() => {
        return thisWeeksWorkouts.find(workout =>
            workout.date.toDateString() === today.toDateString()
        );
    }, [thisWeeksWorkouts, today]);

    // Memoize completed and upcoming workouts
    const completedWorkouts = useMemo(() =>
        thisWeeksWorkouts.filter(workout => workout.completed),
        [thisWeeksWorkouts]
    );

    const upcomingWorkouts = useMemo(() =>
        thisWeeksWorkouts.filter(workout => !workout.completed),
        [thisWeeksWorkouts]
    );

    // 5/3/1 4-week cycle overview with completed lifts and pass/fail status
    const cycleOverview = [
        {
            week: 1,
            name: 'Week 1',
            description: '5/5/5+',
            status: 'completed' as const,
            lifts: [
                { lift: 'Bench Press', topSet: '5/5/5+', weight: '80kg', reps: 8, passed: true },
                { lift: 'Squat', topSet: '5/5/5+', weight: '115kg', reps: 7, passed: true },
                { lift: 'Deadlift', topSet: '5/5/5+', weight: '155kg', reps: 6, passed: true },
                { lift: 'Overhead Press', topSet: '5/5/5+', weight: '55kg', reps: 9, passed: true },
            ]
        },
        {
            week: 2,
            name: 'Week 2',
            description: '3/3/3+',
            status: 'completed' as const,
            lifts: [
                { lift: 'Bench Press', topSet: '3/3/3+', weight: '82kg', reps: 5, passed: true },
                { lift: 'Squat', topSet: '3/3/3+', weight: '117kg', reps: 4, passed: true },
                { lift: 'Deadlift', topSet: '3/3/3+', weight: '157kg', reps: 3, passed: true },
                { lift: 'Overhead Press', topSet: '3/3/3+', weight: '57kg', reps: 6, passed: true },
            ]
        },
        {
            week: 3,
            name: 'Week 3',
            description: '5/3/1+',
            status: 'current' as const,
            lifts: [
                { lift: 'Bench Press', topSet: '5/3/1+', weight: '85kg', reps: 3, passed: true },
                { lift: 'Squat', topSet: '5/3/1+', weight: '120kg', reps: 2, passed: true },
                { lift: 'Deadlift', topSet: '5/3/1+', weight: '160kg', reps: 1, passed: false },
                { lift: 'Overhead Press', topSet: '5/3/1+', weight: '60kg', reps: 4, passed: null },
            ]
        },
        {
            week: 4,
            name: 'Week 4',
            description: 'Deload',
            status: 'upcoming' as const,
            lifts: [
                { lift: 'Bench Press', topSet: '5x5', weight: '65kg', reps: null, passed: null },
                { lift: 'Squat', topSet: '5x5', weight: '95kg', reps: null, passed: null },
                { lift: 'Deadlift', topSet: '5x5', weight: '125kg', reps: null, passed: null },
                { lift: 'Overhead Press', topSet: '5x5', weight: '45kg', reps: null, passed: null },
            ]
        },
    ];

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
                                Complete Your Setup
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
                                To start your 5/3/1 journey, we need to set up your workout schedule, exercise progression, and 1 rep max values.
                            </Text>
                            <Button
                                onPress={() => setOnboardingVisible(true)}
                                variant="primary"
                                fullWidth
                            >
                                Start Setup
                            </Button>
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
                                Week 3 - Cycle 1
                            </Text>
                        </View>

                        {/* Today's Workout */}
                        {todaysWorkout && (
                            <View style={{ gap: 12, marginBottom: 16 }}>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '600',
                                        color: isDark ? COLORS.textDark : COLORS.text,
                                        marginBottom: 8
                                    }}
                                >
                                    Today
                                </Text>
                                <View
                                    style={{
                                        backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
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
                                            {todaysWorkout.lift}
                                        </Text>
                                        <Badge
                                            label={todaysWorkout.day}
                                            variant={todaysWorkout.completed ? "success" : "primary"}
                                        />
                                    </View>
                                    <View style={{ marginBottom: 12 }}>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary
                                            }}
                                        >
                                            Top Set: {todaysWorkout.topSet}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary
                                            }}
                                        >
                                            Weight: {todaysWorkout.weight}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: isDark ? COLORS.textTertiaryDark : COLORS.textTertiary
                                            }}
                                        >
                                            {formatDate(todaysWorkout.date)}
                                        </Text>
                                    </View>
                                    {todaysWorkout.completed ? (
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: COLORS.success,
                                                fontWeight: '500'
                                            }}
                                        >
                                            ✓ Completed
                                        </Text>
                                    ) : (
                                        <Button
                                            onPress={() => handleStartWorkout(todaysWorkout.lift)}
                                            variant="primary"
                                            fullWidth
                                        >
                                            Start Workout
                                        </Button>
                                    )}
                                </View>
                            </View>
                        )}

                        {/* Upcoming Workouts */}
                        {upcomingWorkouts.length > 0 && (
                            <View style={{ gap: 12, marginBottom: 16 }}>
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
                                {upcomingWorkouts.map((workout, index) => (
                                    <View
                                        key={index}
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
                                                {workout.lift}
                                            </Text>
                                            <Badge
                                                label={workout.day}
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
                                                Top Set: {workout.topSet}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary
                                                }}
                                            >
                                                Weight: {workout.weight}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    color: isDark ? COLORS.textTertiaryDark : COLORS.textTertiary
                                                }}
                                            >
                                                {formatDate(workout.date)}
                                            </Text>
                                        </View>
                                        <Button
                                            onPress={() => handleStartWorkout(workout.lift)}
                                            variant="primary"
                                            fullWidth
                                        >
                                            Start Workout
                                        </Button>
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
                                        color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                        marginBottom: 8
                                    }}
                                >
                                    Completed
                                </Text>
                                {completedWorkouts.map((workout, index) => (
                                    <View
                                        key={index}
                                        style={{
                                            backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                            padding: 16,
                                            borderRadius: 12,
                                            borderWidth: 1,
                                            borderColor: isDark ? COLORS.borderDark : COLORS.border,
                                            opacity: 0.6,
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
                                                {workout.lift}
                                            </Text>
                                            <Badge
                                                label={workout.day}
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
                                                Top Set: {workout.topSet}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary
                                                }}
                                            >
                                                Weight: {workout.weight}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    color: isDark ? COLORS.textTertiaryDark : COLORS.textTertiary
                                                }}
                                            >
                                                {formatDate(workout.date)}
                                            </Text>
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
                    </Card>
                )}

                {/* 4-Week Cycle Overview - Only show when onboarding is complete */}
                {!isOnboardingNeeded() && (
                    <Card
                        title="4-Week Cycle Overview"
                        borderColor={isDark ? COLORS.successLight : COLORS.success}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <Calendar size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                            <Text
                                style={{
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                    marginLeft: 8,
                                    fontSize: 14
                                }}
                            >
                                Jim Wendler's 5/3/1 Program
                            </Text>
                        </View>
                        <View style={{ gap: 16 }}>
                            {cycleOverview.map((week, index) => (
                                <View key={index} style={{ gap: 8 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                            {getStatusIcon(week.status)}
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    color: getStatusColor(week.status),
                                                    fontWeight: '600',
                                                    marginLeft: 8
                                                }}
                                            >
                                                {week.name}
                                            </Text>
                                        </View>
                                        <Badge
                                            label={week.description}
                                            variant={week.status === 'completed' ? 'success' : week.status === 'current' ? 'primary' : 'complementary'}
                                        />
                                    </View>
                                    <View style={{ marginLeft: 24, gap: 6 }}>
                                        {week.lifts.map((lift, liftIndex) => (
                                            <View key={liftIndex} style={{ gap: 4 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                    <Text
                                                        style={{
                                                            fontSize: 14,
                                                            color: isDark ? COLORS.textDark : COLORS.text,
                                                            fontWeight: '500'
                                                        }}
                                                    >
                                                        {lift.lift}
                                                    </Text>
                                                    {getPassFailIcon(lift.passed)}
                                                </View>
                                                <View style={{ marginLeft: 8 }}>
                                                    <Text
                                                        style={{
                                                            fontSize: 12,
                                                            color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary
                                                        }}
                                                    >
                                                        Top Set: {lift.topSet} @ {lift.weight}
                                                    </Text>
                                                    {lift.reps !== null && (
                                                        <Text
                                                            style={{
                                                                fontSize: 12,
                                                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary
                                                            }}
                                                        >
                                                            Reps: {lift.reps}
                                                        </Text>
                                                    )}
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </Card>
                )}
            </ScrollView>

            {/* Onboarding Modal */}
            <Modal
                isVisible={onboardingVisible}
                onBackdropPress={() => { }} // Prevent closing by backdrop
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                }}
                backdropOpacity={0.5}
                useNativeDriver={true}
                hideModalContentWhileAnimating={true}
                statusBarTranslucent={true}
                animationIn="fadeIn"
                animationOut="fadeOut"
                animationInTiming={200}
                animationOutTiming={200}
            >
                <View
                    style={{
                        backgroundColor: isDark ? COLORS.backgroundDark : COLORS.background,
                        borderRadius: 12,
                        padding: 20,
                        width: '100%',
                        maxWidth: 400,
                        shadowColor: isDark ? COLORS.primaryDark : COLORS.primary,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 8,
                    }}
                >
                    {/* Header */}
                    <View style={{ marginBottom: 20 }}>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: isDark ? COLORS.textDark : COLORS.text,
                                textAlign: 'center',
                            }}
                        >
                            {getStepTitle(currentStep)}
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                textAlign: 'center',
                                marginTop: 8,
                            }}
                        >
                            {getStepDescription(currentStep)}
                        </Text>

                        {/* Progress indicator */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
                            {[0, 1, 2].map((step) => (
                                <View
                                    key={step}
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: step === currentStep
                                            ? (isDark ? COLORS.primary : COLORS.primaryDark)
                                            : (isDark ? COLORS.borderDark : COLORS.border),
                                        marginHorizontal: 4,
                                    }}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Step Content */}
                    {currentStep === 0 && (
                        <View style={{ gap: 12 }}>
                            {Object.entries({
                                benchPress: 'Bench Press',
                                squat: 'Squat',
                                deadlift: 'Deadlift',
                                overheadPress: 'Overhead Press'
                            }).map(([key, name]) => (
                                <View key={key} style={{ gap: 8 }}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: '600',
                                            color: isDark ? COLORS.textDark : COLORS.text,
                                        }}
                                    >
                                        {name}
                                    </Text>
                                    <View style={{ flexDirection: 'row', gap: 8 }}>
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                            <TouchableOpacity
                                                key={day}
                                                onPress={() => updateOnboardingData('workoutSchedule', key, day)}
                                                style={{
                                                    flex: 1,
                                                    backgroundColor: onboardingData.workoutSchedule[key as keyof typeof onboardingData.workoutSchedule] === day
                                                        ? (isDark ? COLORS.primary : COLORS.primaryDark)
                                                        : (isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary),
                                                    borderWidth: 1,
                                                    borderColor: onboardingData.workoutSchedule[key as keyof typeof onboardingData.workoutSchedule] === day
                                                        ? (isDark ? COLORS.primary : COLORS.primaryDark)
                                                        : (isDark ? COLORS.borderDark : COLORS.border),
                                                    borderRadius: 8,
                                                    padding: 12,
                                                    alignItems: 'center',
                                                }}
                                                activeOpacity={0.8}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 12,
                                                        fontWeight: '600',
                                                        color: onboardingData.workoutSchedule[key as keyof typeof onboardingData.workoutSchedule] === day
                                                            ? 'white'
                                                            : (isDark ? COLORS.textDark : COLORS.text),
                                                    }}
                                                >
                                                    {day.slice(0, 3)}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {currentStep === 1 && (
                        <View style={{ gap: 12 }}>
                            {Object.entries({
                                benchPress: 'Bench Press',
                                squat: 'Squat',
                                deadlift: 'Deadlift',
                                overheadPress: 'Overhead Press'
                            }).map(([key, name]) => (
                                <View key={key} style={{ gap: 8 }}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: '600',
                                            color: isDark ? COLORS.textDark : COLORS.text,
                                        }}
                                    >
                                        {name}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                            }}
                                        >
                                            +{formatWeight(0).split(' ')[1]}
                                        </Text>
                                        <TextInput
                                            value={onboardingData.exerciseProgression[key as keyof typeof onboardingData.exerciseProgression]}
                                            onChangeText={(value) => updateOnboardingData('exerciseProgression', key, value)}
                                            keyboardType="numeric"
                                            style={{
                                                flex: 1,
                                                backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                                borderWidth: 1,
                                                borderColor: isDark ? COLORS.borderDark : COLORS.border,
                                                borderRadius: 8,
                                                padding: 12,
                                                color: isDark ? COLORS.textDark : COLORS.text,
                                                fontSize: 16,
                                            }}
                                            placeholder="2.5"
                                            placeholderTextColor={isDark ? COLORS.textTertiaryDark : COLORS.textTertiary}
                                        />
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {currentStep === 2 && (
                        <View style={{ gap: 12 }}>
                            {Object.entries({
                                benchPress: 'Bench Press',
                                squat: 'Squat',
                                deadlift: 'Deadlift',
                                overheadPress: 'Overhead Press'
                            }).map(([key, name]) => (
                                <View key={key} style={{ gap: 8 }}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: '600',
                                            color: isDark ? COLORS.textDark : COLORS.text,
                                        }}
                                    >
                                        {name}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <TextInput
                                            value={onboardingData.oneRepMax[key as keyof typeof onboardingData.oneRepMax]}
                                            onChangeText={(value) => updateOnboardingData('oneRepMax', key, value)}
                                            keyboardType="numeric"
                                            style={{
                                                flex: 1,
                                                backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                                borderWidth: 1,
                                                borderColor: isDark ? COLORS.borderDark : COLORS.border,
                                                borderRadius: 8,
                                                padding: 12,
                                                color: isDark ? COLORS.textDark : COLORS.text,
                                                fontSize: 16,
                                            }}
                                            placeholder="100"
                                            placeholderTextColor={isDark ? COLORS.textTertiaryDark : COLORS.textTertiary}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                                minWidth: 30,
                                            }}
                                        >
                                            {formatWeight(0).split(' ')[1]}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Navigation Buttons */}
                    <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
                        {currentStep > 0 && (
                            <TouchableOpacity
                                onPress={handleOnboardingBack}
                                style={{
                                    flex: 1,
                                    backgroundColor: 'transparent',
                                    borderWidth: 1,
                                    borderColor: isDark ? COLORS.borderDark : COLORS.border,
                                    borderRadius: 8,
                                    padding: 16,
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}
                                activeOpacity={0.8}
                            >
                                <ArrowLeft size={16} color={isDark ? COLORS.textDark : COLORS.text} />
                                <Text style={{ color: isDark ? COLORS.textDark : COLORS.text, fontSize: 16, fontWeight: '600', marginLeft: 8 }}>
                                    Back
                                </Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            onPress={handleOnboardingNext}
                            style={{
                                flex: 1,
                                backgroundColor: isDark ? COLORS.primary : COLORS.primaryDark,
                                borderRadius: 8,
                                padding: 16,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginRight: 8 }}>
                                {currentStep === 2 ? 'Complete' : 'Next'}
                            </Text>
                            {currentStep < 2 && <ArrowRight size={16} color="white" />}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}; 