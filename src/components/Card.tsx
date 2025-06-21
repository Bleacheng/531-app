import React from 'react';
import { View, Text, Stack } from '@tamagui/core';
import { TouchableOpacity } from 'react-native';
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

    const defaultBorderColor = isDark ? COLORS.primaryLight : COLORS.primary;
    const defaultBackgroundColor = isDark ? COLORS.backgroundSecondaryDark : COLORS.backgroundSecondary;

    const cardContent = (
        <View
            backgroundColor={backgroundColor || defaultBackgroundColor}
            padding={20}
            borderRadius={16}
            marginBottom={20}
            borderWidth={2}
            borderColor={borderColor || defaultBorderColor}
            style={{
                shadowColor: borderColor || defaultBorderColor,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
            }}
        >
            <Stack flexDirection="row" alignItems="center" marginBottom={15}>
                {Icon && (
                    <View
                        backgroundColor={borderColor || defaultBorderColor}
                        width={8}
                        height={24}
                        borderRadius={4}
                        marginRight={12}
                    />
                )}
                <Text
                    fontSize={20}
                    fontWeight="bold"
                    color={isDark ? COLORS.textDark : COLORS.text}
                >
                    {title}
                </Text>
            </Stack>
            {children}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
                {cardContent}
            </TouchableOpacity>
        );
    }

    return cardContent;
}; 