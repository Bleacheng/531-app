import React, { useState } from 'react';
import { Alert, Share, Platform, TouchableOpacity, View, Text, ScrollView, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { Download, Upload, FileText, AlertTriangle, CheckCircle, X } from 'lucide-react-native';
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
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [importModalVisible, setImportModalVisible] = useState(false);
    const [importData, setImportData] = useState<AppData | null>(null);

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

    const handleImport = () => {
        setImportModalVisible(true);
    };

    const processImportData = async (jsonString: string) => {
        setIsImporting(true);
        try {
            const data = JSON.parse(jsonString);

            if (!validateImportData(data)) {
                throw new Error('Invalid data format');
            }

            const summary = getDataSummary(data);
            setImportData(data);

            // Show confirmation modal with data summary
            setImportModalVisible(false);

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

    const confirmImport = async () => {
        if (!importData) return;

        try {
            await importAppData(importData);
            Alert.alert(
                'Import Successful',
                'Your workout data has been imported successfully. The app will restart to apply changes.',
                [{ text: 'OK' }]
            );
            onDataImported?.();
            setImportData(null);
        } catch (error) {
            console.error('Import error:', error);
            Alert.alert(
                'Import Failed',
                'Failed to import the data. Please check the format and try again.',
                [{ text: 'OK' }]
            );
        }
    };

    const renderImportModal = () => {
        return (
            <Modal
                isVisible={importModalVisible}
                onBackdropPress={() => setImportModalVisible(false)}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                }}
            >
                <View
                    style={{
                        backgroundColor: isDark ? COLORS.backgroundDark : COLORS.background,
                        borderRadius: 12,
                        padding: 20,
                        width: '100%',
                        maxWidth: 400,
                        maxHeight: Dimensions.get('window').height * 0.8,
                        minHeight: Dimensions.get('window').height * 0.6,
                        shadowColor: isDark ? COLORS.primaryDark : COLORS.primary,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 10,
                    }}
                >
                    {/* Header */}
                    <View style={{ marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                            <Upload size={24} color={isDark ? COLORS.warning : COLORS.warningDark} />
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    color: isDark ? COLORS.textDark : COLORS.text,
                                    marginLeft: 8,
                                }}
                            >
                                Import Data
                            </Text>
                        </View>
                        <Text
                            style={{
                                fontSize: 14,
                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                            }}
                        >
                            Paste your exported workout data JSON below to restore your data.
                        </Text>
                    </View>

                    {/* Content - Scrollable */}
                    <ScrollView
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={true}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    >
                        {/* Warning */}
                        <View
                            style={{
                                backgroundColor: isDark ? COLORS.warningDark + '20' : COLORS.warning + '20',
                                padding: 16,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: isDark ? COLORS.warning : COLORS.warningDark,
                                marginBottom: 20,
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <AlertTriangle size={16} color={isDark ? COLORS.warning : COLORS.warningDark} />
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '600',
                                        color: isDark ? COLORS.warning : COLORS.warningDark,
                                        marginLeft: 6,
                                    }}
                                >
                                    Warning
                                </Text>
                            </View>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: isDark ? COLORS.warning : COLORS.warningDark,
                                    lineHeight: 16,
                                }}
                            >
                                Importing will replace all existing data. Make sure to export your current data first if you want to keep it.
                            </Text>
                        </View>
                    </ScrollView>

                    {/* Import Button */}
                    <View style={{ gap: 12 }}>
                        <TouchableOpacity
                            onPress={() => {
                                // For this example, we'll simulate file selection
                                // In a real app, you'd use a file picker library like react-native-document-picker
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
                            }}
                            style={{
                                backgroundColor: isDark ? COLORS.primaryLight : COLORS.primary,
                                padding: 20,
                                borderRadius: 12,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.3,
                                shadowRadius: 4,
                                elevation: 4,
                            }}
                            activeOpacity={0.8}
                        >
                            <Upload size={32} color="white" />
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 12 }}>
                                Import Data
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setImportModalVisible(false)}
                            style={{
                                backgroundColor: 'transparent',
                                padding: 20,
                                borderRadius: 12,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                borderWidth: 2,
                                borderColor: isDark ? COLORS.borderDark : COLORS.border,
                            }}
                            activeOpacity={0.8}
                        >
                            <X size={32} color={isDark ? COLORS.textDark : COLORS.text} />
                            <Text style={{ color: isDark ? COLORS.textDark : COLORS.text, fontSize: 18, fontWeight: 'bold', marginLeft: 12 }}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    const renderConfirmImportModal = () => {
        if (!importData) return null;

        const summary = getDataSummary(importData);

        return (
            <Modal
                isVisible={!!importData}
                onBackdropPress={() => setImportData(null)}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                }}
            >
                <View
                    style={{
                        backgroundColor: isDark ? COLORS.backgroundDark : COLORS.background,
                        borderRadius: 12,
                        padding: 20,
                        width: '100%',
                        maxWidth: 400,
                        maxHeight: Dimensions.get('window').height * 0.8,
                        minHeight: Dimensions.get('window').height * 0.6,
                        shadowColor: isDark ? COLORS.primaryDark : COLORS.primary,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 10,
                    }}
                >
                    {/* Header */}
                    <View style={{ marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                            <Upload size={24} color={isDark ? COLORS.warning : COLORS.warningDark} />
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    color: isDark ? COLORS.textDark : COLORS.text,
                                    marginLeft: 8,
                                }}
                            >
                                Confirm Import
                            </Text>
                        </View>
                        <Text
                            style={{
                                fontSize: 14,
                                color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                            }}
                        >
                            Review the data that will be imported:
                        </Text>
                    </View>

                    {/* Content - Scrollable */}
                    <ScrollView
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={true}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    >
                        {/* Data Summary */}
                        <View
                            style={{
                                backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                                padding: 16,
                                borderRadius: 8,
                                marginBottom: 20,
                            }}
                        >
                            <View style={{ gap: 8 }}>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '600',
                                        color: isDark ? COLORS.textDark : COLORS.text,
                                    }}
                                >
                                    Data Summary:
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                    }}
                                >
                                    • {summary.totalWorkouts} workouts
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                    }}
                                >
                                    • {summary.totalPRs} personal records
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                    }}
                                >
                                    • Current progress: Cycle {summary.currentProgress.cycle}, Week {summary.currentProgress.week}
                                </Text>
                                {summary.oldestWorkout && (
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                                        }}
                                    >
                                        • Date range: {summary.oldestWorkout} to {summary.newestWorkout}
                                    </Text>
                                )}
                            </View>
                        </View>

                        {/* Warning */}
                        <View
                            style={{
                                backgroundColor: isDark ? COLORS.errorDark + '20' : COLORS.error + '20',
                                padding: 16,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: isDark ? COLORS.error : COLORS.errorDark,
                                marginBottom: 20,
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <AlertTriangle size={16} color={isDark ? COLORS.error : COLORS.errorDark} />
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '600',
                                        color: isDark ? COLORS.error : COLORS.errorDark,
                                        marginLeft: 6,
                                    }}
                                >
                                    Warning
                                </Text>
                            </View>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: isDark ? COLORS.error : COLORS.errorDark,
                                    lineHeight: 16,
                                }}
                            >
                                This will replace all existing data. This action cannot be undone.
                            </Text>
                        </View>
                    </ScrollView>

                    {/* Buttons */}
                    <View style={{ gap: 12 }}>
                        <TouchableOpacity
                            onPress={confirmImport}
                            style={{
                                backgroundColor: isDark ? COLORS.error : COLORS.errorDark,
                                padding: 20,
                                borderRadius: 12,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.3,
                                shadowRadius: 4,
                                elevation: 4,
                            }}
                            activeOpacity={0.8}
                        >
                            <CheckCircle size={32} color="white" />
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 12 }}>
                                Confirm Import
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setImportData(null)}
                            style={{
                                backgroundColor: 'transparent',
                                padding: 20,
                                borderRadius: 12,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                borderWidth: 2,
                                borderColor: isDark ? COLORS.borderDark : COLORS.border,
                            }}
                            activeOpacity={0.8}
                        >
                            <X size={32} color={isDark ? COLORS.textDark : COLORS.text} />
                            <Text style={{ color: isDark ? COLORS.textDark : COLORS.text, fontSize: 18, fontWeight: 'bold', marginLeft: 12 }}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <>
            <Card
                title="Data Backup & Restore"
                borderColor={isDark ? COLORS.warningLight : COLORS.warning}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                    <FileText size={16} color={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary} />
                    <Text
                        style={{
                            color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                            marginLeft: 8,
                            fontSize: 14,
                        }}
                    >
                        Export or import your workout data
                    </Text>
                </View>

                {/* Export Section */}
                <View style={{ marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <Download size={16} color={isDark ? COLORS.success : COLORS.successDark} />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: isDark ? COLORS.textDark : COLORS.text,
                                marginLeft: 8,
                            }}
                        >
                            Export Data
                        </Text>
                    </View>
                    <Text
                        style={{
                            fontSize: 14,
                            color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                            marginBottom: 12,
                        }}
                    >
                        Create a backup of all your workout data, settings, and progress. This includes:
                    </Text>
                    <View style={{ gap: 4, marginBottom: 12 }}>
                        <Text
                            style={{
                                fontSize: 12,
                                color: isDark ? COLORS.textTertiaryDark : COLORS.textTertiary,
                            }}
                        >
                            • Workout history and completed sessions
                        </Text>
                        <Text
                            style={{
                                fontSize: 12,
                                color: isDark ? COLORS.textTertiaryDark : COLORS.textTertiary,
                            }}
                        >
                            • Personal records and training maxes
                        </Text>
                        <Text
                            style={{
                                fontSize: 12,
                                color: isDark ? COLORS.textTertiaryDark : COLORS.textTertiary,
                            }}
                        >
                            • App settings and workout schedule
                        </Text>
                        <Text
                            style={{
                                fontSize: 12,
                                color: isDark ? COLORS.textTertiaryDark : COLORS.textTertiary,
                            }}
                        >
                            • Current cycle and week progress
                        </Text>
                    </View>
                    <Button
                        onPress={handleExport}
                        variant="primary"
                        fullWidth
                        disabled={isExporting}
                        icon={isExporting ? undefined : Download}
                    >
                        {isExporting ? "Exporting..." : "Export Data"}
                    </Button>
                </View>

                {/* Import Section */}
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <Upload size={16} color={isDark ? COLORS.warning : COLORS.warningDark} />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: isDark ? COLORS.textDark : COLORS.text,
                                marginLeft: 8,
                            }}
                        >
                            Import Data
                        </Text>
                    </View>
                    <Text
                        style={{
                            fontSize: 14,
                            color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                            marginBottom: 12,
                        }}
                    >
                        Restore your workout data from a previous backup. This will replace all current data.
                    </Text>

                    {/* Warning */}
                    <View
                        style={{
                            backgroundColor: isDark ? COLORS.warningDark + '20' : COLORS.warning + '20',
                            padding: 12,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: isDark ? COLORS.warning : COLORS.warningDark,
                            marginBottom: 12,
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <AlertTriangle size={14} color={isDark ? COLORS.warning : COLORS.warningDark} />
                            <Text
                                style={{
                                    fontSize: 12,
                                    fontWeight: '600',
                                    color: isDark ? COLORS.warning : COLORS.warningDark,
                                    marginLeft: 6,
                                }}
                            >
                                Warning
                            </Text>
                        </View>
                        <Text
                            style={{
                                fontSize: 12,
                                color: isDark ? COLORS.warning : COLORS.warningDark,
                            }}
                        >
                            Importing will replace all existing data. Make sure to export your current data first if you want to keep it.
                        </Text>
                    </View>

                    <Button
                        onPress={handleImport}
                        variant="outline"
                        fullWidth
                        disabled={isImporting}
                        icon={isImporting ? undefined : Upload}
                    >
                        {isImporting ? "Importing..." : "Import Data"}
                    </Button>
                </View>

                {/* Info */}
                <View
                    style={{
                        backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                        padding: 12,
                        borderRadius: 8,
                        marginTop: 16,
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <CheckCircle size={14} color={isDark ? COLORS.success : COLORS.successDark} />
                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: '600',
                                color: isDark ? COLORS.success : COLORS.successDark,
                                marginLeft: 6,
                            }}
                        >
                            Data Format
                        </Text>
                    </View>
                    <Text
                        style={{
                            fontSize: 12,
                            color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                        }}
                    >
                        Your data is exported as JSON, which is human-readable and can be opened in any text editor.
                        This format ensures compatibility across different devices and app versions.
                    </Text>
                </View>
            </Card>

            {renderImportModal()}
            {renderConfirmImportModal()}
        </>
    );
}; 