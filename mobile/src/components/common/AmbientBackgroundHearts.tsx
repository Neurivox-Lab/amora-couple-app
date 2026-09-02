import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const AMBIENT_PARTICLES = ['✨', '🌸', '💖', '🧸', '💫', '💕'];

export const AmbientBackgroundHearts: React.FC = () => {
  const particles = useRef(
    Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: (i * (width / 8)) + Math.random() * 20,
      animY: new Animated.Value(0),
      animOpacity: new Animated.Value(0),
      scale: 0.6 + Math.random() * 0.4,
      emoji: AMBIENT_PARTICLES[i % AMBIENT_PARTICLES.length],
      duration: 7000 + Math.random() * 4000,
      delay: i * 800,
    }))
  ).current;

  useEffect(() => {
    particles.forEach((p) => {
      const loopAnim = Animated.loop(
        Animated.sequence([
          Animated.delay(p.delay),
          Animated.parallel([
            Animated.timing(p.animY, {
              toValue: 1,
              duration: p.duration,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(p.animOpacity, {
                toValue: 0.6,
                duration: p.duration * 0.3,
                useNativeDriver: true,
              }),
              Animated.timing(p.animOpacity, {
                toValue: 0,
                duration: p.duration * 0.7,
                useNativeDriver: true,
              }),
            ]),
          ]),
          Animated.timing(p.animY, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
      loopAnim.start();
    });
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((p) => {
        const translateY = p.animY.interpolate({
          inputRange: [0, 1],
          outputRange: [height * 0.8, -40],
        });

        return (
          <Animated.View
            key={p.id}
            style={[
              styles.particle,
              {
                left: p.x,
                opacity: p.animOpacity,
                transform: [{ translateY }, { scale: p.scale }],
              },
            ]}
          >
            <Text style={styles.emoji}>{p.emoji}</Text>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    bottom: 0,
  },
  emoji: {
    fontSize: 16,
    opacity: 0.7,
  },
});
