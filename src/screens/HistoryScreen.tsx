import React, { useRef, useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { TrendingUp, Calendar, Target, History, Dumbbell } from 'lucide-react-native';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { COLORS } from '../constants/colors';

export const HistoryScreen: React.FC = () => {
    const { theme } = useTheme();
    const { formatWeight, saveScrollPosition, getScrollPosition } = useSettings();
    const isDark = theme === 'dark';
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
            value: '0',
            icon: Calendar,
            color: COLORS.primary
        },
        {
            title: 'Current Cycle',
            value: 'Not Started',
            icon: TrendingUp,
            color: COLORS.success
        },
        {
            title: 'Best Deadlift',
            value: 'No Data',
            icon: Target,
            color: COLORS.warning
        },
        {
            title: 'Training Max',
            value: 'No Data',
            icon: Dumbbell,
            color: COLORS.error
        },
    ];

    const recentProgress: any[] = [];

    const workoutHistory: any[] = [];

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
            style={{
                flex: 1,
                backgroundColor: isDark ? COLORS.backgroundDark : COLORS.background,
            }}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
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
                    {recentProgress.length > 0 ? (
                        recentProgress.map((item, index) => (
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
                        ))
                    ) : (
                        <View style={{
                            padding: 20,
                            alignItems: 'center',
                            backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: isDark ? COLORS.borderDark : COLORS.border,
                        }}>
                            <Target size={24} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: isDark ? COLORS.textDark : COLORS.text,
                                    fontWeight: '500',
                                    marginTop: 8,
                                    textAlign: 'center'
                                }}
                            >
                                No Progress Data
                            </Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                    textAlign: 'center',
                                    marginTop: 4
                                }}
                            >
                                Complete your first workout to see progress here
                            </Text>
                        </View>
                    )}
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
                    {workoutHistory.length > 0 ? (
                        workoutHistory.map((workout, index) => (
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
                        ))
                    ) : (
                        <View style={{
                            padding: 20,
                            alignItems: 'center',
                            backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: isDark ? COLORS.borderDark : COLORS.border,
                        }}>
                            <History size={24} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: isDark ? COLORS.textDark : COLORS.text,
                                    fontWeight: '500',
                                    marginTop: 8,
                                    textAlign: 'center'
                                }}
                            >
                                No Workout History
                            </Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                    textAlign: 'center',
                                    marginTop: 4
                                }}
                            >
                                Complete your first workout to see history here
                            </Text>
                        </View>
                    )}
                </View>
            </Card>
        </ScrollView>
    );
}; 