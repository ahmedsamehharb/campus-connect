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
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAuth } from '@/providers';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    // Clear previous message
    setMessage(null);
    
    // Trim inputs
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password;

    if (!trimmedName || !trimmedEmail || !trimmedPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    if (trimmedPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (trimmedPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await signUp(trimmedEmail, trimmedPassword, trimmedName);
      
      if (error) {
        // Handle specific error messages
        let errorMessage = error.message;
        if (error.message?.includes('already registered')) {
          errorMessage = 'An account with this email already exists. Please sign in instead.';
        } else if (error.message?.includes('invalid')) {
          errorMessage = 'Please check your email address and try again.';
        }
        setMessage({ type: 'error', text: errorMessage });
      } else {
        // Success - show message and navigate after delay
        setMessage({ 
          type: 'success', 
          text: 'Account created successfully! Redirecting to sign in...' 
        });
        // Navigate to login after 2 seconds
        setTimeout(() => {
          router.replace('/(auth)/login');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Signup error:', err);
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
            <Text className="text-3xl font-bold text-gray-900">Create Account</Text>
            <Text className="text-base text-gray-500 mt-2">
              Join Campus Connect and get started
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
            {/* Name Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Full Name</Text>
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
                <User size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-900"
                  placeholder="John Doe"
                  placeholderTextColor="#9ca3af"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Input */}
            <View className="mb-4">
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

            {/* Password Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Password</Text>
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
                  placeholder="Create a password"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
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
                  elevation: 2,
                }}
              >
                <Lock size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-900"
                  placeholder="Confirm your password"
                  placeholderTextColor="#9ca3af"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleSignUp}
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
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Terms */}
            <Text className="text-center text-xs text-gray-400 mb-8 leading-5">
              By signing up, you agree to our{' '}
              <Text className="text-blue-500 font-medium">Terms of Service</Text> and{' '}
              <Text className="text-blue-500 font-medium">Privacy Policy</Text>
            </Text>
          </Animated.View>

          {/* Sign In Link */}
          <Animated.View
            entering={FadeInDown.duration(800).delay(300).springify()}
            className="flex-row justify-center mt-auto"
          >
            <Text className="text-gray-500">Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-blue-500 font-bold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
