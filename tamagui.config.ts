import { createTamagui, createTokens } from '@tamagui/core'
import { config } from '@tamagui/config/v2'
import { themes } from '@tamagui/themes'

// Create custom tokens for our unique orange-based color palette
const tokens = createTokens({
  color: {
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
  },
  space: {
    $0: 0,
    $1: 4,
    $2: 8,
    $3: 12,
    $4: 16,
    $5: 20,
    $6: 24,
    $7: 28,
    $8: 32,
    $9: 36,
    $10: 40,
  },
  size: {
    $0: 0,
    $1: 4,
    $2: 8,
    $3: 12,
    $4: 16,
    $5: 20,
    $6: 24,
    $7: 28,
    $8: 32,
    $9: 36,
    $10: 40,
  },
  radius: {
    $0: 0,
    $1: 4,
    $2: 8,
    $3: 12,
    $4: 16,
    $5: 20,
  },
  zIndex: {
    $0: 0,
    $1: 100,
    $2: 200,
    $3: 300,
    $4: 400,
    $5: 500,
  },
})

// Create custom themes
const customThemes = {
  light: {
    background: tokens.color.background,
    backgroundSecondary: tokens.color.backgroundSecondary,
    backgroundTertiary: tokens.color.backgroundTertiary,
    border: tokens.color.border,
    borderSecondary: tokens.color.borderSecondary,
    text: tokens.color.text,
    textSecondary: tokens.color.textSecondary,
    textTertiary: tokens.color.textTertiary,
    primary: tokens.color.primary,
    primaryLight: tokens.color.primaryLight,
    primaryDark: tokens.color.primaryDark,
    secondary: tokens.color.secondary,
    secondaryLight: tokens.color.secondaryLight,
    secondaryDark: tokens.color.secondaryDark,
    accent: tokens.color.accent,
    accentLight: tokens.color.accentLight,
    accentDark: tokens.color.accentDark,
    complementary: tokens.color.complementary,
    complementaryLight: tokens.color.complementaryLight,
    complementaryDark: tokens.color.complementaryDark,
    success: tokens.color.success,
    successLight: tokens.color.successLight,
    successDark: tokens.color.successDark,
    warning: tokens.color.warning,
    warningLight: tokens.color.warningLight,
    warningDark: tokens.color.warningDark,
    error: tokens.color.error,
    errorLight: tokens.color.errorLight,
    errorDark: tokens.color.errorDark,
  },
  dark: {
    background: tokens.color.backgroundDark,
    backgroundSecondary: tokens.color.backgroundSecondaryDark,
    backgroundTertiary: tokens.color.backgroundTertiaryDark,
    border: tokens.color.borderDark,
    borderSecondary: tokens.color.borderSecondaryDark,
    text: tokens.color.textDark,
    textSecondary: tokens.color.textSecondaryDark,
    textTertiary: tokens.color.textTertiaryDark,
    primary: tokens.color.primaryLight,
    primaryLight: tokens.color.primary,
    primaryDark: tokens.color.primaryDark,
    secondary: tokens.color.secondaryLight,
    secondaryLight: tokens.color.secondary,
    secondaryDark: tokens.color.secondaryDark,
    accent: tokens.color.accentLight,
    accentLight: tokens.color.accent,
    accentDark: tokens.color.accentDark,
    complementary: tokens.color.complementaryLight,
    complementaryLight: tokens.color.complementary,
    complementaryDark: tokens.color.complementaryDark,
    success: tokens.color.successLight,
    successLight: tokens.color.success,
    successDark: tokens.color.successDark,
    warning: tokens.color.warningLight,
    warningLight: tokens.color.warning,
    warningDark: tokens.color.warningDark,
    error: tokens.color.errorLight,
    errorLight: tokens.color.error,
    errorDark: tokens.color.errorDark,
  },
}

const tamaguiConfig = createTamagui({
  ...config,
  tokens,
  themes: {
    ...themes,
    ...customThemes,
  },
})

export default tamaguiConfig 