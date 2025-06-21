import React from 'react';
import { ScrollView } from 'react-native';
import { Stack, Text } from '@tamagui/core';
import { Calendar, CheckCircle, Circle, TrendingUp } from 'lucide-react-native';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { COLORS } from '../constants/colors';

export const HomeScreen: React.FC = () => {
    const { resolvedTheme } = useTheme();
    const { formatWeight } = useSettings();
    const isDark = resolvedTheme === 'dark';

    const handleStartWorkout = () => {
        console.log('Start workout pressed');
        // TODO: Navigate to workout screen
    };

    // This week's upcoming workouts (Week 3 - 5/3/1+)
    const thisWeeksWorkouts = [
        {
            lift: 'Bench Press',
            topSet: '5/3/1+',
            weight: '85kg',
            day: 'Monday'
        },
        {
            lift: 'Squat',
            topSet: '5/3/1+',
            weight: '120kg',
            day: 'Tuesday'
        },
        {
            lift: 'Deadlift',
            topSet: '5/3/1+',
            weight: '160kg',
            day: 'Thursday'
        },
        {
            lift: 'Overhead Press',
            topSet: '5/3/1+',
            weight: '60kg',
            day: 'Friday'
        },
    ];

    // 5/3/1 4-week cycle overview with completed lifts and reps
    const cycleOverview = [
        {
            week: 1,
            name: 'Week 1',
            description: '5/5/5+',
            status: 'completed' as const,
            lifts: [
                { lift: 'Bench Press', topSet: '5/5/5+', weight: '80kg', reps: 8 },
                { lift: 'Squat', topSet: '5/5/5+', weight: '115kg', reps: 7 },
                { lift: 'Deadlift', topSet: '5/5/5+', weight: '155kg', reps: 6 },
                { lift: 'Overhead Press', topSet: '5/5/5+', weight: '55kg', reps: 9 },
            ]
        },
        {
            week: 2,
            name: 'Week 2',
            description: '3/3/3+',
            status: 'completed' as const,
            lifts: [
                { lift: 'Bench Press', topSet: '3/3/3+', weight: '82kg', reps: 5 },
                { lift: 'Squat', topSet: '3/3/3+', weight: '117kg', reps: 4 },
                { lift: 'Deadlift', topSet: '3/3/3+', weight: '157kg', reps: 3 },
                { lift: 'Overhead Press', topSet: '3/3/3+', weight: '57kg', reps: 6 },
            ]
        },
        {
            week: 3,
            name: 'Week 3',
            description: '5/3/1+',
            status: 'current' as const,
            lifts: [
                { lift: 'Bench Press', topSet: '5/3/1+', weight: '85kg', reps: 3 },
                { lift: 'Squat', topSet: '5/3/1+', weight: '120kg', reps: 2 },
                { lift: 'Deadlift', topSet: '5/3/1+', weight: '160kg', reps: 1 },
                { lift: 'Overhead Press', topSet: '5/3/1+', weight: '60kg', reps: 4 },
            ]
        },
        {
            week: 4,
            name: 'Week 4',
            description: 'Deload',
            status: 'upcoming' as const,
            lifts: [
                { lift: 'Bench Press', topSet: '5x5', weight: '65kg', reps: null },
                { lift: 'Squat', topSet: '5x5', weight: '95kg', reps: null },
                { lift: 'Deadlift', topSet: '5x5', weight: '125kg', reps: null },
                { lift: 'Overhead Press', topSet: '5x5', weight: '45kg', reps: null },
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

    return (
        <ScrollView style={{ flex: 1, padding: 20 }}>
            {/* This Week's Workout */}
            <Card
                title="This Week's Workout"
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
                <Stack gap={12}>
                    {thisWeeksWorkouts.map((workout, index) => (
                        <Stack key={index} gap={8}>
                            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
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
                            <Stack marginLeft={16}>
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
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
                <Stack marginTop={15}>
                    <Button
                        title="Start Workout"
                        onPress={handleStartWorkout}
                        variant="primary"
                        fullWidth
                    />
                </Stack>
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
                                        <Text
                                            fontSize={14}
                                            color={isDark ? COLORS.textDark : COLORS.text}
                                            fontWeight="500"
                                        >
                                            {lift.lift}
                                        </Text>
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