import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS } from '../constants/colors';

interface ButtonProps {
    children: React.ReactNode;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    disabled?: boolean;
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onPress,
    variant = 'primary',
    icon: IconComponent,
    iconPosition = 'left',
    disabled = false,
    fullWidth = false,
    style,
    textStyle,
}) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

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
            return isDark ? COLORS.textDark : COLORS.text;
        }
        return 'white';
    };

    const buttonStyles = getButtonStyles();
    const textColor = getTextColor();

    return (
        <TouchableOpacity
            style={[buttonStyles, style]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
        >
            {IconComponent && iconPosition === 'left' && (
                <IconComponent
                    size={18}
                    color={textColor}
                    style={{ marginRight: 8 }}
                />
            )}
            <Text
                style={[
                    {
                        color: textColor,
                        fontWeight: 'bold',
                        fontSize: 16,
                    },
                    textStyle
                ]}
            >
                {children}
            </Text>
            {IconComponent && iconPosition === 'right' && (
                <IconComponent
                    size={18}
                    color={textColor}
                    style={{ marginLeft: 8 }}
                />
            )}
        </TouchableOpacity>
    );
}; 