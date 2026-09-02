import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../common/GradientButton';
import { Sparkles, Droplets, Sun, Music2, Heart, Trophy, X, Sprout } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

interface LoveGardenWidgetProps {
  partnerName: string;
  onRewardHearts?: (hearts: number) => void;
}

const GARDEN_STAGES = [
  { level: 1, name: 'Tiny Sweet Seedling 🌱', emoji: '🌱', desc: 'Planting our love foundation' },
  { level: 2, name: 'Sprouting Rose Bush 🌿', emoji: '🌿', desc: 'Growing with daily hugs & check-ins' },
  { level: 3, name: 'Blooming Rose Garden 🌹', emoji: '🌹', desc: 'Rich in affection and shared memories' },
  { level: 4, name: 'Giant Cherry Blossom 🌸', emoji: '🌸', desc: 'Deeply rooted soulmate bond' },
  { level: 5, name: 'Enchanted Golden Tree 🌳✨', emoji: '🌳', desc: 'Legendary forever love in full bloom' },
];

export const LoveGardenWidget: React.FC<LoveGardenWidgetProps> = ({
  partnerName,
  onRewardHearts,
}) => {
  const [currentLevel, setCurrentLevel] = useState(4);
  const [waterCount, setWaterCount] = useState(78);
  const [waterAnim] = useState(new Animated.Value(1));
  const [showFullModal, setShowFullModal] = useState(false);
  const [justWateredMsg, setJustWateredMsg] = useState<string | null>(null);

  const stage = GARDEN_STAGES[currentLevel - 1] || GARDEN_STAGES[3];

  const handleWaterTree = (actionName: string, iconEmoji: string) => {
    triggerHaptic('heartbeat');
    Animated.sequence([
      Animated.timing(waterAnim, { toValue: 1.25, duration: 200, useNativeDriver: true }),
      Animated.timing(waterAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    setWaterCount(prev => prev + 5);
    setJustWateredMsg(`${iconEmoji} ${actionName}! +5 Love Droplets added`);
    setTimeout(() => setJustWateredMsg(null), 3000);

    if (onRewardHearts) onRewardHearts(10);
  };

  return (
    <View style={styles.container}>
      {/* Garden Card */}
      <TouchableOpacity
        style={styles.gardenCard}
        onPress={() => {
          triggerHaptic('light');
          setShowFullModal(true);
        }}
        activeOpacity={0.88}
      >
        <View style={styles.cardHeader}>
          <View style={styles.badgeRow}>
            <Sprout size={14} color={Colors.emeraldGreen} />
            <Text style={styles.badgeText}>OUR LOVE GARDEN</Text>
          </View>
          <Text style={styles.levelTag}>Stage {currentLevel}/5 🌸</Text>
        </View>

        {/* Tree Centerpiece with bounce */}
        <View style={styles.treeSection}>
          <Animated.View style={[styles.treeCircle, { transform: [{ scale: waterAnim }] }]}>
            <Text style={styles.treeEmoji}>{stage.emoji}</Text>
          </Animated.View>
          <Text style={styles.treeStageTitle}>{stage.name}</Text>
          <Text style={styles.treeDesc}>{stage.desc}</Text>
        </View>

        {/* Growth Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(waterCount % 100)}%` }]} />
          </View>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressText}>{waterCount % 100} / 100 Droplets to Next Bloom</Text>
            <Text style={styles.progressTotalText}>Total: {waterCount} 💧</Text>
          </View>
        </View>

        {/* Toast */}
        {justWateredMsg && (
          <View style={styles.toastBox}>
            <Text style={styles.toastText}>{justWateredMsg}</Text>
          </View>
        )}

        {/* Quick Garden Care Buttons */}
        <View style={styles.careActionsRow}>
          <TouchableOpacity
            style={styles.careBtn}
            onPress={(e) => {
              e.stopPropagation();
              handleWaterTree('Watered with Hugs', '💧');
            }}
          >
            <Droplets size={16} color="#0A84FF" />
            <Text style={styles.careBtnText}>Water 💧</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.careBtn}
            onPress={(e) => {
              e.stopPropagation();
              handleWaterTree('Sunshine Kisses Sent', '☀️');
            }}
          >
            <Sun size={16} color="#FF9500" />
            <Text style={styles.careBtnText}>Sunlight ☀️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.careBtn}
            onPress={(e) => {
              e.stopPropagation();
              handleWaterTree('Sang Romantic Song', '🎵');
            }}
          >
            <Music2 size={16} color={Colors.primary} />
            <Text style={styles.careBtnText}>Love Song 🎵</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* FULL GARDEN MODAL */}
      <Modal visible={showFullModal} animationType="slide" transparent onRequestClose={() => setShowFullModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Couple Love Garden Sanctuary 🌸🪴</Text>
              <TouchableOpacity onPress={() => setShowFullModal(false)}>
                <X size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              This tree grows with every sweet message, quiz answered, and hug sent between you and {partnerName}!
            </Text>

            {/* Tree Showcase */}
            <View style={styles.showcaseBox}>
              <Text style={styles.showcaseEmoji}>{stage.emoji}</Text>
              <Text style={styles.showcaseTitle}>{stage.name}</Text>
              <Text style={styles.showcaseSub}>{stage.desc}</Text>
            </View>

            {/* Bloom Milestones list */}
            <Text style={styles.milestonesTitle}>Garden Evolution Stages:</Text>
            <View style={styles.stagesList}>
              {GARDEN_STAGES.map((stg) => (
                <View
                  key={stg.level}
                  style={[styles.stageItem, stg.level === currentLevel && styles.stageItemActive]}
                >
                  <Text style={styles.stageEmoji}>{stg.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.stageName, stg.level === currentLevel && styles.stageNameActive]}>
                      Stage {stg.level}: {stg.name}
                    </Text>
                    <Text style={styles.stageDescText}>{stg.desc}</Text>
                  </View>
                  {stg.level <= currentLevel && (
                    <Text style={styles.unlockedMark}>✨ Unlocked</Text>
                  )}
                </View>
              ))}
            </View>

            <GradientButton
              title="Give Giant Hug & Water Garden 💧💖"
              onPress={() => {
                handleWaterTree('Giant Hug & Water Shower', '🌸');
                setShowFullModal(false);
              }}
              style={{ width: '100%', marginTop: Spacing.md }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
  },
  gardenCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#E8F5E9',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F8EE',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Spacing.borderRadius.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: Typography.weights.heavy,
    color: Colors.emeraldGreen,
  },
  levelTag: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  treeSection: {
    alignItems: 'center',
    marginVertical: 4,
  },
  treeCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0FFF4',
    borderWidth: 2,
    borderColor: '#C6F6D5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  treeEmoji: {
    fontSize: 34,
  },
  treeStageTitle: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  treeDesc: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  progressContainer: {
    marginTop: Spacing.sm,
    gap: 3,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E2F7E6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.emeraldGreen,
    borderRadius: 4,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: Typography.sizes.xs - 2,
    fontWeight: Typography.weights.bold,
    color: Colors.emeraldGreen,
  },
  progressTotalText: {
    fontSize: Typography.sizes.xs - 2,
    color: Colors.textMuted,
  },
  toastBox: {
    backgroundColor: '#E8F8EE',
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.sm,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  toastText: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.bold,
    color: Colors.emeraldGreen,
  },
  careActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  careBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#FAF5F7',
    paddingVertical: 8,
    borderRadius: Spacing.borderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  careBtnText: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
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
    borderColor: '#E8F5E9',
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  modalTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  modalSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: Spacing.md,
  },
  showcaseBox: {
    alignItems: 'center',
    backgroundColor: '#F0FFF4',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#C6F6D5',
    marginBottom: Spacing.md,
  },
  showcaseEmoji: {
    fontSize: 54,
    marginBottom: 4,
  },
  showcaseTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  showcaseSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  milestonesTitle: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  stagesList: {
    gap: 6,
  },
  stageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: 8,
    borderRadius: Spacing.borderRadius.md,
    backgroundColor: '#FAF5F7',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stageItemActive: {
    backgroundColor: '#E8F8EE',
    borderColor: Colors.emeraldGreen,
  },
  stageEmoji: {
    fontSize: 22,
  },
  stageName: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  stageNameActive: {
    color: Colors.emeraldGreen,
  },
  stageDescText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  unlockedMark: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Colors.emeraldGreen,
  },
});
