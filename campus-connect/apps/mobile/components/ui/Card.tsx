import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({
  children,
  onPress,
  style,
  className = '',
  variant = 'default',
}: CardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const variantStyles = {
    default: isDark ? 'bg-gray-800' : 'bg-white',
    elevated: isDark ? 'bg-gray-800' : 'bg-white',
    outlined: `bg-transparent border ${isDark ? 'border-gray-700' : 'border-gray-200'}`,
  };

  const shadowStyle =
    variant === 'elevated'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 8,
          elevation: 4,
        }
      : variant === 'default'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isDark ? 0.2 : 0.05,
          shadowRadius: 3,
          elevation: 2,
        }
      : {};

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      className={`rounded-2xl p-4 ${variantStyles[variant]} ${className}`}
      style={[shadowStyle, style]}
    >
      {children}
    </Wrapper>
  );
}

export default Card;








