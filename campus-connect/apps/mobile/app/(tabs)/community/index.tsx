import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Search,
  Plus,
  MessageSquare,
  MessageCircle,
  Heart,
  User,
  Users,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/providers';
import { api, supabase } from '@/lib/supabase';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  reply_count: number;
  is_liked: boolean;
  created_at: string;
  author: {
    id: string;
    name: string;
    avatar_url?: string;
    major?: string;
    year?: string;
  };
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Question: { bg: '#dbeafe', text: '#2563eb', border: '#93c5fd' },
  question: { bg: '#dbeafe', text: '#2563eb', border: '#93c5fd' },
  Help: { bg: '#dcfce7', text: '#16a34a', border: '#86efac' },
  help: { bg: '#dcfce7', text: '#16a34a', border: '#86efac' },
  Discussion: { bg: '#fce7f3', text: '#db2777', border: '#f9a8d4' },
  discussion: { bg: '#fce7f3', text: '#db2777', border: '#f9a8d4' },
  Announcement: { bg: '#ffedd5', text: '#ea580c', border: '#fdba74' },
  announcement: { bg: '#ffedd5', text: '#ea580c', border: '#fdba74' },
  Academic: { bg: '#dbeafe', text: '#2563eb', border: '#93c5fd' },
  academic: { bg: '#dbeafe', text: '#2563eb', border: '#93c5fd' },
  'Campus Life': { bg: '#f3e8ff', text: '#9333ea', border: '#d8b4fe' },
  campus_life: { bg: '#f3e8ff', text: '#9333ea', border: '#d8b4fe' },
  Events: { bg: '#ffedd5', text: '#ea580c', border: '#fdba74' },
  events: { bg: '#ffedd5', text: '#ea580c', border: '#fdba74' },
  General: { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' },
  general: { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' },
};

const defaultColors = { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' };

const categories = [
  { id: 'all', label: 'All' },
  { id: 'question', label: 'Question' },
  { id: 'help', label: 'Help' },
  { id: 'discussion', label: 'Discussion' },
  { id: 'announcement', label: 'Announcement' },
];

export default function CommunityScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchPosts = useCallback(async () => {
    try {
      setError(null);
      const { data, error } = await api.getPosts(user?.id);
      
      if (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts');
        return;
      }
      
      setPosts(data || []);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
  }, [fetchPosts]);

  const handleLike = async (postId: string, isLiked: boolean) => {
    if (!user?.id) return;

    try {
      if (isLiked) {
        await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, is_liked: false, likes: p.likes - 1 } : p
          )
        );
      } else {
        await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, is_liked: true, likes: p.likes + 1 } : p
          )
        );
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  // Handle reply - start a conversation with the post author
  const handleReply = async (post: Post) => {
    if (!user?.id) {
      Alert.alert('Sign In Required', 'Please sign in to reply');
      return;
    }

    if (!post.author?.id) {
      Alert.alert('Error', 'Cannot find post author');
      return;
    }

    // Don't allow replying to your own post
    if (post.author.id === user.id) {
      Alert.alert('Info', 'You cannot reply to your own post');
      return;
    }

    setReplyingToId(post.id);

    try {
      // Create or get existing conversation with the post author
      const result = await api.createDirectConversation(user.id, post.author.id);

      if (result.error) {
        console.error('Error creating conversation:', result.error);
        Alert.alert('Error', 'Failed to start conversation. Please try again.');
        setReplyingToId(null);
        return;
      }

      if (result.data) {
        // Navigate to the conversation
        router.push(`/(tabs)/messages/${result.data.id}` as any);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      Alert.alert('Error', 'Failed to start conversation. Please try again.');
    } finally {
      setReplyingToId(null);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      post.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-[#f8fafc]'}`}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Loading posts...</Text>
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
            placeholder="Search requests..."
            placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </Animated.View>

      {/* Category Filters */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(100).springify()}
        className="px-5 pb-3"
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full ${
                  isSelected
                    ? 'bg-[#1E3A5F]'
                    : isDark
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-white border border-gray-200'
                }`}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-sm font-medium ${
                    isSelected
                      ? 'text-white'
                      : isDark
                      ? 'text-gray-300'
                      : 'text-gray-700'
                  }`}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
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
            <Users size={48} color={isDark ? '#6b7280' : '#9ca3af'} />
            <Text className={`mt-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{error}</Text>
            <TouchableOpacity onPress={onRefresh} className="mt-4 bg-blue-500 px-6 py-2.5 rounded-xl">
              <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredPosts.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Users size={48} color={isDark ? '#6b7280' : '#9ca3af'} />
            <Text className={`mt-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {searchQuery ? 'No posts match your search' : 'No posts yet. Start the conversation!'}
            </Text>
          </View>
        ) : (
          <View className="mt-2">
            {filteredPosts.map((post, index) => {
              const colors = categoryColors[post.category] || defaultColors;
              
              return (
                <Animated.View
                  key={post.id}
                  entering={FadeInDown.duration(400).delay(80 * index).springify()}
                >
                  <TouchableOpacity
                    onPress={() => router.push(`/(tabs)/community/${post.id}` as any)}
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
                    {/* Author Info */}
                    <View className="flex-row items-center mb-3">
                      <View className="w-11 h-11 rounded-full bg-blue-100 items-center justify-center">
                        <User size={20} color="#3b82f6" />
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {post.author?.name || 'Anonymous'}
                        </Text>
                        <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {post.author?.major || 'Student'} • {formatTimeAgo(post.created_at)}
                        </Text>
                      </View>
                      <View
                        className="px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: colors.bg }}
                      >
                        <Text
                          className="text-xs font-semibold capitalize"
                          style={{ color: colors.text }}
                        >
                          {post.category.replace('_', ' ')}
                        </Text>
                      </View>
                    </View>

                    {/* Post Content */}
                    <Text
                      className={`text-base font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
                    >
                      {post.title}
                    </Text>
                    <Text
                      className={`text-sm leading-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                      numberOfLines={2}
                    >
                      {post.content}
                    </Text>

                    {/* Actions */}
                    <View className={`flex-row items-center justify-center mt-4 pt-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                      {/* Check if this is the user's own post */}
                      {post.author?.id === user?.id ? (
                        <View className={`flex-1 items-center py-2 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Your post
                          </Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl border ${
                            replyingToId === post.id
                              ? 'bg-gray-100 border-gray-300'
                              : isDark
                              ? 'bg-gray-800 border-gray-700'
                              : 'bg-white border-gray-200'
                          }`}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleReply(post);
                          }}
                          disabled={replyingToId === post.id}
                          activeOpacity={0.7}
                        >
                          {replyingToId === post.id ? (
                            <ActivityIndicator size="small" color="#3b82f6" />
                          ) : (
                            <>
                              <MessageCircle size={18} color={isDark ? '#9ca3af' : '#6b7280'} />
                              <Text className={`text-sm font-medium ml-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Reply
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* FAB - Create Post */}
      <TouchableOpacity
        onPress={() => Alert.alert('Create Post', 'Post creation coming soon!')}
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
