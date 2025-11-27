import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, X } from 'lucide-react-native';
import { useColorScheme } from '@/components/useColorScheme';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

export default function StreetViewScreen() {
  const params = useLocalSearchParams<{
    latitude: string;
    longitude: string;
    name: string;
    address: string;
  }>();
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState(true);

  const latitude = parseFloat(params.latitude);
  const longitude = parseFloat(params.longitude);
  const name = params.name || 'Location';
  const address = params.address || '';

  // Google Street View Embed with 360-degree view
  // Users can look around but cannot move to different locations
  // Note: Replace YOUR_GOOGLE_MAPS_API_KEY with your actual API key
  const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // TODO: Add to environment variables
  
  const streetViewEmbedHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body, html {
          width: 100%;
          height: 100%;
          overflow: hidden;
          touch-action: none;
        }
        #streetview {
          width: 100%;
          height: 100%;
        }
      </style>
    </head>
    <body>
      <div id="streetview"></div>
      <script>
        function initStreetView() {
          const panorama = new google.maps.StreetViewPanorama(
            document.getElementById('streetview'),
            {
              position: { lat: ${latitude}, lng: ${longitude} },
              pov: { heading: 0, pitch: 0 },
              zoom: 1,
              visible: true,
              disableDefaultUI: true,
              showRoadLabels: false,
              linksControl: false,
              panControl: false,
              enableCloseButton: false,
              fullscreenControl: false,
              zoomControl: false,
              addressControl: false,
              clickToGo: false,
              scrollwheel: false,
              disableDoubleClickZoom: true,
            }
          );
          
          // Prevent navigation to other Street View locations
          panorama.registerPanoProvider(function() {
            return null; // Return null to prevent loading other panoramas
          });
        }
      </script>
      <script async defer
        src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initStreetView&libraries=geometry">
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-black'}`} edges={['top']}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Header */}
      <View
        className={`absolute top-0 left-0 right-0 z-10 ${
          isDark ? 'bg-gray-900/90' : 'bg-black/80'
        }`}
        style={{ paddingTop: 8, paddingBottom: 8 }}
      >
        <View className="flex-row items-center justify-between px-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center"
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color="#ffffff" />
            <Text className="text-white font-medium ml-1">Back</Text>
          </TouchableOpacity>
          
          <View className="flex-1 mx-4">
            <Text className="text-white font-semibold text-sm" numberOfLines={1}>
              {name}
            </Text>
            {address && (
              <Text className="text-gray-300 text-xs" numberOfLines={1}>
                {address}
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2"
            activeOpacity={0.7}
          >
            <X size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Street View Container */}
      <View className="flex-1" style={{ marginTop: 0 }}>
        {loading && (
          <View className="absolute inset-0 items-center justify-center z-20 bg-black">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-white mt-4 text-sm">Loading Street View...</Text>
          </View>
        )}
        
        <WebView
          source={{ html: streetViewEmbedHtml }}
          style={{ flex: 1, backgroundColor: '#000' }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

