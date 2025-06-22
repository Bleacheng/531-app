import React, { useRef, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import { TrendingUp, Calendar, Target, History, Dumbbell } from 'lucide-react-native';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { COLORS } from '../constants/colors';

export const HistoryScreen: React.FC = () => {
    const { resolvedTheme } = useTheme();
    const { formatWeight, saveScrollPosition, getScrollPosition } = useSettings();
    const isDark = resolvedTheme === 'dark';
    const scrollViewRef = useRef<ScrollView>(null);

    // Restore scroll position when component mounts
    useEffect(() => {
        const savedPosition = getScrollPosition('history');
        if (savedPosition > 0) {
            scrollViewRef.current?.scrollTo({ y: savedPosition, animated: false });
        }
    }, []);

    const stats = [
        {
            title: 'Total Workouts',
            value: '24',
            icon: Calendar,
            color: COLORS.primary
        },
        {
            title: 'Current Cycle',
            value: 'Cycle 1',
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
            title: 'Training Max',
            value: formatWeight(180),
            icon: Dumbbell,
            color: COLORS.error
        },
    ];

    const recentProgress = [
        { exercise: 'Bench Press', current: 100, previous: 95, change: 5, status: 'success' as const },
        { exercise: 'Deadlift', current: 180, previous: 175, change: 5, status: 'success' as const },
        { exercise: 'Squat', current: 140, previous: 140, change: 0, status: 'warning' as const },
        { exercise: 'Overhead Press', current: 70, previous: 72, change: -2, status: 'error' as const },
    ];

    const workoutHistory = [
        {
            date: 'Today',
            workout: 'Week 3 - Bench Press',
            exercises: ['Bench Press 5/3/1+', 'Assistance Work'],
            status: 'completed' as const
        },
        {
            date: 'Yesterday',
            workout: 'Week 3 - Squat',
            exercises: ['Squat 5/3/1+', 'Assistance Work'],
            status: 'completed' as const
        },
        {
            date: '2 days ago',
            workout: 'Week 3 - Deadlift',
            exercises: ['Deadlift 5/3/1+', 'Assistance Work'],
            status: 'completed' as const
        },
        {
            date: '3 days ago',
            workout: 'Week 3 - Overhead Press',
            exercises: ['Overhead Press 5/3/1+', 'Assistance Work'],
            status: 'completed' as const
        },
        {
            date: '1 week ago',
            workout: 'Week 2 - Bench Press',
            exercises: ['Bench Press 3/3/3+', 'Assistance Work'],
            status: 'completed' as const
        },
    ];

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
        <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 60 }}
            onScroll={(event) => {
                const offsetY = event.nativeEvent.contentOffset.y;
                saveScrollPosition('history', offsetY);
            }}
            scrollEventThrottle={16}
        >
            {/* Profile Header */}
            <Card
                title="Your Progress"
                borderColor={isDark ? COLORS.primaryLight : COLORS.primary}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                    <TrendingUp size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                    <Text
                        style={{
                            color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                            marginLeft: 8,
                            fontSize: 14
                        }}
                    >
                        Overall statistics
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <View
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
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                    <Icon size={16} color={stat.color} />
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                            marginLeft: 6
                                        }}
                                    >
                                        {stat.title}
                                    </Text>
                                </View>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        color: isDark ? COLORS.textDark : COLORS.text
                                    }}
                                >
                                    {stat.value}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </Card>

            {/* Recent Progress */}
            <Card
                title="Recent Progress"
                borderColor={isDark ? COLORS.secondaryLight : COLORS.secondary}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                    <Target size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                    <Text
                        style={{
                            color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                            marginLeft: 8,
                            fontSize: 14
                        }}
                    >
                        Last 30 days
                    </Text>
                </View>
                <View style={{ gap: 12 }}>
                    {recentProgress.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: isDark ? COLORS.textDark : COLORS.text,
                                        fontWeight: '500'
                                    }}
                                >
                                    {item.exercise}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary
                                    }}
                                >
                                    {formatWeight(item.current)} (was {formatWeight(item.previous)})
                                </Text>
                            </View>
                            <Badge
                                label={item.change > 0 ? `+${item.change} kg` : item.change < 0 ? `${item.change} kg` : '0 kg'}
                                variant={item.status}
                            />
                        </View>
                    ))}
                </View>
            </Card>

            {/* Workout History */}
            <Card
                title="Workout History"
                borderColor={isDark ? COLORS.successLight : COLORS.success}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                    <History size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                    <Text
                        style={{
                            color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                            marginLeft: 8,
                            fontSize: 14
                        }}
                    >
                        Recent workouts
                    </Text>
                </View>
                <View style={{ gap: 12 }}>
                    {workoutHistory.map((workout, index) => (
                        <View
                            key={index}
                            style={{
                                backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                padding: 12,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: isDark ? COLORS.borderDark : COLORS.border,
                            }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        color: isDark ? COLORS.textDark : COLORS.text
                                    }}
                                >
                                    {workout.workout}
                                </Text>
                                <Badge
                                    label={workout.date}
                                    variant="complementary"
                                />
                            </View>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                    marginBottom: 4
                                }}
                            >
                                {workout.exercises.join(' • ')}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: getStatusColor(workout.status),
                                        fontWeight: '500'
                                    }}
                                >
                                    ✓ Completed
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </Card>
        </ScrollView>
    );
}; 