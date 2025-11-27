import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  ChevronLeft,
  MapPin,
  Navigation,
  Bus,
  Eye,
  ExternalLink,
  Compass,
  Clock,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import {
  BUS_STOPS,
  openStreetView,
  openGoogleMaps,
  openNavigation,
  getNextArrivals,
  formatArrivalTime,
  getScheduleFrequency,
  BusStop,
  Location,
  NextArrival,
} from '@/lib/maps';

export default function CampusMapsScreen() {
  const colorScheme = useColorScheme();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [arrivals, setArrivals] = useState<Record<string, NextArrival[]>>({});

  const isDark = colorScheme === 'dark';

  // Update arrivals every minute
  useEffect(() => {
    const updateArrivals = () => {
      const newArrivals: Record<string, NextArrival[]> = {};
      BUS_STOPS.forEach((stop) => {
        // Get all arrivals and filter to only buses that stop at this stop
        const allArrivals = getNextArrivals(stop.id, 10);
        // Filter to only show buses that are in the stop's buses array
        const filteredArrivals = allArrivals
          .filter((arrival) => stop.buses.includes(arrival.busLine))
          .sort((a, b) => a.minutesUntil - b.minutesUntil)
          .slice(0, 3); // Take top 3
        newArrivals[stop.id] = filteredArrivals;
      });
      setArrivals(newArrivals);
    };

    updateArrivals();
    const interval = setInterval(updateArrivals, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Update arrivals on refresh
    const newArrivals: Record<string, NextArrival[]> = {};
    BUS_STOPS.forEach((stop) => {
      // Get all arrivals and filter to only buses that stop at this stop
      const allArrivals = getNextArrivals(stop.id, 10);
      // Filter to only show buses that are in the stop's buses array
      const filteredArrivals = allArrivals
        .filter((arrival) => stop.buses.includes(arrival.busLine))
        .sort((a, b) => a.minutesUntil - b.minutesUntil)
        .slice(0, 3); // Take top 3
      newArrivals[stop.id] = filteredArrivals;
    });
    setArrivals(newArrivals);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleStreetView = (location: Location | BusStop) => {
    // Navigate to embedded Street View screen
    router.push({
      pathname: '/transport/streetview',
      params: {
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
        name: location.name,
        address: location.address || '',
      },
    });
  };

  const handleOpenMaps = (location: Location) => {
    openGoogleMaps(location);
  };

  const handleNavigation = (location: Location | BusStop) => {
    // Navigate button now opens Google Maps search (what Street View used to do)
    openStreetView(location);
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <Stack.Screen
        options={{
          title: 'Campus Maps',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="p-2">
              <ChevronLeft size={24} color={isDark ? '#ffffff' : '#374151'} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: isDark ? '#111827' : '#FFFFFF',
          },
          headerTitleStyle: {
            color: isDark ? '#ffffff' : '#111827',
          },
        }}
      />

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header Section */}
        <Animated.View
          entering={FadeInDown.duration(500)}
          className={`px-5 pt-6 pb-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
        >
          <Text className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Bus Stops - Heilbronn
          </Text>
          <Text className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Find bus stops and arrival times in the Bildungs Campus area
          </Text>
        </Animated.View>

        {/* Bus Stops Section */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(100)}
          className="px-5 mb-6"
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Bus Stops
            </Text>
            <View className="flex-row items-center">
              <Bus size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
              <Text className={`text-sm ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {BUS_STOPS.length} stops
              </Text>
            </View>
          </View>

          {BUS_STOPS.map((stop, index) => (
            <Animated.View
              key={stop.id}
              entering={FadeInDown.duration(400).delay(400 + index * 50)}
            >
              <View
                className={`rounded-2xl p-4 mb-3 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isDark ? 0.3 : 0.06,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Bus size={18} color="#3b82f6" />
                      <Text className={`text-base font-semibold ml-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {stop.name}
                      </Text>
                    </View>
                    {stop.description && (
                      <Text className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {stop.description}
                      </Text>
                    )}
                    {stop.address && (
                      <View className="flex-row items-center mt-1">
                        <MapPin size={12} color={isDark ? '#9ca3af' : '#6b7280'} />
                        <Text className={`text-xs ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} numberOfLines={1}>
                          {stop.address}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Bus Lines */}
                <View className="mb-3">
                  <Text className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Bus Lines:
                  </Text>
                  <View className="flex-row flex-wrap">
                    {stop.buses.map((bus) => (
                      <View
                        key={bus}
                        className={`px-3 py-1.5 rounded-full mr-2 mb-2 ${
                          isDark ? 'bg-blue-900/30' : 'bg-blue-100'
                        }`}
                      >
                        <Text className={`text-xs font-semibold ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                          {bus}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Next Arrivals */}
                {arrivals[stop.id] && arrivals[stop.id].length > 0 && (
                  <View 
                    className="mb-3 pt-3"
                    style={{ borderTopWidth: 1, borderTopColor: isDark ? '#374151' : '#e5e7eb' }}
                  >
                    <View className="flex-row items-center mb-2">
                      <Clock size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
                      <Text className={`text-xs font-semibold ml-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Next Arrivals:
                      </Text>
                    </View>
                    <View>
                      {arrivals[stop.id].map((arrival, idx) => {
                        const frequency = getScheduleFrequency(stop.id, arrival.busLine);
                        const arrivalTime = arrival.arrivalTime.toLocaleTimeString('de-DE', {
                          hour: '2-digit',
                          minute: '2-digit',
                        });
                        
                        return (
                          <View
                            key={`${arrival.busLine}-${idx}`}
                            className="flex-row items-center justify-between py-1.5"
                            style={
                              idx < arrivals[stop.id].length - 1
                                ? { borderBottomWidth: 1, borderBottomColor: isDark ? '#374151' : '#f3f4f6' }
                                : undefined
                            }
                          >
                            <View className="flex-row items-center flex-1">
                              <View
                                className={`w-2 h-2 rounded-full mr-2 ${
                                  arrival.minutesUntil <= 5 ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                              />
                              <Text className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Bus {arrival.busLine}
                              </Text>
                              {arrival.direction && (
                                <Text className={`text-xs ml-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  → {arrival.direction === 'toward-harmonie' ? 'Harmonie' : 'Other'}
                                </Text>
                              )}
                              {frequency && (
                                <Text className={`text-xs ml-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                  ({frequency})
                                </Text>
                              )}
                            </View>
                            <View className="flex-row items-center">
                              <Text className={`text-sm font-semibold mr-2 ${
                                arrival.minutesUntil <= 5
                                  ? 'text-green-600'
                                  : arrival.minutesUntil <= 15
                                  ? 'text-blue-600'
                                  : isDark
                                  ? 'text-gray-400'
                                  : 'text-gray-600'
                              }`}>
                                {formatArrivalTime(arrival)}
                              </Text>
                              <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {arrivalTime}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* Action Buttons - Street View and Navigate for bus stops */}
                <View className="flex-row" style={{ gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => handleStreetView(stop)}
                    className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl ${
                      isDark ? 'bg-blue-900/30' : 'bg-blue-50'
                    }`}
                    activeOpacity={0.7}
                  >
                    <Eye size={14} color="#3b82f6" />
                    <Text className="text-blue-500 font-medium text-xs ml-1.5">Street View</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleNavigation(stop)}
                    className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl ${
                      isDark ? 'bg-green-900/30' : 'bg-green-50'
                    }`}
                    activeOpacity={0.7}
                  >
                    <Navigation size={14} color="#10b981" />
                    <Text className="text-green-600 font-medium text-xs ml-1.5">Navigate</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(400)}
          className="px-5"
        >
          <View
            className={`rounded-2xl p-4 ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}
          >
            <View className="flex-row items-center mb-2">
              <Compass size={18} color="#3b82f6" />
              <Text className={`text-base font-semibold ml-2 ${isDark ? 'text-white' : 'text-blue-900'}`}>
                Quick Actions
              </Text>
            </View>
            <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-blue-700'}`}>
              Use Street View to see the bus stop location, or use Navigate to get directions. 
              All bus stops show real-time arrival information for buses 12, 31, 32, 33, 41, 42, and 5.
            </Text>
          </View>
        </Animated.View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}

