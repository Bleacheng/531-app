import React from 'react';
import { ScrollView } from 'react-native';
import { Stack, Text } from '@tamagui/core';
import { Palette, Scale, Calendar, TrendingUp } from 'lucide-react-native';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { COLORS } from '../constants/colors';

export const SettingsScreen: React.FC = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const { unit, setUnit, formatWeight, workoutSchedule, updateWorkoutDay, exerciseProgression, updateExerciseProgression } = useSettings();
    const isDark = resolvedTheme === 'dark';

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

    const progressionOptions = [1, 1.25, 2.5, 5, 7.5, 10];

    const exerciseNames = {
        benchPress: 'Bench Press',
        squat: 'Squat',
        deadlift: 'Deadlift',
        overheadPress: 'Overhead Press'
    };

    return (
        <ScrollView style={{ flex: 1, padding: 20, paddingTop: 40, paddingBottom: 40 }}>
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

            {/* Workout Schedule Settings */}
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
                        Set your weekly workout days
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
                            <Stack flexDirection="row" flexWrap="wrap" gap={6}>
                                {dayOptions.map((day) => (
                                    <Button
                                        key={day}
                                        title={day}
                                        onPress={() => updateWorkoutDay(key as keyof typeof workoutSchedule, day)}
                                        variant={workoutSchedule[key as keyof typeof workoutSchedule] === day ? 'primary' : 'outline'}
                                    />
                                ))}
                            </Stack>
                        </Stack>
                    ))}
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
                            <Stack flexDirection="row" flexWrap="wrap" gap={6}>
                                {progressionOptions.map((progression) => (
                                    <Button
                                        key={progression}
                                        title={`${progression} ${unit}`}
                                        onPress={() => updateExerciseProgression(key as keyof typeof exerciseProgression, progression)}
                                        variant={exerciseProgression[key as keyof typeof exerciseProgression] === progression ? 'primary' : 'outline'}
                                    />
                                ))}
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
            </Card>

            {/* Current Settings Summary */}
            <Card
                title="Current Settings"
                borderColor={isDark ? COLORS.accentLight : COLORS.accent}
                backgroundColor={isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary}
            >
                <Stack gap={12}>
                    <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                        <Text
                            fontSize={16}
                            color={isDark ? COLORS.textDark : COLORS.text}
                            fontWeight="500"
                        >
                            Theme
                        </Text>
                        <Text
                            fontSize={16}
                            color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                        >
                            {themeOptions.find(opt => opt.value === theme)?.label}
                        </Text>
                    </Stack>
                    <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                        <Text
                            fontSize={16}
                            color={isDark ? COLORS.textDark : COLORS.text}
                            fontWeight="500"
                        >
                            Units
                        </Text>
                        <Text
                            fontSize={16}
                            color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                        >
                            {unitOptions.find(opt => opt.value === unit)?.label}
                        </Text>
                    </Stack>
                    <Stack gap={8}>
                        <Text
                            fontSize={16}
                            color={isDark ? COLORS.textDark : COLORS.text}
                            fontWeight="500"
                        >
                            Workout Schedule
                        </Text>
                        {Object.entries(exerciseNames).map(([key, name]) => (
                            <Stack key={key} flexDirection="row" justifyContent="space-between" alignItems="center">
                                <Text
                                    fontSize={14}
                                    color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                                >
                                    {name}
                                </Text>
                                <Text
                                    fontSize={14}
                                    color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                                    fontWeight="500"
                                >
                                    {workoutSchedule[key as keyof typeof workoutSchedule]}
                                </Text>
                            </Stack>
                        ))}
                    </Stack>
                    <Stack gap={8}>
                        <Text
                            fontSize={16}
                            color={isDark ? COLORS.textDark : COLORS.text}
                            fontWeight="500"
                        >
                            Progression
                        </Text>
                        {Object.entries(exerciseNames).map(([key, name]) => (
                            <Stack key={key} flexDirection="row" justifyContent="space-between" alignItems="center">
                                <Text
                                    fontSize={14}
                                    color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                                >
                                    {name}
                                </Text>
                                <Text
                                    fontSize={14}
                                    color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                                    fontWeight="500"
                                >
                                    +{exerciseProgression[key as keyof typeof exerciseProgression]} {unit}
                                </Text>
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
            </Card>
        </ScrollView>
    );
}; 