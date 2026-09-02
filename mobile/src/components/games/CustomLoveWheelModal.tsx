import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, TextInput, ScrollView, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../common/GradientButton';
import { Sparkles, Dices, Plus, X, Heart, Flame, Gift, RefreshCw } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

const { width } = Dimensions.get('window');

const DEFAULT_DARES = [
  '💆 15-Min Gentle Back Massage',
  '🍳 Breakfast in Bed Tomorrow',
  '💋 10 Passionate Kisses Right Now',
  '🍿 Pick Tonight’s Movie (No Debates)',
  '🧋 Sweet Bubble Tea / Coffee Run',
  '🧸 5-Minute Uninterrupted Cuddle Wrap',
  '🍦 Midnight Ice Cream Drive',
  '🕺 Do a 30-Second Silly Happy Dance',
];

interface CustomLoveWheelModalProps {
  visible: boolean;
  partnerName: string;
  onClose: () => void;
  onRewardHearts?: (hearts: number) => void;
}

export const CustomLoveWheelModal: React.FC<CustomLoveWheelModalProps> = ({
  visible,
  partnerName,
  onClose,
  onRewardHearts,
}) => {
  const [dares, setDares] = useState<string[]>(DEFAULT_DARES);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winnerDare, setWinnerDare] = useState<string | null>(null);
  const [newDareText, setNewDareText] = useState('');
  const [showAddDare, setShowAddDare] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;

  const handleSpin = () => {
    if (isSpinning || dares.length === 0) return;
    triggerHaptic('heavy');
    setIsSpinning(true);
    setWinnerDare(null);

    const randomExtraRounds = 4 + Math.floor(Math.random() * 4);
    const randomPick = Math.floor(Math.random() * dares.length);
    const targetDeg = randomExtraRounds * 360 + (randomPick * (360 / dares.length));

    spinAnim.setValue(0);
    Animated.timing(spinAnim, {
      toValue: targetDeg,
      duration: 3500,
      useNativeDriver: true,
    }).start(() => {
      triggerHaptic('success');
      setIsSpinning(false);
      setWinnerDare(dares[randomPick]);
      if (onRewardHearts) onRewardHearts(25);
    });
  };

  const handleAddCustomDare = () => {
    if (!newDareText.trim()) return;
    triggerHaptic('light');
    setDares(prev => [...prev, newDareText.trim()]);
    setNewDareText('');
    setShowAddDare(false);
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={22} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>Love Rewards Dare Spinner 🎡💖</Text>
            <Text style={styles.headerSub}>Spin for sweet couple favors with {partnerName}</Text>
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              triggerHaptic('light');
              setShowAddDare(true);
            }}
          >
            <Plus size={18} color={Colors.primaryDark} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* WHEEL DISPLAY */}
          <View style={styles.wheelArea}>
            <View style={styles.pointerTriangle}>
              <Text style={styles.pointerText}>▼</Text>
            </View>

            <Animated.View style={[styles.wheelCircle, { transform: [{ rotate: spin }] }]}>
              <View style={styles.wheelHub}>
                <Heart size={28} color={Colors.loveRed} fill={Colors.loveRed} />
              </View>
            </Animated.View>
          </View>

          {/* SPIN BUTTON */}
          <GradientButton
            title={isSpinning ? "Spinning the Love Wheel... ✨" : "Spin for Love Reward 🎡"}
            onPress={handleSpin}
            disabled={isSpinning}
            style={styles.spinBtn}
          />

          {/* WINNER REVEAL CARD */}
          {winnerDare && (
            <View style={styles.winnerCard}>
              <View style={styles.winnerBadge}>
                <Sparkles size={14} color={Colors.primaryDark} />
                <Text style={styles.winnerBadgeText}>REWARD WON!</Text>
              </View>
              <Text style={styles.winnerText}>{winnerDare}</Text>
              <Text style={styles.winnerPrompt}>{partnerName} must deliver this sweet reward today! 🥰</Text>
            </View>
          )}

          {/* DARE LIST */}
          <View style={styles.daresListSection}>
            <View style={styles.daresHeader}>
              <Text style={styles.daresTitle}>Active Wheel Dares ({dares.length}):</Text>
              <TouchableOpacity onPress={() => setDares(DEFAULT_DARES)}>
                <Text style={styles.resetText}>Reset Defaults 🔄</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.daresChips}>
              {dares.map((dare, i) => (
                <View key={i} style={styles.dareChip}>
                  <Text style={styles.dareText}>{dare}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* ADD DARE MODAL */}
        <Modal visible={showAddDare} animationType="slide" transparent onRequestClose={() => setShowAddDare(false)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Custom Love Dare ✍️</Text>
                <TouchableOpacity onPress={() => setShowAddDare(false)}>
                  <X size={20} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="e.g. 15-min foot massage / Cook my favorite noodles"
                placeholderTextColor={Colors.textMuted}
                value={newDareText}
                onChangeText={setNewDareText}
              />

              <GradientButton
                title="Add to Spinner Wheel 🎡"
                onPress={handleAddCustomDare}
                disabled={!newDareText.trim()}
                style={{ width: '100%', marginTop: Spacing.sm }}
              />
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  headerTitleBox: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  headerSub: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  addBtn: {
    padding: Spacing.xs,
    backgroundColor: '#FFEBF2',
    borderRadius: Spacing.borderRadius.full,
  },
  scroll: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  wheelArea: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.lg,
  },
  pointerTriangle: {
    position: 'absolute',
    top: -15,
    zIndex: 10,
  },
  pointerText: {
    fontSize: 28,
    color: Colors.loveRed,
  },
  wheelCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 8,
    borderColor: '#FFE0EB',
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  wheelHub: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  spinBtn: {
    width: '100%',
    marginVertical: Spacing.sm,
  },
  winnerCard: {
    width: '100%',
    backgroundColor: '#FFF9E6',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFE8A3',
    marginVertical: Spacing.md,
  },
  winnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF0C2',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Spacing.borderRadius.full,
    marginBottom: 4,
  },
  winnerBadgeText: {
    fontSize: 10,
    fontWeight: Typography.weights.heavy,
    color: '#8A5D00',
  },
  winnerText: {
    fontSize: Typography.sizes.md + 1,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginVertical: 4,
  },
  winnerPrompt: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  daresListSection: {
    width: '100%',
    marginTop: Spacing.md,
  },
  daresHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  daresTitle: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  resetText: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
  daresChips: {
    gap: 6,
  },
  dareChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: Spacing.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dareText: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textPrimary,
    fontWeight: Typography.weights.medium,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  input: {
    backgroundColor: '#FAF5F7',
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
  },
});
