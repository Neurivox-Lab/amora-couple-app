import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Sparkles, RefreshCw } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

interface DecisionWheelProps {
  onSelected?: (item: string) => void;
}

const DEFAULT_SEGMENTS = [
  { label: 'Wood-fired Pizza 🍕', color: '#FF6B8B' },
  { label: 'Long Night Drive 🚗', color: '#4FACFE' },
  { label: 'Ice Cream Run 🍦', color: '#FFD166' },
  { label: 'Movie Blanket Fort 🍿', color: '#A18CD1' },
  { label: 'Full Body Massage 💆‍♀️', color: '#FA709A' },
  { label: 'Cook Pasta Together 🍝', color: '#2ED573' },
];

export const DecisionWheel: React.FC<DecisionWheelProps> = ({ onSelected }) => {
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const spinAnim = useRef(new Animated.Value(0)).current;

  const handleSpin = () => {
    if (spinning) return;
    triggerHaptic('heavy');
    setSpinning(true);
    setWinner(null);

    const randomIndex = Math.floor(Math.random() * DEFAULT_SEGMENTS.length);
    const segmentAngle = 360 / DEFAULT_SEGMENTS.length;
    // 5 full rotations + landing angle
    const targetDegree = 360 * 5 + (DEFAULT_SEGMENTS.length - 1 - randomIndex) * segmentAngle + (segmentAngle / 2);

    spinAnim.setValue(0);
    Animated.timing(spinAnim, {
      toValue: targetDegree,
      duration: 3500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      triggerHaptic('success');
      setSpinning(false);
      const selectedItem = DEFAULT_SEGMENTS[randomIndex].label;
      setWinner(selectedItem);
      if (onSelected) onSelected(selectedItem);
    });
  };

  const spinInterpolation = spinAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Sparkles size={14} color={Colors.gold} />
          <Text style={styles.badgeText}>Couples Decision Spinner</Text>
        </View>
      </View>

      <Text style={styles.title}>Can't Decide What To Do?</Text>
      <Text style={styles.subtitle}>Spin the wheel and let fate decide tonight’s romantic adventure!</Text>

      {/* Spinner Graphic */}
      <View style={styles.wheelWrapper}>
        <View style={styles.pointerTriangle} />
        <Animated.View style={[styles.wheelCircle, { transform: [{ rotate: spinInterpolation }] }]}>
          {DEFAULT_SEGMENTS.map((seg, i) => {
            const angle = (360 / DEFAULT_SEGMENTS.length) * i;
            return (
              <View
                key={i}
                style={[
                  styles.segmentItem,
                  {
                    transform: [{ rotate: `${angle}deg` }],
                    backgroundColor: seg.color,
                  },
                ]}
              >
                <Text style={styles.segmentText}>{seg.label.split(' ')[0]}</Text>
              </View>
            );
          })}
          <View style={styles.centerKnob}>
            <Text style={styles.centerKnobEmoji}>❤️</Text>
          </View>
        </Animated.View>
      </View>

      {/* Winner Display */}
      {winner && (
        <View style={styles.winnerBox}>
          <Text style={styles.winnerPre}>Tonight's Plan Is:</Text>
          <Text style={styles.winnerText}>{winner} ✨</Text>
        </View>
      )}

      {/* Spin Trigger Button */}
      <TouchableOpacity
        style={[styles.spinButton, spinning && styles.spinButtonDisabled]}
        onPress={handleSpin}
        disabled={spinning}
        activeOpacity={0.8}
      >
        <RefreshCw size={18} color="#FFFFFF" style={spinning ? styles.spinIcon : undefined} />
        <Text style={styles.spinButtonText}>{spinning ? 'Spinning...' : 'SPIN THE WHEEL 🎡'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFF3D6',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
    marginVertical: Spacing.sm,
  },
  headerRow: {
    marginBottom: Spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF9E6',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.full,
  },
  badgeText: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: '#B7791F',
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  subtitle: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  wheelWrapper: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.md,
    position: 'relative',
  },
  pointerTriangle: {
    position: 'absolute',
    top: -12,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.primaryDark,
    transform: [{ rotate: '180deg' }],
    zIndex: 10,
  },
  wheelCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  segmentItem: {
    position: 'absolute',
    top: 0,
    left: 50,
    width: 100,
    height: 100,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
  },
  segmentText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.heavy,
    color: '#FFFFFF',
  },
  centerKnob: {
    position: 'absolute',
    top: 70,
    left: 70,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  centerKnobEmoji: {
    fontSize: 24,
  },
  winnerBox: {
    backgroundColor: '#FFF0F5',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Spacing.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.primaryLight,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  winnerPre: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.semibold,
  },
  winnerText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
    marginTop: 2,
  },
  spinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: Spacing.xl,
    borderRadius: Spacing.borderRadius.full,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  spinButtonDisabled: {
    opacity: 0.6,
  },
  spinButtonText: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.sm + 1,
  },
  spinIcon: {
    transform: [{ rotate: '45deg' }],
  },
});
