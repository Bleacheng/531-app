import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider, View, Text } from '@tamagui/core';
import { TouchableOpacity, ScrollView } from 'react-native';
import tamaguiConfig from './tamagui.config';

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        {/* Header */}
        <View style={{
          padding: 20,
          backgroundColor: '#3b82f6',
          paddingTop: 60,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20
        }}>
          <Text style={{
            fontSize: 28,
            color: 'white',
            fontWeight: 'bold',
            marginBottom: 5
          }}>
            531 App
          </Text>
          <Text style={{
            color: '#bfdbfe',
            fontSize: 16
          }}>
            Your strength training companion
          </Text>
        </View>

        <ScrollView style={{ flex: 1, padding: 20 }}>
          {/* Quick Actions */}
          <View style={{
            backgroundColor: '#dbeafe',
            padding: 20,
            borderRadius: 12,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: '#93c5fd'
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 15,
              color: '#1e40af'
            }}>
              Quick Start
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={{
                flex: 1,
                backgroundColor: '#3b82f6',
                padding: 15,
                borderRadius: 8,
                alignItems: 'center'
              }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  Start Workout
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                flex: 1,
                backgroundColor: 'transparent',
                padding: 15,
                borderRadius: 8,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#3b82f6'
              }}>
                <Text style={{ color: '#3b82f6', fontWeight: 'bold' }}>
                  View History
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Today's Workout */}
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 12,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: '#e5e7eb'
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 10
            }}>
              Today's Workout
            </Text>
            <Text style={{
              color: '#6b7280',
              marginBottom: 15
            }}>
              Week 1 - Cycle 1
            </Text>
            <View style={{ gap: 10 }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Text style={{ fontSize: 16 }}>Bench Press</Text>
                <Text style={{ fontWeight: 'bold', color: '#3b82f6' }}>5/3/1</Text>
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Text style={{ fontSize: 16 }}>Overhead Press</Text>
                <Text style={{ fontWeight: 'bold', color: '#3b82f6' }}>5/3/1</Text>
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Text style={{ fontSize: 16 }}>Deadlift</Text>
                <Text style={{ fontWeight: 'bold', color: '#3b82f6' }}>5/3/1</Text>
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Text style={{ fontSize: 16 }}>Squat</Text>
                <Text style={{ fontWeight: 'bold', color: '#3b82f6' }}>5/3/1</Text>
              </View>
            </View>
          </View>

          {/* Recent Progress */}
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 12,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: '#e5e7eb'
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 15
            }}>
              Recent Progress
            </Text>
            <View style={{ gap: 10 }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Text style={{ fontSize: 16 }}>Bench Press 1RM</Text>
                <Text style={{ fontWeight: 'bold', color: '#10b981' }}>+5 lbs</Text>
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Text style={{ fontSize: 16 }}>Deadlift 1RM</Text>
                <Text style={{ fontWeight: 'bold', color: '#10b981' }}>+10 lbs</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <StatusBar style="light" />
      </View>
    </TamaguiProvider>
  );
}
