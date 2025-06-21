import React from 'react';
import { ScrollView } from 'react-native';
import { Stack, Text } from '@tamagui/core';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react-native';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { COLORS } from '../constants/colors';

export const ProfileScreen: React.FC = () => {
    const { resolvedTheme } = useTheme();
    const { formatWeight } = useSettings();
    const isDark = resolvedTheme === 'dark';

    const stats = [
        {
            title: 'Total Workouts',
            value: '24',
            icon: Calendar,
            color: COLORS.primary
        },
        {
            title: 'Current Streak',
            value: '8 days',
            icon: TrendingUp,
            color: COLORS.success
        },
        {
            title: 'Best Deadlift',
            value: formatWeight(200),
            icon: Target,
            color: COLORS.warning
        },
        {
            title: 'Achievements',
            value: '12',
            icon: Award,
            color: COLORS.error
        },
    ];

    const recentProgress = [
        { exercise: 'Bench Press', current: 100, previous: 95, change: 5, status: 'success' as const },
        { exercise: 'Deadlift', current: 180, previous: 175, change: 5, status: 'success' as const },
        { exercise: 'Squat', current: 140, previous: 140, change: 0, status: 'warning' as const },
        { exercise: 'Overhead Press', current: 70, previous: 72, change: -2, status: 'error' as const },
    ];

    const achievements = [
        { title: 'First Workout', description: 'Completed your first 5/3/1 workout', date: '2 weeks ago' },
        { title: 'Week Warrior', description: 'Completed 4 workouts in a week', date: '1 week ago' },
        { title: 'Strength Gains', description: 'Increased all lifts by 5kg+', date: '3 days ago' },
    ];

    return (
        <ScrollView style={{ flex: 1, padding: 20 }}>
            {/* Profile Header */}
            <Card
                title="Your Progress"
                borderColor={isDark ? COLORS.primaryLight : COLORS.primary}
            >
                <Stack flexDirection="row" alignItems="center" marginBottom={15}>
                    <TrendingUp size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                    <Text
                        color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                        marginLeft={8}
                        fontSize={14}
                    >
                        Overall statistics
                    </Text>
                </Stack>

                <Stack flexDirection="row" flexWrap="wrap" gap={10}>
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Stack
                                key={index}
                                style={{
                                    backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                    padding: 16,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: isDark ? COLORS.borderDark : COLORS.border,
                                    minWidth: '45%',
                                    flex: 1,
                                }}
                            >
                                <Stack flexDirection="row" alignItems="center" marginBottom={8}>
                                    <Icon size={16} color={stat.color} />
                                    <Text
                                        fontSize={12}
                                        color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                                        marginLeft={6}
                                    >
                                        {stat.title}
                                    </Text>
                                </Stack>
                                <Text
                                    fontSize={18}
                                    fontWeight="bold"
                                    color={isDark ? COLORS.textDark : COLORS.text}
                                >
                                    {stat.value}
                                </Text>
                            </Stack>
                        );
                    })}
                </Stack>
            </Card>

            {/* Recent Progress */}
            <Card
                title="Recent Progress"
                borderColor={isDark ? COLORS.secondaryLight : COLORS.secondary}
            >
                <Stack flexDirection="row" alignItems="center" marginBottom={15}>
                    <Target size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                    <Text
                        color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                        marginLeft={8}
                        fontSize={14}
                    >
                        Last 30 days
                    </Text>
                </Stack>
                <Stack gap={12}>
                    {recentProgress.map((item, index) => (
                        <Stack key={index} flexDirection="row" justifyContent="space-between" alignItems="center">
                            <Stack flex={1}>
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
                                    {formatWeight(item.current)} (was {formatWeight(item.previous)})
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

            {/* Achievements */}
            <Card
                title="Achievements"
                borderColor={isDark ? COLORS.successLight : COLORS.success}
            >
                <Stack flexDirection="row" alignItems="center" marginBottom={15}>
                    <Award size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                    <Text
                        color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                        marginLeft={8}
                        fontSize={14}
                    >
                        Your accomplishments
                    </Text>
                </Stack>
                <Stack gap={12}>
                    {achievements.map((achievement, index) => (
                        <Stack
                            key={index}
                            style={{
                                backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                padding: 12,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: isDark ? COLORS.borderDark : COLORS.border,
                            }}
                        >
                            <Text
                                fontSize={16}
                                fontWeight="bold"
                                color={isDark ? COLORS.textDark : COLORS.text}
                                marginBottom={4}
                            >
                                {achievement.title}
                            </Text>
                            <Text
                                fontSize={14}
                                color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                                marginBottom={4}
                            >
                                {achievement.description}
                            </Text>
                            <Text
                                fontSize={12}
                                color={isDark ? COLORS.textTertiaryDark : COLORS.textTertiary}
                            >
                                {achievement.date}
                            </Text>
                        </Stack>
                    ))}
                </Stack>
            </Card>
        </ScrollView>
    );
}; 