// Layout principal de l'application avec Expo Router

import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "../global.css";
import { initializeNotifications } from '../src/services';
import { hasCompletedOnboarding } from '../src/storage';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkOnboarding();
    initializeNotifications();
  }, []);

  const checkOnboarding = async () => {
    const completed = await hasCompletedOnboarding();

    // Si l'onboarding n'est pas complété et qu'on n'est pas déjà sur welcome/onboarding
    if (
      !completed &&
      !(segments as string[]).includes('welcome') &&
      !(segments as string[]).includes('onboarding')
    ) {
      router.replace('/welcome');
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="welcome" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-dream" />
        <Stack.Screen name="dream-details" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="insights" />
        <Stack.Screen name="badges" />
        <Stack.Screen name="rituals" />
        <Stack.Screen name="lunar-journal" />
        <Stack.Screen name="constellation" />
        <Stack.Screen name="calendar" />
        <Stack.Screen name="exercise" />
      </Stack>
    </GestureHandlerRootView>
  );
}
