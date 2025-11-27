import { createClient } from '@supabase/supabase-js';
import { supabaseStorageAdapter } from './storage';
import Constants from 'expo-constants';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || Constants.expoConfig?.extra?.supabaseUrl || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || Constants.expoConfig?.extra?.supabaseAnonKey || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please check your .env file.');
}

// Create Supabase client with React Native storage adapter
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: supabaseStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disable for React Native
  },
});

// =============================================
// AUTH HELPERS
// =============================================
export const auth = {
  signUp: async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getUser: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  getSession: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  refreshSession: async () => {
    const { data, error } = await supabase.auth.refreshSession();
    return { data, error };
  },
};

// Re-export types from types file
export * from '@/types';

// =============================================
// API FUNCTIONS
// =============================================
export const api = {
  // Profile
  getProfile: async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    return { data, error };
  },

  updateProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select().single();
    return { data, error };
  },

  // Courses
  getCourses: async () => {
    const { data, error } = await supabase
      .from('courses')
      .select(
        `
        *,
        schedules:course_schedules(*)
      `
      )
      .order('code');
    return { data, error };
  },

  getEnrollments: async (userId: string) => {
    const { data, error } = await supabase
      .from('enrollments')
      .select(
        `
        *,
        course:courses(*, schedules:course_schedules(*))
      `
      )
      .eq('user_id', userId);
    return { data, error };
  },

  // Assignments
  getAssignments: async (userId: string) => {
    const { data, error } = await supabase
      .from('assignments')
      .select(
        `
        *,
        course:courses(code, name),
        submission:assignment_submissions!left(*)
      `
      )
      .order('due_date');
    return { data, error };
  },

  // Events
  getEvents: async (userId?: string) => {
    let query = supabase
      .from('events')
      .select(
        `
        *,
        attendee_count:event_attendees(count)
      `
      )
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date');

    const { data, error } = await query;

    if (data && userId) {
      const { data: attending } = await supabase.from('event_attendees').select('event_id').eq('user_id', userId);

      const attendingIds = new Set(attending?.map((a) => a.event_id) || []);
      data.forEach((event: any) => {
        event.is_attending = attendingIds.has(event.id);
        event.attendee_count = event.attendee_count?.[0]?.count || 0;
      });
    }

    return { data, error };
  },

  getEventById: async (eventId: string, userId?: string) => {
    const { data, error } = await supabase
      .from('events')
      .select(
        `
        *,
        attendee_count:event_attendees(count)
      `
      )
      .eq('id', eventId)
      .single();

    if (data && userId) {
      const { data: attending } = await supabase
        .from('event_attendees')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single();

      data.is_attending = !!attending;
      data.attendee_count = data.attendee_count?.[0]?.count || 0;
    }

    return { data, error };
  },

  joinEvent: async (eventId: string, userId: string) => {
    const { data, error } = await supabase
      .from('event_attendees')
      .insert({ event_id: eventId, user_id: userId })
      .select()
      .single();
    return { data, error };
  },

  leaveEvent: async (eventId: string, userId: string) => {
    const { error } = await supabase.from('event_attendees').delete().eq('event_id', eventId).eq('user_id', userId);
    return { error };
  },

  // Posts
  getPosts: async (userId?: string) => {
    const { data, error } = await supabase
      .from('posts')
      .select(
        `
        *,
        author:profiles(id, name, avatar_url, major, year),
        reply_count:post_replies(count)
      `
      )
      .order('created_at', { ascending: false });

    if (data && userId) {
      const { data: likes } = await supabase.from('post_likes').select('post_id').eq('user_id', userId);

      const likedIds = new Set(likes?.map((l) => l.post_id) || []);
      data.forEach((post: any) => {
        post.is_liked = likedIds.has(post.id);
        post.reply_count = post.reply_count?.[0]?.count || 0;
      });
    }

    return { data, error };
  },

  createPost: async (userId: string, post: { title: string; content: string; category: string; tags?: string[] }) => {
    const { data, error } = await supabase
      .from('posts')
      .insert({ ...post, user_id: userId })
      .select()
      .single();
    return { data, error };
  },

  // FAQs
  getFAQs: async () => {
    const { data, error } = await supabase.from('faqs').select('*').order('category');
    return { data, error };
  },

  // Financial
  getFinancialSummary: async (userId: string) => {
    const { data, error } = await supabase.from('financial_summary').select('*').eq('user_id', userId).single();
    return { data, error };
  },

  getTransactions: async (userId: string, limit = 20) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  // Study Rooms
  getStudyRooms: async () => {
    const { data, error } = await supabase.from('study_rooms').select('*').order('name');
    return { data, error };
  },

  bookRoom: async (roomId: string, userId: string, startTime: string, endTime: string) => {
    const { data, error } = await supabase
      .from('room_bookings')
      .insert({
        room_id: roomId,
        user_id: userId,
        start_time: startTime,
        end_time: endTime,
      })
      .select()
      .single();
    return { data, error };
  },

  // Jobs
  getJobs: async (userId?: string) => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .gte('deadline', new Date().toISOString().split('T')[0])
      .order('posted_date', { ascending: false });

    if (data && userId) {
      const [{ data: saved }, { data: applied }] = await Promise.all([
        supabase.from('saved_jobs').select('job_id').eq('user_id', userId),
        supabase.from('job_applications').select('job_id').eq('user_id', userId),
      ]);

      const savedIds = new Set(saved?.map((s) => s.job_id) || []);
      const appliedIds = new Set(applied?.map((a) => a.job_id) || []);

      data.forEach((job: any) => {
        job.is_saved = savedIds.has(job.id);
        job.is_applied = appliedIds.has(job.id);
      });
    }

    return { data, error };
  },

  // Notifications
  getNotifications: async (userId: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  markNotificationRead: async (notificationId: string) => {
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', notificationId);
    return { error };
  },

  // Achievements & Stats
  getUserStats: async (userId: string) => {
    const { data, error } = await supabase.from('user_stats').select('*').eq('user_id', userId).single();
    return { data, error };
  },

  getAchievements: async (userId: string) => {
    const { data: achievements, error } = await supabase.from('achievements').select('*');

    if (achievements && userId) {
      const { data: userAchievements } = await supabase.from('user_achievements').select('*').eq('user_id', userId);

      const userMap = new Map(userAchievements?.map((ua) => [ua.achievement_id, ua]) || []);

      achievements.forEach((achievement: any) => {
        const ua: any = userMap.get(achievement.id);
        achievement.user_progress = ua?.progress || 0;
        achievement.unlocked = ua?.unlocked || false;
        achievement.unlocked_at = ua?.unlocked_at;
      });
    }

    return { data: achievements, error };
  },

  // Messaging
  getConversations: async (userId: string) => {
    const { data: participations, error } = await supabase
      .from('conversation_participants')
      .select(
        `
        conversation_id,
        conversation:conversations(
          id,
          type,
          name,
          created_at
        )
      `
      )
      .eq('user_id', userId);

    if (error || !participations) return { data: [], error };

    const conversationsWithDetails = await Promise.all(
      participations.map(async (p: any) => {
        const conv = p.conversation;

        const { data: participants } = await supabase
          .from('conversation_participants')
          .select(
            `
            user:profiles(id, name, avatar_url)
          `
          )
          .eq('conversation_id', conv.id);

        const { data: lastMessages } = await supabase
          .from('messages')
          .select(
            `
            id,
            content,
            created_at,
            sender_id,
            sender:profiles(name)
          `
          )
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1);

        const { count: unreadCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .eq('read', false)
          .neq('sender_id', userId);

        return {
          ...conv,
          participants: participants?.map((p: any) => p.user) || [],
          lastMessage: lastMessages?.[0] || null,
          unreadCount: unreadCount || 0,
        };
      })
    );

    conversationsWithDetails.sort((a, b) => {
      const aTime = a.lastMessage?.created_at || a.created_at;
      const bTime = b.lastMessage?.created_at || b.created_at;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    return { data: conversationsWithDetails, error: null };
  },

  getMessages: async (conversationId: string, limit = 50) => {
    const { data, error } = await supabase
      .from('messages')
      .select(
        `
        id,
        conversation_id,
        content,
        created_at,
        read,
        sender_id,
        sender:profiles(id, name, avatar_url)
      `
      )
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit);

    const transformedData = data?.map((msg: any) => ({
      ...msg,
      sender: Array.isArray(msg.sender) ? msg.sender[0] : msg.sender,
    }));

    return { data: transformedData, error };
  },

  sendMessage: async (conversationId: string, senderId: string, content: string) => {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content: content,
      })
      .select(
        `
        id,
        conversation_id,
        content,
        created_at,
        read,
        sender_id,
        sender:profiles(id, name, avatar_url)
      `
      )
      .single();

    if (error) return { data: null, error };

    const transformedData = data
      ? {
          ...data,
          sender: Array.isArray(data.sender) ? data.sender[0] : data.sender,
        }
      : null;

    return { data: transformedData, error: null };
  },

  markMessagesAsRead: async (conversationId: string, userId: string) => {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .eq('read', false);

    return { error };
  },

  // Search
  search: async (query: string) => {
    const q = query.toLowerCase();

    const [courses, events, jobs, faqs] = await Promise.all([
      supabase.from('courses').select('id, code, name, professor').ilike('name', `%${q}%`),
      supabase.from('events').select('id, title, date, location').ilike('title', `%${q}%`),
      supabase.from('jobs').select('id, title, company, type').ilike('title', `%${q}%`),
      supabase.from('faqs').select('id, question, category').ilike('question', `%${q}%`),
    ]);

    return {
      courses: courses.data || [],
      events: events.data || [],
      jobs: jobs.data || [],
      faqs: faqs.data || [],
    };
  },

  // Subscribe to messages (realtime)
  subscribeToMessages: (conversationId: string, callback: (message: any) => void) => {
    return supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const { data } = await supabase
            .from('messages')
            .select(
              `
              id,
              conversation_id,
              content,
              created_at,
              read,
              sender_id,
              sender:profiles(id, name, avatar_url)
            `
            )
            .eq('id', payload.new.id)
            .single();

          if (data) {
            const transformedData = {
              ...data,
              sender: Array.isArray(data.sender) ? data.sender[0] : data.sender,
            };
            callback(transformedData);
          }
        }
      )
      .subscribe();
  },

  unsubscribeFromMessages: (conversationId: string) => {
    supabase.removeChannel(supabase.channel(`messages:${conversationId}`));
  },

  // Create a new direct conversation
  createDirectConversation: async (userId: string, otherUserId: string) => {
    try {
      console.log('Creating direct conversation between', userId, 'and', otherUserId);

      // Check if conversation already exists
      const { data: existingConvs, error: existingError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', userId);

      if (existingError) {
        console.error('Error checking existing conversations:', existingError);
      }

      if (existingConvs && existingConvs.length > 0) {
        for (const conv of existingConvs) {
          const { data: otherParticipant } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', conv.conversation_id)
            .eq('user_id', otherUserId)
            .maybeSingle();

          if (otherParticipant) {
            // Check if it's a direct conversation
            const { data: convData } = await supabase
              .from('conversations')
              .select('*')
              .eq('id', conv.conversation_id)
              .eq('type', 'direct')
              .maybeSingle();

            if (convData) {
              console.log('Found existing conversation:', convData.id);
              return { data: convData, error: null, existing: true };
            }
          }
        }
      }

      console.log('Creating new conversation...');

      // Create new conversation
      const { data: newConv, error: convError } = await supabase
        .from('conversations')
        .insert({ type: 'direct' })
        .select()
        .single();

      if (convError) {
        console.error('Error creating conversation:', convError);
        return { data: null, error: convError, existing: false };
      }

      if (!newConv) {
        console.error('No conversation data returned');
        return { data: null, error: { message: 'Failed to create conversation' }, existing: false };
      }

      console.log('Conversation created:', newConv.id, 'Adding participants...');

      // Add participants
      const { error: partError } = await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: newConv.id, user_id: userId },
          { conversation_id: newConv.id, user_id: otherUserId },
        ]);

      if (partError) {
        console.error('Error adding participants:', partError);
        return { data: null, error: partError, existing: false };
      }

      console.log('Participants added successfully');
      return { data: newConv, error: null, existing: false };
    } catch (error: any) {
      console.error('Exception in createDirectConversation:', error);
      return { data: null, error: { message: error.message || 'Unknown error' }, existing: false };
    }
  },

  // Create a group conversation
  createGroupConversation: async (userId: string, name: string, memberIds: string[]) => {
    const { data: newConv, error: convError } = await supabase
      .from('conversations')
      .insert({ type: 'group', name })
      .select()
      .single();

    if (convError || !newConv) return { data: null, error: convError };

    // Add all participants including creator
    const participants = [userId, ...memberIds].map((id) => ({
      conversation_id: newConv.id,
      user_id: id,
    }));

    const { error: partError } = await supabase.from('conversation_participants').insert(participants);

    if (partError) return { data: null, error: partError };

    return { data: newConv, error: null };
  },

  // Add participants to an existing conversation
  addParticipantsToConversation: async (conversationId: string, userIds: string[]) => {
    const participants = userIds.map((id) => ({
      conversation_id: conversationId,
      user_id: id,
    }));

    const { error } = await supabase.from('conversation_participants').insert(participants);

    return { error };
  },

  // Search users for messaging
  searchUsers: async (query: string, currentUserId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, avatar_url, major, year')
      .neq('id', currentUserId)
      .ilike('name', `%${query}%`)
      .limit(10);

    return { data, error };
  },
};





