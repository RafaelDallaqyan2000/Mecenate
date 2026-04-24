import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { Platform } from 'react-native';

export function useTriggerHaptic() {
  return useCallback(() => {
    if (Platform.OS === 'web') return;
    void Haptics.selectionAsync();
  }, []);
}
