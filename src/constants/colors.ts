export const COLORS = {
    // Primary colors - Vibrant orange
    primary: '#f97316', // Orange-500
    primaryLight: '#fb923c', // Orange-400
    primaryDark: '#ea580c', // Orange-600

    // Secondary colors - Deep orange/amber
    secondary: '#f59e0b', // Amber-500
    secondaryLight: '#fbbf24', // Amber-400
    secondaryDark: '#d97706', // Amber-600

    // Accent colors - Warm yellow
    accent: '#eab308', // Yellow-500
    accentLight: '#facc15', // Yellow-400
    accentDark: '#ca8a04', // Yellow-600

    // Complementary colors - Teal for contrast
    complementary: '#14b8a6', // Teal-500
    complementaryLight: '#5eead4', // Teal-400
    complementaryDark: '#0d9488', // Teal-600

    // Success colors - Green with orange tint
    success: '#22c55e', // Green-500
    successLight: '#4ade80', // Green-400
    successDark: '#16a34a', // Green-600

    // Warning colors - Orange-red
    warning: '#f97316', // Orange-500
    warningLight: '#fb923c', // Orange-400
    warningDark: '#ea580c', // Orange-600

    // Error colors - Red-orange
    error: '#ef4444', // Red-500
    errorLight: '#f87171', // Red-400
    errorDark: '#dc2626', // Red-600

    // Neutral colors for light theme - Warm whites and grays
    background: '#ffffff',
    backgroundSecondary: '#fefefe',
    backgroundTertiary: '#fafafa',
    border: '#f3f4f6',
    borderSecondary: '#e5e7eb',
    text: '#1f2937',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',

    // Neutral colors for dark theme - Deep grays with orange tint
    backgroundDark: '#0f172a',
    backgroundSecondaryDark: '#1e293b',
    backgroundTertiaryDark: '#334155',
    borderDark: '#475569',
    borderSecondaryDark: '#64748b',
    textDark: '#f8fafc',
    textSecondaryDark: '#cbd5e1',
    textTertiaryDark: '#94a3b8',
} as const;

export type ColorKey = keyof typeof COLORS; 