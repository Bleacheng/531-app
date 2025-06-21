import React, { useRef, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Stack, Text } from '@tamagui/core';
import { Calendar, CheckCircle, Circle, TrendingUp, X } from 'lucide-react-native';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { COLORS } from '../constants/colors';

export const HomeScreen: React.FC = () => {
    const { resolvedTheme } = useTheme();
    const { formatWeight, workoutSchedule, exerciseProgression, saveScrollPosition, getScrollPosition } = useSettings();
    const isDark = resolvedTheme === 'dark';
    const scrollViewRef = useRef<ScrollView>(null);

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

    // This week's workouts (Week 3 - 5/3/1+)
    const thisWeeksWorkouts = [
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
    ];

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

    const formatDate = (date: Date) => {
        const today = new Date();
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

    const completedWorkouts = thisWeeksWorkouts.filter(workout => workout.completed);
    const upcomingWorkouts = thisWeeksWorkouts.filter(workout => !workout.completed);

    // Get today's workout
    const today = new Date();
    const todaysWorkout = thisWeeksWorkouts.find(workout =>
        workout.date.toDateString() === today.toDateString()
    );

    return (
        <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1, padding: 20 }}
            onScroll={(event) => {
                const offsetY = event.nativeEvent.contentOffset.y;
                saveScrollPosition('home', offsetY);
            }}
            scrollEventThrottle={16}
        >
            {/* Week Plan */}
            <Card
                title="Week Plan"
                borderColor={isDark ? COLORS.secondaryLight : COLORS.secondary}
            >
                <Stack flexDirection="row" alignItems="center" marginBottom={15}>
                    <Calendar size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                    <Text
                        color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                        marginLeft={8}
                        fontSize={16}
                    >
                        Week 3 - Cycle 1
                    </Text>
                </Stack>

                {/* Today's Workout */}
                {todaysWorkout && (
                    <Stack gap={12} marginBottom={16}>
                        <Text
                            fontSize={14}
                            fontWeight="600"
                            color={isDark ? COLORS.textDark : COLORS.text}
                            marginBottom={8}
                        >
                            Today
                        </Text>
                        <Stack
                            style={{
                                backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                padding: 16,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: isDark ? COLORS.primary : COLORS.primaryDark,
                            }}
                        >
                            <Stack flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom={8}>
                                <Text
                                    fontSize={16}
                                    color={isDark ? COLORS.textDark : COLORS.text}
                                    fontWeight="600"
                                >
                                    {todaysWorkout.lift}
                                </Text>
                                <Badge
                                    label={todaysWorkout.day}
                                    variant={todaysWorkout.completed ? "success" : "primary"}
                                />
                            </Stack>
                            <Stack marginBottom={12}>
                                <Text
                                    fontSize={14}
                                    color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                                >
                                    Top Set: {todaysWorkout.topSet}
                                </Text>
                                <Text
                                    fontSize={14}
                                    color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                                >
                                    Weight: {todaysWorkout.weight}
                                </Text>
                                <Text
                                    fontSize={12}
                                    color={isDark ? COLORS.textTertiaryDark : COLORS.textTertiary}
                                >
                                    {formatDate(todaysWorkout.date)}
                                </Text>
                            </Stack>
                            {todaysWorkout.completed ? (
                                <Text
                                    fontSize={12}
                                    color={COLORS.success}
                                    fontWeight="500"
                                >
                                    ✓ Completed
                                </Text>
                            ) : (
                                <Button
                                    title="Start Workout"
                                    onPress={() => handleStartWorkout(todaysWorkout.lift)}
                                    variant="primary"
                                    fullWidth
                                />
                            )}
                        </Stack>
                    </Stack>
                )}

                {/* Upcoming Workouts */}
                {upcomingWorkouts.length > 0 && (
                    <Stack gap={12} marginBottom={16}>
                        <Text
                            fontSize={14}
                            fontWeight="600"
                            color={isDark ? COLORS.textDark : COLORS.text}
                            marginBottom={8}
                        >
                            Upcoming
                        </Text>
                        {upcomingWorkouts.map((workout, index) => (
                            <Stack
                                key={index}
                                style={{
                                    backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                    padding: 16,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: isDark ? COLORS.borderDark : COLORS.border,
                                }}
                            >
                                <Stack flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom={8}>
                                    <Text
                                        fontSize={16}
                                        color={isDark ? COLORS.textDark : COLORS.text}
                                        fontWeight="600"
                                    >
                                        {workout.lift}
                                    </Text>
                                    <Badge
                                        label={workout.day}
                                        variant="complementary"
                                    />
                                </Stack>
                                <Stack marginBottom={12}>
                                    <Text
                                        fontSize={14}
                                        color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                                    >
                                        Top Set: {workout.topSet}
                                    </Text>
                                    <Text
                                        fontSize={14}
                                        color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                                    >
                                        Weight: {workout.weight}
                                    </Text>
                                    <Text
                                        fontSize={12}
                                        color={isDark ? COLORS.textTertiaryDark : COLORS.textTertiary}
                                    >
                                        {formatDate(workout.date)}
                                    </Text>
                                </Stack>
                                <Button
                                    title="Start Workout"
                                    onPress={() => handleStartWorkout(workout.lift)}
                                    variant="primary"
                                    fullWidth
                                />
                            </Stack>
                        ))}
                    </Stack>
                )}

                {/* Completed Workouts */}
                {completedWorkouts.length > 0 && (
                    <Stack gap={12}>
                        <Text
                            fontSize={14}
                            fontWeight="600"
                            color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                            marginBottom={8}
                        >
                            Completed
                        </Text>
                        {completedWorkouts.map((workout, index) => (
                            <Stack
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
                                <Stack flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom={8}>
                                    <Text
                                        fontSize={16}
                                        color={isDark ? COLORS.textDark : COLORS.text}
                                        fontWeight="600"
                                    >
                                        {workout.lift}
                                    </Text>
                                    <Badge
                                        label={workout.day}
                                        variant="success"
                                    />
                                </Stack>
                                <Stack marginBottom={12}>
                                    <Text
                                        fontSize={14}
                                        color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                                    >
                                        Top Set: {workout.topSet}
                                    </Text>
                                    <Text
                                        fontSize={14}
                                        color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                                    >
                                        Weight: {workout.weight}
                                    </Text>
                                    <Text
                                        fontSize={12}
                                        color={isDark ? COLORS.textTertiaryDark : COLORS.textTertiary}
                                    >
                                        {formatDate(workout.date)}
                                    </Text>
                                </Stack>
                                <Text
                                    fontSize={12}
                                    color={COLORS.success}
                                    fontWeight="500"
                                >
                                    ✓ Completed
                                </Text>
                            </Stack>
                        ))}
                    </Stack>
                )}
            </Card>

            {/* 4-Week Cycle Overview */}
            <Card
                title="4-Week Cycle Overview"
                borderColor={isDark ? COLORS.successLight : COLORS.success}
            >
                <Stack flexDirection="row" alignItems="center" marginBottom={15}>
                    <Calendar size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                    <Text
                        color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                        marginLeft={8}
                        fontSize={14}
                    >
                        Jim Wendler's 5/3/1 Program
                    </Text>
                </Stack>
                <Stack gap={16}>
                    {cycleOverview.map((week, index) => (
                        <Stack key={index} gap={8}>
                            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                                <Stack flexDirection="row" alignItems="center" flex={1}>
                                    {getStatusIcon(week.status)}
                                    <Text
                                        fontSize={16}
                                        color={getStatusColor(week.status)}
                                        fontWeight="600"
                                        marginLeft={8}
                                    >
                                        {week.name}
                                    </Text>
                                </Stack>
                                <Badge
                                    label={week.description}
                                    variant={week.status === 'completed' ? 'success' : week.status === 'current' ? 'primary' : 'complementary'}
                                />
                            </Stack>
                            <Stack marginLeft={24} gap={6}>
                                {week.lifts.map((lift, liftIndex) => (
                                    <Stack key={liftIndex} gap={4}>
                                        <Stack flexDirection="row" alignItems="center" gap={8}>
                                            <Text
                                                fontSize={14}
                                                color={isDark ? COLORS.textDark : COLORS.text}
                                                fontWeight="500"
                                            >
                                                {lift.lift}
                                            </Text>
                                            {getPassFailIcon(lift.passed)}
                                        </Stack>
                                        <Stack marginLeft={8}>
                                            <Text
                                                fontSize={12}
                                                color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                                            >
                                                Top Set: {lift.topSet} @ {lift.weight}
                                            </Text>
                                            {lift.reps !== null && (
                                                <Text
                                                    fontSize={12}
                                                    color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                                                >
                                                    Reps: {lift.reps}
                                                </Text>
                                            )}
                                        </Stack>
                                    </Stack>
                                ))}
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
            </Card>
        </ScrollView>
    );
}; 