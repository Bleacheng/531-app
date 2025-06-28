import React, { useState, useRef, useEffect } from 'react';
import { TextInput, TouchableOpacity, ScrollView, Alert, View, Text } from 'react-native';
import Modal from 'react-native-modal';
import { Palette, Scale, Calendar, TrendingUp, ChevronDown, RotateCcw, AlertTriangle, CheckCircle, X, Database, Settings } from 'lucide-react-native';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { DataBackup } from '../components/DataBackup';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { COLORS } from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SettingsScreen: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const {
        unit,
        setUnit,
        formatWeight,
        workoutSchedule,
        updateWorkoutDay,
        exerciseProgression,
        updateExerciseProgression,
        oneRepMax,
        updateOneRepMax,
        trainingMaxPercentage,
        updateTrainingMaxPercentage,
        workingSetPercentages,
        updateWorkingSetPercentages,
        warmupSets,
        updateWarmupSet,
        toggleWarmupEnabled,
        saveScrollPosition,
        getScrollPosition,
        setWorkoutSchedule,
        setExerciseProgression,
        setOneRepMax,
        setTrainingMaxPercentage,
        setWarmupSets
    } = useSettings();
    const isDark = theme === 'dark';

    // Scroll position remembering
    const scrollViewRef = useRef<ScrollView>(null);

    // Restore scroll position when component mounts
    useEffect(() => {
        const savedPosition = getScrollPosition('settings');
        if (savedPosition > 0) {
            scrollViewRef.current?.scrollTo({ y: savedPosition, animated: false });
        }
    }, []);

    // Update local state when context values change
    useEffect(() => {
        setProgressionInputs({
            benchPress: exerciseProgression.benchPress.toString(),
            squat: exerciseProgression.squat.toString(),
            deadlift: exerciseProgression.deadlift.toString(),
            overheadPress: exerciseProgression.overheadPress.toString(),
        });
    }, [exerciseProgression]);

    useEffect(() => {
        setOneRepMaxInputs({
            benchPress: oneRepMax.benchPress.toString(),
            squat: oneRepMax.squat.toString(),
            deadlift: oneRepMax.deadlift.toString(),
            overheadPress: oneRepMax.overheadPress.toString(),
        });
    }, [oneRepMax]);

    useEffect(() => {
        setWarmupInputs({
            set1Percentage: warmupSets.set1.percentage.toString(),
            set1Reps: warmupSets.set1.reps.toString(),
            set2Percentage: warmupSets.set2.percentage.toString(),
            set2Reps: warmupSets.set2.reps.toString(),
            set3Percentage: warmupSets.set3.percentage.toString(),
            set3Reps: warmupSets.set3.reps.toString(),
        });
    }, [warmupSets]);

    // Local state for text inputs
    const [progressionInputs, setProgressionInputs] = useState({
        benchPress: exerciseProgression.benchPress.toString(),
        squat: exerciseProgression.squat.toString(),
        deadlift: exerciseProgression.deadlift.toString(),
        overheadPress: exerciseProgression.overheadPress.toString(),
    });

    // Local state for 1RM inputs
    const [oneRepMaxInputs, setOneRepMaxInputs] = useState({
        benchPress: oneRepMax.benchPress.toString(),
        squat: oneRepMax.squat.toString(),
        deadlift: oneRepMax.deadlift.toString(),
        overheadPress: oneRepMax.overheadPress.toString(),
    });

    // Local state for warm-up inputs
    const [warmupInputs, setWarmupInputs] = useState({
        set1Percentage: warmupSets.set1.percentage.toString(),
        set1Reps: warmupSets.set1.reps.toString(),
        set2Percentage: warmupSets.set2.percentage.toString(),
        set2Reps: warmupSets.set2.reps.toString(),
        set3Percentage: warmupSets.set3.percentage.toString(),
        set3Reps: warmupSets.set3.reps.toString(),
    });

    // Training max percentage options (80% to 100% in 5% increments)
    const trainingMaxOptions = [
        { value: 80, label: '80%' },
        { value: 85, label: '85%' },
        { value: 90, label: '90%' },
        { value: 95, label: '95%' },
        { value: 100, label: '100%' },
    ];

    // Local state for modals
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<keyof typeof workoutSchedule | null>(null);
    const [resetSettingsModalVisible, setResetSettingsModalVisible] = useState(false);
    const [resetDataModalVisible, setResetDataModalVisible] = useState(false);
    const [trainingMaxModalVisible, setTrainingMaxModalVisible] = useState(false);

    const themeOptions = [
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

    // Handle 1RM changes
    const handleOneRepMaxChange = (exercise: keyof typeof oneRepMax, value: string) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue > 0) {
            updateOneRepMax(exercise, numValue);
        }
        setOneRepMaxInputs(prev => ({
            ...prev,
            [exercise]: value
        }));
    };

    const handleOneRepMaxBlur = (exercise: keyof typeof oneRepMax) => {
        const numValue = parseFloat(oneRepMaxInputs[exercise]);
        if (isNaN(numValue) || numValue <= 0) {
            // Reset to current value if invalid
            setOneRepMaxInputs(prev => ({
                ...prev,
                [exercise]: oneRepMax[exercise].toString()
            }));
        }
    };

    const handleDaySelect = (exercise: keyof typeof workoutSchedule, day: string) => {
        updateWorkoutDay(exercise, day);
        setModalVisible(false);
        setSelectedExercise(null);
    };

    const handleTrainingMaxSelect = (percentage: number) => {
        updateTrainingMaxPercentage(percentage);
        setTrainingMaxModalVisible(false);
    };

    // Handle warm-up changes
    const handleWarmupChange = (set: 'set1' | 'set2' | 'set3', field: 'percentage' | 'reps', value: string) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue > 0) {
            if (field === 'percentage' && numValue <= 100) {
                updateWarmupSet(set, field, numValue);
            } else if (field === 'reps') {
                updateWarmupSet(set, field, numValue);
            }
        }
        setWarmupInputs(prev => ({
            ...prev,
            [`${set}${field.charAt(0).toUpperCase() + field.slice(1)}`]: value
        }));
    };

    const handleWarmupBlur = (set: 'set1' | 'set2' | 'set3', field: 'percentage' | 'reps') => {
        const inputKey = `${set}${field.charAt(0).toUpperCase() + field.slice(1)}` as keyof typeof warmupInputs;
        const numValue = parseFloat(warmupInputs[inputKey]);
        const currentValue = field === 'percentage' ? warmupSets[set].percentage : warmupSets[set].reps;

        if (isNaN(numValue) || numValue <= 0 || (field === 'percentage' && numValue > 100)) {
            // Reset to current value if invalid
            setWarmupInputs(prev => ({
                ...prev,
                [inputKey]: currentValue.toString()
            }));
        }
    };

    const handleResetSettings = () => {
        setResetSettingsModalVisible(true);
    };

    const handleResetData = () => {
        setResetDataModalVisible(true);
    };

    const confirmResetSettings = () => {
        // Reset theme to light
        setTheme('light');

        // Reset unit to kg
        setUnit('kg');

        // Reset workout schedule to defaults
        const defaultSchedule = {
            benchPress: 'Monday',
            squat: 'Tuesday',
            deadlift: 'Thursday',
            overheadPress: 'Friday',
        };
        setWorkoutSchedule(defaultSchedule);

        // Reset exercise progression to defaults
        const defaultProgression = {
            benchPress: 2.5,
            squat: 5,
            deadlift: 5,
            overheadPress: 2.5,
        };
        setExerciseProgression(defaultProgression);

        // Reset 1RM to defaults
        const defaultOneRepMax = {
            benchPress: 100,
            squat: 140,
            deadlift: 180,
            overheadPress: 70,
        };
        setOneRepMax(defaultOneRepMax);

        // Reset training max percentage to defaults
        const defaultTrainingMax = {
            percentage: 90,
        };
        setTrainingMaxPercentage(defaultTrainingMax);

        // Reset warm-up sets to defaults
        const defaultWarmup = {
            set1: { percentage: 40, reps: 5 },
            set2: { percentage: 50, reps: 5 },
            set3: { percentage: 60, reps: 3 },
            enabled: true,
        };
        setWarmupSets(defaultWarmup);

        // Update local state for progression inputs
        setProgressionInputs({
            benchPress: defaultProgression.benchPress.toString(),
            squat: defaultProgression.squat.toString(),
            deadlift: defaultProgression.deadlift.toString(),
            overheadPress: defaultProgression.overheadPress.toString(),
        });

        // Update local state for 1RM inputs
        setOneRepMaxInputs({
            benchPress: defaultOneRepMax.benchPress.toString(),
            squat: defaultOneRepMax.squat.toString(),
            deadlift: defaultOneRepMax.deadlift.toString(),
            overheadPress: defaultOneRepMax.overheadPress.toString(),
        });

        // Update local state for warm-up inputs
        setWarmupInputs({
            set1Percentage: defaultWarmup.set1.percentage.toString(),
            set1Reps: defaultWarmup.set1.reps.toString(),
            set2Percentage: defaultWarmup.set2.percentage.toString(),
            set2Reps: defaultWarmup.set2.reps.toString(),
            set3Percentage: defaultWarmup.set3.percentage.toString(),
            set3Reps: defaultWarmup.set3.reps.toString(),
        });

        setResetSettingsModalVisible(false);

        Alert.alert(
            'Settings Reset',
            'All settings have been reset to their default values.',
            [{ text: 'OK' }]
        );
    };

    const confirmResetData = async () => {
        try {
            // Clear all workout-related data from AsyncStorage
            await Promise.all([
                AsyncStorage.removeItem('workout_trainingMaxes'),
                AsyncStorage.removeItem('workout_personalRecords'),
                AsyncStorage.removeItem('workout_history'),
                AsyncStorage.removeItem('workout_currentCycle'),
                AsyncStorage.removeItem('workout_currentWeek'),
            ]);

            // Reset settings to empty values to force onboarding
            const emptySchedule = {
                benchPress: '',
                squat: '',
                deadlift: '',
                overheadPress: '',
            };
            const emptyProgression = {
                benchPress: 0,
                squat: 0,
                deadlift: 0,
                overheadPress: 0,
            };
            const emptyOneRepMax = {
                benchPress: 0,
                squat: 0,
                deadlift: 0,
                overheadPress: 0,
            };
            const emptyTrainingMax = {
                percentage: 0,
            };

            // Save empty values
            await Promise.all([
                setWorkoutSchedule(emptySchedule),
                setExerciseProgression(emptyProgression),
                setOneRepMax(emptyOneRepMax),
                setTrainingMaxPercentage(emptyTrainingMax),
            ]);

            setResetDataModalVisible(false);

            Alert.alert(
                'Data Reset',
                'All workout data has been cleared and settings reset. You will need to complete setup again.',
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Error resetting data:', error);
            Alert.alert(
                'Error',
                'Failed to reset data. Please try again.',
                [{ text: 'OK' }]
            );
        }
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
        return (
            <Modal
                isVisible={modalVisible}
                onBackdropPress={() => setModalVisible(false)}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                }}
                backdropOpacity={0.5}
                useNativeDriver={true}
                hideModalContentWhileAnimating={true}
                statusBarTranslucent={true}
                animationIn="fadeIn"
                animationOut="fadeOut"
                animationInTiming={200}
                animationOutTiming={200}
            >
                <View
                    style={{
                        backgroundColor: isDark ? COLORS.backgroundDark : COLORS.background,
                        borderRadius: 12,
                        padding: 20,
                        width: '100%',
                        maxWidth: 400,
                        shadowColor: isDark ? COLORS.primaryDark : COLORS.primary,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 8,
                    }}
                >
                    {/* Header */}
                    <View style={{ marginBottom: 20 }}>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: isDark ? COLORS.textDark : COLORS.text,
                                textAlign: 'center',
                            }}
                        >
                            Select Day
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                textAlign: 'center',
                                marginTop: 8,
                            }}
                        >
                            Choose which day to perform {selectedExercise ? exerciseNames[selectedExercise] : 'this exercise'}
                        </Text>
                    </View>

                    {/* Day Options */}
                    <View style={{ gap: 8 }}>
                        {selectedExercise && getAvailableDays(selectedExercise).map(({ day, isCurrent, hasConflict, conflictingExercise }) => (
                            <TouchableOpacity
                                key={day}
                                onPress={() => handleDaySelect(selectedExercise, day)}
                                style={{
                                    backgroundColor: isCurrent
                                        ? (isDark ? COLORS.primary : COLORS.primaryDark)
                                        : hasConflict
                                            ? (isDark ? COLORS.errorDark + '20' : COLORS.error + '20')
                                            : (isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary),
                                    borderWidth: 1,
                                    borderColor: isCurrent
                                        ? (isDark ? COLORS.primary : COLORS.primaryDark)
                                        : hasConflict
                                            ? (isDark ? COLORS.error : COLORS.errorDark)
                                            : (isDark ? COLORS.borderDark : COLORS.border),
                                    borderRadius: 8,
                                    padding: 16,
                                    alignItems: 'center',
                                }}
                                activeOpacity={0.8}
                                disabled={hasConflict}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: '600',
                                        color: isCurrent
                                            ? 'white'
                                            : hasConflict
                                                ? (isDark ? COLORS.error : COLORS.errorDark)
                                                : (isDark ? COLORS.textDark : COLORS.text),
                                    }}
                                >
                                    {day}
                                </Text>
                                {isCurrent && (
                                    <CheckCircle size={20} color="white" style={{ marginTop: 4 }} />
                                )}
                                {hasConflict && (
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: isDark ? COLORS.error : COLORS.errorDark,
                                            marginTop: 4,
                                        }}
                                    >
                                        Conflicts with {conflictingExercise}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Cancel Button */}
                    <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        style={{
                            backgroundColor: 'transparent',
                            padding: 16,
                            borderRadius: 8,
                            alignItems: 'center',
                            marginTop: 16,
                            borderWidth: 1,
                            borderColor: isDark ? COLORS.borderDark : COLORS.border,
                        }}
                        activeOpacity={0.8}
                    >
                        <Text style={{ color: isDark ? COLORS.textDark : COLORS.text, fontSize: 16, fontWeight: '600' }}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    };

    const renderResetSettingsModal = () => {
        return (
            <Modal
                isVisible={resetSettingsModalVisible}
                onBackdropPress={() => setResetSettingsModalVisible(false)}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                }}
                backdropOpacity={0.5}
                useNativeDriver={true}
                hideModalContentWhileAnimating={true}
                statusBarTranslucent={true}
                animationIn="fadeIn"
                animationOut="fadeOut"
                animationInTiming={200}
                animationOutTiming={200}
            >
                <View
                    style={{
                        backgroundColor: isDark ? COLORS.backgroundDark : COLORS.background,
                        borderRadius: 12,
                        padding: 20,
                        width: '100%',
                        maxWidth: 400,
                        shadowColor: isDark ? COLORS.primaryDark : COLORS.primary,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 8,
                    }}
                >
                    {/* Header */}
                    <View style={{ marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                            <Settings size={24} color={isDark ? COLORS.error : COLORS.errorDark} />
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    color: isDark ? COLORS.textDark : COLORS.text,
                                    marginLeft: 8,
                                }}
                            >
                                Reset Settings
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
                            This action will permanently delete all your workout history, personal records, training maxes, and progress data. Your app settings will also be reset to defaults.
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
                                • Theme: Light
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
                                Reset Settings
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setResetSettingsModalVisible(false)}
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

    const renderResetDataModal = () => {
        return (
            <Modal
                isVisible={resetDataModalVisible}
                onBackdropPress={() => setResetDataModalVisible(false)}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                }}
                backdropOpacity={0.5}
                useNativeDriver={true}
                hideModalContentWhileAnimating={true}
                statusBarTranslucent={true}
                animationIn="fadeIn"
                animationOut="fadeOut"
                animationInTiming={200}
                animationOutTiming={200}
            >
                <View
                    style={{
                        backgroundColor: isDark ? COLORS.backgroundDark : COLORS.background,
                        borderRadius: 12,
                        padding: 20,
                        width: '100%',
                        maxWidth: 400,
                        shadowColor: isDark ? COLORS.primaryDark : COLORS.primary,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 8,
                    }}
                >
                    {/* Header */}
                    <View style={{ marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                            <Database size={24} color={isDark ? COLORS.error : COLORS.errorDark} />
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    color: isDark ? COLORS.textDark : COLORS.text,
                                    marginLeft: 8,
                                }}
                            >
                                Reset Workout Data
                            </Text>
                        </View>
                        <Text
                            style={{
                                fontSize: 14,
                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                            }}
                        >
                            This will permanently delete all your workout data and reset your settings. This action cannot be undone.
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
                                Critical Warning
                            </Text>
                        </View>
                        <Text
                            style={{
                                fontSize: 12,
                                color: isDark ? COLORS.error : COLORS.errorDark,
                                lineHeight: 16,
                            }}
                        >
                            This action will permanently delete all your workout history, personal records, training maxes, and progress data. Your app settings will also be reset to defaults.
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
                            Data that will be deleted:
                        </Text>
                        <View style={{ gap: 4 }}>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                }}
                            >
                                • All workout history
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                }}
                            >
                                • Personal records
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                }}
                            >
                                • Training maxes
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                }}
                            >
                                • Current cycle and week progress
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                }}
                            >
                                • All app settings (workout schedule, progression, 1RM, etc.)
                            </Text>
                        </View>
                    </View>

                    {/* Buttons */}
                    <View style={{ gap: 12 }}>
                        <TouchableOpacity
                            onPress={confirmResetData}
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
                                Delete All Data
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setResetDataModalVisible(false)}
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

    const renderTrainingMaxModal = () => {
        return (
            <Modal
                isVisible={trainingMaxModalVisible}
                onBackdropPress={() => setTrainingMaxModalVisible(false)}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                }}
                backdropOpacity={0.5}
                useNativeDriver={true}
                hideModalContentWhileAnimating={true}
                statusBarTranslucent={true}
                animationIn="fadeIn"
                animationOut="fadeOut"
                animationInTiming={200}
                animationOutTiming={200}
            >
                <View
                    style={{
                        backgroundColor: isDark ? COLORS.backgroundDark : COLORS.background,
                        borderRadius: 12,
                        padding: 20,
                        width: '100%',
                        maxWidth: 400,
                        shadowColor: isDark ? COLORS.primaryDark : COLORS.primary,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 8,
                    }}
                >
                    {/* Header */}
                    <View style={{ marginBottom: 20 }}>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: isDark ? COLORS.textDark : COLORS.text,
                                textAlign: 'center',
                            }}
                        >
                            Select Training Max Percentage
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                textAlign: 'center',
                                marginTop: 8,
                            }}
                        >
                            Choose the percentage of your 1RM to use as training max
                        </Text>
                    </View>

                    {/* Options */}
                    <View style={{ gap: 8 }}>
                        {trainingMaxOptions.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                onPress={() => handleTrainingMaxSelect(option.value)}
                                style={{
                                    backgroundColor: trainingMaxPercentage.percentage === option.value
                                        ? (isDark ? COLORS.primary : COLORS.primaryDark)
                                        : (isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary),
                                    borderWidth: 1,
                                    borderColor: trainingMaxPercentage.percentage === option.value
                                        ? (isDark ? COLORS.primary : COLORS.primaryDark)
                                        : (isDark ? COLORS.borderDark : COLORS.border),
                                    borderRadius: 8,
                                    padding: 16,
                                    alignItems: 'center',
                                }}
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: '600',
                                        color: trainingMaxPercentage.percentage === option.value
                                            ? 'white'
                                            : (isDark ? COLORS.textDark : COLORS.text),
                                    }}
                                >
                                    {option.label}
                                </Text>
                                {trainingMaxPercentage.percentage === option.value && (
                                    <CheckCircle size={20} color="white" style={{ marginTop: 4 }} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Cancel Button */}
                    <TouchableOpacity
                        onPress={() => setTrainingMaxModalVisible(false)}
                        style={{
                            backgroundColor: 'transparent',
                            padding: 16,
                            borderRadius: 8,
                            alignItems: 'center',
                            marginTop: 16,
                            borderWidth: 1,
                            borderColor: isDark ? COLORS.borderDark : COLORS.border,
                        }}
                        activeOpacity={0.8}
                    >
                        <Text style={{ color: isDark ? COLORS.textDark : COLORS.text, fontSize: 16, fontWeight: '600' }}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    };

    return (
        <>
            <View style={{ flex: 1 }}>
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

                    {/* 5/3/1 Program Settings */}
                    <Card
                        title="5/3/1 Program Settings"
                        borderColor={isDark ? COLORS.primaryLight : COLORS.primary}
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
                                Configure your 5/3/1 program parameters
                            </Text>
                        </View>

                        {/* 1RM Settings */}
                        <View style={{ marginBottom: 20 }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: isDark ? COLORS.textDark : COLORS.text,
                                    marginBottom: 12,
                                }}
                            >
                                1 Rep Max (1RM)
                            </Text>
                            <View style={{ gap: 12 }}>
                                {Object.entries(exerciseNames).map(([key, name]) => (
                                    <View key={key} style={{ gap: 8 }}>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                            }}
                                        >
                                            {name}
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                            <TextInput
                                                value={oneRepMaxInputs[key as keyof typeof oneRepMaxInputs]}
                                                onChangeText={(value) => handleOneRepMaxChange(key as keyof typeof oneRepMax, value)}
                                                onBlur={() => handleOneRepMaxBlur(key as keyof typeof oneRepMax)}
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
                                                placeholder="100"
                                                placeholderTextColor={isDark ? COLORS.textTertiaryDark : COLORS.textTertiary}
                                            />
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                                    minWidth: 30,
                                                }}
                                            >
                                                {unit}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Training Max Percentage Settings */}
                        <View style={{ marginBottom: 20 }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: isDark ? COLORS.textDark : COLORS.text,
                                    marginBottom: 12,
                                }}
                            >
                                Training Max Percentage
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                    marginBottom: 12,
                                }}
                            >
                                Percentage of 1RM used as training max for all exercises (typically 85-90%)
                            </Text>
                            <TouchableOpacity
                                onPress={() => setTrainingMaxModalVisible(true)}
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
                                        {trainingMaxPercentage.percentage}%
                                    </Text>
                                </View>
                                <ChevronDown size={20} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Working Set Percentages Info */}
                        <View>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: isDark ? COLORS.textDark : COLORS.text,
                                    marginBottom: 12,
                                }}
                            >
                                Working Set Percentages
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                    marginBottom: 12,
                                }}
                            >
                                These are the standard 5/3/1 percentages and cannot be modified:
                            </Text>
                            <View style={{ gap: 8 }}>
                                <View style={{
                                    backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                    padding: 12,
                                    borderRadius: 8
                                }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: isDark ? COLORS.textDark : COLORS.text, marginBottom: 4 }}>
                                        Week 1 (5/5/5+): 65% × 5, 75% × 5, 85% × 5+
                                    </Text>
                                </View>
                                <View style={{
                                    backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                    padding: 12,
                                    borderRadius: 8
                                }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: isDark ? COLORS.textDark : COLORS.text, marginBottom: 4 }}>
                                        Week 2 (3/3/3+): 70% × 3, 80% × 3, 90% × 3+
                                    </Text>
                                </View>
                                <View style={{
                                    backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                    padding: 12,
                                    borderRadius: 8
                                }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: isDark ? COLORS.textDark : COLORS.text, marginBottom: 4 }}>
                                        Week 3 (5/3/1+): 75% × 5, 85% × 3, 95% × 1+
                                    </Text>
                                </View>
                                <View style={{
                                    backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                    padding: 12,
                                    borderRadius: 8
                                }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: isDark ? COLORS.textDark : COLORS.text, marginBottom: 4 }}>
                                        Week 4 (Deload): 40% × 5, 50% × 5, 60% × 5
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Card>

                    {/* Warm-up Settings */}
                    <Card
                        title="Warm-up Sets"
                        borderColor={isDark ? COLORS.secondaryLight : COLORS.secondary}
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
                                Configure warm-up sets for all exercises
                            </Text>
                        </View>

                        {/* Enable/Disable Warm-ups */}
                        <View style={{ marginBottom: 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: isDark ? COLORS.textDark : COLORS.text,
                                    }}
                                >
                                    Enable Warm-ups
                                </Text>
                                <TouchableOpacity
                                    onPress={toggleWarmupEnabled}
                                    style={{
                                        backgroundColor: warmupSets.enabled
                                            ? (isDark ? COLORS.success : COLORS.successDark)
                                            : (isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary),
                                        borderWidth: 1,
                                        borderColor: warmupSets.enabled
                                            ? (isDark ? COLORS.success : COLORS.successDark)
                                            : (isDark ? COLORS.borderDark : COLORS.border),
                                        borderRadius: 20,
                                        padding: 4,
                                        width: 50,
                                        height: 30,
                                        justifyContent: 'center',
                                        alignItems: warmupSets.enabled ? 'flex-end' : 'flex-start',
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <View
                                        style={{
                                            backgroundColor: 'white',
                                            borderRadius: 12,
                                            width: 22,
                                            height: 22,
                                            shadowOffset: { width: 0, height: 1 },
                                            shadowOpacity: 0.2,
                                            shadowRadius: 2,
                                            elevation: 2,
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                }}
                            >
                                Warm-ups are automatically disabled during deload week (Week 4)
                            </Text>
                        </View>

                        {/* Warm-up Sets Configuration */}
                        {warmupSets.enabled && (
                            <View>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: isDark ? COLORS.textDark : COLORS.text,
                                        marginBottom: 12,
                                    }}
                                >
                                    Warm-up Sets
                                </Text>
                                <View style={{ gap: 12 }}>
                                    {[
                                        { key: 'set1', label: 'Set 1' },
                                        { key: 'set2', label: 'Set 2' },
                                        { key: 'set3', label: 'Set 3' },
                                    ].map(({ key, label }) => (
                                        <View key={key} style={{ gap: 8 }}>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: '600',
                                                    color: isDark ? COLORS.textDark : COLORS.text,
                                                }}
                                            >
                                                {label}
                                            </Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                <View style={{ flex: 1 }}>
                                                    <Text
                                                        style={{
                                                            fontSize: 12,
                                                            color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                                            marginBottom: 4,
                                                        }}
                                                    >
                                                        Percentage
                                                    </Text>
                                                    <TextInput
                                                        value={warmupInputs[`${key}Percentage` as keyof typeof warmupInputs]}
                                                        onChangeText={(value) => handleWarmupChange(key as 'set1' | 'set2' | 'set3', 'percentage', value)}
                                                        onBlur={() => handleWarmupBlur(key as 'set1' | 'set2' | 'set3', 'percentage')}
                                                        keyboardType="numeric"
                                                        style={{
                                                            backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                                            borderWidth: 1,
                                                            borderColor: isDark ? COLORS.borderDark : COLORS.border,
                                                            borderRadius: 8,
                                                            padding: 12,
                                                            color: isDark ? COLORS.textDark : COLORS.text,
                                                            fontSize: 16,
                                                        }}
                                                        placeholder="40"
                                                        placeholderTextColor={isDark ? COLORS.textTertiaryDark : COLORS.textTertiary}
                                                    />
                                                </View>
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                                        marginTop: 20,
                                                    }}
                                                >
                                                    ×
                                                </Text>
                                                <View style={{ flex: 1 }}>
                                                    <Text
                                                        style={{
                                                            fontSize: 12,
                                                            color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                                            marginBottom: 4,
                                                        }}
                                                    >
                                                        Reps
                                                    </Text>
                                                    <TextInput
                                                        value={warmupInputs[`${key}Reps` as keyof typeof warmupInputs]}
                                                        onChangeText={(value) => handleWarmupChange(key as 'set1' | 'set2' | 'set3', 'reps', value)}
                                                        onBlur={() => handleWarmupBlur(key as 'set1' | 'set2' | 'set3', 'reps')}
                                                        keyboardType="numeric"
                                                        style={{
                                                            backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                                            borderWidth: 1,
                                                            borderColor: isDark ? COLORS.borderDark : COLORS.border,
                                                            borderRadius: 8,
                                                            padding: 12,
                                                            color: isDark ? COLORS.textDark : COLORS.text,
                                                            fontSize: 16,
                                                        }}
                                                        placeholder="5"
                                                        placeholderTextColor={isDark ? COLORS.textTertiaryDark : COLORS.textTertiary}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </Card>

                    {/* Data Backup & Restore */}
                    <DataBackup
                        onDataImported={() => {
                            // Reload settings after import
                            // This would typically trigger a context reload
                            console.log('Data imported successfully');
                        }}
                    />

                    {/* Reset Options */}
                    <Card
                        title="Reset Options"
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
                                Reset settings or clear workout data
                            </Text>
                        </View>

                        {/* Reset Settings Section */}
                        <View style={{ marginBottom: 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Settings size={16} color={isDark ? COLORS.warning : COLORS.warningDark} />
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: isDark ? COLORS.textDark : COLORS.text,
                                        marginLeft: 8,
                                    }}
                                >
                                    Reset Settings
                                </Text>
                            </View>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                    marginBottom: 12,
                                }}
                            >
                                Reset theme, units, workout schedule, and exercise progression to default values. Your workout data will not be affected.
                            </Text>
                            <Button
                                onPress={handleResetSettings}
                                variant="outline"
                                fullWidth
                                style={{
                                    borderColor: isDark ? COLORS.warning : COLORS.warningDark,
                                }}
                            >
                                Reset Settings
                            </Button>
                        </View>

                        {/* Reset Data Section */}
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Database size={16} color={isDark ? COLORS.error : COLORS.errorDark} />
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: isDark ? COLORS.textDark : COLORS.text,
                                        marginLeft: 8,
                                    }}
                                >
                                    Clear Workout Data
                                </Text>
                            </View>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                    marginBottom: 12,
                                }}
                            >
                                Permanently delete all workout history, personal records, training maxes, and progress data. Your settings will remain unchanged.
                            </Text>
                            <Button
                                onPress={handleResetData}
                                variant="outline"
                                fullWidth
                                style={{
                                    borderColor: isDark ? COLORS.error : COLORS.errorDark,
                                }}
                            >
                                Clear All Data
                            </Button>
                        </View>
                    </Card>
                </ScrollView>
            </View>

            {renderDaySelectorModal()}
            {renderResetSettingsModal()}
            {renderResetDataModal()}
            {renderTrainingMaxModal()}
        </>
    );
}; 