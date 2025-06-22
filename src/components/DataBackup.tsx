import React, { useState } from 'react';
import { Alert, Share, Platform } from 'react-native';
import { Stack, Text } from '@tamagui/core';
import { Download, Upload, FileText, AlertTriangle, CheckCircle } from 'lucide-react-native';
import { Card } from './Card';
import { Button } from './Button';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS } from '../constants/colors';
import {
    exportAppData,
    importAppData,
    generateBackupFilename,
    validateImportData,
    getDataSummary,
    type AppData
} from '../utils/dataExport';

interface DataBackupProps {
    onDataImported?: () => void;
}

export const DataBackup: React.FC<DataBackupProps> = ({ onDataImported }) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const data = await exportAppData();
            const jsonString = JSON.stringify(data, null, 2);
            const filename = generateBackupFilename();

            if (Platform.OS === 'web') {
                // For web, create a download link
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } else {
                // For mobile, use Share API
                await Share.share({
                    message: jsonString,
                    title: '5/3/1 Workout Backup',
                });
            }

            Alert.alert(
                'Export Successful',
                'Your workout data has been exported successfully.',
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Export error:', error);
            Alert.alert(
                'Export Failed',
                'Failed to export your workout data. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsExporting(false);
        }
    };

    const handleImport = async () => {
        // For this example, we'll simulate file selection
        // In a real app, you'd use a file picker library like react-native-document-picker
        Alert.alert(
            'Import Data',
            'To import data, please paste the JSON content in the next dialog.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Continue',
                    onPress: () => promptForJsonData()
                }
            ]
        );
    };

    const promptForJsonData = () => {
        // This is a simplified approach for demonstration
        // In a real app, you'd use a proper file picker
        Alert.prompt(
            'Paste JSON Data',
            'Please paste your exported workout data JSON:',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Import',
                    onPress: (jsonString) => {
                        if (jsonString) {
                            processImportData(jsonString);
                        }
                    }
                }
            ],
            'plain-text'
        );
    };

    const processImportData = async (jsonString: string) => {
        setIsImporting(true);
        try {
            const data = JSON.parse(jsonString);

            if (!validateImportData(data)) {
                throw new Error('Invalid data format');
            }

            const summary = getDataSummary(data);

            Alert.alert(
                'Confirm Import',
                `This will import:\n\n` +
                `• ${summary.totalWorkouts} workouts\n` +
                `• ${summary.totalPRs} personal records\n` +
                `• Current progress: Cycle ${summary.currentProgress.cycle}, Week ${summary.currentProgress.week}\n\n` +
                `This will replace all existing data. Continue?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Import',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                await importAppData(data);
                                Alert.alert(
                                    'Import Successful',
                                    'Your workout data has been imported successfully. The app will restart to apply changes.',
                                    [{ text: 'OK' }]
                                );
                                onDataImported?.();
                            } catch (error) {
                                console.error('Import error:', error);
                                Alert.alert(
                                    'Import Failed',
                                    'Failed to import the data. Please check the format and try again.',
                                    [{ text: 'OK' }]
                                );
                            }
                        }
                    }
                ]
            );
        } catch (error) {
            console.error('Import processing error:', error);
            Alert.alert(
                'Invalid Data',
                'The provided data is not in the correct format. Please check your backup file.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <Card
            title="Data Backup & Restore"
            borderColor={isDark ? COLORS.warningLight : COLORS.warning}
        >
            <Stack flexDirection="row" alignItems="center" marginBottom={15}>
                <FileText size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                <Text
                    color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                    marginLeft={8}
                    fontSize={14}
                >
                    Export or import your workout data
                </Text>
            </Stack>

            {/* Export Section */}
            <Stack marginBottom={20}>
                <Stack flexDirection="row" alignItems="center" marginBottom={12}>
                    <Download size={16} color={isDark ? COLORS.success : COLORS.successDark} />
                    <Text
                        fontSize={16}
                        fontWeight="600"
                        color={isDark ? COLORS.textDark : COLORS.text}
                        marginLeft={8}
                    >
                        Export Data
                    </Text>
                </Stack>
                <Text
                    fontSize={14}
                    color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                    marginBottom={12}
                >
                    Create a backup of all your workout data, settings, and progress. This includes:
                </Text>
                <Stack gap={4} marginBottom={12}>
                    <Text
                        fontSize={12}
                        color={isDark ? COLORS.textTertiaryDark : COLORS.textTertiary}
                    >
                        • Workout history and completed sessions
                    </Text>
                    <Text
                        fontSize={12}
                        color={isDark ? COLORS.textTertiaryDark : COLORS.textTertiary}
                    >
                        • Personal records and training maxes
                    </Text>
                    <Text
                        fontSize={12}
                        color={isDark ? COLORS.textTertiaryDark : COLORS.textTertiary}
                    >
                        • App settings and workout schedule
                    </Text>
                    <Text
                        fontSize={12}
                        color={isDark ? COLORS.textTertiaryDark : COLORS.textTertiary}
                    >
                        • Current cycle and week progress
                    </Text>
                </Stack>
                <Button
                    title={isExporting ? "Exporting..." : "Export Data"}
                    onPress={handleExport}
                    variant="primary"
                    fullWidth
                    disabled={isExporting}
                    icon={isExporting ? undefined : Download}
                />
            </Stack>

            {/* Import Section */}
            <Stack>
                <Stack flexDirection="row" alignItems="center" marginBottom={12}>
                    <Upload size={16} color={isDark ? COLORS.warning : COLORS.warningDark} />
                    <Text
                        fontSize={16}
                        fontWeight="600"
                        color={isDark ? COLORS.textDark : COLORS.text}
                        marginLeft={8}
                    >
                        Import Data
                    </Text>
                </Stack>
                <Text
                    fontSize={14}
                    color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                    marginBottom={12}
                >
                    Restore your workout data from a previous backup. This will replace all current data.
                </Text>

                {/* Warning */}
                <Stack
                    style={{
                        backgroundColor: isDark ? COLORS.warningDark + '20' : COLORS.warning + '20',
                        padding: 12,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: isDark ? COLORS.warning : COLORS.warningDark,
                        marginBottom: 12,
                    }}
                >
                    <Stack flexDirection="row" alignItems="center" marginBottom={4}>
                        <AlertTriangle size={14} color={isDark ? COLORS.warning : COLORS.warningDark} />
                        <Text
                            fontSize={12}
                            fontWeight="600"
                            color={isDark ? COLORS.warning : COLORS.warningDark}
                            marginLeft={6}
                        >
                            Warning
                        </Text>
                    </Stack>
                    <Text
                        fontSize={12}
                        color={isDark ? COLORS.warning : COLORS.warningDark}
                    >
                        Importing will replace all existing data. Make sure to export your current data first if you want to keep it.
                    </Text>
                </Stack>

                <Button
                    title={isImporting ? "Importing..." : "Import Data"}
                    onPress={handleImport}
                    variant="outline"
                    fullWidth
                    disabled={isImporting}
                    icon={isImporting ? undefined : Upload}
                />
            </Stack>

            {/* Info */}
            <Stack
                style={{
                    backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                    padding: 12,
                    borderRadius: 8,
                    marginTop: 16,
                }}
            >
                <Stack flexDirection="row" alignItems="center" marginBottom={4}>
                    <CheckCircle size={14} color={isDark ? COLORS.success : COLORS.successDark} />
                    <Text
                        fontSize={12}
                        fontWeight="600"
                        color={isDark ? COLORS.success : COLORS.successDark}
                        marginLeft={6}
                    >
                        Data Format
                    </Text>
                </Stack>
                <Text
                    fontSize={12}
                    color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                >
                    Your data is exported as JSON, which is human-readable and can be opened in any text editor.
                    This format ensures compatibility across different devices and app versions.
                </Text>
            </Stack>
        </Card>
    );
}; 