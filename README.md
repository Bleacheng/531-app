# 5/3/1 Workout App

A React Native app for tracking 5/3/1 workout program progress with cycle management, workout scheduling, and progress tracking.

## Features

- **5/3/1 Program Management**: Complete cycle and week tracking
- **Workout Scheduling**: Schedule exercises for specific days of the week
- **Progress Tracking**: Track workout completion and performance
- **Weight Calculations**: Automatic weight calculations based on training max
- **Data Export**: Export workout history and personal records
- **Dark/Light Theme**: Theme support with automatic system detection

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- EAS CLI (for builds)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd 531-app
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

## EAS Cloud Build Setup

### 1. Install EAS CLI

```bash
npm install -g @expo/eas-cli
```

### 2. Login to Expo

```bash
eas login
```

### 3. Configure EAS Build

The project already includes a basic `eas.json` configuration. You can customize it based on your needs:

```json
{
  "cli": {
    "version": ">= 16.13.2",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 4. Build Commands

#### Development Build (for testing)

```bash
eas build --platform android --profile development
eas build --platform ios --profile development
```

#### Preview Build (for internal testing)

```bash
eas build --platform android --profile preview
eas build --platform ios --profile preview
```

#### Production Build

```bash
eas build --platform android --profile production
eas build --platform ios --profile production
```

### 5. Build for Both Platforms

```bash
eas build --platform all --profile production
```

### 6. Monitor Build Status

```bash
eas build:list
```

### 7. Download Build

After the build completes, you can download it:

```bash
eas build:download
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── constants/          # App constants and colors
├── contexts/           # React contexts for state management
├── screens/            # Main app screens
└── utils/              # Utility functions
```

## Key Components

- **HomeScreen**: Main dashboard with week plan and cycle overview
- **SettingsScreen**: App configuration and workout setup
- **HistoryScreen**: Workout history and progress tracking
- **SettingsContext**: Global state management for app settings

## Workout Program Features

### 5/3/1 Program Structure

- **Week 1**: 5/5/5+ (65%, 75%, 85%)
- **Week 2**: 3/3/3+ (70%, 80%, 90%)
- **Week 3**: 5/3/1+ (75%, 85%, 95%)
- **Week 4**: Deload (40%, 50%, 60%)

### Exercise Management

- Bench Press
- Squat
- Deadlift
- Overhead Press

### Cycle Management

- Automatic cycle progression
- Training max calculations
- Exercise progression tracking

## Data Management

The app uses AsyncStorage for local data persistence:

- Workout schedule
- Exercise progression
- One-rep max values
- Training max percentage
- Workout history
- App settings

## Development

### Running Locally

```bash
npm start
```

### Running on Device

```bash
npm run android
npm run ios
```

### Building for Production

```bash
eas build --platform all --profile production
```

## Troubleshooting

### Common Issues

1. **Build Fails**: Check that all dependencies are properly installed
2. **EAS Login Issues**: Ensure you have the correct Expo account credentials
3. **Platform-specific Issues**: Some features may work differently on iOS vs Android

### Getting Help

- Check the [Expo documentation](https://docs.expo.dev/)
- Review [EAS Build documentation](https://docs.expo.dev/build/introduction/)
- Check the [React Native documentation](https://reactnative.dev/)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
