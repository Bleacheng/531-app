import React, { useState, useRef, useEffect } from 'react';
import { TextInput, TouchableOpacity, ScrollView, Alert, View } from 'react-native';
import Modal from 'react-native-modal';
import { Text } from 'react-native-paper';
import { Palette, Scale, Calendar, TrendingUp, ChevronDown, RotateCcw, AlertTriangle, CheckCircle, X } from 'lucide-react-native';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { DataBackup } from '../components/DataBackup';
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
    const [resetModalVisible, setResetModalVisible] = useState(false);

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

    const handleResetSettings = () => {
        setResetModalVisible(true);
    };

    const confirmResetSettings = () => {
        // Reset theme to system
        setTheme('system');

        // Reset unit to kg
        setUnit('kg');

        // Reset workout schedule to defaults
        const defaultSchedule = {
            benchPress: 'Monday',
            squat: 'Tuesday',
            deadlift: 'Thursday',
            overheadPress: 'Friday',
        };
        // Note: We need to use the bulk update method since we're updating multiple exercises
        Object.entries(defaultSchedule).forEach(([exercise, day]) => {
            updateWorkoutDay(exercise as keyof typeof workoutSchedule, day);
        });

        // Reset exercise progression to defaults
        const defaultProgression = {
            benchPress: 2.5,
            squat: 5,
            deadlift: 5,
            overheadPress: 2.5,
        };
        Object.entries(defaultProgression).forEach(([exercise, progression]) => {
            updateExerciseProgression(exercise as keyof typeof exerciseProgression, progression);
        });

        // Update local state for progression inputs
        setProgressionInputs({
            benchPress: defaultProgression.benchPress.toString(),
            squat: defaultProgression.squat.toString(),
            deadlift: defaultProgression.deadlift.toString(),
            overheadPress: defaultProgression.overheadPress.toString(),
        });

        setResetModalVisible(false);

        Alert.alert(
            'Settings Reset',
            'All settings have been reset to their default values.',
            [{ text: 'OK' }]
        );
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
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: '500',
                            color: isDark ? COLORS.textDark : COLORS.text,
                        }}
                    >
                        {currentDay}
                    </Text>
                    {/* Show conflict warning if applicable */}
                    {getAvailableDays(exercise).find(d => d.day === currentDay)?.hasConflict && (
                        <Text
                            style={{
                                fontSize: 12,
                                color: isDark ? COLORS.warning : COLORS.warningDark,
                                marginTop: 2,
                            }}
                        >
                            Conflicts with {getAvailableDays(exercise).find(d => d.day === currentDay)?.conflictingExercise}
                        </Text>
                    )}
                </View>
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
                isVisible={modalVisible}
                onBackdropPress={() => {
                    setModalVisible(false);
                    setSelectedExercise(null);
                }}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                }}
            >
                <View
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
                >
                    {/* Header */}
                    <View style={{ marginBottom: 20 }}>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: isDark ? COLORS.textDark : COLORS.text,
                                marginBottom: 8,
                            }}
                        >
                            Select Day for {exerciseName}
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                            }}
                        >
                            Choose which day to perform this exercise
                        </Text>
                    </View>

                    {/* Day Options */}
                    <View style={{ gap: 8 }}>
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
                                <View>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: dayInfo.isCurrent
                                                ? (isDark ? COLORS.primary : COLORS.primaryDark)
                                                : dayInfo.hasConflict
                                                    ? (isDark ? COLORS.warning : COLORS.warningDark)
                                                    : (isDark ? COLORS.textDark : COLORS.text),
                                            fontWeight: dayInfo.isCurrent ? "600" : "400"
                                        }}
                                    >
                                        {dayInfo.day}
                                    </Text>
                                    {dayInfo.isCurrent && (
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: isDark ? COLORS.primary : COLORS.primaryDark,
                                                marginTop: 2,
                                            }}
                                        >
                                            Currently selected
                                        </Text>
                                    )}
                                    {dayInfo.hasConflict && !dayInfo.isCurrent && (
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: isDark ? COLORS.textTertiaryDark : COLORS.textTertiary,
                                                marginTop: 2,
                                            }}
                                        >
                                            Conflicts with {dayInfo.conflictingExercise}
                                        </Text>
                                    )}
                                    {!dayInfo.hasConflict && !dayInfo.isCurrent && (
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: isDark ? COLORS.success : COLORS.successDark,
                                                marginTop: 2,
                                            }}
                                        >
                                            Available
                                        </Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Cancel Button */}
                    <View style={{ marginTop: 20 }}>
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(false);
                                setSelectedExercise(null);
                            }}
                            style={{
                                backgroundColor: 'transparent',
                                padding: 20,
                                borderRadius: 12,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                borderWidth: 2,
                                borderColor: isDark ? COLORS.borderDark : COLORS.border,
                            }}
                            activeOpacity={0.8}
                        >
                            <X size={32} color={isDark ? COLORS.textDark : COLORS.text} />
                            <Text style={{ color: isDark ? COLORS.textDark : COLORS.text, fontSize: 18, fontWeight: 'bold', marginLeft: 12 }}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    const renderResetSettingsModal = () => {
        return (
            <Modal
                isVisible={resetModalVisible}
                onBackdropPress={() => setResetModalVisible(false)}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                }}
            >
                <View
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
                >
                    {/* Header */}
                    <View style={{ marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                            <RotateCcw size={24} color={isDark ? COLORS.error : COLORS.errorDark} />
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    color: isDark ? COLORS.textDark : COLORS.text,
                                    marginLeft: 8,
                                }}
                            >
                                Reset All Settings
                            </Text>
                        </View>
                        <Text
                            style={{
                                fontSize: 14,
                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                            }}
                        >
                            This will reset all settings to their default values. This action cannot be undone.
                        </Text>
                    </View>

                    {/* Warning */}
                    <View
                        style={{
                            backgroundColor: isDark ? COLORS.errorDark + '20' : COLORS.error + '20',
                            padding: 16,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: isDark ? COLORS.error : COLORS.errorDark,
                            marginBottom: 20,
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <AlertTriangle size={16} color={isDark ? COLORS.error : COLORS.errorDark} />
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '600',
                                    color: isDark ? COLORS.error : COLORS.errorDark,
                                    marginLeft: 6,
                                }}
                            >
                                Warning
                            </Text>
                        </View>
                        <Text
                            style={{
                                fontSize: 12,
                                color: isDark ? COLORS.error : COLORS.errorDark,
                                lineHeight: 16,
                            }}
                        >
                            This action will reset all settings to their default values. Your workout history and personal records will not be affected.
                        </Text>
                    </View>

                    {/* What will be reset */}
                    <View style={{ marginBottom: 20 }}>
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: isDark ? COLORS.textDark : COLORS.text,
                                marginBottom: 8,
                            }}
                        >
                            Settings that will be reset:
                        </Text>
                        <View style={{ gap: 4 }}>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                }}
                            >
                                • Theme: System (follow device settings)
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                }}
                            >
                                • Units: Kilograms (kg)
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                }}
                            >
                                • Workout Schedule: Default days
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                }}
                            >
                                • Exercise Progression: Default values
                            </Text>
                        </View>
                    </View>

                    {/* Buttons */}
                    <View style={{ gap: 12 }}>
                        <TouchableOpacity
                            onPress={confirmResetSettings}
                            style={{
                                backgroundColor: isDark ? COLORS.error : COLORS.errorDark,
                                padding: 20,
                                borderRadius: 12,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.3,
                                shadowRadius: 4,
                                elevation: 4,
                            }}
                            activeOpacity={0.8}
                        >
                            <CheckCircle size={32} color="white" />
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 12 }}>
                                Reset All Settings
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setResetModalVisible(false)}
                            style={{
                                backgroundColor: 'transparent',
                                padding: 20,
                                borderRadius: 12,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                borderWidth: 2,
                                borderColor: isDark ? COLORS.borderDark : COLORS.border,
                            }}
                            activeOpacity={0.8}
                        >
                            <X size={32} color={isDark ? COLORS.textDark : COLORS.text} />
                            <Text style={{ color: isDark ? COLORS.textDark : COLORS.text, fontSize: 18, fontWeight: 'bold', marginLeft: 12 }}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <>
            <View style={{ flex: 1 }}>
                <ScrollView
                    ref={scrollViewRef}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 60 }}
                    onScroll={(event) => {
                        const offsetY = event.nativeEvent.contentOffset.y;
                        saveScrollPosition('settings', offsetY);
                    }}
                    scrollEventThrottle={16}
                >
                    {/* Theme Settings */}
                    <Card
                        title="Theme"
                        borderColor={isDark ? COLORS.primaryLight : COLORS.primary}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <Palette size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                            <Text
                                style={{
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                    marginLeft: 8,
                                    fontSize: 14,
                                }}
                            >
                                Choose your preferred theme
                            </Text>
                        </View>
                        <View style={{ gap: 12 }}>
                            {themeOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    onPress={() => setTheme(option.value)}
                                    variant={theme === option.value ? 'primary' : 'outline'}
                                    fullWidth
                                >
                                    {`${option.label} - ${option.description}`}
                                </Button>
                            ))}
                        </View>
                    </Card>

                    {/* Unit Settings */}
                    <Card
                        title="Units"
                        borderColor={isDark ? COLORS.secondaryLight : COLORS.secondary}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <Scale size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                            <Text
                                style={{
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                    marginLeft: 8,
                                    fontSize: 14,
                                }}
                            >
                                Choose your preferred weight units
                            </Text>
                        </View>
                        <View style={{ gap: 12 }}>
                            {unitOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    onPress={() => setUnit(option.value)}
                                    variant={unit === option.value ? 'primary' : 'outline'}
                                    fullWidth
                                >
                                    {`${option.label} - ${option.description}`}
                                </Button>
                            ))}
                        </View>

                        {/* Example */}
                        <View style={{ marginTop: 15, padding: 12, backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary, borderRadius: 8 }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                }}
                            >
                                Example: {formatWeight(100)}
                            </Text>
                        </View>
                    </Card>

                    {/* Workout Schedule */}
                    <Card
                        title="Workout Schedule"
                        borderColor={isDark ? COLORS.successLight : COLORS.success}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <Calendar size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                            <Text
                                style={{
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                    marginLeft: 8,
                                    fontSize: 14,
                                }}
                            >
                                Select which day each exercise is performed
                            </Text>
                        </View>

                        <View style={{ gap: 12 }}>
                            {Object.entries(exerciseNames).map(([key, name]) => (
                                <View key={key} style={{ gap: 8 }}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: '600',
                                            color: isDark ? COLORS.textDark : COLORS.text,
                                        }}
                                    >
                                        {name}
                                    </Text>
                                    {renderDaySelector(key as keyof typeof workoutSchedule)}
                                </View>
                            ))}
                        </View>
                    </Card>

                    {/* Exercise Progression Settings */}
                    <Card
                        title="Exercise Progression"
                        borderColor={isDark ? COLORS.warningLight : COLORS.warning}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <TrendingUp size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                            <Text
                                style={{
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                    marginLeft: 8,
                                    fontSize: 14,
                                }}
                            >
                                Set weight progression per cycle
                            </Text>
                        </View>
                        <View style={{ gap: 12 }}>
                            {Object.entries(exerciseNames).map(([key, name]) => (
                                <View key={key} style={{ gap: 8 }}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: '600',
                                            color: isDark ? COLORS.textDark : COLORS.text,
                                        }}
                                    >
                                        {name}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                            }}
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
                                    </View>
                                </View>
                            ))}
                        </View>
                    </Card>

                    {/* Data Backup & Restore */}
                    <DataBackup
                        onDataImported={() => {
                            // Reload settings after import
                            // This would typically trigger a context reload
                            console.log('Data imported successfully');
                        }}
                    />

                    {/* Reset Settings */}
                    <Card
                        title="Reset Settings"
                        borderColor={isDark ? COLORS.errorLight : COLORS.error}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <RotateCcw size={16} color={isDark ? COLORS.error : COLORS.errorDark} />
                            <Text
                                style={{
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                    marginLeft: 8,
                                    fontSize: 14,
                                }}
                            >
                                Reset all settings to their default values
                            </Text>
                        </View>

                        {/* Warning */}
                        <View
                            style={{
                                backgroundColor: isDark ? COLORS.errorDark + '20' : COLORS.error + '20',
                                padding: 12,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: isDark ? COLORS.error : COLORS.errorDark,
                                marginBottom: 16,
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                <AlertTriangle size={14} color={isDark ? COLORS.error : COLORS.errorDark} />
                                <Text
                                    style={{
                                        fontSize: 12,
                                        fontWeight: '600',
                                        color: isDark ? COLORS.error : COLORS.errorDark,
                                        marginLeft: 6,
                                    }}
                                >
                                    Alert
                                </Text>
                            </View>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: isDark ? COLORS.error : COLORS.errorDark,
                                }}
                            >
                                This will reset your theme, units, workout schedule, and exercise progression to their default values. Your workout history and personal records will not be affected.
                            </Text>
                        </View>

                        <Button
                            onPress={handleResetSettings}
                            variant="outline"
                            fullWidth
                            style={{
                                borderColor: isDark ? COLORS.error : COLORS.errorDark,
                            }}
                        >
                            Reset All Settings
                        </Button>
                    </Card>
                </ScrollView>
            </View>

            {renderDaySelectorModal()}
            {renderResetSettingsModal()}
        </>
    );
}; 