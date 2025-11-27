import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle } from 'lucide-react-native';

export default function AuthCallbackScreen() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if we have tokens in the URL (from email verification)
        const accessToken = params.access_token as string;
        const refreshToken = params.refresh_token as string;
        const type = params.type as string;

        if (type === 'signup' || type === 'email_change' || type === 'recovery') {
          if (accessToken && refreshToken) {
            // Set the session with the tokens from the URL
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              throw error;
            }

            setStatus('success');
            setMessage('Email verified successfully! Redirecting to login...');
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
              router.replace('/(auth)/login');
            }, 2000);
          } else {
            // No tokens, check if already verified
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
              setStatus('success');
              setMessage('You are already signed in! Redirecting...');
              setTimeout(() => {
                router.replace('/(tabs)/home');
              }, 2000);
            } else {
              setStatus('success');
              setMessage('Email verified! Please sign in.');
              setTimeout(() => {
                router.replace('/(auth)/login');
              }, 2000);
            }
          }
        } else {
          // Unknown type, just redirect to login
          setStatus('success');
          setMessage('Redirecting to login...');
          setTimeout(() => {
            router.replace('/(auth)/login');
          }, 2000);
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage(error.message || 'Verification failed. Please try again.');
      }
    };

    handleCallback();
  }, [params]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 24,
          padding: 32,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
          width: '100%',
          maxWidth: 400,
        }}
      >
        {status === 'loading' && (
          <>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text
              style={{
                marginTop: 24,
                fontSize: 18,
                fontWeight: '600',
                color: '#374151',
                textAlign: 'center',
              }}
            >
              {message}
            </Text>
          </>
        )}

        {status === 'success' && (
          <>
            <View
              style={{
                backgroundColor: '#dcfce7',
                borderRadius: 50,
                padding: 16,
              }}
            >
              <CheckCircle size={48} color="#16a34a" />
            </View>
            <Text
              style={{
                marginTop: 24,
                fontSize: 24,
                fontWeight: 'bold',
                color: '#16a34a',
                textAlign: 'center',
              }}
            >
              Success!
            </Text>
            <Text
              style={{
                marginTop: 12,
                fontSize: 16,
                color: '#6b7280',
                textAlign: 'center',
              }}
            >
              {message}
            </Text>
          </>
        )}

        {status === 'error' && (
          <>
            <View
              style={{
                backgroundColor: '#fee2e2',
                borderRadius: 50,
                padding: 16,
              }}
            >
              <XCircle size={48} color="#dc2626" />
            </View>
            <Text
              style={{
                marginTop: 24,
                fontSize: 24,
                fontWeight: 'bold',
                color: '#dc2626',
                textAlign: 'center',
              }}
            >
              Verification Failed
            </Text>
            <Text
              style={{
                marginTop: 12,
                fontSize: 16,
                color: '#6b7280',
                textAlign: 'center',
              }}
            >
              {message}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}



