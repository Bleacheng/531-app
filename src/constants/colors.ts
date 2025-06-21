export const COLORS = {
    // Primary colors - Monotone grays
    primary: '#374151', // Gray-700
    primaryLight: '#6b7280', // Gray-500
    primaryDark: '#1f2937', // Gray-800

    // Secondary colors - Lighter grays
    secondary: '#9ca3af', // Gray-400
    secondaryLight: '#d1d5db', // Gray-300
    secondaryDark: '#6b7280', // Gray-500

    // Accent colors - Dark grays
    accent: '#4b5563', // Gray-600
    accentLight: '#6b7280', // Gray-500
    accentDark: '#374151', // Gray-700

    // Complementary colors - Medium grays
    complementary: '#6b7280', // Gray-500
    complementaryLight: '#9ca3af', // Gray-400
    complementaryDark: '#4b5563', // Gray-600

    // Status colors - Red, Yellow, Green
    success: '#22c55e', // Green-500
    successLight: '#4ade80', // Green-400
    successDark: '#16a34a', // Green-600

    warning: '#eab308', // Yellow-500
    warningLight: '#facc15', // Yellow-400
    warningDark: '#ca8a04', // Yellow-600

    error: '#ef4444', // Red-500
    errorLight: '#f87171', // Red-400
    errorDark: '#dc2626', // Red-600

    // Neutral colors for light theme - Whites and light grays
    background: '#ffffff',
    backgroundSecondary: '#f9fafb', // Gray-50
    backgroundTertiary: '#f3f4f6', // Gray-100
    border: '#e5e7eb', // Gray-200
    borderSecondary: '#d1d5db', // Gray-300
    text: '#111827', // Gray-900
    textSecondary: '#6b7280', // Gray-500
    textTertiary: '#9ca3af', // Gray-400

    // Neutral colors for dark theme - Blacks and dark grays
    backgroundDark: '#000000',
    backgroundSecondaryDark: '#111827', // Gray-900
    backgroundTertiaryDark: '#1f2937', // Gray-800
    borderDark: '#374151', // Gray-700
    borderSecondaryDark: '#4b5563', // Gray-600
    textDark: '#f9fafb', // Gray-50
    textSecondaryDark: '#d1d5db', // Gray-300
    textTertiaryDark: '#9ca3af', // Gray-400
} as const;

export type ColorKey = keyof typeof COLORS; 