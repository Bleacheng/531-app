import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider, View } from '@tamagui/core';
import tamaguiConfig from './tamagui.config';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { Header } from './src/components/Header';
import { HomeScreen } from './src/screens/HomeScreen';
import { useTheme } from './src/contexts/ThemeContext';
import { COLORS } from './src/constants/colors';

// Main app content component
const AppContent = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View
      flex={1}
      backgroundColor={isDark ? COLORS.backgroundDark : COLORS.background}
    >
      <Header
        title="531 App"
        subtitle="Your strength training companion"
      />
      <HomeScreen />
      <StatusBar style={isDark ? "light" : "dark"} />
    </View>
  );
};

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </TamaguiProvider>
  );
}
