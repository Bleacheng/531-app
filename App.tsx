import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider, View } from '@tamagui/core';
import { useState } from 'react';
import tamaguiConfig from './tamagui.config';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { SettingsProvider } from './src/contexts/SettingsContext';
import { Header } from './src/components/Header';
import { Footer } from './src/components/Footer';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { COLORS } from './src/constants/colors';

type Screen = 'home' | 'profile' | 'settings';

// Main app content component
const AppContent = () => {
  const { resolvedTheme } = useTheme();
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const isDark = resolvedTheme === 'dark';

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View
      flex={1}
      backgroundColor={isDark ? COLORS.backgroundDark : COLORS.background}
    >
      {currentScreen === 'home' && (
        <Header
          title="531 App"
          subtitle="Your strength training companion"
        />
      )}
      <View flex={1}>
        {renderScreen()}
      </View>
      <Footer
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
      />
      <StatusBar style={isDark ? "light" : "dark"} />
    </View>
  );
};

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <ThemeProvider>
        <SettingsProvider>
          <AppContent />
        </SettingsProvider>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
