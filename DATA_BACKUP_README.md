# 5/3/1 Workout App - Data Backup & Restore

This document explains the data export/import system for the 5/3/1 Workout App.

## Overview

The app uses a **JSON-based data format** for backing up and restoring all workout data. This format is:
- **Human-readable** - You can open the backup files in any text editor
- **Cross-platform** - Works on any device or operating system
- **Version-controlled** - Includes version information for future compatibility
- **Comprehensive** - Includes all your workout data, settings, and progress

## What Gets Backed Up

### Settings
- **Units** (kg/lbs)
- **Theme** (system/light/dark)
- **Workout Schedule** (which day each exercise is performed)
- **Exercise Progression** (weight increases per cycle)

### Workout Data
- **Training Maxes** - Your current training maxes for each exercise
- **Personal Records** - All your PRs with dates and workout references
- **Workout History** - Complete workout sessions with:
  - Sets, reps, and weights
  - Notes and comments
  - Completion status
  - Cycle and week information

### Progress Tracking
- **Current Cycle** - Which 4-week cycle you're in
- **Current Week** - Which week of the current cycle (1-4)

## Data Format Structure

```json
{
  "version": "1.0.0",
  "exportDate": "2024-01-15T10:30:00.000Z",
  "settings": {
    "unit": "kg",
    "theme": "system",
    "workoutSchedule": {
      "benchPress": "Monday",
      "squat": "Tuesday",
      "deadlift": "Thursday",
      "overheadPress": "Friday"
    },
    "exerciseProgression": {
      "benchPress": 2.5,
      "squat": 5,
      "deadlift": 5,
      "overheadPress": 2.5
    }
  },
  "trainingMaxes": [...],
  "personalRecords": [...],
  "workoutHistory": [...],
  "currentCycle": 1,
  "currentWeek": 2
}
```

## How to Use

### Exporting Data

1. Go to **Settings** → **Data Backup & Restore**
2. Tap **"Export Data"**
3. Choose how to save the file:
   - **Web**: File will download automatically
   - **Mobile**: Use the Share menu to save to your preferred location

The file will be named: `531-workout-backup-YYYY-MM-DD.json`

### Importing Data

1. Go to **Settings** → **Data Backup & Restore**
2. Tap **"Import Data"**
3. Select your backup file
4. Review the data summary
5. Confirm the import

**⚠️ Warning**: Importing will replace all existing data. Export your current data first if you want to keep it.

### Resetting Settings

If you want to reset only the settings (not workout data):

1. Go to **Settings** → **Reset Settings**
2. Tap **"Reset All Settings"**
3. Confirm the reset

This will reset to default values:
- **Theme**: System
- **Units**: Kilograms (kg)
- **Workout Schedule**: Monday (Bench), Tuesday (Squat), Thursday (Deadlift), Friday (Press)
- **Exercise Progression**: 2.5kg for Bench/Press, 5kg for Squat/Deadlift

**Note**: This only affects settings, not your workout history or personal records.

## File Locations

### Recommended Storage Locations

- **Cloud Storage**: Google Drive, iCloud, Dropbox, OneDrive
- **Local Storage**: Documents folder, Downloads folder
- **Backup Services**: Time Machine (Mac), File History (Windows)

### File Naming Convention

- Format: `531-workout-backup-YYYY-MM-DD.json`
- Example: `531-workout-backup-2024-01-15.json`

## Data Security & Privacy

- **Local Storage**: All data is stored locally on your device
- **No Cloud Sync**: The app doesn't automatically sync to cloud services
- **Manual Control**: You choose when and where to store backups
- **No Personal Info**: The backup contains only workout data, no personal information

## Troubleshooting

### Common Issues

**"Invalid data format" error**
- Make sure you're importing a valid backup file
- Check that the file wasn't corrupted during transfer
- Verify the file has a `.json` extension

**"Import failed" error**
- Try exporting your current data first
- Restart the app and try again
- Check that you have sufficient storage space

**File not found**
- Ensure the backup file is in a location the app can access
- Try moving the file to a different folder
- Check file permissions

### Data Recovery

If you lose your data:
1. Check your backup files
2. Look in your cloud storage for recent backups
3. Check your device's backup service (Time Machine, etc.)
4. If no backup exists, you'll need to start fresh

## Technical Details

### File Size
- Typical backup files are 1-50 KB
- Size depends on number of workouts and notes
- Very lightweight and easy to share

### Compatibility
- **Version 1.0.0**: Current format
- **Future versions**: Will maintain backward compatibility
- **Cross-platform**: Works on iOS, Android, and web

### Data Validation
The app validates imported data to ensure:
- Required fields are present
- Data types are correct
- Values are within expected ranges
- File structure is valid

## Best Practices

### Regular Backups
- Export data weekly or after important workouts
- Keep multiple backup files
- Store backups in different locations

### Before Major Changes
- Export before updating the app
- Export before switching devices
- Export before factory reset

### File Management
- Use descriptive filenames with dates
- Organize backups in a dedicated folder
- Don't edit backup files manually

## Support

If you encounter issues with data backup/restore:
1. Check this documentation
2. Try the troubleshooting steps above
3. Contact support with your specific error message
4. Include the app version and device information

---

**Note**: This backup system is designed to be simple and reliable. The JSON format ensures your data will always be accessible, even if you can't use the app anymore. 