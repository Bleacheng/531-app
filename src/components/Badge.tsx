import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS } from '../constants/colors';

interface BadgeProps {
    label: string;
    variant?: 'primary' | 'secondary' | 'success' | 'complementary';
    size?: 'small' | 'medium' | 'large';
}

export const Badge: React.FC<BadgeProps> = ({
    label,
    variant = 'primary',
    size = 'medium'
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const getBadgeStyles = () => {
        const baseStyles = {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
        };

        // Size variations
        switch (size) {
            case 'small':
                baseStyles.paddingHorizontal = 8;
                baseStyles.paddingVertical = 4;
                break;
            case 'large':
                baseStyles.paddingHorizontal = 16;
                baseStyles.paddingVertical = 8;
                break;
        }

        // Color variations
        switch (variant) {
            case 'primary':
                return {
                    ...baseStyles,
                    backgroundColor: isDark ? COLORS.primaryLight : COLORS.primary,
                };
            case 'secondary':
                return {
                    ...baseStyles,
                    backgroundColor: isDark ? COLORS.secondaryLight : COLORS.secondary,
                };
            case 'success':
                return {
                    ...baseStyles,
                    backgroundColor: isDark ? COLORS.successLight : COLORS.success,
                };
            case 'complementary':
                return {
                    ...baseStyles,
                    backgroundColor: isDark ? COLORS.complementaryLight : COLORS.complementary,
                };
            default:
                return baseStyles;
        }
    };

    const getTextSize = () => {
        switch (size) {
            case 'small':
                return 12;
            case 'large':
                return 16;
            default:
                return 14;
        }
    };

    const badgeStyles = getBadgeStyles();
    const textSize = getTextSize();

    return (
        <View style={badgeStyles}>
            <Text
                style={{
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: textSize
                }}
            >
                {label}
            </Text>
        </View>
    );
}; 