import React, { useState, useRef, useEffect } from 'react';
import { TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Stack, Text } from '@tamagui/core';
import { Palette, Scale, Calendar, TrendingUp, ChevronDown } from 'lucide-react-native';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { COLORS } from '../constants/colors';

export const SettingsScreen: React.FC = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const { unit, setUnit, formatWeight, workoutSchedule, updateWorkoutDay, exerciseProgression, updateExerciseProgression, saveScrollPosition, getScrollPosition } = useSettings();
    const isDark = resolvedTheme === 'dark';

    // Scroll position remembering
    const scrollViewRef = useRef<ScrollView>(null);

    // Restore scroll position when component mounts
    useEffect(() => {
        const savedPosition = getScrollPosition('settings');
        if (savedPosition > 0) {
            scrollViewRef.current?.scrollTo({ y: savedPosition, animated: false });
        }
    }, []);

    // Local state for text inputs
    const [progressionInputs, setProgressionInputs] = useState({
        benchPress: exerciseProgression.benchPress.toString(),
        squat: exerciseProgression.squat.toString(),
        deadlift: exerciseProgression.deadlift.toString(),
        overheadPress: exerciseProgression.overheadPress.toString(),
    });

    // Local state for modal
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<keyof typeof workoutSchedule | null>(null);

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

    const handleDaySelect = (exercise: keyof typeof workoutSchedule, day: string) => {
        updateWorkoutDay(exercise, day);
        setModalVisible(false);
        setSelectedExercise(null);
    };

    const getAvailableDays = (currentExercise: keyof typeof workoutSchedule) => {
        const currentDay = workoutSchedule[currentExercise];
        return dayOptions.map(day => {
            // Check if any other exercise is using this day
            const conflictingExercise = Object.entries(workoutSchedule).find(([key, scheduledDay]) =>
                key !== currentExercise && scheduledDay === day
            );

            return {
                day,
                isCurrent: day === currentDay,
                hasConflict: !!conflictingExercise,
                conflictingExercise: conflictingExercise ? exerciseNames[conflictingExercise[0] as keyof typeof exerciseNames] : null
            };
        });
    };

    const openDaySelector = (exercise: keyof typeof workoutSchedule) => {
        setSelectedExercise(exercise);
        setModalVisible(true);
    };

    const renderDaySelector = (exercise: keyof typeof workoutSchedule) => {
        const currentDay = workoutSchedule[exercise];

        return (
            <TouchableOpacity
                onPress={() => openDaySelector(exercise)}
                style={{
                    backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                    borderWidth: 1,
                    borderColor: isDark ? COLORS.borderDark : COLORS.border,
                    borderRadius: 8,
                    padding: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Stack flex={1}>
                    <Text
                        fontSize={16}
                        color={isDark ? COLORS.textDark : COLORS.text}
                        fontWeight="500"
                    >
                        {currentDay}
                    </Text>
                    {/* Show conflict warning if applicable */}
                    {getAvailableDays(exercise).find(d => d.day === currentDay)?.hasConflict && (
                        <Text
                            fontSize={12}
                            color={isDark ? COLORS.warning : COLORS.warningDark}
                            marginTop={2}
                        >
                            Conflicts with {getAvailableDays(exercise).find(d => d.day === currentDay)?.conflictingExercise}
                        </Text>
                    )}
                </Stack>
                <ChevronDown
                    size={16}
                    color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                />
            </TouchableOpacity>
        );
    };

    const renderDaySelectorModal = () => {
        if (!selectedExercise) return null;

        const availableDays = getAvailableDays(selectedExercise);
        const exerciseName = exerciseNames[selectedExercise];

        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                statusBarTranslucent={true}
                onRequestClose={() => {
                    setModalVisible(false);
                    setSelectedExercise(null);
                }}
            >
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        top: -1000,
                        left: -1000,
                        right: -1000,
                        bottom: -1000,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 20,
                    }}
                    activeOpacity={1}
                    onPress={() => {
                        setModalVisible(false);
                        setSelectedExercise(null);
                    }}
                >
                    <Stack
                        style={{
                            backgroundColor: isDark ? COLORS.backgroundDark : COLORS.background,
                            borderRadius: 12,
                            padding: 20,
                            width: '100%',
                            maxWidth: 400,
                            shadowColor: isDark ? COLORS.primaryDark : COLORS.primary,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 10,
                        }}
                        onStartShouldSetResponder={() => true}
                    >
                        {/* Header */}
                        <Stack marginBottom={20}>
                            <Text
                                fontSize={20}
                                fontWeight="bold"
                                color={isDark ? COLORS.textDark : COLORS.text}
                                marginBottom={8}
                            >
                                Select Day for {exerciseName}
                            </Text>
                            <Text
                                fontSize={14}
                                color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                            >
                                Choose which day to perform this exercise
                            </Text>
                        </Stack>

                        {/* Day Options */}
                        <Stack gap={8}>
                            {availableDays.map((dayInfo) => (
                                <TouchableOpacity
                                    key={dayInfo.day}
                                    onPress={() => handleDaySelect(selectedExercise, dayInfo.day)}
                                    style={{
                                        padding: 16,
                                        backgroundColor: dayInfo.isCurrent
                                            ? (isDark ? COLORS.primary + '20' : COLORS.primaryDark + '20')
                                            : dayInfo.hasConflict && !dayInfo.isCurrent
                                                ? (isDark ? COLORS.warningDark + '20' : COLORS.warning + '20')
                                                : (isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary),
                                        borderWidth: 1,
                                        borderColor: dayInfo.isCurrent
                                            ? (isDark ? COLORS.primary : COLORS.primaryDark)
                                            : dayInfo.hasConflict && !dayInfo.isCurrent
                                                ? (isDark ? COLORS.warning : COLORS.warningDark)
                                                : (isDark ? COLORS.borderDark : COLORS.border),
                                        borderRadius: 8,
                                    }}
                                >
                                    <Stack>
                                        <Text
                                            fontSize={16}
                                            color={dayInfo.isCurrent
                                                ? (isDark ? COLORS.primary : COLORS.primaryDark)
                                                : dayInfo.hasConflict
                                                    ? (isDark ? COLORS.warning : COLORS.warningDark)
                                                    : (isDark ? COLORS.textDark : COLORS.text)
                                            }
                                            fontWeight={dayInfo.isCurrent ? "600" : "400"}
                                        >
                                            {dayInfo.day}
                                        </Text>
                                        {dayInfo.isCurrent && (
                                            <Text
                                                fontSize={12}
                                                color={isDark ? COLORS.primary : COLORS.primaryDark}
                                                marginTop={2}
                                            >
                                                Currently selected
                                            </Text>
                                        )}
                                        {dayInfo.hasConflict && !dayInfo.isCurrent && (
                                            <Text
                                                fontSize={12}
                                                color={isDark ? COLORS.textTertiaryDark : COLORS.textTertiary}
                                                marginTop={2}
                                            >
                                                Conflicts with {dayInfo.conflictingExercise}
                                            </Text>
                                        )}
                                        {!dayInfo.hasConflict && !dayInfo.isCurrent && (
                                            <Text
                                                fontSize={12}
                                                color={isDark ? COLORS.success : COLORS.successDark}
                                                marginTop={2}
                                            >
                                                Available
                                            </Text>
                                        )}
                                    </Stack>
                                </TouchableOpacity>
                            ))}
                        </Stack>

                        {/* Cancel Button */}
                        <Stack marginTop={20}>
                            <Button
                                title="Cancel"
                                onPress={() => {
                                    setModalVisible(false);
                                    setSelectedExercise(null);
                                }}
                                variant="outline"
                                fullWidth
                            />
                        </Stack>
                    </Stack>
                </TouchableOpacity>
            </Modal>
        );
    };

    return (
        <>
            <Stack style={{ flex: 1 }}>
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

                    {/* Workout Schedule */}
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
                                Select which day each exercise is performed
                            </Text>
                        </Stack>

                        <Stack gap={16}>
                            {Object.entries(exerciseNames).map(([key, name]) => (
                                <Stack key={key} gap={8}>
                                    <Text
                                        fontSize={16}
                                        fontWeight="600"
                                        color={isDark ? COLORS.textDark : COLORS.text}
                                    >
                                        {name}
                                    </Text>
                                    {renderDaySelector(key as keyof typeof workoutSchedule)}
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
            </Stack>

            {renderDaySelectorModal()}
        </>
    );
}; 