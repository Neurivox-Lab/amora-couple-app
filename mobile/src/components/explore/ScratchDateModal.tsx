import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, PanResponder, Dimensions, Animated } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../common/GradientButton';
import { Sparkles, Trophy, Calendar, Send, RefreshCw, X, Gift, Check, Flame } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

const { width } = Dimensions.get('window');

interface MysteryDate {
  id: number;
  title: string;
  category: string;
  emoji: string;
  description: string;
  difficulty: string;
  estimatedCost: string;
  rewardHearts: number;
}

const MYSTERY_DATES: MysteryDate[] = [
  {
    id: 1,
    title: 'Blindfolded Dessert Taste Test 🍓',
    category: 'Spicy & Intimate 🔥',
    emoji: '🍓',
    description: 'Blindfold your partner and feed them 5 mysterious sweet treats (chocolates, berries, whipped cream, caramel). Guess all 5 to win unlimited kisses!',
    difficulty: 'Easy & Fun',
    estimatedCost: '$10 - $15',
    rewardHearts: 50,
  },
  {
    id: 2,
    title: 'Midnight Blanket Fort & Movie Marathon 🏰',
    category: 'Cozy & At Home 🛋️',
    emoji: '🏰',
    description: 'Build the ultimate giant blanket fort in the living room with fairy lights, pillows, popcorn, and watch our favorite comfort movie till 2 AM.',
    difficulty: 'Cozy',
    estimatedCost: 'Free',
    rewardHearts: 45,
  },
  {
    id: 3,
    title: '5-Ingredient Chef Cook-Off Challenge 🍳',
    category: 'Spontaneous Adventure 🚗',
    emoji: '🍳',
    description: 'Head to the grocery store, pick 5 random secret ingredients for each other under $15, and cook a delicious 3-course dinner together from scratch.',
    difficulty: 'Medium',
    estimatedCost: '$20',
    rewardHearts: 60,
  },
  {
    id: 4,
    title: 'Late Night Stargazing & Hot Cocoa Drive 🌌',
    category: 'Romance & Chill ✨',
    emoji: '☕',
    description: 'Pack a thermos of hot chocolate and heavy blankets. Drive to a quiet spot away from city lights, put on our song, and stargaze on the car hood.',
    difficulty: 'Adventurous',
    estimatedCost: '$5',
    rewardHearts: 55,
  },
  {
    id: 5,
    title: 'Recreate Our Very First Date Photo 📸',
    category: 'Memories & Nostalgia 💍',
    emoji: '📸',
    description: 'Wear the exact same style outfit as our first date, visit the same spot (or recreate the backdrop), and take a modern side-by-side throwback photo!',
    difficulty: 'Sentimental',
    estimatedCost: 'Free',
    rewardHearts: 70,
  },
];

interface ScratchDateModalProps {
  visible: boolean;
  partnerName: string;
  onClose: () => void;
  onDateScheduled?: (dateTitle: string) => void;
}

export const ScratchDateModal: React.FC<ScratchDateModalProps> = ({
  visible,
  partnerName,
  onClose,
  onDateScheduled,
}) => {
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const activeDate = MYSTERY_DATES[currentDateIndex];

  // PanResponder to track scratches
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: () => {
      if (!isRevealed) {
        setScratchProgress(prev => {
          const next = prev + 3;
          if (next >= 100) {
            triggerHaptic('success');
            setIsRevealed(true);
            return 100;
          }
          if (next % 20 === 0) triggerHaptic('light');
          return next;
        });
      }
    },
  });

  const handleNextCard = () => {
    triggerHaptic('medium');
    setScratchProgress(0);
    setIsRevealed(false);
    setCurrentDateIndex(prev => (prev + 1) % MYSTERY_DATES.length);
  };

  const handleSchedule = () => {
    triggerHaptic('heartbeat');
    if (onDateScheduled) {
      onDateScheduled(activeDate.title);
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.titleRow}>
              <Gift size={20} color={Colors.primary} />
              <Text style={styles.modalTitle}>Mystery Scratch-Off Date 🎟️</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSub}>
            Rub your finger on the gold foil below to scratch and reveal tonight's surprise mission!
          </Text>

          {/* SCRATCH CARD CONTAINER */}
          <View style={styles.scratchCardContainer}>
            {/* Underlying Date Mission Details */}
            <View style={styles.revealedContent}>
              <View style={styles.dateCategoryBadge}>
                <Sparkles size={12} color={Colors.primaryDark} />
                <Text style={styles.dateCategoryText}>{activeDate.category}</Text>
              </View>

              <Text style={styles.dateTitle}>{activeDate.title}</Text>
              <Text style={styles.dateDesc}>{activeDate.description}</Text>

              <View style={styles.dateMetaRow}>
                <Text style={styles.metaItem}>💰 {activeDate.estimatedCost}</Text>
                <Text style={styles.metaItem}>🎯 {activeDate.difficulty}</Text>
                <Text style={[styles.metaItem, { color: Colors.loveRed, fontWeight: 'bold' }]}>
                  ❤️ +{activeDate.rewardHearts} Pts
                </Text>
              </View>
            </View>

            {/* Foil Layer */}
            {!isRevealed && (
              <View
                style={[
                  styles.foilLayer,
                  { opacity: 1 - scratchProgress / 110 },
                ]}
                {...panResponder.panHandlers}
              >
                <Text style={styles.foilIcon}>✨ 🪙 ✨</Text>
                <Text style={styles.foilPrompt}>SWIPE FINGER TO SCRATCH</Text>
                <Text style={styles.scratchPct}>{scratchProgress}% Scratched</Text>
              </View>
            )}
          </View>

          {/* Actions */}
          {isRevealed ? (
            <View style={styles.actions}>
              <GradientButton
                title="Schedule for Date Night & Invite Partner 💌"
                onPress={handleSchedule}
                style={styles.scheduleBtn}
              />
              <TouchableOpacity style={styles.nextCardBtn} onPress={handleNextCard}>
                <RefreshCw size={14} color={Colors.textSecondary} />
                <Text style={styles.nextCardText}>Scratch Another Date 🎟️</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.quickRevealBtn}
              onPress={() => {
                triggerHaptic('success');
                setIsRevealed(true);
                setScratchProgress(100);
              }}
            >
              <Text style={styles.quickRevealText}>Instant Reveal ✨</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalTitle: {
    fontSize: Typography.sizes.md + 1,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  modalSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 16,
  },
  scratchCardContainer: {
    height: 260,
    borderRadius: Spacing.borderRadius.xl,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#FFF8FA',
    borderWidth: 2,
    borderColor: '#FFD1DF',
  },
  revealedContent: {
    ...StyleSheet.absoluteFillObject,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  dateCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFEBF2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.full,
    marginBottom: Spacing.xs,
  },
  dateCategoryText: {
    fontSize: 10,
    fontWeight: Typography.weights.heavy,
    color: Colors.primaryDark,
  },
  dateTitle: {
    fontSize: Typography.sizes.md + 1,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginVertical: 4,
  },
  dateDesc: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginVertical: Spacing.xs,
  },
  dateMetaRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
    backgroundColor: '#FAF5F7',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Spacing.borderRadius.full,
  },
  metaItem: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textPrimary,
    fontWeight: Typography.weights.medium,
  },
  foilLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    borderWidth: 3,
    borderColor: '#F1D779',
  },
  foilIcon: {
    fontSize: 32,
  },
  foilPrompt: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.heavy,
    color: '#4A3B00',
    letterSpacing: 1,
  },
  scratchPct: {
    fontSize: Typography.sizes.xs,
    color: '#6E5700',
    fontWeight: Typography.weights.bold,
  },
  actions: {
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  scheduleBtn: {
    width: '100%',
  },
  nextCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.xs,
  },
  nextCardText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.bold,
  },
  quickRevealBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
  },
  quickRevealText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
});
