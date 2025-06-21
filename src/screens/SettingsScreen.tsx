import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, TextInput } from 'react-native';
import { Stack, Text } from '@tamagui/core';
import { Palette, Scale, Calendar, TrendingUp, GripVertical } from 'lucide-react-native';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { COLORS } from '../constants/colors';

export const SettingsScreen: React.FC = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const { unit, setUnit, formatWeight, workoutSchedule, updateWorkoutDay, exerciseProgression, updateExerciseProgression, saveScrollPosition, getScrollPosition } = useSettings();
    const isDark = resolvedTheme === 'dark';
    const scrollViewRef = useRef<ScrollView>(null);

    // Local state for text inputs
    const [progressionInputs, setProgressionInputs] = useState({
        benchPress: exerciseProgression.benchPress.toString(),
        squat: exerciseProgression.squat.toString(),
        deadlift: exerciseProgression.deadlift.toString(),
        overheadPress: exerciseProgression.overheadPress.toString(),
    });

    // Restore scroll position when component mounts
    useEffect(() => {
        const savedPosition = getScrollPosition('settings');
        if (savedPosition > 0) {
            scrollViewRef.current?.scrollTo({ y: savedPosition, animated: false });
        }
    }, []);

    const themeOptions = [
        { value: 'system' as const, label: 'System', description: 'Follow device settings' },
        { value: 'light' as const, label: 'Light', description: 'Always use light theme' },
        { value: 'dark' as const, label: 'Dark', description: 'Always use dark theme' },
    ];

    const unitOptions = [
        { value: 'kg' as const, label: 'Kilograms (kg)', description: 'Metric system' },
        { value: 'lbs' as const, label: 'Pounds (lbs)', description: 'Imperial system' },
    ];

    const dayOptions = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ];

    const exerciseNames = {
        benchPress: 'Bench Press',
        squat: 'Squat',
        deadlift: 'Deadlift',
        overheadPress: 'Overhead Press'
    };

    const handleProgressionChange = (exercise: keyof typeof exerciseProgression, value: string) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue > 0) {
            updateExerciseProgression(exercise, numValue);
        }
        setProgressionInputs(prev => ({
            ...prev,
            [exercise]: value
        }));
    };

    const handleProgressionBlur = (exercise: keyof typeof exerciseProgression) => {
        const numValue = parseFloat(progressionInputs[exercise]);
        if (isNaN(numValue) || numValue <= 0) {
            // Reset to current value if invalid
            setProgressionInputs(prev => ({
                ...prev,
                [exercise]: exerciseProgression[exercise].toString()
            }));
        }
    };

    return (
        <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1, padding: 20 }}
            onScroll={(event) => {
                const offsetY = event.nativeEvent.contentOffset.y;
                saveScrollPosition('settings', offsetY);
            }}
            scrollEventThrottle={16}
        >
            {/* Header */}
            <Stack marginBottom={20}>
                <Text
                    fontSize={24}
                    fontWeight="bold"
                    color={isDark ? COLORS.textDark : COLORS.text}
                >
                    Settings
                </Text>
            </Stack>

            {/* Theme Settings */}
            <Card
                title="Theme"
                borderColor={isDark ? COLORS.primaryLight : COLORS.primary}
            >
                <Stack flexDirection="row" alignItems="center" marginBottom={15}>
                    <Palette size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                    <Text
                        color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                        marginLeft={8}
                        fontSize={14}
                    >
                        Choose your preferred theme
                    </Text>
                </Stack>
                <Stack gap={8}>
                    {themeOptions.map((option) => (
                        <Button
                            key={option.value}
                            title={`${option.label} - ${option.description}`}
                            onPress={() => setTheme(option.value)}
                            variant={theme === option.value ? 'primary' : 'outline'}
                            fullWidth
                        />
                    ))}
                </Stack>
            </Card>

            {/* Unit Settings */}
            <Card
                title="Units"
                borderColor={isDark ? COLORS.secondaryLight : COLORS.secondary}
            >
                <Stack flexDirection="row" alignItems="center" marginBottom={15}>
                    <Scale size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                    <Text
                        color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                        marginLeft={8}
                        fontSize={14}
                    >
                        Choose your preferred weight units
                    </Text>
                </Stack>
                <Stack gap={8}>
                    {unitOptions.map((option) => (
                        <Button
                            key={option.value}
                            title={`${option.label} - ${option.description}`}
                            onPress={() => setUnit(option.value)}
                            variant={unit === option.value ? 'primary' : 'outline'}
                            fullWidth
                        />
                    ))}
                </Stack>

                {/* Example */}
                <Stack marginTop={15} padding={12} backgroundColor={isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary} borderRadius={8}>
                    <Text
                        fontSize={14}
                        color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                        marginBottom={8}
                    >
                        Example: {formatWeight(100)}
                    </Text>
                </Stack>
            </Card>

            {/* Draggable Workout Schedule */}
            <Card
                title="Workout Schedule"
                borderColor={isDark ? COLORS.successLight : COLORS.success}
            >
                <Stack flexDirection="row" alignItems="center" marginBottom={15}>
                    <Calendar size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                    <Text
                        color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                        marginLeft={8}
                        fontSize={14}
                    >
                        Drag exercises to schedule your week
                    </Text>
                </Stack>

                {/* Weekly Schedule Grid */}
                <Stack gap={8}>
                    {dayOptions.map((day) => {
                        const exerciseForDay = Object.entries(workoutSchedule).find(([key, scheduledDay]) => scheduledDay === day);
                        const isDayOccupied = !!exerciseForDay;

                        return (
                            <Stack
                                key={day}
                                style={{
                                    backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                    padding: 12,
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: isDark ? COLORS.borderDark : COLORS.border,
                                    minHeight: 50,
                                    justifyContent: 'center',
                                }}
                            >
                                <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
                                    <Text
                                        fontSize={16}
                                        fontWeight="600"
                                        color={isDark ? COLORS.textDark : COLORS.text}
                                    >
                                        {day}
                                    </Text>
                                    {isDayOccupied ? (
                                        <Stack flexDirection="row" alignItems="center" gap={8}>
                                            <GripVertical size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                                            <Text
                                                fontSize={14}
                                                color={isDark ? COLORS.primary : COLORS.primaryLight}
                                                fontWeight="500"
                                            >
                                                {exerciseNames[exerciseForDay[0] as keyof typeof exerciseNames]}
                                            </Text>
                                        </Stack>
                                    ) : (
                                        <Text
                                            fontSize={14}
                                            color={isDark ? COLORS.textTertiaryDark : COLORS.textTertiary}
                                            fontStyle="italic"
                                        >
                                            Rest day
                                        </Text>
                                    )}
                                </Stack>
                            </Stack>
                        );
                    })}
                </Stack>
            </Card>

            {/* Exercise Progression Settings */}
            <Card
                title="Exercise Progression"
                borderColor={isDark ? COLORS.warningLight : COLORS.warning}
            >
                <Stack flexDirection="row" alignItems="center" marginBottom={15}>
                    <TrendingUp size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                    <Text
                        color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                        marginLeft={8}
                        fontSize={14}
                    >
                        Set weight progression per cycle
                    </Text>
                </Stack>
                <Stack gap={12}>
                    {Object.entries(exerciseNames).map(([key, name]) => (
                        <Stack key={key} gap={8}>
                            <Text
                                fontSize={16}
                                fontWeight="600"
                                color={isDark ? COLORS.textDark : COLORS.text}
                            >
                                {name}
                            </Text>
                            <Stack flexDirection="row" alignItems="center" gap={8}>
                                <Text
                                    fontSize={14}
                                    color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                                >
                                    +{unit}
                                </Text>
                                <TextInput
                                    value={progressionInputs[key as keyof typeof progressionInputs]}
                                    onChangeText={(value) => handleProgressionChange(key as keyof typeof exerciseProgression, value)}
                                    onBlur={() => handleProgressionBlur(key as keyof typeof exerciseProgression)}
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
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
            </Card>
        </ScrollView>
    );
}; 