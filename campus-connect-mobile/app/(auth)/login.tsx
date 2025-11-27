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
  Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GraduationCap, Mail, Lock, Fingerprint } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAuth } from '@/providers';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signInWithBiometric, biometricAvailable, biometricEnabled } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  const handleBiometricLogin = async () => {
    setIsLoading(true);
    const { error } = await signInWithBiometric();
    setIsLoading(false);

    if (error) {
      Alert.alert('Authentication Failed', error.message);
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
        <View className="flex-1 px-6 pt-16 pb-10">
          {/* Logo & Header */}
          <Animated.View
            entering={FadeInUp.duration(800).springify()}
            className="items-center mb-10"
          >
            <View className="w-20 h-20 bg-blue-500 rounded-2xl items-center justify-center mb-4 shadow-lg">
              <GraduationCap size={40} color="#ffffff" />
            </View>
            <Text className="text-3xl font-bold text-gray-900">Campus Connect</Text>
            <Text className="text-base text-gray-500 mt-2">Welcome back!</Text>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.duration(800).delay(150).springify()}>
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
            <View className="mb-6">
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
                  placeholder="Enter your password"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className={`bg-blue-500 py-4 rounded-2xl items-center mb-4 ${isLoading ? 'opacity-70' : ''}`}
              style={{
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
                <Text className="text-white font-bold text-base">Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Biometric Login */}
            {biometricAvailable && biometricEnabled && (
              <TouchableOpacity
                onPress={handleBiometricLogin}
                disabled={isLoading}
                className="flex-row items-center justify-center py-4 bg-white border border-gray-200 rounded-2xl mb-4"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 4,
                  elevation: 2,
                }}
                activeOpacity={0.8}
              >
                <Fingerprint size={22} color="#3b82f6" />
                <Text className="text-blue-500 font-semibold text-base ml-2">
                  Sign in with Biometrics
                </Text>
              </TouchableOpacity>
            )}

            {/* Forgot Password */}
            <TouchableOpacity className="items-center mb-8">
              <Text className="text-blue-500 font-medium">Forgot Password?</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Sign Up Link */}
          <Animated.View
            entering={FadeInDown.duration(800).delay(300).springify()}
            className="flex-row justify-center mt-auto"
          >
            <Text className="text-gray-500">Don't have an account? </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text className="text-blue-500 font-bold">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
