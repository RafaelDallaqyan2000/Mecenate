import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextLayoutEventData,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

function fadeStartColor(solidHex: string): string {
  if (solidHex.startsWith('#') && solidHex.length === 7) {
    const r = parseInt(solidHex.slice(1, 3), 16);
    const g = parseInt(solidHex.slice(3, 5), 16);
    const b = parseInt(solidHex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},0)`;
  }
  return 'rgba(255,255,255,0)';
}

export interface ExpandableDescriptionProps {
  text: string;
  expandedText?: string;
  textStyle?: StyleProp<TextStyle>;
  lineHeight?: number;
  fadeColor: string;
  linkColor: string;
  reserveRight?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

export function ExpandableDescription({
  text,
  expandedText,
  textStyle,
  lineHeight = 20,
  fadeColor,
  linkColor,
  reserveRight = 108,
  containerStyle,
}: ExpandableDescriptionProps) {
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [needsMore, setNeedsMore] = useState(false);
  const measuredForWidth = useRef<number | null>(null);

  useEffect(() => {
    setExpanded(false);
    setNeedsMore(false);
    measuredForWidth.current = null;
  }, [text, expandedText]);

  const onTextLayoutMeasure = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    if (layoutWidth <= 0) return;
    if (measuredForWidth.current === layoutWidth) return;
    const lines = e.nativeEvent.lines;
    let more = lines.length > 2;
    if (
      !more &&
      expandedText &&
      expandedText.trim().length > 0 &&
      expandedText !== text
    ) {
      more = true;
    }
    setNeedsMore(more);
    measuredForWidth.current = layoutWidth;
  };

  const onContainerLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w !== layoutWidth) {
      setLayoutWidth(w);
      measuredForWidth.current = null;
    }
  };

  if (!text) {
    return null;
  }

  const measureW = Math.max(1, layoutWidth - reserveRight);

  const fullContent = expandedText ?? text;

  if (expanded) {
    return (
      <View style={containerStyle}>
        <Text style={[textStyle, { lineHeight }]}>{fullContent}</Text>
      </View>
    );
  }

  return (
    <View style={containerStyle} onLayout={onContainerLayout}>
      {layoutWidth > 0 ? (
        <Text
          pointerEvents="none"
          style={[textStyle, styles.measure, { width: measureW, lineHeight }]}
          onTextLayout={onTextLayoutMeasure}>
          {text}
        </Text>
      ) : null}
      <View style={styles.block}>
        <Text
          numberOfLines={2}
          style={[textStyle, { lineHeight }, needsMore && { paddingRight: reserveRight }]}>
          {text}
        </Text>
        {needsMore ? (
          <>
            <LinearGradient
              pointerEvents="none"
              colors={[fadeStartColor(fadeColor), fadeColor]}
              locations={[0.15, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[styles.fade, { height: lineHeight, bottom: 0 }]}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Показать еще"
              hitSlop={8}
              style={styles.moreHit}
              onPress={() => setExpanded(true)}>
              <Text style={[textStyle, styles.moreLabel, { color: linkColor, lineHeight }]}>Показать еще</Text>
            </Pressable>
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  measure: {
    position: 'absolute',
    opacity: 0,
    left: 0,
    top: 0,
    zIndex: -1,
  },
  block: {
    position: 'relative',
  },
  fade: {
    position: 'absolute',
    right: 96,
    width: 72,
  },
  moreHit: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  moreLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
});
