import React from 'react';
import { View, Text, Stack } from '@tamagui/core';
import { TouchableOpacity } from 'react-native';
import { Dumbbell, Sun, Moon } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS } from '../constants/colors';

interface HeaderProps {
    title: string;
    subtitle: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
    const { theme, toggleTheme, resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    const getThemeIcon = () => {
        switch (theme) {
            case 'system':
                return isDark ? <Sun size={20} color="white" /> : <Moon size={20} color="white" />;
            case 'light':
                return <Moon size={20} color="white" />;
            case 'dark':
                return <Sun size={20} color="white" />;
            default:
                return <Moon size={20} color="white" />;
        }
    };

    return (
        <View
            padding={20}
            backgroundColor={isDark ? COLORS.primaryDark : COLORS.primary}
            paddingTop={60}
            borderBottomLeftRadius={20}
            borderBottomRightRadius={20}
            style={{
                shadowColor: isDark ? COLORS.primaryDark : COLORS.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
            }}
        >
            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                <Stack flexDirection="row" alignItems="center" flex={1}>
                    <Dumbbell
                        size={32}
                        color="white"
                        style={{ marginRight: 12 }}
                    />
                    <Stack flex={1}>
                        <Text
                            fontSize={28}
                            color="white"
                            fontWeight="bold"
                            marginBottom={5}
                        >
                            {title}
                        </Text>
                        <Text
                            color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                            fontSize={16}
                        >
                            {subtitle}
                        </Text>
                    </Stack>
                </Stack>

                {/* Theme Toggle Button with icon */}
                <TouchableOpacity
                    onPress={toggleTheme}
                    style={{
                        backgroundColor: isDark ? COLORS.accentLight : COLORS.accent,
                        padding: 12,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: isDark ? COLORS.accent : COLORS.accentDark,
                        shadowColor: isDark ? COLORS.accentLight : COLORS.accent,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 4,
                    }}
                >
                    {getThemeIcon()}
                </TouchableOpacity>
            </Stack>
        </View>
    );
}; 