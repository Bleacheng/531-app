import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Card as PaperCard, Text } from 'react-native-paper';
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
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    return (
        <PaperCard
            style={{
                borderColor: borderColor || (isDark ? COLORS.borderDark : COLORS.border),
                backgroundColor: backgroundColor || (isDark ? COLORS.backgroundSecondaryDark : COLORS.backgroundSecondary),
                borderWidth: 1,
                borderRadius: 12,
                marginBottom: 16,
                elevation: 2,
            }}
            onPress={onPress}
        >
            <PaperCard.Content style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                {Icon && <Icon size={20} color={isDark ? COLORS.primaryLight : COLORS.primaryDark} style={{ marginRight: 8 }} />}
                <Text variant="titleMedium" style={{ color: isDark ? COLORS.textDark : COLORS.text, fontWeight: 'bold' }}>{title}</Text>
            </PaperCard.Content>
            <PaperCard.Content>
                {children}
            </PaperCard.Content>
        </PaperCard>
    );
}; 