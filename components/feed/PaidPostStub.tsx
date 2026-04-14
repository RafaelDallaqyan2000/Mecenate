import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { memo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { feedColors } from '@/components/feed/feedTheme';
import { DollarIcon } from '@/components/icons/DollarIcon';
import { AppButton } from '@/components/ui/AppButton';

export interface PaidPostStubProps {
  coverUrl: string;
  onDonatePress?: () => void;
}

function PaidPostStubComponent({ coverUrl, onDonatePress }: PaidPostStubProps) {
  return (
    <View style={styles.mediaWrap}>
      <Image source={{ uri: coverUrl }} style={styles.coverImage} contentFit="cover" />
      {Platform.OS === 'web' || Platform.OS === 'android' ? (
        <View style={[styles.blurFallback, StyleSheet.absoluteFill]} />
      ) : (
        <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
      )}
      <View style={[styles.dimLayer, StyleSheet.absoluteFill]} />
      <View style={styles.overlay}>
        <View style={styles.iconSquare}>
          <DollarIcon size={20} color={feedColors.cardBg} />
        </View>
        <View>
          <Text style={styles.messageLine1}>Контент скрыт пользователем.</Text>
          <Text style={styles.messageLine2}>Доступ откроется после доната</Text>
        </View>
        <AppButton
          title="Отправить донат"
          onPress={() => onDonatePress?.()}
          style={styles.donateButton}
        />
      </View>
    </View>
  );
}

export const PaidPostStub = memo(PaidPostStubComponent);

const styles = StyleSheet.create({
  mediaWrap: {
    width: '100%',
    height: 393,
    backgroundColor: feedColors.capsuleBg,
    overflow: 'hidden',
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
  },
  blurFallback: {
    backgroundColor: 'rgba(30, 30, 40, 0.72)',
  },
  dimLayer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSquare: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: feedColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  messageLine1: {
    color: feedColors.cardBg,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
  messageLine2: {
    color: feedColors.cardBg,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 6,
  },
  donateButton: {
    width: '100%',
    maxWidth: 239,
    alignSelf: 'center',
    marginTop: 13,
  },
});
