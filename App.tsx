import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { SettingsProvider } from './src/contexts/SettingsContext';
import { Header } from './src/components/Header';
import { Footer } from './src/components/Footer';
import { HomeScreen } from './src/screens/HomeScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { COLORS } from './src/constants/colors';
import { WorkoutSessionProvider } from './src/contexts/WorkoutSessionContext';

type Screen = 'home' | 'profile' | 'settings';

// Main app content component
const AppContent = () => {
  const { theme } = useTheme();
  const [currentScreen, setCurrentScreen] = React.useState<Screen>('home');
  const isDark = theme === 'dark';

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} />;
      case 'profile':
        return <HistoryScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDark ? COLORS.backgroundDark : COLORS.background,
      }}
      edges={['left', 'right']}
    >
      {currentScreen === 'home' && (
        <Header
          title="531 App"
          subtitle="Uh vro can i get uuuuuh"
        />
      )}
      {currentScreen === 'profile' && (
        <Header
          title="History"
          subtitle="Your workout progress"
        />
      )}
      {currentScreen === 'settings' && (
        <Header
          title="Settings"
          subtitle="App preferences"
        />
      )}
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        {renderScreen()}
      </View>
      <Footer
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
      />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </SafeAreaView>
  );
};

// ThemeWrapper: gets theme from context and passes to PaperProvider
const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const paperTheme = theme === 'dark' ? MD3DarkTheme : MD3LightTheme;
  return <PaperProvider theme={paperTheme}>{children}</PaperProvider>;
};

export default function App() {
  return (
    <WorkoutSessionProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeProvider>
            <ThemeWrapper>
              <SettingsProvider>
                <AppContent />
              </SettingsProvider>
            </ThemeWrapper>
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </WorkoutSessionProvider>
  );
}
