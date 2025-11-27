import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, MapPin, Users, Clock, ChevronLeft, Share2, Check } from 'lucide-react-native';
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
  max_attendees?: number;
  organizer_id?: string;
  is_attending: boolean;
  created_at: string;
}

const categoryColors: Record<string, string> = {
  Career: '#43a047',
  Academic: '#1a73e8',
  Sports: '#f57c00',
  Social: '#9c27b0',
  Workshop: '#00acc1',
  career: '#43a047',
  academic: '#1a73e8',
  sports: '#f57c00',
  social: '#9c27b0',
  workshop: '#00acc1',
};

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch event details
  const fetchEvent = useCallback(async () => {
    if (!id) return;

    try {
      setError(null);
      const { data, error } = await api.getEventById(id, user?.id);

      if (error) {
        console.error('Error fetching event:', error);
        setError('Failed to load event details');
        return;
      }

      setEvent(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load event details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, user?.id]);

  // Initial fetch
  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEvent();
  }, [fetchEvent]);

  // Handle RSVP
  const handleRSVP = async () => {
    if (!event || !user?.id || rsvpLoading) return;

    setRsvpLoading(true);

    try {
      if (event.is_attending) {
        // Cancel RSVP
        const { error } = await api.leaveEvent(event.id, user.id);
        if (error) {
          Alert.alert('Error', 'Failed to cancel RSVP');
        } else {
          setEvent((prev) =>
            prev ? { ...prev, is_attending: false, attendee_count: prev.attendee_count - 1 } : null
          );
        }
      } else {
        // RSVP to event
        if (event.max_attendees && event.attendee_count >= event.max_attendees) {
          Alert.alert('Event Full', 'This event has reached its maximum capacity.');
          return;
        }

        const { error } = await api.joinEvent(event.id, user.id);
        if (error) {
          Alert.alert('Error', 'Failed to RSVP to event');
        } else {
          setEvent((prev) =>
            prev ? { ...prev, is_attending: true, attendee_count: prev.attendee_count + 1 } : null
          );
        }
      }
    } catch (err) {
      console.error('RSVP error:', err);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setRsvpLoading(false);
    }
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Format time
  const formatTime = (dateStr: string, timeStr?: string) => {
    if (timeStr) return timeStr;
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <ActivityIndicator size="large" color="#1a73e8" />
        <Text className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading event...</Text>
      </SafeAreaView>
    );
  }

  if (error || !event) {
    return (
      <SafeAreaView className={`flex-1 items-center justify-center px-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Calendar size={48} color={isDark ? '#6b7280' : '#9ca3af'} />
        <Text className={`mt-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {error || 'Event not found'}
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-blue-500 px-6 py-2 rounded-lg">
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const categoryColor = categoryColors[event.category] || '#546e7a';

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Event Details',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="p-2">
              <ChevronLeft size={24} color={isDark ? '#FFFFFF' : '#374151'} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity className="p-2">
              <Share2 size={20} color={isDark ? '#FFFFFF' : '#374151'} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1a73e8" />
        }
      >
        {/* Hero Section */}
        <View className={`p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <View
            className="w-16 h-16 rounded-2xl items-center justify-center mb-4"
            style={{ backgroundColor: categoryColor + '20' }}
          >
            <Calendar size={32} color={categoryColor} />
          </View>
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {event.title}
          </Text>
          <View
            className="px-3 py-1 rounded-full self-start mt-2"
            style={{ backgroundColor: categoryColor + '20' }}
          >
            <Text className="text-sm font-medium capitalize" style={{ color: categoryColor }}>
              {event.category}
            </Text>
          </View>

          {/* Attending badge */}
          {event.is_attending && (
            <View className="flex-row items-center mt-3 bg-green-100 px-3 py-2 rounded-lg self-start">
              <Check size={16} color="#16a34a" />
              <Text className="text-green-700 font-medium ml-1">You're going!</Text>
            </View>
          )}
        </View>

        {/* Details */}
        <View className="px-6 py-4">
          <View className={`p-4 rounded-2xl mb-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
                <Calendar size={20} color="#1a73e8" />
              </View>
              <View className="ml-3">
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Date</Text>
                <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formatDate(event.date)}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center">
                <Clock size={20} color="#9333ea" />
              </View>
              <View className="ml-3">
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Time</Text>
                <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formatTime(event.date, event.time)}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center">
                <MapPin size={20} color="#ea580c" />
              </View>
              <View className="ml-3 flex-1">
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Location</Text>
                <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {event.location}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center">
                <Users size={20} color="#16a34a" />
              </View>
              <View className="ml-3">
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Attendees</Text>
                <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {event.attendee_count}
                  {event.max_attendees ? ` / ${event.max_attendees}` : ''} going
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          {event.description && (
            <View className={`p-4 rounded-2xl mb-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <Text className={`text-base font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                About this event
              </Text>
              <Text className={`text-base leading-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {event.description}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* RSVP Button */}
      <View
        className={`px-6 py-4 ${isDark ? 'bg-gray-800' : 'bg-white'} border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <TouchableOpacity
          onPress={handleRSVP}
          disabled={rsvpLoading}
          className={`py-4 rounded-xl items-center flex-row justify-center ${
            event.is_attending ? 'bg-gray-200' : 'bg-primary-500'
          }`}
          activeOpacity={0.8}
        >
          {rsvpLoading ? (
            <ActivityIndicator size="small" color={event.is_attending ? '#374151' : '#ffffff'} />
          ) : (
            <>
              {event.is_attending && <Check size={20} color="#374151" style={{ marginRight: 8 }} />}
              <Text
                className={`font-semibold text-base ${event.is_attending ? 'text-gray-700' : 'text-white'}`}
              >
                {event.is_attending ? 'Cancel RSVP' : 'RSVP to Event'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
