import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Calendar,
  MapPin,
  Users,
  Search,
  Filter,
  ChevronRight,
  Plus,
  Clock,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/providers';
import { api } from '@/lib/supabase';

interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location: string;
  category: string;
  attendee_count: number;
  is_attending: boolean;
  max_attendees?: number;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  Career: { bg: '#dcfce7', text: '#16a34a' },
  Academic: { bg: '#dbeafe', text: '#2563eb' },
  Sports: { bg: '#ffedd5', text: '#ea580c' },
  Social: { bg: '#f3e8ff', text: '#9333ea' },
  Workshop: { bg: '#cffafe', text: '#0891b2' },
  career: { bg: '#dcfce7', text: '#16a34a' },
  academic: { bg: '#dbeafe', text: '#2563eb' },
  sports: { bg: '#ffedd5', text: '#ea580c' },
  social: { bg: '#f3e8ff', text: '#9333ea' },
  workshop: { bg: '#cffafe', text: '#0891b2' },
};

const defaultColors = { bg: '#f1f5f9', text: '#475569' };

export default function EventsScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setError(null);
      const { data, error } = await api.getEvents(user?.id);
      
      if (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events');
        return;
      }
      
      setEvents(data || []);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEvents();
  }, [fetchEvents]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: date.getDate().toString(),
    };
  };

  const formatTime = (dateStr: string, timeStr?: string) => {
    if (timeStr) return timeStr;
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-[#f8fafc]'}`}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Loading events...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-[#f8fafc]'}`} edges={['bottom']}>
      {/* Search Bar */}
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        className="px-5 py-3"
      >
        <View
          className={`flex-row items-center px-4 py-3.5 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.3 : 0.06,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Search size={20} color={isDark ? '#9ca3af' : '#9ca3af'} />
          <TextInput
            className={`flex-1 ml-3 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}
            placeholder="Search events..."
            placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity className="p-1">
            <Filter size={20} color={isDark ? '#9ca3af' : '#9ca3af'} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
        }
      >
        {error ? (
          <View className="items-center justify-center py-12">
            <Calendar size={48} color={isDark ? '#6b7280' : '#9ca3af'} />
            <Text className={`mt-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{error}</Text>
            <TouchableOpacity onPress={onRefresh} className="mt-4 bg-blue-500 px-6 py-2.5 rounded-xl">
              <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredEvents.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Calendar size={48} color={isDark ? '#6b7280' : '#9ca3af'} />
            <Text className={`mt-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {searchQuery ? 'No events match your search' : 'No upcoming events'}
            </Text>
          </View>
        ) : (
          <View className="mt-2">
            <Text className={`text-sm font-medium mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {filteredEvents.length} Upcoming Event{filteredEvents.length !== 1 ? 's' : ''}
            </Text>
            
            {filteredEvents.map((event, index) => {
              const colors = categoryColors[event.category] || defaultColors;
              const { month, day } = formatDate(event.date);
              
              return (
                <Animated.View
                  key={event.id}
                  entering={FadeInDown.duration(400).delay(80 * index).springify()}
                >
                  <TouchableOpacity
                    onPress={() => router.push(`/(tabs)/events/${event.id}` as any)}
                    className={`mb-3 p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isDark ? 0.3 : 0.06,
                      shadowRadius: 8,
                      elevation: 3,
                    }}
                    activeOpacity={0.8}
                  >
                    <View className="flex-row">
                      {/* Date Badge */}
                      <View
                        className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
                        style={{ backgroundColor: colors.bg }}
                      >
                        <Text className="text-xs font-semibold" style={{ color: colors.text }}>
                          {month}
                        </Text>
                        <Text className="text-2xl font-bold" style={{ color: colors.text }}>
                          {day}
                        </Text>
                      </View>

                      {/* Event Details */}
                      <View className="flex-1">
                        <Text
                          className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                          numberOfLines={1}
                        >
                          {event.title}
                        </Text>

                        <View className="flex-row items-center mt-2">
                          <Clock size={14} color={isDark ? '#9ca3af' : '#9ca3af'} />
                          <Text className={`text-sm ml-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatTime(event.date, event.time)}
                          </Text>
                        </View>

                        <View className="flex-row items-center mt-1">
                          <MapPin size={14} color={isDark ? '#9ca3af' : '#9ca3af'} />
                          <Text
                            className={`text-sm ml-1.5 flex-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                            numberOfLines={1}
                          >
                            {event.location}
                          </Text>
                        </View>

                        <View className="flex-row items-center justify-between mt-3">
                          <View className="flex-row items-center">
                            <Users size={14} color={isDark ? '#9ca3af' : '#9ca3af'} />
                            <Text className={`text-sm ml-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {event.attendee_count} attending
                            </Text>
                          </View>
                          
                          {event.is_attending && (
                            <View className="bg-green-100 px-2.5 py-1 rounded-full">
                              <Text className="text-green-600 text-xs font-semibold">Going</Text>
                            </View>
                          )}
                        </View>
                      </View>

                      <ChevronRight size={20} color={isDark ? '#6b7280' : '#d1d5db'} />
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* FAB - Create Event */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full items-center justify-center"
        style={{
          shadowColor: '#3b82f6',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 6,
        }}
        activeOpacity={0.8}
      >
        <Plus size={26} color="#ffffff" strokeWidth={2.5} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
