import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Card } from '../components/Card';
import { X, CheckCircle } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS } from '../constants/colors';
import { Badge } from '../components/Badge';

// Set type: { weight: string|number, reps: string|number, amrap?: boolean }
const WorkoutSessionScreen = ({
    exerciseName,
    sets,
    week,
    cycle,
    weekName,
    onComplete,
    onDiscard,
    onNavigate, // (screen: 'history' | 'settings')
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [setStates, setSetStates] = useState(
        sets.map(set => ({
            status: null, // 'success' | 'fail'
            repsCompleted: set.amrap ? '' : set.reps.toString(),
        }))
    );
    const [submitting, setSubmitting] = useState(false);

    const handleSet = (idx, status) => {
        setSetStates(prev => prev.map((s, i) => {
            if (i !== idx) return s;
            // If already selected, undo
            if (s.status === status) return { ...s, status: null };
            return { ...s, status };
        }));
    };
    const handleRepsChange = (idx, val) => {
        setSetStates(prev => prev.map((s, i) => i === idx ? { ...s, repsCompleted: val.replace(/[^0-9]/g, '') } : s));
    };

    const canFinish = setStates.every((s, i) => {
        if (sets[i].amrap) {
            if (s.status === 'success') {
                return s.repsCompleted && parseInt(s.repsCompleted) > 0;
            }
            return s.status === 'fail';
        }
        return s.status !== null;
    });

    const handleFinish = () => {
        setSubmitting(true);
        onComplete && onComplete(setStates);
    };

    const handleDiscard = () => {
        Alert.alert('Discard Workout?', 'Are you sure you want to discard this workout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Discard', style: 'destructive', onPress: () => onDiscard && onDiscard() },
        ]);
    };

    return (
        <View style={{ flex: 1, backgroundColor: isDark ? COLORS.backgroundDark : COLORS.background }}>
            <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
                <Card
                    title={`${exerciseName} - ${weekName}`}
                    borderColor={isDark ? COLORS.primaryLight : COLORS.primary}
                    backgroundColor={isDark ? COLORS.backgroundSecondaryDark : COLORS.backgroundSecondary}
                    style={{ width: '95%', alignSelf: 'center' }}
                >
                    <View style={{ gap: 16, width: '100%' }}>
                        {sets.map((set, idx) => (
                            <View key={idx} style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                borderRadius: 12,
                                borderWidth: 2,
                                borderColor:
                                    setStates[idx].status === 'success'
                                        ? (isDark ? COLORS.successDark : COLORS.success)
                                        : setStates[idx].status === 'fail'
                                            ? (isDark ? COLORS.errorDark : COLORS.error)
                                            : (isDark ? COLORS.borderDark : COLORS.border),
                                padding: 20,
                                gap: 12,
                                minHeight: 80,
                                marginBottom: 2,
                            }}>
                                {/* Fail button */}
                                <TouchableOpacity
                                    onPress={() => handleSet(idx, 'fail')}
                                    style={{
                                        backgroundColor: isDark ? COLORS.errorDark : COLORS.error,
                                        borderRadius: 10,
                                        padding: 12,
                                        marginRight: 12,
                                        opacity: setStates[idx].status === 'success' ? 0.5 : 1,
                                    }}
                                    disabled={false}
                                >
                                    <X size={28} color={'white'} />
                                </TouchableOpacity>
                                {/* Set info */}
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    {/* Set type badge */}
                                    {set.type === 'warmup' && (
                                        <Badge label="Warmup" variant="secondary" size="small" />
                                    )}
                                    {set.type === 'working' && (
                                        <Badge label="Working" variant="primary" size="small" />
                                    )}
                                    {set.type === 'bbb' && (
                                        <Badge label="BBB" variant="complementary" size="small" />
                                    )}
                                    <Text style={{ fontWeight: '700', color: isDark ? COLORS.textDark : COLORS.text, fontSize: 14, marginBottom: 2, marginTop: 4 }}>{`Set ${idx + 1}`}</Text>
                                    <Text style={{ color: isDark ? COLORS.textDark : COLORS.text, fontSize: 16, fontWeight: 'bold', marginBottom: set.amrap ? 6 : 0 }}>
                                        {set.weight} × {set.reps}{set.amrap ? '+' : ''}
                                    </Text>
                                    {set.amrap && (
                                        <TextInput
                                            value={setStates[idx].repsCompleted}
                                            onChangeText={val => handleRepsChange(idx, val)}
                                            keyboardType="numeric"
                                            placeholder="Reps"
                                            style={{
                                                borderWidth: 1,
                                                borderColor: isDark ? COLORS.borderDark : COLORS.border,
                                                borderRadius: 8,
                                                padding: 8,
                                                color: isDark ? COLORS.textDark : COLORS.text,
                                                backgroundColor: isDark ? COLORS.backgroundDark : COLORS.background,
                                                width: 100,
                                                textAlign: 'center',
                                                fontSize: 16,
                                                marginTop: 6,
                                            }}
                                            editable={setStates[idx].status !== 'fail'}
                                        />
                                    )}
                                </View>
                                {/* Success button */}
                                <TouchableOpacity
                                    onPress={() => handleSet(idx, 'success')}
                                    style={{
                                        backgroundColor: isDark ? COLORS.successDark : COLORS.success,
                                        borderRadius: 10,
                                        padding: 12,
                                        marginLeft: 12,
                                        opacity: setStates[idx].status === 'fail' || (set.amrap && (!setStates[idx].repsCompleted || parseInt(setStates[idx].repsCompleted) <= 0)) ? 0.5 : 1,
                                    }}
                                    disabled={set.amrap && (!setStates[idx].repsCompleted || parseInt(setStates[idx].repsCompleted) <= 0)}
                                >
                                    <CheckCircle size={28} color={'white'} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </Card>
                <TouchableOpacity
                    onPress={handleFinish}
                    disabled={!canFinish || submitting}
                    style={{
                        backgroundColor: canFinish && !submitting ? (isDark ? COLORS.primary : COLORS.primaryDark) : (isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary),
                        padding: 18,
                        borderRadius: 10,
                        alignItems: 'center',
                        marginTop: 32,
                        marginBottom: 12,
                        opacity: canFinish && !submitting ? 1 : 0.6,
                        maxWidth: 500,
                        alignSelf: 'center',
                        width: '100%',
                    }}
                >
                    <Text style={{ color: canFinish && !submitting ? 'white' : (isDark ? COLORS.textSecondaryDark : COLORS.textSecondary), fontWeight: 'bold', fontSize: 18 }}>
                        Finish Workout
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleDiscard}
                    style={{
                        backgroundColor: 'transparent',
                        padding: 18,
                        borderRadius: 10,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: isDark ? COLORS.error : COLORS.errorDark,
                        marginBottom: 32,
                        maxWidth: 500,
                        alignSelf: 'center',
                        width: '100%',
                    }}
                >
                    <Text style={{ color: isDark ? COLORS.error : COLORS.errorDark, fontWeight: 'bold', fontSize: 18 }}>
                        Discard
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default WorkoutSessionScreen; 