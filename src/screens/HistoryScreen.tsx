import React, { useRef, useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { TrendingUp, Calendar, Target, History, Dumbbell } from 'lucide-react-native';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { COLORS } from '../constants/colors';
import { OneRMGraph } from '../components/OneRMGraph';

export const HistoryScreen: React.FC = () => {
    const { theme } = useTheme();
    const { formatWeight, saveScrollPosition, getScrollPosition, oneRepMax, unit, workoutHistory } = useSettings();
    const isDark = theme === 'dark';
    const scrollViewRef = useRef<ScrollView>(null);

    // Restore scroll position when component mounts
    useEffect(() => {
        const savedPosition = getScrollPosition('history');
        if (savedPosition > 0) {
            scrollViewRef.current?.scrollTo({ y: savedPosition, animated: false });
        }
    }, []);

    // Filter completed workouts from actual workoutHistory
    const completedWorkouts = Array.isArray(workoutHistory?.workouts)
        ? workoutHistory.workouts.filter((w) => w.status === 'completed')
        : [];

    // Compute stats from actual data
    const totalWorkouts = completedWorkouts.length;
    // Try to get the latest cycle from completed workouts, fallback to 1
    const currentCycle = completedWorkouts.length > 0 ? Math.max(...completedWorkouts.map(w => w.cycle)) : 1;

    const stats = [
        {
            title: 'Total Workouts',
            value: totalWorkouts.toString(),
            icon: Calendar,
            color: COLORS.primary
        },
        {
            title: 'Current Cycle',
            value: totalWorkouts > 0 ? `Cycle ${currentCycle}` : 'Not Started',
            icon: TrendingUp,
            color: COLORS.success
        },
    ];

    // Use the same oneRMData and unit as in HomeScreen for the graph
    // (Assume oneRMData is available from context or compute it here)
    const oneRMData: any[] = [];

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

            {/* Recent Progress (Stats Graph) */}
            <Card
                title="Recent Progress"
                borderColor={isDark ? COLORS.secondaryLight : COLORS.secondary}
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
                        1RM Progress
                    </Text>
                </View>
                <OneRMGraph data={oneRMData} unit={unit} />
            </Card>

            {/* Workout History - Only show completed workouts */}
            <Card
                title="Workout History"
                borderColor={isDark ? COLORS.secondaryLight : COLORS.secondary}
            >
                {completedWorkouts.length === 0 ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary, fontSize: 16 }}>
                            No completed workouts yet.
                        </Text>
                    </View>
                ) : (
                    <View>
                        {completedWorkouts.map((w, i) => (
                            <View
                                key={i}
                                style={{
                                    marginBottom: 14,
                                    padding: 14,
                                    borderRadius: 10,
                                    backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                    borderWidth: 1,
                                    borderColor: isDark ? COLORS.borderDark : COLORS.border,
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                                    <Badge label={w.exercise.charAt(0).toUpperCase() + w.exercise.slice(1)} variant="success" />
                                    <Text style={{ color: isDark ? COLORS.textDark : COLORS.text, fontWeight: 'bold', fontSize: 16, marginLeft: 8 }}>
                                        Cycle {w.cycle}, Week {w.week}
                                    </Text>
                                    {w.failed === true && (
                                        <View style={{ marginLeft: 8 }}>
                                            <Badge label="Failed" variant="error" size="small" />
                                        </View>
                                    )}
                                    {w.failed === false && (
                                        <View style={{ marginLeft: 8 }}>
                                            <Badge label="Passed" variant="success" size="small" />
                                        </View>
                                    )}
                                </View>
                                <Text style={{ color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary, fontSize: 14, marginBottom: 2 }}>
                                    Completed: {w.completedDate ? new Date(w.completedDate).toLocaleDateString() : '—'}
                                </Text>
                                <Text style={{ color: isDark ? COLORS.textDark : COLORS.text, fontSize: 15 }}>
                                    Weight: {w.weight && !isNaN(Number(w.weight)) ? formatWeight(Number(w.weight)) : (w.weight || '—')} | Reps: {w.reps ?? '—'}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </Card>
        </ScrollView>
    );
}; 