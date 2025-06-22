import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import { Dumbbell, Sun, Moon } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS } from '../constants/colors';

interface HeaderProps {
    title: string;
    subtitle: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
    const { resolvedTheme, toggleTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    return (
        <Appbar.Header style={{ backgroundColor: isDark ? COLORS.backgroundDark : COLORS.background }}>
            <Dumbbell size={28} color={isDark ? COLORS.primaryLight : COLORS.primaryDark} style={{ marginRight: 12 }} />
            <Appbar.Content
                title={<Text variant="titleLarge" style={{ color: isDark ? COLORS.textDark : COLORS.text }}>{title}</Text>}
                subtitle={<Text variant="bodyMedium" style={{ color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary }}>{subtitle}</Text>}
            />
            <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 12 }}>
                {isDark ? (
                    <Sun size={22} color={COLORS.accent} />
                ) : (
                    <Moon size={22} color={COLORS.accentDark} />
                )}
            </TouchableOpacity>
        </Appbar.Header>
    );
}; 