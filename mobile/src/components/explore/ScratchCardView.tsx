import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Sparkles, Gift, CheckCircle } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

interface ScratchCardProps {
  number: number;
  title: string;
  category: string;
  isUnlocked?: boolean;
}

export const ScratchCardView: React.FC<ScratchCardProps> = ({
  number,
  title,
  category,
  isUnlocked = false,
}) => {
  const [scratched, setScratched] = useState(isUnlocked);

  const handleScratch = () => {
    if (scratched) return;
    triggerHaptic('heartbeat');
    setScratched(true);
  };

  return (
    <TouchableOpacity
      style={[styles.card, scratched ? styles.cardScratched : styles.cardLocked]}
      onPress={handleScratch}
      activeOpacity={0.85}
    >
      {scratched ? (
        <View style={styles.revealedContent}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
          <Text style={styles.revealedTitle}>{title}</Text>
          <View style={styles.unlockedRow}>
            <CheckCircle size={14} color={Colors.emeraldGreen} />
            <Text style={styles.unlockedText}>Revealed Date Idea ✨</Text>
          </View>
        </View>
      ) : (
        <View style={styles.mysteryContent}>
          <View style={styles.iconCircle}>
            <Gift size={24} color={Colors.gold} />
          </View>
          <Text style={styles.cardNum}>Mystery Date #{number}</Text>
          <Text style={styles.tapToScratch}>Tap to Scratch & Reveal 🎟️</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.borderRadius.lg,
    minHeight: 130,
    marginVertical: Spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
    borderWidth: 1.5,
  },
  cardLocked: {
    backgroundColor: '#2A1F33',
    borderColor: '#4A3B57',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  cardScratched: {
    backgroundColor: '#FFF8FA',
    borderColor: '#FFD6E2',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  mysteryContent: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 209, 102, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardNum: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: '#FFE29F',
  },
  tapToScratch: {
    fontSize: Typography.sizes.xs,
    color: '#D4C2E2',
    marginTop: 3,
  },
  revealedContent: {
    alignItems: 'center',
    width: '100%',
  },
  categoryBadge: {
    backgroundColor: '#FFEBF2',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Spacing.borderRadius.full,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  revealedTitle: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginVertical: 4,
  },
  unlockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  unlockedText: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.emeraldGreen,
    fontWeight: Typography.weights.semibold,
  },
});
