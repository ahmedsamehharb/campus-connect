import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router, Stack } from 'expo-router';
import * as Linking from 'expo-linking';
import {
  ChevronLeft,
  Bus,
  Car,
  MapPin,
  Clock,
  Navigation,
  ChevronRight,
  AlertCircle,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Mock transportation data
const busRoutes = [
  {
    id: '1',
    name: 'Blue Route',
    color: '#3B82F6',
    nextArrival: '3 min',
    frequency: 'Every 10 min',
    status: 'on-time',
    stops: ['Student Union', 'Library', 'Engineering', 'Dorms'],
  },
  {
    id: '2',
    name: 'Red Route',
    color: '#EF4444',
    nextArrival: '7 min',
    frequency: 'Every 15 min',
    status: 'on-time',
    stops: ['Main Gate', 'Science Center', 'Sports Complex', 'Parking Lot A'],
  },
  {
    id: '3',
    name: 'Green Route',
    color: '#10B981',
    nextArrival: '12 min',
    frequency: 'Every 20 min',
    status: 'delayed',
    delay: '5 min',
    stops: ['Downtown', 'Hospital', 'Campus North', 'Campus South'],
  },
];

const parkingLots = [
  {
    id: '1',
    name: 'Lot A - Main',
    available: 45,
    total: 200,
    type: 'student',
    distance: '5 min walk',
  },
  {
    id: '2',
    name: 'Lot B - Engineering',
    available: 12,
    total: 100,
    type: 'student',
    distance: '3 min walk',
  },
  {
    id: '3',
    name: 'Lot C - Sports',
    available: 78,
    total: 150,
    type: 'student',
    distance: '8 min walk',
  },
  {
    id: '4',
    name: 'Visitor Parking',
    available: 5,
    total: 50,
    type: 'visitor',
    distance: '2 min walk',
  },
];

export default function TransportScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'bus' | 'parking'>('bus');

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const openMaps = (destination: string) => {
    const url = `https://maps.google.com/?q=${encodeURIComponent(destination)}`;
    Linking.openURL(url);
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const ratio = available / total;
    if (ratio > 0.3) return '#10B981';
    if (ratio > 0.1) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: 'Transportation',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="p-2">
              <ChevronLeft size={24} color="#374151" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3B82F6']} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Tab Switcher */}
        <Animated.View entering={FadeInDown.duration(500)} className="px-4 pt-4">
          <View className="bg-gray-200 rounded-xl p-1 flex-row">
            <TouchableOpacity
              onPress={() => setActiveTab('bus')}
              className={`flex-1 flex-row items-center justify-center py-3 rounded-lg ${
                activeTab === 'bus' ? 'bg-white' : ''
              }`}
            >
              <Bus size={18} color={activeTab === 'bus' ? '#3B82F6' : '#6B7280'} />
              <Text
                className={`ml-2 font-medium ${
                  activeTab === 'bus' ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                Shuttles
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('parking')}
              className={`flex-1 flex-row items-center justify-center py-3 rounded-lg ${
                activeTab === 'parking' ? 'bg-white' : ''
              }`}
            >
              <Car size={18} color={activeTab === 'parking' ? '#3B82F6' : '#6B7280'} />
              <Text
                className={`ml-2 font-medium ${
                  activeTab === 'parking' ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                Parking
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {activeTab === 'bus' ? (
          /* Bus Routes */
          <Animated.View entering={FadeInDown.duration(500).delay(100)} className="px-4 mt-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Shuttle Routes</Text>

            {busRoutes.map((route, index) => (
              <Animated.View
                key={route.id}
                entering={FadeInDown.duration(400).delay(150 + index * 50)}
              >
                <TouchableOpacity
                  className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <View
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: route.color }}
                      />
                      <Text className="text-lg font-semibold text-gray-800">{route.name}</Text>
                    </View>
                    {route.status === 'delayed' ? (
                      <View className="flex-row items-center bg-yellow-100 px-2 py-1 rounded-full">
                        <AlertCircle size={14} color="#F59E0B" />
                        <Text className="text-xs text-yellow-700 ml-1">+{route.delay}</Text>
                      </View>
                    ) : (
                      <View className="bg-green-100 px-2 py-1 rounded-full">
                        <Text className="text-xs text-green-700">On Time</Text>
                      </View>
                    )}
                  </View>

                  <View className="flex-row items-center mb-3">
                    <View className="flex-row items-center flex-1">
                      <Clock size={16} color="#6B7280" />
                      <Text className="text-sm text-gray-600 ml-2">
                        Next: <Text className="font-semibold text-blue-500">{route.nextArrival}</Text>
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-500">{route.frequency}</Text>
                  </View>

                  <View className="pt-3 border-t border-gray-100">
                    <View className="flex-row items-center">
                      <MapPin size={14} color="#9CA3AF" />
                      <Text className="text-sm text-gray-500 ml-2" numberOfLines={1}>
                        {route.stops.join(' → ')}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}

            {/* Map Button */}
            <TouchableOpacity
              className="bg-blue-500 rounded-xl py-4 items-center flex-row justify-center mt-4"
              onPress={() => openMaps('University Campus')}
            >
              <Navigation size={20} color="#FFFFFF" />
              <Text className="text-white font-semibold ml-2">View Campus Map</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          /* Parking Lots */
          <Animated.View entering={FadeInDown.duration(500).delay(100)} className="px-4 mt-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-semibold text-gray-800">Parking Availability</Text>
              <Text className="text-sm text-gray-500">Updated just now</Text>
            </View>

            {parkingLots.map((lot, index) => (
              <Animated.View
                key={lot.id}
                entering={FadeInDown.duration(400).delay(150 + index * 50)}
              >
                <TouchableOpacity
                  className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                  activeOpacity={0.7}
                  onPress={() => openMaps(lot.name)}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <View className="flex-row items-center">
                        <Text className="text-base font-semibold text-gray-800">{lot.name}</Text>
                        {lot.type === 'visitor' && (
                          <View className="bg-purple-100 px-2 py-0.5 rounded-full ml-2">
                            <Text className="text-xs text-purple-700">Visitor</Text>
                          </View>
                        )}
                      </View>
                      <View className="flex-row items-center mt-1">
                        <MapPin size={12} color="#6B7280" />
                        <Text className="text-sm text-gray-500 ml-1">{lot.distance}</Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text
                        className="text-2xl font-bold"
                        style={{ color: getAvailabilityColor(lot.available, lot.total) }}
                      >
                        {lot.available}
                      </Text>
                      <Text className="text-sm text-gray-500">of {lot.total} spots</Text>
                    </View>
                  </View>

                  {/* Progress bar */}
                  <View className="mt-3">
                    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${(lot.available / lot.total) * 100}%`,
                          backgroundColor: getAvailabilityColor(lot.available, lot.total),
                        }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}

            {/* Tips */}
            <View className="bg-blue-50 rounded-xl p-4 mt-4">
              <Text className="text-blue-800 font-semibold mb-2">💡 Parking Tips</Text>
              <Text className="text-blue-700 text-sm">
                Lot A typically fills up by 9 AM on weekdays. Consider arriving early or using the
                shuttle from Lot C for best availability.
              </Text>
            </View>
          </Animated.View>
        )}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}






