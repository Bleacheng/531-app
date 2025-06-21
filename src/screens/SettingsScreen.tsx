import React from 'react';
import { ScrollView } from 'react-native';
import { Stack, Text } from '@tamagui/core';
import { Palette, Scale } from 'lucide-react-native';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { COLORS } from '../constants/colors';

export const SettingsScreen: React.FC = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const { unit, setUnit, formatWeight } = useSettings();
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

    return (
        <ScrollView style={{ flex: 1, padding: 20 }}>
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
                </Stack>
            </Card>
        </ScrollView>
    );
}; 