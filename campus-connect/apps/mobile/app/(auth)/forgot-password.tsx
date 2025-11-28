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
import { Mail, ArrowLeft } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { auth } from '@/lib/supabase';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleResetPassword = async () => {
    // Clear previous message
    setMessage(null);

    // Trim and lowercase email
    const trimmedEmail = email.trim().toLowerCase();

    // Validate email is not empty
    if (!trimmedEmail) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await auth.resetPassword(trimmedEmail);

      // Always show success message (for security, never reveal if email exists)
      setMessage({
        type: 'success',
        text: 'If an account exists, a password reset link has been sent to your email. Please check your inbox and spam folder.',
      });
    } catch (err: any) {
      console.error('Password reset error:', err);
      // Still show success for security
      setMessage({
        type: 'success',
        text: 'If an account exists, a password reset link has been sent to your email. Please check your inbox and spam folder.',
      });
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
            <Text className="text-3xl font-bold text-gray-900">Forgot Password?</Text>
            <Text className="text-base text-gray-500 mt-2">
              Enter your email address and we'll send you a link to reset your password.
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
            {/* Email Input */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Email</Text>
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
                <Mail size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-900"
                  placeholder="your.email@university.edu"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Send Reset Link Button */}
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
                  Send Reset Link
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Back to Login Link */}
          <Animated.View
            entering={FadeInDown.duration(800).delay(300).springify()}
            className="flex-row justify-center mt-auto"
          >
            <Text className="text-gray-500">Remember your password? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-blue-500 font-bold">Back to Login</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

