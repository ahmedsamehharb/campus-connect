import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  ActivityIndicator,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, Edit, User, Users, MessageCircle, X, UserPlus } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/providers';
import { api } from '@/lib/supabase';

interface Participant {
  id: string;
  name: string;
  avatar_url?: string;
}

interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  participants: Participant[];
  lastMessage: {
    id: string;
    content: string;
    created_at: string;
    sender_id: string;
    sender?: { name: string };
  } | null;
  unreadCount: number;
  created_at: string;
}

interface UserSearchResult {
  id: string;
  name: string;
  avatar_url?: string;
  major?: string;
  year?: string;
}

export default function MessagesScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // New Chat Modal state
  const [showNewChat, setShowNewChat] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [startingConversation, setStartingConversation] = useState(false);

  const fetchConversations = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error } = await api.getConversations(user.id);
      
      if (error) {
        console.error('Error fetching conversations:', error);
        setError('Failed to load messages');
        return;
      }
      
      setConversations(data || []);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchConversations();
  }, [fetchConversations]);

  // Search users for new chat
  useEffect(() => {
    const searchUsers = async () => {
      if (!userSearchQuery.trim() || !user?.id) {
        setSearchResults([]);
        return;
      }

      setSearchingUsers(true);
      const { data } = await api.searchUsers(userSearchQuery, user.id);
      if (data) {
        setSearchResults(data);
      }
      setSearchingUsers(false);
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [userSearchQuery, user?.id]);

  // Start a new conversation
  const startConversation = async (otherUser: UserSearchResult) => {
    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to start a conversation');
      return;
    }

    setStartingConversation(true);
    console.log('Starting conversation with:', otherUser.name, otherUser.id);

    try {
      const result = await api.createDirectConversation(user.id, otherUser.id);
      console.log('Create conversation result:', result);

      if (result.error) {
        console.error('Error creating conversation:', result.error);
        const errorMsg = result.error.message || 'Unknown error';
        Alert.alert('Error', 'Failed to create conversation: ' + errorMsg);
        return;
      }

      if (result.data) {
        console.log('Conversation created/found:', result.data.id);
        setShowNewChat(false);
        setUserSearchQuery('');
        setSearchResults([]);
        // Navigate to the conversation
        router.push(`/(tabs)/messages/${result.data.id}` as any);
      }
    } catch (error) {
      console.error('Exception creating conversation:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setStartingConversation(false);
    }
  };

  const getConversationName = (conv: Conversation) => {
    if (conv.type === 'group' && conv.name) {
      return conv.name;
    }
    const otherParticipant = conv.participants.find((p) => p.id !== user?.id);
    return otherParticipant?.name || 'Unknown';
  };

  const getLastMessagePreview = (conv: Conversation) => {
    if (!conv.lastMessage) return 'No messages yet';
    
    const isMe = conv.lastMessage.sender_id === user?.id;
    const prefix = isMe ? 'You: ' : '';
    
    return prefix + conv.lastMessage.content;
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredConversations = conversations.filter((conv) => {
    const name = getConversationName(conv).toLowerCase();
    const lastMsg = conv.lastMessage?.content.toLowerCase() || '';
    return name.includes(searchQuery.toLowerCase()) || lastMsg.includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-[#f8fafc]'}`}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Loading messages...</Text>
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
            placeholder="Search messages..."
            placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </Animated.View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
        }
      >
        {error ? (
          <View className="items-center justify-center py-12 px-5">
            <MessageCircle size={48} color={isDark ? '#6b7280' : '#9ca3af'} />
            <Text className={`mt-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{error}</Text>
            <TouchableOpacity onPress={onRefresh} className="mt-4 bg-blue-500 px-6 py-2.5 rounded-xl">
              <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredConversations.length === 0 ? (
          <View className="items-center justify-center py-12 px-5">
            <MessageCircle size={48} color={isDark ? '#6b7280' : '#9ca3af'} />
            <Text className={`mt-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {searchQuery ? 'No conversations match your search' : 'No messages yet. Start a conversation!'}
            </Text>
          </View>
        ) : (
          <View className="px-5 mt-2">
            {filteredConversations.map((conv, index) => (
              <Animated.View
                key={conv.id}
                entering={FadeInDown.duration(400).delay(80 * index).springify()}
              >
                <TouchableOpacity
                  onPress={() => router.push(`/(tabs)/messages/${conv.id}` as any)}
                  className={`flex-row items-center p-4 rounded-2xl mb-3 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isDark ? 0.3 : 0.06,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                  activeOpacity={0.8}
                >
                  {/* Avatar */}
                  <View
                    className={`w-14 h-14 rounded-full items-center justify-center ${
                      conv.type === 'group' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}
                  >
                    {conv.type === 'group' ? (
                      <Users size={24} color="#3b82f6" />
                    ) : (
                      <User size={24} color="#6b7280" />
                    )}
                  </View>

                  {/* Content */}
                  <View className="flex-1 ml-4">
                    <View className="flex-row items-center justify-between">
                      <Text
                        className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                        numberOfLines={1}
                      >
                        {getConversationName(conv)}
                      </Text>
                      <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {conv.lastMessage
                          ? formatTimeAgo(conv.lastMessage.created_at)
                          : formatTimeAgo(conv.created_at)}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between mt-1">
                      <Text
                        className={`text-sm flex-1 mr-3 ${
                          conv.unreadCount > 0
                            ? isDark
                              ? 'text-white font-semibold'
                              : 'text-gray-900 font-semibold'
                            : isDark
                            ? 'text-gray-400'
                            : 'text-gray-500'
                        }`}
                        numberOfLines={1}
                      >
                        {getLastMessagePreview(conv)}
                      </Text>
                      {conv.unreadCount > 0 && (
                        <View className="bg-blue-500 min-w-[22px] h-[22px] px-1.5 rounded-full items-center justify-center">
                          <Text className="text-white text-xs font-bold">
                            {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* FAB - New Message */}
      <TouchableOpacity
        onPress={() => setShowNewChat(true)}
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
        <Edit size={22} color="#ffffff" strokeWidth={2.5} />
      </TouchableOpacity>

      {/* New Chat Modal */}
      <Modal
        visible={showNewChat}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNewChat(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className={`rounded-t-3xl ${isDark ? 'bg-gray-900' : 'bg-white'}`} style={{ maxHeight: '80%' }}>
              {/* Modal Header */}
              <View className={`flex-row items-center justify-between px-5 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  New Message
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowNewChat(false);
                    setUserSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="p-2"
                >
                  <X size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
                </TouchableOpacity>
              </View>

              {/* Search Input */}
              <View className="px-5 py-3">
                <View
                  className={`flex-row items-center px-4 py-3 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
                >
                  <Search size={20} color={isDark ? '#9ca3af' : '#9ca3af'} />
                  <TextInput
                    className={`flex-1 ml-3 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}
                    placeholder="Search users by name..."
                    placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                    value={userSearchQuery}
                    onChangeText={setUserSearchQuery}
                    autoFocus
                  />
                  {searchingUsers && (
                    <ActivityIndicator size="small" color="#3b82f6" />
                  )}
                </View>
              </View>

              {/* Search Results */}
              <ScrollView className="px-5" style={{ maxHeight: 400 }}>
                {userSearchQuery.trim() === '' ? (
                  <View className="items-center py-8">
                    <UserPlus size={48} color={isDark ? '#6b7280' : '#9ca3af'} />
                    <Text className={`mt-3 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Search for a user to start a conversation
                    </Text>
                  </View>
                ) : searchingUsers ? (
                  <View className="items-center py-8">
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text className={`mt-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Searching...
                    </Text>
                  </View>
                ) : searchResults.length === 0 ? (
                  <View className="items-center py-8">
                    <User size={48} color={isDark ? '#6b7280' : '#9ca3af'} />
                    <Text className={`mt-3 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      No users found matching "{userSearchQuery}"
                    </Text>
                  </View>
                ) : (
                  <View className="pb-6">
                    {searchResults.map((searchUser) => (
                      <TouchableOpacity
                        key={searchUser.id}
                        onPress={() => startConversation(searchUser)}
                        disabled={startingConversation}
                        className={`flex-row items-center p-4 rounded-xl mb-2 ${
                          isDark ? 'bg-gray-800' : 'bg-gray-50'
                        }`}
                        activeOpacity={0.7}
                      >
                        <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center">
                          <User size={24} color="#3b82f6" />
                        </View>
                        <View className="flex-1 ml-3">
                          <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {searchUser.name}
                          </Text>
                          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {searchUser.major || 'Student'}{searchUser.year ? ` • ${searchUser.year}` : ''}
                          </Text>
                        </View>
                        {startingConversation ? (
                          <ActivityIndicator size="small" color="#3b82f6" />
                        ) : (
                          <MessageCircle size={20} color="#3b82f6" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
