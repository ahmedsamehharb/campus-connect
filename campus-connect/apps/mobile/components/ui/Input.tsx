import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useColorScheme } from '@/components/useColorScheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

export function Input({
  label,
  error,
  hint,
  icon,
  rightIcon,
  isPassword = false,
  ...props
}: InputProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      {label && (
        <Text
          className={`text-sm font-medium mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          {label}
        </Text>
      )}
      <View
        className={`
          flex-row items-center px-4 py-3 rounded-xl border
          ${isDark ? 'bg-gray-800' : 'bg-gray-50'}
          ${
            error
              ? 'border-red-500'
              : isFocused
              ? 'border-primary-500'
              : isDark
              ? 'border-gray-700'
              : 'border-gray-200'
          }
        `}
      >
        {icon && <View className="mr-3">{icon}</View>}
        <TextInput
          className={`flex-1 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}
          placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-2">
            {showPassword ? (
              <EyeOff size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
            ) : (
              <Eye size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
            )}
          </TouchableOpacity>
        )}
        {rightIcon && !isPassword && <View className="ml-2">{rightIcon}</View>}
      </View>
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
      {hint && !error && (
        <Text className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {hint}
        </Text>
      )}
    </View>
  );
}

export default Input;






