import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../common/GradientButton';
import { Trophy, Award, Sparkles, Heart, Flame, Lock, CheckCircle2, X, Star, Crown } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

const { width } = Dimensions.get('window');

interface BadgeItem {
  id: string;
  title: string;
  description: string;
  emoji: string;
  isUnlocked: boolean;
  progress: string;
  category: string;
  rewardHearts: number;
}

const COUPLE_BADGES: BadgeItem[] = [
  {
    id: 'b1',
    title: 'Mind Readers 🧠',
    description: 'Score 90%+ compatibility on 5 different situation quizzes',
    emoji: '🧠',
    isUnlocked: true,
    progress: '5/5 Complete',
    category: 'Quiz Master',
    rewardHearts: 100,
  },
  {
    id: 'b2',
    title: 'Ludo Supreme Champions 🎲',
    description: 'Play 10 matches of Couple Ludo Supreme together',
    emoji: '🎲',
    isUnlocked: true,
    progress: '10/10 Complete',
    category: 'Arcade',
    rewardHearts: 80,
  },
  {
    id: 'b3',
    title: '30-Day Flame Streak 🔥',
    description: 'Keep your daily love streak active for 30 consecutive days',
    emoji: '🔥',
    isUnlocked: true,
    progress: '30/30 Days',
    category: 'Commitment',
    rewardHearts: 150,
  },
  {
    id: 'b4',
    title: 'Teddy Hugs Ambassador 🧸',
    description: 'Send 50 virtual hugs and "I Remembered You" love taps',
    emoji: '🧸',
    isUnlocked: true,
    progress: '50/50 Sent',
    category: 'Affection',
    rewardHearts: 75,
  },
  {
    id: 'b5',
    title: 'Time Capsule Guardians 💌',
    description: 'Seal 5 locked letters inside the Secret Love Vault',
    emoji: '🔐',
    isUnlocked: true,
    progress: '5/5 Sealed',
    category: 'Romance',
    rewardHearts: 90,
  },
  {
    id: 'b6',
    title: 'Highway Speed Demons 🏎️',
    description: 'Boost with 3x Nitro in Neon Highway Car Racer 15 times',
    emoji: '🏎️',
    isUnlocked: false,
    progress: '9/15 Races',
    category: 'Arcade',
    rewardHearts: 70,
  },
  {
    id: 'b7',
    title: 'Scratch Date Explorers 🎟️',
    description: 'Scratch off and complete 10 mystery couple date missions',
    emoji: '🎟️',
    isUnlocked: false,
    progress: '4/10 Dates',
    category: 'Adventure',
    rewardHearts: 120,
  },
  {
    id: 'b8',
    title: 'Golden 100-Day Legends 👑',
    description: 'Reach a legendary 100-day unbroken relationship streak',
    emoji: '👑',
    isUnlocked: false,
    progress: '38/100 Days',
    category: 'Forever Love',
    rewardHearts: 300,
  },
];

interface CoupleTrophyModalProps {
  visible: boolean;
  partnerName: string;
  coupleLevel?: number;
  totalHearts?: number;
  onClose: () => void;
}

export const CoupleTrophyModal: React.FC<CoupleTrophyModalProps> = ({
  visible,
  partnerName,
  coupleLevel = 14,
  totalHearts = 480,
  onClose,
}) => {
  const unlockedCount = COUPLE_BADGES.filter(b => b.isUnlocked).length;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={22} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>Couple Trophy Room 🏆</Text>
            <Text style={styles.headerSub}>Our Level, Badges & Love Milestones</Text>
          </View>

          <View style={styles.heartScoreBadge}>
            <Heart size={14} color={Colors.loveRed} fill={Colors.loveRed} />
            <Text style={styles.heartScoreText}>{totalHearts}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* LEVEL HERO CARD */}
          <View style={styles.levelCard}>
            <View style={styles.levelIconCircle}>
              <Crown size={36} color={Colors.gold} />
            </View>

            <Text style={styles.levelTitle}>Level {coupleLevel}: Soulmate Harmony 💖</Text>
            <Text style={styles.levelSub}>You & {partnerName} are in the top 2% of couple sync!</Text>

            {/* XP Bar */}
            <View style={styles.xpBarContainer}>
              <View style={styles.xpBarTrack}>
                <View style={[styles.xpBarFill, { width: '72%' }]} />
              </View>
              <View style={styles.xpTextRow}>
                <Text style={styles.xpText}>1,440 / 2,000 XP</Text>
                <Text style={styles.xpNextText}>560 XP to Level {coupleLevel + 1}</Text>
              </View>
            </View>
          </View>

          {/* BADGES SUMMARY ROW */}
          <View style={styles.badgesSummaryRow}>
            <Text style={styles.sectionHeading}>Unlocked Badges ({unlockedCount}/{COUPLE_BADGES.length})</Text>
            <Text style={styles.summarySub}>Earn XP from quizzes, games & stories</Text>
          </View>

          {/* BADGES GRID */}
          <View style={styles.badgeGrid}>
            {COUPLE_BADGES.map((badge) => (
              <View
                key={badge.id}
                style={[styles.badgeCard, !badge.isUnlocked && styles.badgeCardLocked]}
              >
                <View style={styles.badgeCardTop}>
                  <View style={[styles.badgeEmojiCircle, badge.isUnlocked ? styles.badgeEmojiCircleUnlocked : styles.badgeEmojiCircleLocked]}>
                    <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
                  </View>

                  <View style={[styles.lockStatusBadge, badge.isUnlocked ? styles.statusUnlocked : styles.statusLocked]}>
                    {badge.isUnlocked ? (
                      <CheckCircle2 size={12} color={Colors.emeraldGreen} />
                    ) : (
                      <Lock size={12} color="#999" />
                    )}
                    <Text style={[styles.lockStatusText, badge.isUnlocked ? styles.textGreen : styles.textGray]}>
                      {badge.isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.badgeTitle}>{badge.title}</Text>
                <Text style={styles.badgeDesc}>{badge.description}</Text>

                <View style={styles.badgeFooter}>
                  <Text style={styles.progressText}>{badge.progress}</Text>
                  <Text style={styles.rewardText}>+{badge.rewardHearts} ❤️</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
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
  heartScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFEBF0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Spacing.borderRadius.full,
  },
  heartScoreText: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.loveRed,
  },
  scroll: {
    padding: Spacing.md,
  },
  levelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFEBF0',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: Spacing.md,
  },
  levelIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gold,
    marginBottom: Spacing.xs,
  },
  levelTitle: {
    fontSize: Typography.sizes.md + 2,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  levelSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  xpBarContainer: {
    width: '100%',
    gap: 4,
  },
  xpBarTrack: {
    height: 10,
    backgroundColor: '#FAF0F4',
    borderRadius: 5,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  xpTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  xpText: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  xpNextText: {
    fontSize: Typography.sizes.xs - 2,
    color: Colors.textMuted,
  },
  badgesSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    paddingHorizontal: 2,
  },
  sectionHeading: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  summarySub: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textSecondary,
  },
  badgeGrid: {
    gap: Spacing.sm,
  },
  badgeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  badgeCardLocked: {
    backgroundColor: '#FAFAFA',
    borderColor: '#E8E8E8',
    opacity: 0.8,
  },
  badgeCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  badgeEmojiCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeEmojiCircleUnlocked: {
    backgroundColor: '#FFF0F5',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  badgeEmojiCircleLocked: {
    backgroundColor: '#EEEEEE',
    borderWidth: 1.5,
    borderColor: '#CCC',
  },
  badgeEmoji: {
    fontSize: 22,
  },
  lockStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Spacing.borderRadius.full,
  },
  statusUnlocked: {
    backgroundColor: '#EBFBEE',
  },
  statusLocked: {
    backgroundColor: '#EEEEEE',
  },
  lockStatusText: {
    fontSize: 9,
    fontWeight: Typography.weights.heavy,
  },
  textGreen: {
    color: Colors.emeraldGreen,
  },
  textGray: {
    color: '#888',
  },
  badgeTitle: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  badgeDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  badgeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#FAF0F4',
  },
  progressText: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  rewardText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.loveRed,
  },
});
