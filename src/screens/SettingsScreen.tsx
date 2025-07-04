import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, ScrollView, Alert, View, Text, Dimensions } from 'react-native';
import { TextInput } from 'react-native-paper';
import Modal from 'react-native-modal';
import { Palette, Scale, Calendar, TrendingUp, ChevronDown, RotateCcw, AlertTriangle, CheckCircle, X, Database, Settings, TrendingDown } from 'lucide-react-native';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { DataBackup } from '../components/DataBackup';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { COLORS } from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const settingsExercises = ['benchPress', 'squat', 'overheadPress', 'deadlift'] as const;

export const SettingsScreen: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const {
        unit,
        setUnit,
        toggleUnit,
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
        variantSettings,
        updateVariant,
        updateBbbPercentage,
        bbbSettings,
        setBbbSettings,
        updateBbbEnabled,
        saveScrollPosition,
        getScrollPosition,
        setWorkoutSchedule,
        setExerciseProgression,
        setOneRepMax,
        setTrainingMaxPercentage,
        setWarmupSets,
        setVariantSettings,
        trainingMaxDecreases,
        decreaseTrainingMax,
        resetTrainingMaxDecreases,
        clearWorkoutHistory,
        clearTrainingMaxDecreases
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

    // Local state for text inputs - only initialize once
    const [progressionInputs, setProgressionInputs] = useState({
        benchPress: exerciseProgression.benchPress > 0 ? exerciseProgression.benchPress.toString() : '',
        squat: exerciseProgression.squat > 0 ? exerciseProgression.squat.toString() : '',
        deadlift: exerciseProgression.deadlift > 0 ? exerciseProgression.deadlift.toString() : '',
        overheadPress: exerciseProgression.overheadPress > 0 ? exerciseProgression.overheadPress.toString() : '',
    });

    // Local state for 1RM inputs - only initialize once
    const [oneRepMaxInputs, setOneRepMaxInputs] = useState({
        benchPress: oneRepMax.benchPress > 0 ? oneRepMax.benchPress.toString() : '',
        squat: oneRepMax.squat > 0 ? oneRepMax.squat.toString() : '',
        deadlift: oneRepMax.deadlift > 0 ? oneRepMax.deadlift.toString() : '',
        overheadPress: oneRepMax.overheadPress > 0 ? oneRepMax.overheadPress.toString() : '',
    });

    // Local state for warm-up inputs - only initialize once
    const [warmupInputs, setWarmupInputs] = useState({
        set1Percentage: warmupSets.set1.percentage > 0 ? warmupSets.set1.percentage.toString() : '',
        set1Reps: warmupSets.set1.reps > 0 ? warmupSets.set1.reps.toString() : '',
        set2Percentage: warmupSets.set2.percentage > 0 ? warmupSets.set2.percentage.toString() : '',
        set2Reps: warmupSets.set2.reps > 0 ? warmupSets.set2.reps.toString() : '',
        set3Percentage: warmupSets.set3.percentage > 0 ? warmupSets.set3.percentage.toString() : '',
        set3Reps: warmupSets.set3.reps > 0 ? warmupSets.set3.reps.toString() : '',
    });

    // Local state for variant inputs
    const [variantInputs, setVariantInputs] = useState({
        bbbPercentage: variantSettings.bbbPercentage > 0 ? variantSettings.bbbPercentage.toString() : '50',
    });

    // Local state for BBB inputs
    const [bbbInputs, setBbbInputs] = useState({
        percentage: bbbSettings.percentage > 0 ? bbbSettings.percentage.toString() : '50',
    });

    // Update local state when context values change
    useEffect(() => {
        setProgressionInputs({
            benchPress: exerciseProgression.benchPress > 0 ? exerciseProgression.benchPress.toString() : '',
            squat: exerciseProgression.squat > 0 ? exerciseProgression.squat.toString() : '',
            deadlift: exerciseProgression.deadlift > 0 ? exerciseProgression.deadlift.toString() : '',
            overheadPress: exerciseProgression.overheadPress > 0 ? exerciseProgression.overheadPress.toString() : '',
        });
    }, [exerciseProgression]);

    useEffect(() => {
        setOneRepMaxInputs({
            benchPress: oneRepMax.benchPress > 0 ? oneRepMax.benchPress.toString() : '',
            squat: oneRepMax.squat > 0 ? oneRepMax.squat.toString() : '',
            deadlift: oneRepMax.deadlift > 0 ? oneRepMax.deadlift.toString() : '',
            overheadPress: oneRepMax.overheadPress > 0 ? oneRepMax.overheadPress.toString() : '',
        });
    }, [oneRepMax]);

    useEffect(() => {
        setWarmupInputs({
            set1Percentage: warmupSets.set1.percentage > 0 ? warmupSets.set1.percentage.toString() : '',
            set1Reps: warmupSets.set1.reps > 0 ? warmupSets.set1.reps.toString() : '',
            set2Percentage: warmupSets.set2.percentage > 0 ? warmupSets.set2.percentage.toString() : '',
            set2Reps: warmupSets.set2.reps > 0 ? warmupSets.set2.reps.toString() : '',
            set3Percentage: warmupSets.set3.percentage > 0 ? warmupSets.set3.percentage.toString() : '',
            set3Reps: warmupSets.set3.reps > 0 ? warmupSets.set3.reps.toString() : '',
        });
    }, [warmupSets]);

    useEffect(() => {
        setVariantInputs({
            bbbPercentage: variantSettings.bbbPercentage > 0 ? variantSettings.bbbPercentage.toString() : '50',
        });
    }, [variantSettings]);

    useEffect(() => {
        setBbbInputs({
            percentage: bbbSettings.percentage > 0 ? bbbSettings.percentage.toString() : '50',
        });
    }, [bbbSettings]);

    // Training max percentage options (80% to 100% in 5% increments)
    const trainingMaxOptions = [
        { value: 80, label: '80%' },
        { value: 85, label: '85%' },
        { value: 90, label: '90%' },
        { value: 95, label: '95%' },
        { value: 100, label: '100%' },
    ];

    // Variant options
    const variantOptions = [
        { value: 'nothing' as const, label: 'Nothing', description: 'No additional work' },
        { value: 'bigButBoring' as const, label: 'Big But Boring', description: '5 sets of 10 reps at BBB% of TM' },
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
        // Always update local state
        setProgressionInputs(prev => ({
            ...prev,
            [exercise]: value
        }));

        // Only update context if it's a valid number
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue > 0) {
            updateExerciseProgression(exercise, numValue);
        }
    };

    const handleProgressionBlur = (exercise: keyof typeof exerciseProgression) => {
        const numValue = parseFloat(progressionInputs[exercise]);
        if (isNaN(numValue) || numValue <= 0) {
            // Reset to current value if invalid
            setProgressionInputs(prev => ({
                ...prev,
                [exercise]: exerciseProgression[exercise] > 0 ? exerciseProgression[exercise].toString() : ''
            }));
        }
    };

    // Handle 1RM changes
    const handleOneRepMaxChange = (exercise: keyof typeof oneRepMax, value: string) => {
        // Always update local state
        setOneRepMaxInputs(prev => ({
            ...prev,
            [exercise]: value
        }));

        // Only update context if it's a valid number
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue > 0) {
            updateOneRepMax(exercise, numValue);
        }
    };

    const handleOneRepMaxBlur = (exercise: keyof typeof oneRepMax) => {
        const numValue = parseFloat(oneRepMaxInputs[exercise]);
        if (isNaN(numValue) || numValue <= 0) {
            // Reset to current value if invalid
            setOneRepMaxInputs(prev => ({
                ...prev,
                [exercise]: oneRepMax[exercise] > 0 ? oneRepMax[exercise].toString() : ''
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
        // Always update local state
        setWarmupInputs(prev => ({
            ...prev,
            [`${set}${field.charAt(0).toUpperCase() + field.slice(1)}`]: value
        }));

        // Only update context if it's a valid number
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue > 0) {
            if (field === 'percentage' && numValue <= 100) {
                updateWarmupSet(set, field, numValue);
            } else if (field === 'reps') {
                updateWarmupSet(set, field, numValue);
            }
        }
    };

    const handleWarmupBlur = (set: 'set1' | 'set2' | 'set3', field: 'percentage' | 'reps') => {
        const currentValue = warmupInputs[`${set}${field.charAt(0).toUpperCase() + field.slice(1)}` as keyof typeof warmupInputs];
        const numValue = parseFloat(currentValue);
        if (isNaN(numValue) || numValue <= 0) {
            // Reset to current value if invalid
            const currentWarmupValue = warmupSets[set][field];
            setWarmupInputs(prev => ({
                ...prev,
                [`${set}${field.charAt(0).toUpperCase() + field.slice(1)}`]: currentWarmupValue > 0 ? currentWarmupValue.toString() : ''
            }));
        }
    };

    // Handle variant changes
    const handleVariantChange = (variant: 'nothing' | 'bigButBoring') => {
        updateVariant(variant);
        // Automatically enable/disable BBB based on variant selection
        updateBbbEnabled(variant === 'bigButBoring');
    };

    const handleBbbPercentageBlur = () => {
        const numValue = parseFloat(variantInputs.bbbPercentage);
        if (isNaN(numValue) || numValue <= 0 || numValue > 100) {
            // Reset to current value if invalid
            setVariantInputs(prev => ({
                ...prev,
                bbbPercentage: variantSettings.bbbPercentage > 0 ? variantSettings.bbbPercentage.toString() : '50'
            }));
        } else {
            // Update the variant settings with the valid percentage
            updateBbbPercentage(numValue);
        }
    };

    // Handle BBB changes
    const handleBbbPercentageChange = (value: string) => {
        // Always update local state
        setBbbInputs(prev => ({
            ...prev,
            percentage: value
        }));

        // Only update context if it's a valid number
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue > 0 && numValue <= 100) {
            updateBbbPercentage(numValue);
        }
    };

    const handleResetSettings = () => {
        setResetSettingsModalVisible(true);
    };

    const handleResetData = () => {
        setResetDataModalVisible(true);
    };

    const confirmResetSettings = async () => {
        try {
            // Reset theme to light
            setTheme('light');

            // Reset unit to kg
            setUnit('kg');

            // Clear workout history and training max decreases
            await Promise.all([
                clearWorkoutHistory(),
                clearTrainingMaxDecreases(),
            ]);

            // Reset workout schedule to empty values to force onboarding
            const emptySchedule = {
                benchPress: '',
                squat: '',
                deadlift: '',
                overheadPress: '',
            };
            setWorkoutSchedule(emptySchedule);

            // Reset exercise progression to empty values to force onboarding
            const emptyProgression = {
                benchPress: 0,
                squat: 0,
                deadlift: 0,
                overheadPress: 0,
            };
            setExerciseProgression(emptyProgression);

            // Reset 1RM to empty values to force onboarding
            const emptyOneRepMax = {
                benchPress: 0,
                squat: 0,
                deadlift: 0,
                overheadPress: 0,
            };
            setOneRepMax(emptyOneRepMax);

            // Reset training max percentage to empty values to force onboarding
            const emptyTrainingMax = {
                percentage: 0,
            };
            setTrainingMaxPercentage(emptyTrainingMax);

            // Reset warm-up sets to defaults
            const defaultWarmup = {
                set1: { percentage: 40, reps: 5 },
                set2: { percentage: 50, reps: 5 },
                set3: { percentage: 60, reps: 3 },
                enabled: true,
            };
            setWarmupSets(defaultWarmup);

            // Reset variant settings to defaults
            const defaultVariant = {
                variant: 'nothing' as const,
                bbbPercentage: 50,
            };
            setVariantSettings(defaultVariant);

            // Reset BBB settings to defaults
            const defaultBbb = {
                enabled: false,
                percentage: 50,
            };
            setBbbSettings(defaultBbb);

            // Update local state for progression inputs
            setProgressionInputs({
                benchPress: '',
                squat: '',
                deadlift: '',
                overheadPress: '',
            });

            // Update local state for 1RM inputs
            setOneRepMaxInputs({
                benchPress: '',
                squat: '',
                deadlift: '',
                overheadPress: '',
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

            // Update local state for variant inputs
            setVariantInputs({
                bbbPercentage: defaultVariant.bbbPercentage.toString(),
            });

            setResetSettingsModalVisible(false);

            Alert.alert(
                'Settings Reset',
                'All settings and workout data have been reset. You will need to complete setup again.',
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Error resetting settings:', error);
            Alert.alert(
                'Error',
                'Failed to reset settings. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    const confirmResetData = async () => {
        try {
            // Clear workout history and training max decreases using context functions
            await Promise.all([
                clearWorkoutHistory(),
                clearTrainingMaxDecreases(),
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
            const emptyVariant = {
                variant: 'nothing' as const,
                bbbPercentage: 50,
            };
            const emptyBbb = {
                enabled: false,
                percentage: 50,
            };

            // Save empty values
            await Promise.all([
                setWorkoutSchedule(emptySchedule),
                setExerciseProgression(emptyProgression),
                setOneRepMax(emptyOneRepMax),
                setTrainingMaxPercentage(emptyTrainingMax),
                setVariantSettings(emptyVariant),
                setBbbSettings(emptyBbb),
            ]);

            // Update local state to reflect empty values
            setProgressionInputs({
                benchPress: '',
                squat: '',
                deadlift: '',
                overheadPress: '',
            });

            setOneRepMaxInputs({
                benchPress: '',
                squat: '',
                deadlift: '',
                overheadPress: '',
            });

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
            >
                <View
                    style={{
                        backgroundColor: isDark ? COLORS.backgroundDark : COLORS.background,
                        borderRadius: 12,
                        padding: 20,
                        width: '100%',
                        maxWidth: 400,
                        maxHeight: Dimensions.get('window').height * 0.8,
                        minHeight: Dimensions.get('window').height * 0.6,
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

                    {/* Day Options - Scrollable */}
                    <ScrollView
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={true}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    >
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
                    </ScrollView>

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
            >
                <View
                    style={{
                        backgroundColor: isDark ? COLORS.backgroundDark : COLORS.background,
                        borderRadius: 12,
                        padding: 20,
                        width: '100%',
                        maxWidth: 400,
                        maxHeight: Dimensions.get('window').height * 0.8,
                        minHeight: Dimensions.get('window').height * 0.6,
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
                            Reset all settings to empty values, requiring you to complete the setup process again. Your workout data will not be affected.
                        </Text>
                    </View>

                    {/* Content - Scrollable */}
                    <ScrollView
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={true}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    >
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
                                This action will reset all your app settings to empty values, requiring you to complete the setup process again. Your workout data will not be affected.
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
                                    • Workout Schedule: Empty (requires setup)
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                    }}
                                >
                                    • Exercise Progression: Empty (requires setup)
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                    }}
                                >
                                    • 1 Rep Max Values: Empty (requires setup)
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                    }}
                                >
                                    • Training Max Percentage: Empty (requires setup)
                                </Text>
                            </View>
                        </View>
                    </ScrollView>

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
            >
                <View
                    style={{
                        backgroundColor: isDark ? COLORS.backgroundDark : COLORS.background,
                        borderRadius: 12,
                        padding: 20,
                        width: '100%',
                        maxWidth: 400,
                        maxHeight: Dimensions.get('window').height * 0.8,
                        minHeight: Dimensions.get('window').height * 0.6,
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

                    {/* Content - Scrollable */}
                    <ScrollView
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={true}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    >
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
                    </ScrollView>

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
            >
                <View
                    style={{
                        backgroundColor: isDark ? COLORS.backgroundDark : COLORS.background,
                        borderRadius: 12,
                        padding: 20,
                        width: '100%',
                        maxWidth: 400,
                        maxHeight: Dimensions.get('window').height * 0.8,
                        minHeight: Dimensions.get('window').height * 0.6,
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

                    {/* Options - Scrollable */}
                    <ScrollView
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={true}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    >
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
                    </ScrollView>

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
                            {settingsExercises.map((key) => (
                                <View key={key} style={{ gap: 8 }}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: '600',
                                            color: isDark ? COLORS.textDark : COLORS.text,
                                        }}
                                    >
                                        {exerciseNames[key]}
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
                            {settingsExercises.map((key) => (
                                <View key={key} style={{ gap: 8 }}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: '600',
                                            color: isDark ? COLORS.textDark : COLORS.text,
                                        }}
                                    >
                                        {exerciseNames[key]}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                            }}
                                        >
                                            +
                                        </Text>
                                        <TextInput
                                            value={progressionInputs[key as keyof typeof progressionInputs]}
                                            onChangeText={(value) => {
                                                let sanitized = value.replace(/,/g, '.').replace(/[^0-9.]/g, '');
                                                const firstDot = sanitized.indexOf('.');
                                                if (firstDot !== -1) {
                                                    sanitized = sanitized.slice(0, firstDot + 1) + sanitized.slice(firstDot + 1).replace(/\./g, '');
                                                }
                                                handleProgressionChange(key as keyof typeof exerciseProgression, sanitized);
                                            }}
                                            onBlur={() => handleProgressionBlur(key as keyof typeof exerciseProgression)}
                                            mode="outlined"
                                            keyboardType="numeric"
                                            placeholder="2.5"
                                            style={{
                                                flex: 1,
                                            }}
                                            contentStyle={{
                                                fontSize: 16,
                                            }}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                            }}
                                        >
                                            {unit}
                                        </Text>
                                    </View>
                                    <Text style={{ color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary, fontSize: 12, marginTop: 4, textAlign: 'center' }}>
                                        If you can't see a decimal point, try pasting or using a different keyboard.
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </Card>

                    {/* Training Max Decreases Settings */}
                    <Card
                        title="Training Max Decreases"
                        borderColor={isDark ? COLORS.errorLight : COLORS.error}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <TrendingDown size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                            <Text
                                style={{
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                    marginLeft: 8,
                                    fontSize: 14,
                                }}
                            >
                                Failed workouts reduce training max by 10% for next cycle
                            </Text>
                        </View>

                        <View style={{ gap: 12 }}>
                            {settingsExercises.map((key) => {
                                const decreases = trainingMaxDecreases[key as keyof typeof trainingMaxDecreases];
                                const hasDecreases = decreases > 0;

                                return (
                                    <View key={key} style={{
                                        gap: 8,
                                        backgroundColor: hasDecreases ? (isDark ? COLORS.errorDark + '20' : COLORS.error + '20') : 'transparent',
                                        padding: hasDecreases ? 12 : 0,
                                        borderRadius: hasDecreases ? 8 : 0,
                                        borderWidth: hasDecreases ? 1 : 0,
                                        borderColor: hasDecreases ? (isDark ? COLORS.error : COLORS.errorDark) : 'transparent'
                                    }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: '600',
                                                    color: isDark ? COLORS.textDark : COLORS.text,
                                                }}
                                            >
                                                {exerciseNames[key]}
                                            </Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                {hasDecreases && (
                                                    <Text
                                                        style={{
                                                            fontSize: 14,
                                                            color: isDark ? COLORS.error : COLORS.errorDark,
                                                            fontWeight: '600',
                                                        }}
                                                    >
                                                        -{decreases * 10}%
                                                    </Text>
                                                )}
                                                <TouchableOpacity
                                                    onPress={() => resetTrainingMaxDecreases(key as keyof typeof workoutSchedule)}
                                                    style={{
                                                        backgroundColor: hasDecreases ? (isDark ? COLORS.error : COLORS.errorDark) : (isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary),
                                                        paddingHorizontal: 12,
                                                        paddingVertical: 6,
                                                        borderRadius: 6,
                                                        borderWidth: 1,
                                                        borderColor: hasDecreases ? (isDark ? COLORS.error : COLORS.errorDark) : (isDark ? COLORS.borderDark : COLORS.border),
                                                    }}
                                                    disabled={!hasDecreases}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 12,
                                                            color: hasDecreases ? 'white' : (isDark ? COLORS.textSecondaryDark : COLORS.textSecondary),
                                                            fontWeight: '600',
                                                        }}
                                                    >
                                                        Reset
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        {hasDecreases && (
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                                    fontStyle: 'italic',
                                                }}
                                            >
                                                Training max reduced by {decreases * 10}% due to {decreases} failed workout{decreases > 1 ? 's' : ''}
                                            </Text>
                                        )}
                                        {!hasDecreases && (
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                                    fontStyle: 'italic',
                                                }}
                                            >
                                                No decreases applied
                                            </Text>
                                        )}
                                    </View>
                                );
                            })}
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
                                {settingsExercises.map((key) => (
                                    <View key={key} style={{ gap: 8 }}>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                            }}
                                        >
                                            {exerciseNames[key]}
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                            <TextInput
                                                value={oneRepMaxInputs[key as keyof typeof oneRepMaxInputs]}
                                                onChangeText={(value) => handleOneRepMaxChange(key as keyof typeof oneRepMax, value)}
                                                onBlur={() => handleOneRepMaxBlur(key as keyof typeof oneRepMax)}
                                                mode="outlined"
                                                keyboardType="numeric"
                                                placeholder="100"
                                                style={{
                                                    flex: 1,
                                                }}
                                                contentStyle={{
                                                    fontSize: 16,
                                                }}
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

                        {/* Variant Settings */}
                        <View style={{ marginBottom: 20 }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: isDark ? COLORS.textDark : COLORS.text,
                                    marginBottom: 12,
                                }}
                            >
                                Variant
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                    marginBottom: 12,
                                }}
                            >
                                Choose additional work to perform after main sets
                            </Text>
                            <View style={{ gap: 12 }}>
                                {variantOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        onPress={() => handleVariantChange(option.value)}
                                        style={{
                                            backgroundColor: variantSettings.variant === option.value
                                                ? (isDark ? COLORS.primaryDark + '20' : COLORS.primary + '20')
                                                : (isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary),
                                            borderWidth: 1,
                                            borderColor: variantSettings.variant === option.value
                                                ? (isDark ? COLORS.primary : COLORS.primaryDark)
                                                : (isDark ? COLORS.borderDark : COLORS.border),
                                            borderRadius: 8,
                                            padding: 12,
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <View style={{ flex: 1 }}>
                                                <Text
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: '600',
                                                        color: isDark ? COLORS.textDark : COLORS.text,
                                                        marginBottom: 4,
                                                    }}
                                                >
                                                    {option.label}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: 12,
                                                        color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                                    }}
                                                >
                                                    {option.description}
                                                </Text>
                                            </View>
                                            {variantSettings.variant === option.value && (
                                                <CheckCircle size={20} color={isDark ? COLORS.primary : COLORS.primaryDark} />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* BBB Percentage Input - Only show when Big But Boring is selected */}
                            {variantSettings.variant === 'bigButBoring' && (
                                <View style={{ marginTop: 16 }}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: '600',
                                            color: isDark ? COLORS.textDark : COLORS.text,
                                            marginBottom: 8,
                                        }}
                                    >
                                        BBB Percentage of Training Max
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                            marginBottom: 8,
                                        }}
                                    >
                                        Percentage of training max to use for BBB sets (typically 40-60%)
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TextInput
                                            style={{
                                                flex: 1,
                                                borderWidth: 1,
                                                borderColor: isDark ? COLORS.borderDark : COLORS.border,
                                                borderRadius: 8,
                                                padding: 12,
                                                color: isDark ? COLORS.textDark : COLORS.text,
                                                backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                                fontSize: 16,
                                            }}
                                            keyboardType="numeric"
                                            value={variantInputs.bbbPercentage}
                                            onChangeText={(text) => {
                                                const sanitized = text.replace(/[^0-9.]/g, '');
                                                setVariantInputs(prev => ({ ...prev, bbbPercentage: sanitized }));
                                            }}
                                            onBlur={handleBbbPercentageBlur}
                                            placeholder="50"
                                        />
                                        <Text style={{ marginLeft: 8, color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary, fontSize: 16 }}>
                                            %
                                        </Text>
                                    </View>
                                </View>
                            )}
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
                                                        mode="outlined"
                                                        keyboardType="numeric"
                                                        placeholder="40"
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                        }}
                                                        contentStyle={{
                                                            fontSize: 16,
                                                        }}
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
                                                        mode="outlined"
                                                        keyboardType="numeric"
                                                        placeholder="5"
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                        }}
                                                        contentStyle={{
                                                            fontSize: 16,
                                                        }}
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
                                Reset all settings to empty values, requiring you to complete the setup process again. Your workout data will not be affected.
                            </Text>
                            <Button
                                onPress={handleResetSettings}
                                variant="outline"
                                style={{ backgroundColor: isDark ? COLORS.errorDark + '20' : COLORS.error + '20' }}
                            >
                                Reset All Settings
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
                                style={{ backgroundColor: isDark ? COLORS.errorDark + '20' : COLORS.error + '20' }}
                            >
                                Reset All Data
                            </Button>
                        </View>

                        <View style={{ gap: 12 }}>
                            <Button
                                onPress={() => {
                                    Alert.alert(
                                        'Clear Workout History',
                                        'This will clear all workout history but keep your settings. This can help fix date issues.',
                                        [
                                            { text: 'Cancel', style: 'cancel' },
                                            {
                                                text: 'Clear History',
                                                style: 'destructive',
                                                onPress: () => {
                                                    clearWorkoutHistory();
                                                    Alert.alert('Success', 'Workout history cleared.');
                                                }
                                            }
                                        ]
                                    );
                                }}
                                variant="outline"
                                style={{ backgroundColor: isDark ? COLORS.warningDark + '20' : COLORS.warning + '20' }}
                            >
                                Clear Workout History Only
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