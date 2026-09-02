import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { triggerHaptic } from '../../utils/haptics';

interface AvatarBubbleProps {
  name: string;
  emoji: string;
  mood?: string;
  isMe?: boolean;
  onPress?: () => void;
}

const MOOD_EMOJIS: Record<string, string> = {
  in_love: '🥰',
  teddy_hugs: '🧸',
  happy: '😊',
  chill: '🌿',
  tired: '😴',
  need_hugs: '🥺',
  stressed: '😤',
};

export const AvatarBubble: React.FC<AvatarBubbleProps> = ({
  name,
  emoji,
  mood = 'happy',
  isMe = false,
  onPress,
}) => {
  const moodEmoji = MOOD_EMOJIS[mood] || '😊';
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: isMe ? -5 : 5,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: isMe ? 5 : -5,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    );
    floatLoop.start();
    return () => floatLoop.stop();
  }, [isMe]);

  const handlePress = () => {
    triggerHaptic('light');
    if (onPress) onPress();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={!onPress}
    >
      <Animated.View
        style={[
          styles.avatarCircle,
          isMe ? styles.myBorder : styles.partnerBorder,
          { transform: [{ translateY: floatAnim }] },
        ]}
      >
        <Text style={styles.avatarEmoji}>{emoji}</Text>
        <View style={styles.moodBadge}>
          <Text style={styles.moodText}>{moodEmoji}</Text>
        </View>
      </Animated.View>
      <Text style={styles.nameText} numberOfLines={1}>
        {name} {isMe ? '(You)' : ''}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 80,
  },
  avatarCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFEBF0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2.5,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  myBorder: {
    borderColor: Colors.primary,
  },
  partnerBorder: {
    borderColor: '#4FACFE',
  },
  avatarEmoji: {
    fontSize: 30,
  },
  moodBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  moodText: {
    fontSize: 13,
  },
  nameText: {
    marginTop: 6,
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});
