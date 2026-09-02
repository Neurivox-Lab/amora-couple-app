import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { triggerHaptic } from '../../utils/haptics';

interface PulsingHeartProps {
  emoji?: string;
  size?: number;
  onPress?: () => void;
}

export const PulsingHeart: React.FC<PulsingHeartProps> = ({
  emoji = '🧸❤️',
  size = 52,
  onPress,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // Realistic romantic heartbeat rhythm: Beat-Beat... Pause... Beat-Beat...
    const heartbeatSequence = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.18,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.9,
            duration: 180,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.4,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1.0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(1100), // Resting pause between heartbeats
      ])
    );

    heartbeatSequence.start();
    return () => heartbeatSequence.stop();
  }, []);

  const handleTap = () => {
    triggerHaptic('heartbeat');
    if (onPress) onPress();
  };

  return (
    <TouchableOpacity onPress={handleTap} activeOpacity={0.85}>
      <View style={[styles.wrapper, { width: size, height: size, borderRadius: size / 2 }]}>
        <Animated.View
          style={[
            styles.glowRing,
            {
              width: size + 16,
              height: size + 16,
              borderRadius: (size + 16) / 2,
              opacity: glowAnim,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
        <Animated.View style={[styles.innerCircle, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={[styles.emoji, { fontSize: size * 0.45 }]}>{emoji}</Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glowRing: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 107, 139, 0.25)',
  },
  innerCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#FFEBF2',
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emoji: {
    textAlign: 'center',
  },
});
