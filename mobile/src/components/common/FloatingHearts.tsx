import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Animated, Dimensions, Easing } from 'react-native';

const { width, height } = Dimensions.get('window');

const TEDDY_AND_LOVE_EMOJIS = [
  '🧸', '💖', '🧸', '💕', '💗', '🧸❤️', '💓', '💞', '🧸', '💘', '🌹', '💌', '🌸', '✨', '💋', '🍓', '🐻', '🎀', '🥰'
];

interface FloatingHeartItem {
  id: number;
  x: number;
  scale: number;
  emoji: string;
  anim: Animated.Value;
  swayAnim: Animated.Value;
  duration: number;
  delay: number;
}

export const FloatingHearts: React.FC<{ visible: boolean; count?: number }> = ({ visible, count = 32 }) => {
  const [items, setItems] = useState<FloatingHeartItem[]>([]);

  useEffect(() => {
    if (visible) {
      const newItems: FloatingHeartItem[] = Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * (width - 60) + 15,
        scale: 0.8 + Math.random() * 0.9,
        emoji: TEDDY_AND_LOVE_EMOJIS[Math.floor(Math.random() * TEDDY_AND_LOVE_EMOJIS.length)],
        anim: new Animated.Value(0),
        swayAnim: new Animated.Value(0),
        duration: 2600 + Math.random() * 1200,
        delay: Math.random() * 450,
      }));

      setItems(newItems);

      newItems.forEach((item) => {
        // Vertical upward float
        Animated.timing(item.anim, {
          toValue: 1,
          duration: item.duration,
          delay: item.delay,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start();

        // Horizontal swaying oscillation
        Animated.loop(
          Animated.sequence([
            Animated.timing(item.swayAnim, {
              toValue: 1,
              duration: 500 + Math.random() * 400,
              useNativeDriver: true,
            }),
            Animated.timing(item.swayAnim, {
              toValue: -1,
              duration: 500 + Math.random() * 400,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    } else {
      setItems([]);
    }
  }, [visible, count]);

  if (!visible || items.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {items.map((item) => {
        const translateY = item.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [height * 0.9, -120],
        });
        const opacity = item.anim.interpolate({
          inputRange: [0, 0.15, 0.75, 1],
          outputRange: [0, 1, 1, 0],
        });
        const translateX = item.swayAnim.interpolate({
          inputRange: [-1, 1],
          outputRange: [-24, 24],
        });
        const rotate = item.anim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${(item.id % 2 === 0 ? 1 : -1) * 45}deg`],
        });

        return (
          <Animated.View
            key={item.id}
            style={[
              styles.item,
              {
                left: item.x,
                opacity,
                transform: [
                  { translateY },
                  { translateX },
                  { scale: item.scale },
                  { rotate },
                ],
              },
            ]}
          >
            <Text style={styles.emojiText}>{item.emoji}</Text>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99999,
  },
  item: {
    position: 'absolute',
    bottom: 0,
  },
  emojiText: {
    fontSize: 34,
    textShadowColor: 'rgba(255, 107, 139, 0.4)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
});
