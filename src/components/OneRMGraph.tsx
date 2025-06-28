import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Line, Circle, Text as SvgText, G } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS } from '../constants/colors';

interface OneRMData {
    date: string;
    benchPress: number;
    squat: number;
    deadlift: number;
    overheadPress: number;
}

interface OneRMGraphProps {
    data: OneRMData[];
    unit: 'kg' | 'lbs';
}

const { width: screenWidth } = Dimensions.get('window');
const GRAPH_WIDTH = screenWidth - 80; // Account for padding
const GRAPH_HEIGHT = 200;
const PADDING = 40;

export const OneRMGraph: React.FC<OneRMGraphProps> = ({ data, unit }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (data.length === 0) {
        return (
            <View style={{
                height: GRAPH_HEIGHT,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: isDark ? COLORS.backgroundTertiaryDark : COLORS.backgroundTertiary,
                borderRadius: 8,
            }}>
                <Text style={{
                    color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
                    fontSize: 14,
                }}>
                    No 1RM data available yet
                </Text>
            </View>
        );
    }

    // Calculate min and max values for scaling
    const allValues = data.flatMap(d => [d.benchPress, d.squat, d.deadlift, d.overheadPress]);
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const valueRange = maxValue - minValue;

    // Colors for each exercise
    const exerciseColors = {
        benchPress: '#FF6B6B',
        squat: '#4ECDC4',
        deadlift: '#45B7D1',
        overheadPress: '#96CEB4',
    };

    // Helper function to convert value to Y coordinate
    const valueToY = (value: number) => {
        return PADDING + (GRAPH_HEIGHT - 2 * PADDING) * (1 - (value - minValue) / valueRange);
    };

    // Helper function to convert index to X coordinate
    const indexToX = (index: number) => {
        return PADDING + (GRAPH_WIDTH - 2 * PADDING) * (index / (data.length - 1));
    };

    // Generate Y-axis labels
    const yAxisLabels = [];
    const numLabels = 5;
    for (let i = 0; i <= numLabels; i++) {
        const value = minValue + (valueRange * i / numLabels);
        yAxisLabels.push({
            value: Math.round(value),
            y: valueToY(value),
        });
    }

    return (
        <View style={{ marginTop: 16 }}>
            <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT}>
                {/* Y-axis grid lines and labels */}
                {yAxisLabels.map((label, index) => (
                    <G key={index}>
                        <Line
                            x1={PADDING}
                            y1={label.y}
                            x2={GRAPH_WIDTH - PADDING}
                            y2={label.y}
                            stroke={isDark ? COLORS.borderDark : COLORS.border}
                            strokeWidth={0.5}
                            strokeDasharray="2,2"
                        />
                        <SvgText
                            x={PADDING - 8}
                            y={label.y + 4}
                            fontSize="10"
                            fill={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                            textAnchor="end"
                        >
                            {label.value}
                        </SvgText>
                    </G>
                ))}

                {/* X-axis */}
                <Line
                    x1={PADDING}
                    y1={GRAPH_HEIGHT - PADDING}
                    x2={GRAPH_WIDTH - PADDING}
                    y2={GRAPH_HEIGHT - PADDING}
                    stroke={isDark ? COLORS.textDark : COLORS.text}
                    strokeWidth={1}
                />

                {/* Y-axis */}
                <Line
                    x1={PADDING}
                    y1={PADDING}
                    x2={PADDING}
                    y2={GRAPH_HEIGHT - PADDING}
                    stroke={isDark ? COLORS.textDark : COLORS.text}
                    strokeWidth={1}
                />

                {/* Data lines and points */}
                {(['benchPress', 'squat', 'deadlift', 'overheadPress'] as const).map((exercise) => (
                    <G key={exercise}>
                        {/* Line connecting points */}
                        {data.map((point, index) => {
                            if (index === 0) return null;
                            const prevPoint = data[index - 1];
                            return (
                                <Line
                                    key={`line-${exercise}-${index}`}
                                    x1={indexToX(index - 1)}
                                    y1={valueToY(prevPoint[exercise])}
                                    x2={indexToX(index)}
                                    y2={valueToY(point[exercise])}
                                    stroke={exerciseColors[exercise]}
                                    strokeWidth={2}
                                />
                            );
                        })}

                        {/* Data points */}
                        {data.map((point, index) => (
                            <Circle
                                key={`point-${exercise}-${index}`}
                                cx={indexToX(index)}
                                cy={valueToY(point[exercise])}
                                r={4}
                                fill={exerciseColors[exercise]}
                                stroke="white"
                                strokeWidth={1}
                            />
                        ))}
                    </G>
                ))}

                {/* X-axis labels (dates) */}
                {data.map((point, index) => {
                    const date = new Date(point.date);
                    const month = date.toLocaleDateString('en-US', { month: 'short' });
                    const day = date.getDate();
                    return (
                        <SvgText
                            key={`x-label-${index}`}
                            x={indexToX(index)}
                            y={GRAPH_HEIGHT - PADDING + 16}
                            fontSize="10"
                            fill={isDark ? COLORS.textSecondaryDark : COLORS.textSecondary}
                            textAnchor="middle"
                        >
                            {`${month} ${day}`}
                        </SvgText>
                    );
                })}
            </Svg>

            {/* Legend */}
            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 16,
                marginTop: 16
            }}>
                {Object.entries({
                    benchPress: 'Bench Press',
                    squat: 'Squat',
                    deadlift: 'Deadlift',
                    overheadPress: 'Overhead Press',
                }).map(([key, name]) => (
                    <View key={key} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={{
                            width: 12,
                            height: 12,
                            backgroundColor: exerciseColors[key as keyof typeof exerciseColors],
                            borderRadius: 6,
                        }} />
                        <Text style={{
                            fontSize: 12,
                            color: isDark ? COLORS.textDark : COLORS.text,
                        }}>
                            {name}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}; 