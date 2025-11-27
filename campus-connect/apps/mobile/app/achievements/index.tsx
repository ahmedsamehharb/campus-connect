import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router, Stack } from 'expo-router';
import {
  ChevronLeft,
  Trophy,
  Star,
  Target,
  Flame,
  Award,
  Zap,
  Users,
  BookOpen,
  Calendar,
  MessageCircle,
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useAuth } from '@/providers';

// Mock achievements data
const achievements = [
  {
    id: '1',
    title: 'Early Bird',
    description: 'Log in before 8 AM for 7 consecutive days',
    icon: '🌅',
    progress: 5,
    total: 7,
    points: 50,
    unlocked: false,
    category: 'engagement',
  },
  {
    id: '2',
    title: 'Social Butterfly',
    description: 'Connect with 10 other students',
    icon: '🦋',
    progress: 10,
    total: 10,
    points: 100,
    unlocked: true,
    unlockedDate: '2024-10-01',
    category: 'social',
  },
  {
    id: '3',
    title: 'Event Enthusiast',
    description: 'Attend 5 campus events',
    icon: '🎉',
    progress: 3,
    total: 5,
    points: 75,
    unlocked: false,
    category: 'events',
  },
  {
    id: '4',
    title: 'Bookworm',
    description: 'Reserve study rooms 10 times',
    icon: '📚',
    progress: 10,
    total: 10,
    points: 100,
    unlocked: true,
    unlockedDate: '2024-09-15',
    category: 'academic',
  },
  {
    id: '5',
    title: 'Community Leader',
    description: 'Create 5 posts with 10+ replies each',
    icon: '👑',
    progress: 2,
    total: 5,
    points: 150,
    unlocked: false,
    category: 'social',
  },
  {
    id: '6',
    title: 'Wellness Warrior',
    description: 'Complete 30 wellness activities',
    icon: '💪',
    progress: 12,
    total: 30,
    points: 200,
    unlocked: false,
    category: 'wellness',
  },
];

const leaderboard = [
  { rank: 1, name: 'Alex Thompson', points: 2450, avatar: '😎' },
  { rank: 2, name: 'Sarah Johnson', points: 2380, avatar: '🌟' },
  { rank: 3, name: 'Michael Chen', points: 2210, avatar: '🚀' },
  { rank: 4, name: 'Emily Davis', points: 2100, avatar: '✨' },
  { rank: 5, name: 'James Wilson', points: 1950, avatar: '🎯' },
];

const categoryIcons: Record<string, any> = {
  engagement: Flame,
  social: Users,
  events: Calendar,
  academic: BookOpen,
  wellness: Zap,
};

export default function AchievementsScreen() {
  const { profile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'achievements' | 'leaderboard'>('achievements');

  const totalPoints = 450; // User's current points
  const userRank = 12;
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    return '#6B7280';
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: 'Achievements',
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
        {/* Stats Card */}
        <Animated.View entering={FadeInDown.duration(500)} className="px-4 pt-4">
          <View className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-yellow-500 rounded-2xl p-5">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white/80 text-sm">Your Points</Text>
                <View className="flex-row items-center">
                  <Text className="text-white text-4xl font-bold">{totalPoints}</Text>
                  <Star size={24} color="#FFFFFF" className="ml-2" fill="#FFFFFF" />
                </View>
              </View>
              <View className="items-end">
                <View className="bg-white/20 rounded-full px-4 py-2 mb-2">
                  <Text className="text-white font-semibold">Rank #{userRank}</Text>
                </View>
                <Text className="text-white/80 text-sm">
                  {unlockedCount}/{achievements.length} unlocked
                </Text>
              </View>
            </View>

            {/* Progress to next level */}
            <View className="mt-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-white/80 text-sm">Progress to Level 5</Text>
                <Text className="text-white font-medium">450/500</Text>
              </View>
              <View className="h-3 bg-white/30 rounded-full overflow-hidden">
                <View className="h-full bg-white rounded-full" style={{ width: '90%' }} />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Tab Switcher */}
        <Animated.View entering={FadeInDown.duration(500).delay(50)} className="px-4 mt-6">
          <View className="bg-gray-200 rounded-xl p-1 flex-row">
            <TouchableOpacity
              onPress={() => setSelectedTab('achievements')}
              className={`flex-1 flex-row items-center justify-center py-3 rounded-lg ${
                selectedTab === 'achievements' ? 'bg-white' : ''
              }`}
            >
              <Trophy
                size={18}
                color={selectedTab === 'achievements' ? '#F59E0B' : '#6B7280'}
              />
              <Text
                className={`ml-2 font-medium ${
                  selectedTab === 'achievements' ? 'text-yellow-600' : 'text-gray-500'
                }`}
              >
                Achievements
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedTab('leaderboard')}
              className={`flex-1 flex-row items-center justify-center py-3 rounded-lg ${
                selectedTab === 'leaderboard' ? 'bg-white' : ''
              }`}
            >
              <Award size={18} color={selectedTab === 'leaderboard' ? '#3B82F6' : '#6B7280'} />
              <Text
                className={`ml-2 font-medium ${
                  selectedTab === 'leaderboard' ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                Leaderboard
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {selectedTab === 'achievements' ? (
          /* Achievements List */
          <Animated.View entering={FadeIn.duration(300)} className="px-4 mt-6">
            {achievements.map((achievement, index) => {
              const CategoryIcon = categoryIcons[achievement.category] || Target;
              return (
                <Animated.View
                  key={achievement.id}
                  entering={FadeInDown.duration(400).delay(100 + index * 50)}
                >
                  <TouchableOpacity
                    className={`bg-white rounded-xl p-4 mb-3 shadow-sm ${
                      !achievement.unlocked ? 'opacity-80' : ''
                    }`}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-start">
                      <View
                        className={`w-14 h-14 rounded-xl items-center justify-center mr-4 ${
                          achievement.unlocked ? 'bg-yellow-100' : 'bg-gray-100'
                        }`}
                      >
                        <Text className="text-2xl">{achievement.icon}</Text>
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center justify-between">
                          <Text
                            className={`text-base font-semibold ${
                              achievement.unlocked ? 'text-gray-800' : 'text-gray-500'
                            }`}
                          >
                            {achievement.title}
                          </Text>
                          {achievement.unlocked && (
                            <View className="bg-green-100 px-2 py-1 rounded-full">
                              <Text className="text-green-700 text-xs font-medium">Unlocked</Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-sm text-gray-500 mt-1">{achievement.description}</Text>

                        {/* Progress bar */}
                        {!achievement.unlocked && (
                          <View className="mt-3">
                            <View className="flex-row justify-between mb-1">
                              <Text className="text-xs text-gray-400">Progress</Text>
                              <Text className="text-xs text-gray-600 font-medium">
                                {achievement.progress}/{achievement.total}
                              </Text>
                            </View>
                            <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <View
                                className="h-full bg-yellow-500 rounded-full"
                                style={{
                                  width: `${(achievement.progress / achievement.total) * 100}%`,
                                }}
                              />
                            </View>
                          </View>
                        )}

                        <View className="flex-row items-center mt-2">
                          <Star size={14} color="#F59E0B" fill="#F59E0B" />
                          <Text className="text-sm text-yellow-600 ml-1 font-medium">
                            {achievement.points} points
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </Animated.View>
        ) : (
          /* Leaderboard */
          <Animated.View entering={FadeIn.duration(300)} className="px-4 mt-6">
            <View className="bg-white rounded-xl shadow-sm overflow-hidden">
              {leaderboard.map((user, index) => (
                <TouchableOpacity
                  key={user.rank}
                  className={`flex-row items-center p-4 ${
                    index !== leaderboard.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center mr-3"
                    style={{
                      backgroundColor:
                        user.rank <= 3 ? getRankColor(user.rank) + '20' : '#F3F4F6',
                    }}
                  >
                    <Text
                      className="font-bold"
                      style={{ color: getRankColor(user.rank) }}
                    >
                      {user.rank}
                    </Text>
                  </View>
                  <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
                    <Text className="text-xl">{user.avatar}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium text-gray-800">{user.name}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Star size={16} color="#F59E0B" fill="#F59E0B" />
                    <Text className="text-base font-semibold text-gray-800 ml-1">
                      {user.points.toLocaleString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Your Position */}
            <View className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-3">
                <Text className="font-bold text-blue-600">{userRank}</Text>
              </View>
              <View className="w-10 h-10 rounded-full bg-blue-200 items-center justify-center mr-3">
                <Text className="text-xl">🎯</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium text-blue-800">You</Text>
              </View>
              <View className="flex-row items-center">
                <Star size={16} color="#3B82F6" fill="#3B82F6" />
                <Text className="text-base font-semibold text-blue-800 ml-1">{totalPoints}</Text>
              </View>
            </View>
          </Animated.View>
        )}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}





