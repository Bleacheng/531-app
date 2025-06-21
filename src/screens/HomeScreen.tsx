import React from 'react';
import { ScrollView } from 'react-native';
import { Stack, Text } from '@tamagui/core';
import { Play, History, Calendar, TrendingUp } from 'lucide-react-native';
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

    const handleViewHistory = () => {
        console.log('View history pressed');
        // TODO: Navigate to history screen
    };

    const workoutExercises = [
        { name: 'Bench Press', type: '5/3/1' },
        { name: 'Overhead Press', type: '5/3/1' },
        { name: 'Deadlift', type: '5/3/1' },
        { name: 'Squat', type: '5/3/1' },
    ];

    const progressItems = [
        { exercise: 'Bench Press 1RM', weight: 100, change: 5, status: 'success' as const },
        { exercise: 'Deadlift 1RM', weight: 180, change: 10, status: 'success' as const },
        { exercise: 'Squat 1RM', weight: 140, change: 0, status: 'warning' as const },
        { exercise: 'Overhead Press 1RM', weight: 70, change: -2, status: 'error' as const },
    ];

    return (
        <ScrollView style={{ flex: 1, padding: 20 }}>
            {/* Quick Actions */}
            <Card
                title="Quick Start"
                borderColor={isDark ? COLORS.primaryLight : COLORS.primary}
            >
                <Stack flexDirection="row" gap={10}>
                    <Button
                        title="Start Workout"
                        onPress={handleStartWorkout}
                        variant="primary"
                        icon={Play}
                        fullWidth
                    />
                    <Button
                        title="View History"
                        onPress={handleViewHistory}
                        variant="outline"
                        icon={History}
                        fullWidth
                    />
                </Stack>
            </Card>

            {/* Today's Workout */}
            <Card
                title="Today's Workout"
                borderColor={isDark ? COLORS.secondaryLight : COLORS.secondary}
            >
                <Stack flexDirection="row" alignItems="center" marginBottom={15}>
                    <Calendar size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                    <Text
                        color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                        marginLeft={8}
                        fontSize={16}
                    >
                        Week 1 - Cycle 1
                    </Text>
                </Stack>
                <Stack gap={12}>
                    {workoutExercises.map((exercise, index) => (
                        <Stack key={index} flexDirection="row" justifyContent="space-between" alignItems="center">
                            <Text
                                fontSize={16}
                                color={isDark ? COLORS.textDark : COLORS.text}
                                fontWeight="500"
                            >
                                {exercise.name}
                            </Text>
                            <Badge
                                label={exercise.type}
                                variant="complementary"
                            />
                        </Stack>
                    ))}
                </Stack>
            </Card>

            {/* Recent Progress */}
            <Card
                title="Recent Progress"
                borderColor={isDark ? COLORS.successLight : COLORS.success}
            >
                <Stack flexDirection="row" alignItems="center" marginBottom={15}>
                    <TrendingUp size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                    <Text
                        color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                        marginLeft={8}
                        fontSize={14}
                    >
                        Last 30 days
                    </Text>
                </Stack>
                <Stack gap={12}>
                    {progressItems.map((item, index) => (
                        <Stack key={index} flexDirection="row" justifyContent="space-between" alignItems="center">
                            <Stack>
                                <Text
                                    fontSize={16}
                                    color={isDark ? COLORS.textDark : COLORS.text}
                                    fontWeight="500"
                                >
                                    {item.exercise}
                                </Text>
                                <Text
                                    fontSize={14}
                                    color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                                >
                                    {formatWeight(item.weight)}
                                </Text>
                            </Stack>
                            <Badge
                                label={item.change > 0 ? `+${item.change} kg` : item.change < 0 ? `${item.change} kg` : '0 kg'}
                                variant={item.status}
                            />
                        </Stack>
                    ))}
                </Stack>
            </Card>
        </ScrollView>
    );
}; 