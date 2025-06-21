import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Settings, BarChart3, Home } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS } from '../constants/colors';

interface FooterProps {
    currentScreen: 'home' | 'settings' | 'profile';
    onNavigate: (screen: 'home' | 'settings' | 'profile') => void;
}

export const Footer: React.FC<FooterProps> = ({ currentScreen, onNavigate }) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    const navItems = [
        {
            key: 'home' as const,
            icon: Home,
            label: 'Home',
            isActive: currentScreen === 'home'
        },
        {
            key: 'profile' as const,
            icon: BarChart3,
            label: 'Stats',
            isActive: currentScreen === 'profile'
        },
        {
            key: 'settings' as const,
            icon: Settings,
            label: 'Settings',
            isActive: currentScreen === 'settings'
        },
    ];

    return (
        <View
            style={{
                backgroundColor: isDark ? COLORS.backgroundSecondaryDark : COLORS.backgroundSecondary,
                borderTopWidth: 1,
                borderTopColor: isDark ? COLORS.borderDark : COLORS.border,
                paddingVertical: 12,
                paddingHorizontal: 20,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                shadowColor: isDark ? COLORS.primaryDark : COLORS.primary,
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 8,
            }}
        >
            {navItems.map((item) => {
                const Icon = item.icon;
                return (
                    <TouchableOpacity
                        key={item.key}
                        onPress={() => onNavigate(item.key)}
                        style={{
                            alignItems: 'center',
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            borderRadius: 12,
                            backgroundColor: item.isActive
                                ? (isDark ? COLORS.primaryLight : COLORS.primary)
                                : 'transparent',
                            minWidth: 80,
                        }}
                        activeOpacity={0.7}
                    >
                        <Icon
                            size={24}
                            color={item.isActive
                                ? 'white'
                                : (isDark ? COLORS.textSecondaryDark : COLORS.textSecondary)
                            }
                        />
                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: item.isActive ? 'bold' : 'normal',
                                color: item.isActive
                                    ? 'white'
                                    : (isDark ? COLORS.textSecondaryDark : COLORS.textSecondary),
                                marginTop: 4,
                            }}
                        >
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}; 