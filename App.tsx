import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider, View, Text, Stack } from '@tamagui/core';
import { TouchableOpacity, ScrollView } from 'react-native';
import tamaguiConfig from './tamagui.config';
import { ThemeProvider, useTheme } from './ThemeContext';

// Theme-aware component
const AppContent = () => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <View
      flex={1}
      backgroundColor={isDark ? '$backgroundDark' : '$background'}
    >
      {/* Header with orange gradient effect */}
      <View
        padding={20}
        backgroundColor={isDark ? '#ea580c' : '#f97316'}
        paddingTop={60}
        borderBottomLeftRadius={20}
        borderBottomRightRadius={20}
        style={{
          shadowColor: isDark ? '#ea580c' : '#f97316',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <Stack>
            <Text
              fontSize={28}
              color="white"
              fontWeight="bold"
              marginBottom={5}
            >
              531 App
            </Text>
            <Text
              color={isDark ? '#cbd5e1' : '#6b7280'}
              fontSize={16}
            >
              Your strength training companion
            </Text>
          </Stack>

          {/* Theme Toggle Button with orange accent */}
          <TouchableOpacity
            onPress={toggleTheme}
            style={{
              backgroundColor: isDark ? '#facc15' : '#eab308',
              padding: 12,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: isDark ? '#eab308' : '#ca8a04',
              shadowColor: isDark ? '#facc15' : '#eab308',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Text
              color="white"
              fontSize={16}
              fontWeight="bold"
            >
              {isDark ? '☀️' : '🌙'}
            </Text>
          </TouchableOpacity>
        </Stack>
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* Quick Actions with orange theme */}
        <View
          backgroundColor={isDark ? '#1e293b' : '#fefefe'}
          padding={20}
          borderRadius={16}
          marginBottom={20}
          borderWidth={2}
          borderColor={isDark ? '#fb923c' : '#f97316'}
          style={{
            shadowColor: isDark ? '#fb923c' : '#f97316',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Stack flexDirection="row" alignItems="center" marginBottom={15}>
            <View
              backgroundColor={isDark ? '#facc15' : '#eab308'}
              width={8}
              height={24}
              borderRadius={4}
              marginRight={12}
            />
            <Text
              fontSize={20}
              fontWeight="bold"
              color={isDark ? '#f8fafc' : '#1f2937'}
            >
              Quick Start
            </Text>
          </Stack>
          <Stack flexDirection="row" gap={10}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: isDark ? '#fb923c' : '#f97316',
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                shadowColor: isDark ? '#fb923c' : '#f97316',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Text color="white" fontWeight="bold" fontSize={16}>
                Start Workout
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                borderWidth: 2,
                borderColor: isDark ? '#fbbf24' : '#f59e0b',
              }}
            >
              <Text
                color={isDark ? '#fbbf24' : '#f59e0b'}
                fontWeight="bold"
                fontSize={16}
              >
                View History
              </Text>
            </TouchableOpacity>
          </Stack>
        </View>

        {/* Today's Workout with amber accents */}
        <View
          backgroundColor={isDark ? '#1e293b' : '#fefefe'}
          padding={20}
          borderRadius={16}
          marginBottom={20}
          borderWidth={2}
          borderColor={isDark ? '#fbbf24' : '#f59e0b'}
          style={{
            shadowColor: isDark ? '#fbbf24' : '#f59e0b',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Stack flexDirection="row" alignItems="center" marginBottom={15}>
            <View
              backgroundColor={isDark ? '#fbbf24' : '#f59e0b'}
              width={8}
              height={24}
              borderRadius={4}
              marginRight={12}
            />
            <Text
              fontSize={20}
              fontWeight="bold"
              color={isDark ? '#f8fafc' : '#1f2937'}
            >
              Today's Workout
            </Text>
          </Stack>
          <Text
            color={isDark ? '#cbd5e1' : '#6b7280'}
            marginBottom={15}
            fontSize={16}
          >
            Week 1 - Cycle 1
          </Text>
          <Stack gap={12}>
            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
              <Text
                fontSize={16}
                color={isDark ? '#f8fafc' : '#1f2937'}
                fontWeight="500"
              >
                Bench Press
              </Text>
              <View
                backgroundColor={isDark ? '#5eead4' : '#14b8a6'}
                paddingHorizontal={12}
                paddingVertical={6}
                borderRadius={8}
              >
                <Text
                  fontWeight="bold"
                  color="white"
                  fontSize={14}
                >
                  5/3/1
                </Text>
              </View>
            </Stack>
            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
              <Text
                fontSize={16}
                color={isDark ? '#f8fafc' : '#1f2937'}
                fontWeight="500"
              >
                Overhead Press
              </Text>
              <View
                backgroundColor={isDark ? '#5eead4' : '#14b8a6'}
                paddingHorizontal={12}
                paddingVertical={6}
                borderRadius={8}
              >
                <Text
                  fontWeight="bold"
                  color="white"
                  fontSize={14}
                >
                  5/3/1
                </Text>
              </View>
            </Stack>
            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
              <Text
                fontSize={16}
                color={isDark ? '#f8fafc' : '#1f2937'}
                fontWeight="500"
              >
                Deadlift
              </Text>
              <View
                backgroundColor={isDark ? '#5eead4' : '#14b8a6'}
                paddingHorizontal={12}
                paddingVertical={6}
                borderRadius={8}
              >
                <Text
                  fontWeight="bold"
                  color="white"
                  fontSize={14}
                >
                  5/3/1
                </Text>
              </View>
            </Stack>
            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
              <Text
                fontSize={16}
                color={isDark ? '#f8fafc' : '#1f2937'}
                fontWeight="500"
              >
                Squat
              </Text>
              <View
                backgroundColor={isDark ? '#5eead4' : '#14b8a6'}
                paddingHorizontal={12}
                paddingVertical={6}
                borderRadius={8}
              >
                <Text
                  fontWeight="bold"
                  color="white"
                  fontSize={14}
                >
                  5/3/1
                </Text>
              </View>
            </Stack>
          </Stack>
        </View>

        {/* Recent Progress with success colors */}
        <View
          backgroundColor={isDark ? '#1e293b' : '#fefefe'}
          padding={20}
          borderRadius={16}
          marginBottom={20}
          borderWidth={2}
          borderColor={isDark ? '#4ade80' : '#22c55e'}
          style={{
            shadowColor: isDark ? '#4ade80' : '#22c55e',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Stack flexDirection="row" alignItems="center" marginBottom={15}>
            <View
              backgroundColor={isDark ? '#4ade80' : '#22c55e'}
              width={8}
              height={24}
              borderRadius={4}
              marginRight={12}
            />
            <Text
              fontSize={20}
              fontWeight="bold"
              color={isDark ? '#f8fafc' : '#1f2937'}
            >
              Recent Progress
            </Text>
          </Stack>
          <Stack gap={12}>
            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
              <Text
                fontSize={16}
                color={isDark ? '#f8fafc' : '#1f2937'}
                fontWeight="500"
              >
                Bench Press 1RM
              </Text>
              <View
                backgroundColor={isDark ? '#4ade80' : '#22c55e'}
                paddingHorizontal={12}
                paddingVertical={6}
                borderRadius={8}
              >
                <Text
                  fontWeight="bold"
                  color="white"
                  fontSize={14}
                >
                  +5 lbs
                </Text>
              </View>
            </Stack>
            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
              <Text
                fontSize={16}
                color={isDark ? '#f8fafc' : '#1f2937'}
                fontWeight="500"
              >
                Deadlift 1RM
              </Text>
              <View
                backgroundColor={isDark ? '#4ade80' : '#22c55e'}
                paddingHorizontal={12}
                paddingVertical={6}
                borderRadius={8}
              >
                <Text
                  fontWeight="bold"
                  color="white"
                  fontSize={14}
                >
                  +10 lbs
                </Text>
              </View>
            </Stack>
          </Stack>
        </View>

        {/* Theme Info Card with orange accent */}
        <View
          backgroundColor={isDark ? '#334155' : '#fafafa'}
          padding={20}
          borderRadius={16}
          marginBottom={20}
          borderWidth={2}
          borderColor={isDark ? '#facc15' : '#eab308'}
          style={{
            shadowColor: isDark ? '#facc15' : '#eab308',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Stack flexDirection="row" alignItems="center" marginBottom={15}>
            <View
              backgroundColor={isDark ? '#facc15' : '#eab308'}
              width={8}
              height={24}
              borderRadius={4}
              marginRight={12}
            />
            <Text
              fontSize={18}
              fontWeight="bold"
              color={isDark ? '#facc15' : '#eab308'}
            >
              Orange Theme Active
            </Text>
          </Stack>
          <Text
            fontSize={14}
            color={isDark ? '#cbd5e1' : '#6b7280'}
            lineHeight={20}
            marginBottom={10}
          >
            Current theme: {theme.charAt(0).toUpperCase() + theme.slice(1)} mode
          </Text>
          <Text
            fontSize={14}
            color={isDark ? '#cbd5e1' : '#6b7280'}
            lineHeight={20}
          >
            This beautiful orange color palette features vibrant oranges, warm ambers,
            and complementary teals. Tap the {isDark ? '☀️' : '🌙'} button to switch themes!
          </Text>
        </View>
      </ScrollView>

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
