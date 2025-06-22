import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Dumbbell, Sun, Moon } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS } from '../constants/colors';

interface HeaderProps {
    title: string;
    subtitle: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <View style={{
            backgroundColor: isDark ? COLORS.backgroundDark : COLORS.background,
            paddingHorizontal: 20,
            paddingTop: 50,
            paddingBottom: 20,
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: isDark ? COLORS.borderDark : COLORS.border,
        }}>
            <Dumbbell size={28} color={isDark ? COLORS.primaryLight : COLORS.primaryDark} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
                <Text style={{
                    color: isDark ? COLORS.textDark : COLORS.text,
                    fontSize: 20,
                    fontWeight: 'bold'
                }}>
                    {title}
                </Text>
                <Text style={{
                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                    fontSize: 14,
                    marginTop: 2
                }}>
                    {subtitle}
                </Text>
            </View>
            <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 12 }}>
                {isDark ? (
                    <Sun size={22} color={COLORS.accent} />
                ) : (
                    <Moon size={22} color={COLORS.accentDark} />
                )}
            </TouchableOpacity>
        </View>
    );
}; 