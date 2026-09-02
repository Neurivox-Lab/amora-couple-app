import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Sparkles, CheckCircle2, Lock, Heart } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

interface WhoIsMoreLikelyProps {
  prompt: string;
  partnerName: string;
  onVote: (vote: 'ME' | 'PARTNER' | 'BOTH') => void;
  myVote?: 'ME' | 'PARTNER' | 'BOTH' | null;
  partnerVote?: 'ME' | 'PARTNER' | 'BOTH' | 'LOCKED' | null;
}

export const WhoIsMoreLikelyGame: React.FC<WhoIsMoreLikelyProps> = ({
  prompt,
  partnerName,
  onVote,
  myVote: initialMyVote = null,
  partnerVote = null,
}) => {
  const [voted, setVoted] = useState<'ME' | 'PARTNER' | 'BOTH' | null>(initialMyVote);

  const handleVote = (choice: 'ME' | 'PARTNER' | 'BOTH') => {
    if (voted) return;
    triggerHaptic('medium');
    setVoted(choice);
    onVote(choice);
  };

  const isBothAnswered = !!(voted && partnerVote && partnerVote !== 'LOCKED');
  const isMatch = isBothAnswered && (
    (voted === 'ME' && partnerVote === 'PARTNER') ||
    (voted === 'PARTNER' && partnerVote === 'ME') ||
    (voted === 'BOTH' && partnerVote === 'BOTH')
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Sparkles size={14} color="#00C9FF" />
          <Text style={styles.badgeText}>Who Is More Likely To?</Text>
        </View>
      </View>

      <Text style={styles.prompt}>{prompt}</Text>

      {/* 3 Voting Buttons */}
      <View style={styles.choicesRow}>
        {/* Vote Me */}
        <TouchableOpacity
          style={[styles.choiceCard, voted === 'ME' && styles.choiceCardSelected]}
          onPress={() => handleVote('ME')}
          activeOpacity={0.8}
          disabled={!!voted}
        >
          <Text style={styles.choiceEmoji}>🙋‍♀️</Text>
          <Text style={[styles.choiceLabel, voted === 'ME' && styles.choiceLabelSelected]}>
            Definitely Me
          </Text>
          {voted === 'ME' && (
            <View style={styles.checkBadge}>
              <CheckCircle2 size={16} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>

        {/* Vote Both */}
        <TouchableOpacity
          style={[styles.choiceCard, styles.choiceCardMiddle, voted === 'BOTH' && styles.choiceCardSelectedBoth]}
          onPress={() => handleVote('BOTH')}
          activeOpacity={0.8}
          disabled={!!voted}
        >
          <Text style={styles.choiceEmoji}>👫</Text>
          <Text style={[styles.choiceLabel, voted === 'BOTH' && styles.choiceLabelSelected]}>
            Both of Us!
          </Text>
          {voted === 'BOTH' && (
            <View style={styles.checkBadge}>
              <CheckCircle2 size={16} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>

        {/* Vote Partner */}
        <TouchableOpacity
          style={[styles.choiceCard, voted === 'PARTNER' && styles.choiceCardSelectedPartner]}
          onPress={() => handleVote('PARTNER')}
          activeOpacity={0.8}
          disabled={!!voted}
        >
          <Text style={styles.choiceEmoji}>🙋‍♂️</Text>
          <Text style={[styles.choiceLabel, voted === 'PARTNER' && styles.choiceLabelSelected]}>
            {partnerName}
          </Text>
          {voted === 'PARTNER' && (
            <View style={styles.checkBadge}>
              <CheckCircle2 size={16} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Result Status */}
      <View style={styles.statusBox}>
        {isBothAnswered ? (
          <View style={[styles.resultBanner, isMatch ? styles.matchBanner : styles.differBanner]}>
            <Heart size={18} color={isMatch ? '#FF4757' : Colors.textSecondary} fill={isMatch ? '#FF4757' : 'none'} />
            <Text style={[styles.resultText, isMatch && styles.matchText]}>
              {isMatch ? "🎉 You both agreed! +15 ❤️" : `You voted ${voted}, ${partnerName} voted ${partnerVote}`}
            </Text>
          </View>
        ) : voted ? (
          <View style={styles.waitingBanner}>
            <Lock size={15} color={Colors.textSecondary} />
            <Text style={styles.waitingText}>Vote locked! Waiting for {partnerName}... 🔒</Text>
          </View>
        ) : (
          <Text style={styles.hintText}>Point your finger! Who is guilty of this? 😂</Text>
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
    borderColor: '#E6F4FF',
    shadowColor: '#4FACFE',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
    marginVertical: Spacing.sm,
  },
  headerRow: {
    marginBottom: Spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EBF8FF',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: '#0083B0',
  },
  prompt: {
    fontSize: Typography.sizes.md + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  choicesRow: {
    flexDirection: 'row',
    gap: Spacing.xs + 2,
    justifyContent: 'space-between',
  },
  choiceCard: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    borderRadius: Spacing.borderRadius.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    position: 'relative',
  },
  choiceCardMiddle: {
    backgroundColor: '#FFF9FB',
  },
  choiceCardSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  choiceCardSelectedBoth: {
    backgroundColor: Colors.lavender,
    borderColor: '#9354C8',
  },
  choiceCardSelectedPartner: {
    backgroundColor: '#4FACFE',
    borderColor: '#1E90FF',
  },
  choiceEmoji: {
    fontSize: 26,
    marginBottom: 4,
  },
  choiceLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  choiceLabelSelected: {
    color: '#FFFFFF',
  },
  checkBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  statusBox: {
    marginTop: Spacing.md,
  },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: Spacing.sm,
    borderRadius: Spacing.borderRadius.md,
  },
  matchBanner: {
    backgroundColor: '#FFEBF0',
    borderWidth: 1,
    borderColor: '#FFCCD8',
  },
  differBanner: {
    backgroundColor: '#F1F2F6',
  },
  resultText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  matchText: {
    color: Colors.loveRed,
    fontWeight: Typography.weights.bold,
  },
  waitingBanner: {
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
