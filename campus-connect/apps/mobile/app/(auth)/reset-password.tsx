import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Lock, ArrowLeft } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { auth } from '@/lib/supabase';

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleResetPassword = async () => {
    // Clear previous message
    setMessage(null);

    // Validate passwords
    if (!newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await auth.updatePassword(newPassword);

      if (error) {
        // Handle specific error messages
        let errorMessage = error.message;
        if (error.message?.includes('expired') || error.message?.includes('invalid')) {
          errorMessage = 'This password reset link has expired or is invalid. Please request a new one.';
        } else if (error.message?.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
        setMessage({ type: 'error', text: errorMessage });
      } else {
        // Success - show message and redirect to login
        setMessage({
          type: 'success',
          text: 'Password reset successfully! Redirecting to login...',
        });
        // Navigate to login after 2-3 seconds
        setTimeout(() => {
          router.replace('/(auth)/login');
        }, 2500);
      }
    } catch (err: any) {
      console.error('Reset password error:', err);
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#f8fafc]"
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-12 pb-10">
          {/* Back Button */}
          <Animated.View entering={FadeInUp.duration(400)}>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-white mb-6"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <ArrowLeft size={22} color="#374151" />
            </TouchableOpacity>
          </Animated.View>

          {/* Header */}
          <Animated.View
            entering={FadeInUp.duration(800).springify()}
            className="mb-8"
          >
            <Text className="text-3xl font-bold text-gray-900">Reset Your Password</Text>
            <Text className="text-base text-gray-500 mt-2">
              Enter your new password below.
            </Text>
          </Animated.View>

          {/* Message Display */}
          {message && (
            <View
              style={{
                backgroundColor: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
                borderWidth: 1,
                borderColor: message.type === 'error' ? '#fecaca' : '#bbf7d0',
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  color: message.type === 'error' ? '#dc2626' : '#16a34a',
                  fontSize: 14,
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              >
                {message.text}
              </Text>
            </View>
          )}

          {/* Form */}
          <Animated.View entering={FadeInDown.duration(800).delay(150).springify()}>
            {/* New Password Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">New Password</Text>
              <View
                className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 py-3.5"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Lock size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-900"
                  placeholder="Enter new password"
                  placeholderTextColor="#9ca3af"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
              </View>
              <Text className="text-xs text-gray-400 mt-1.5 ml-1">
                Must be at least 6 characters
              </Text>
            </View>

            {/* Confirm Password Input */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Confirm Password</Text>
              <View
                className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 py-3.5"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Lock size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-900"
                  placeholder="Confirm new password"
                  placeholderTextColor="#9ca3af"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Reset Password Button */}
            <TouchableOpacity
              onPress={handleResetPassword}
              disabled={isLoading}
              style={{
                backgroundColor: '#3b82f6',
                paddingVertical: 16,
                borderRadius: 16,
                alignItems: 'center',
                marginBottom: 16,
                opacity: isLoading ? 0.7 : 1,
                shadowColor: '#3b82f6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                  Reset Password
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

