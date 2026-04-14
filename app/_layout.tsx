import { Manrope_500Medium, Manrope_700Bold, useFonts } from '@expo-google-fonts/manrope';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import { AppProviders } from '@/providers/AppProviders';
import { surface } from '@/tokens/colors';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope_500Medium,
    Manrope_700Bold,
  });
  const [appReady, setAppReady] = useState(false);

  const onLayoutRootView = useCallback(() => {
    if (fontsLoaded) {
      setAppReady(true);
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (!fontsLoaded || !appReady) return;
    void SplashScreen.hideAsync();
  }, [fontsLoaded, appReady]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: surface.screen }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: surface.screen }} onLayout={onLayoutRootView}>
      <AppProviders>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="dark" />
      </AppProviders>
    </View>
  );
}
