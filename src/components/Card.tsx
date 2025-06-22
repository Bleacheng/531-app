import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS } from '../constants/colors';

interface CardProps {
    title: string;
    children: React.ReactNode;
    icon?: LucideIcon;
    borderColor?: string;
    backgroundColor?: string;
    onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
    title,
    children,
    icon: Icon,
    borderColor,
    backgroundColor,
    onPress
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const CardContainer = onPress ? TouchableOpacity : View;

    return (
        <CardContainer
            style={{
                borderColor: borderColor || (isDark ? COLORS.borderDark : COLORS.border),
                backgroundColor: backgroundColor || (isDark ? COLORS.backgroundSecondaryDark : COLORS.backgroundSecondary),
                borderWidth: 1,
                borderRadius: 12,
                marginBottom: 16,
                elevation: 2,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            }}
            onPress={onPress}
            activeOpacity={onPress ? 0.8 : 1}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, padding: 16, paddingBottom: 8 }}>
                {Icon && <Icon size={20} color={isDark ? COLORS.primaryLight : COLORS.primaryDark} style={{ marginRight: 8 }} />}
                <Text style={{
                    color: isDark ? COLORS.textDark : COLORS.text,
                    fontWeight: 'bold',
                    fontSize: 18,
                    flex: 1
                }}>
                    {title}
                </Text>
            </View>
            <View style={{ padding: 16, paddingTop: 0 }}>
                {children}
            </View>
        </CardContainer>
    );
}; 