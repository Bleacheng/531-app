import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS } from '../constants/colors';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    disabled?: boolean;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    icon: Icon,
    iconPosition = 'left',
    disabled = false,
    fullWidth = false,
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const getButtonStyles = () => {
        let baseStyles: any = {
            padding: 16,
            borderRadius: 12,
            alignItems: 'center' as const,
            flexDirection: 'row' as const,
            justifyContent: 'center' as const,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 4,
            opacity: disabled ? 0.6 : 1,
        };

        if (fullWidth) {
            baseStyles.flex = 1;
        }

        switch (variant) {
            case 'primary':
                return {
                    ...baseStyles,
                    backgroundColor: isDark ? COLORS.primaryLight : COLORS.primary,
                    shadowColor: isDark ? COLORS.primaryLight : COLORS.primary,
                };
            case 'secondary':
                return {
                    ...baseStyles,
                    backgroundColor: isDark ? COLORS.secondaryLight : COLORS.secondary,
                    shadowColor: isDark ? COLORS.secondaryLight : COLORS.secondary,
                };
            case 'outline':
                return {
                    ...baseStyles,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderColor: isDark ? COLORS.secondaryLight : COLORS.secondary,
                    shadowColor: 'transparent',
                    elevation: 0,
                };
            default:
                return baseStyles;
        }
    };

    const getTextColor = () => {
        if (variant === 'outline') {
            return isDark ? COLORS.secondaryLight : COLORS.secondary;
        }
        return 'white';
    };

    const buttonStyles = getButtonStyles();
    const textColor = getTextColor();

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
        >
            {Icon && iconPosition === 'left' && (
                <Icon
                    size={18}
                    color={textColor}
                    style={{ marginRight: 8 }}
                />
            )}
            <Text
                style={{
                    color: textColor,
                    fontWeight: 'bold',
                    fontSize: 16
                }}
            >
                {title}
            </Text>
            {Icon && iconPosition === 'right' && (
                <Icon
                    size={18}
                    color={textColor}
                    style={{ marginLeft: 8 }}
                />
            )}
        </TouchableOpacity>
    );
}; 