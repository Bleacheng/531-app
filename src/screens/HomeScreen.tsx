import React from 'react';
import { ScrollView } from 'react-native';
import { Stack, Text } from '@tamagui/core';
import { Play, History, Calendar, TrendingUp, Zap } from 'lucide-react-native';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS } from '../constants/colors';

export const HomeScreen: React.FC = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

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
        { exercise: 'Bench Press 1RM', progress: '+5 lbs' },
        { exercise: 'Deadlift 1RM', progress: '+10 lbs' },
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
                            <Text
                                fontSize={16}
                                color={isDark ? COLORS.textDark : COLORS.text}
                                fontWeight="500"
                            >
                                {item.exercise}
                            </Text>
                            <Badge
                                label={item.progress}
                                variant="success"
                            />
                        </Stack>
                    ))}
                </Stack>
            </Card>

            {/* Theme Info Card */}
            <Card
                title="Orange Theme Active"
                borderColor={isDark ? COLORS.accentLight : COLORS.accent}
                backgroundColor={isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary}
            >
                <Stack flexDirection="row" alignItems="center" marginBottom={10}>
                    <Zap size={16} color={isDark ? COLORS.accentLight : COLORS.accent} />
                    <Text
                        color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                        marginLeft={8}
                        fontSize={14}
                    >
                        Current theme: {theme.charAt(0).toUpperCase() + theme.slice(1)} mode
                    </Text>
                </Stack>
                <Text
                    fontSize={14}
                    color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                    lineHeight={20}
                >
                    This beautiful orange color palette features vibrant oranges, warm ambers,
                    and complementary teals. Tap the theme toggle in the header to switch themes!
                </Text>
            </Card>
        </ScrollView>
    );
}; 