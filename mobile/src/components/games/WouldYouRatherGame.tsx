import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GameQuestion } from '../../types';
import { Heart, Sparkles, CheckCircle2, Lock } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

interface WouldYouRatherGameProps {
  question: GameQuestion;
  onAnswer: (selectedOption: string) => void;
  partnerName: string;
}

export const WouldYouRatherGame: React.FC<WouldYouRatherGameProps> = ({
  question,
  onAnswer,
  partnerName,
}) => {
  const [selected, setSelected] = useState<string | null>(question.myAnswer || null);

  const handleSelect = (option: string) => {
    if (selected) return;
    triggerHaptic('medium');
    setSelected(option);
    onAnswer(option);
  };

  const optionA = question.optionA || 'Option A';
  const optionB = question.optionB || 'Option B';
  const isAnswered = !!selected;
  const isBothAnswered = question.bothAnswered;

  return (
    <View style={styles.container}>
      {/* Question Spice Header */}
      <View style={styles.badgeRow}>
        <View style={styles.categoryBadge}>
          <Sparkles size={14} color={Colors.primary} />
          <Text style={styles.categoryText}>Would You Rather</Text>
        </View>
        {question.spiceLevel && question.spiceLevel > 1 && (
          <View style={styles.spiceBadge}>
            <Text style={styles.spiceText}>{'🔥'.repeat(question.spiceLevel)}</Text>
          </View>
        )}
      </View>

      <Text style={styles.prompt}>{question.prompt}</Text>

      {/* Option A */}
      <TouchableOpacity
        style={[
          styles.optionCard,
          styles.optionCardA,
          selected === optionA && styles.optionSelectedA,
        ]}
        onPress={() => handleSelect(optionA)}
        activeOpacity={0.8}
        disabled={isAnswered}
      >
        <Text style={[styles.optionText, selected === optionA && styles.optionTextSelected]}>
          {optionA}
        </Text>
        {selected === optionA && (
          <View style={styles.checkIcon}>
            <CheckCircle2 size={20} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>

      {/* OR Divider */}
      <View style={styles.orDivider}>
        <View style={styles.orLine} />
        <View style={styles.orCircle}>
          <Text style={styles.orText}>OR</Text>
        </View>
        <View style={styles.orLine} />
      </View>

      {/* Option B */}
      <TouchableOpacity
        style={[
          styles.optionCard,
          styles.optionCardB,
          selected === optionB && styles.optionSelectedB,
        ]}
        onPress={() => handleSelect(optionB)}
        activeOpacity={0.8}
        disabled={isAnswered}
      >
        <Text style={[styles.optionText, selected === optionB && styles.optionTextSelected]}>
          {optionB}
        </Text>
        {selected === optionB && (
          <View style={styles.checkIcon}>
            <CheckCircle2 size={20} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>

      {/* Partner Status Box */}
      <View style={styles.partnerStatusBox}>
        {isBothAnswered ? (
          <View style={[styles.matchResult, question.isMatch ? styles.matchBox : styles.differBox]}>
            <Heart size={18} color={question.isMatch ? '#E84A6E' : Colors.textSecondary} fill={question.isMatch ? '#E84A6E' : 'none'} />
            <Text style={[styles.matchText, question.isMatch && styles.matchTextHighlight]}>
              {question.isMatch
                ? `🎉 Perfect Match! Both chose ${question.partnerAnswer}`
                : `${partnerName} chose: ${question.partnerAnswer}`}
            </Text>
          </View>
        ) : isAnswered ? (
          <View style={styles.waitingBox}>
            <Lock size={16} color={Colors.textSecondary} />
            <Text style={styles.waitingText}>
              Waiting for {partnerName} to answer to reveal match... 🔒
            </Text>
          </View>
        ) : (
          <Text style={styles.hintText}>
            Tap your choice! Answers are revealed only when both of you answer.
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#FFEBF0',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    marginVertical: Spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFEBF2',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.full,
  },
  categoryText: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  spiceBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  spiceText: {
    fontSize: 14,
  },
  prompt: {
    fontSize: Typography.sizes.md + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  optionCard: {
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 58,
    position: 'relative',
  },
  optionCardA: {
    backgroundColor: '#FFF5F8',
    borderColor: '#FFD6E2',
  },
  optionSelectedA: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  optionCardB: {
    backgroundColor: '#F3F8FF',
    borderColor: '#D4E6FF',
  },
  optionSelectedB: {
    backgroundColor: '#4FACFE',
    borderColor: '#1E90FF',
  },
  optionText: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
  },
  checkIcon: {
    position: 'absolute',
    right: 14,
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  orCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF5F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Spacing.sm,
  },
  orText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.heavy,
    color: Colors.textSecondary,
  },
  partnerStatusBox: {
    marginTop: Spacing.md,
  },
  matchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs + 2,
    padding: Spacing.sm + 2,
    borderRadius: Spacing.borderRadius.md,
  },
  matchBox: {
    backgroundColor: '#FFEBF2',
    borderWidth: 1,
    borderColor: '#FFB8CE',
  },
  differBox: {
    backgroundColor: '#F5F6FA',
  },
  matchText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  matchTextHighlight: {
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
  waitingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FAF5F7',
    padding: Spacing.sm,
    borderRadius: Spacing.borderRadius.md,
  },
  waitingText: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textSecondary,
  },
  hintText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
