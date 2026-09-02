import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Zap, Heart, Flame, ShieldAlert, Check } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

interface TruthOrDareProps {
  onComplete: (type: 'TRUTH' | 'DARE', prompt: string) => void;
}

const TRUTH_PROMPTS = [
  'What is one secret fantasy or romantic wish you have never shared with me?',
  'What was the exact moment or first impression when you fell for me?',
  'What outfit or look of mine makes you find me most irresistible?',
  'If you could relive one intimate memory of us, which one would it be?',
  'What is a silly quirk of mine that you secretly find adorable?',
];

const DARE_PROMPTS = [
  'Give your partner a slow, relaxing 2-minute shoulder or foot massage right now.',
  'Stare deeply into your partner’s eyes for 60 seconds without laughing or looking away.',
  'Whisper the 3 things you love most about your partner into their ear in a seductive voice.',
  'Give your partner 10 passionate kisses in 10 different spots on their face/neck.',
  'Slow dance to a romantic song in the living room right now.',
];

export const TruthOrDareGame: React.FC<TruthOrDareProps> = ({ onComplete }) => {
  const [mode, setMode] = useState<'SELECT' | 'TRUTH' | 'DARE'>('SELECT');
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handlePick = (type: 'TRUTH' | 'DARE') => {
    triggerHaptic('heavy');
    const prompts = type === 'TRUTH' ? TRUTH_PROMPTS : DARE_PROMPTS;
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(prompt);
    setMode(type);
    setIsCompleted(false);
  };

  const handleDone = () => {
    triggerHaptic('success');
    setIsCompleted(true);
    if (mode !== 'SELECT') {
      onComplete(mode, currentPrompt);
    }
  };

  const handleReset = () => {
    triggerHaptic('light');
    setMode('SELECT');
    setCurrentPrompt('');
    setIsCompleted(false);
  };

  return (
    <View style={styles.container}>
      {mode === 'SELECT' ? (
        <View style={styles.selectContainer}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Zap size={14} color="#A18CD1" />
              <Text style={styles.badgeText}>Truth or Dare: Couple Edition</Text>
            </View>
          </View>

          <Text style={styles.promptTitle}>Pick Your Poison ❤️🔥</Text>
          <Text style={styles.promptSub}>
            Deep honest confessions or spicy real-time romantic actions!
          </Text>

          <View style={styles.buttonsRow}>
            {/* Truth Button */}
            <TouchableOpacity
              style={[styles.bigButton, styles.truthButton]}
              onPress={() => handlePick('TRUTH')}
              activeOpacity={0.8}
            >
              <Heart size={32} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.bigButtonText}>TRUTH 💭</Text>
              <Text style={styles.bigButtonSub}>Deep confession</Text>
            </TouchableOpacity>

            {/* Dare Button */}
            <TouchableOpacity
              style={[styles.bigButton, styles.dareButton]}
              onPress={() => handlePick('DARE')}
              activeOpacity={0.8}
            >
              <Flame size={32} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.bigButtonText}>DARE 🔥</Text>
              <Text style={styles.bigButtonSub}>Spicy challenge</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.challengeContainer}>
          <View style={[styles.typeBadge, mode === 'DARE' ? styles.dareBadge : styles.truthBadge]}>
            <Text style={styles.typeBadgeText}>
              {mode === 'DARE' ? '🔥 YOUR DARE' : '💭 YOUR TRUTH QUESTION'}
            </Text>
          </View>

          <Text style={styles.challengeText}>{currentPrompt}</Text>

          {isCompleted ? (
            <View style={styles.completedBox}>
              <Check size={20} color="#2ED573" />
              <Text style={styles.completedText}>Awesome! Challenge Accomplished! +20 ❤️</Text>
              <TouchableOpacity style={styles.nextBtn} onPress={handleReset}>
                <Text style={styles.nextBtnText}>Next Round →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.passBtn} onPress={handleReset}>
                <Text style={styles.passBtnText}>Chicken Out 🐔</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.doneBtn, mode === 'DARE' ? styles.doneBtnDare : styles.doneBtnTruth]}
                onPress={handleDone}
              >
                <Text style={styles.doneBtnText}>Completed! ❤️</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#F3E8FF',
    shadowColor: '#A18CD1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
    marginVertical: Spacing.sm,
  },
  selectContainer: {
    alignItems: 'center',
  },
  badgeRow: {
    marginBottom: Spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F0FF',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.full,
  },
  badgeText: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: '#8E44AD',
  },
  promptTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  promptSub: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  bigButton: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: Spacing.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  truthButton: {
    backgroundColor: '#A18CD1',
    shadowColor: '#A18CD1',
  },
  dareButton: {
    backgroundColor: '#FF6B8B',
    shadowColor: '#FF6B8B',
  },
  bigButtonText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.heavy,
    color: '#FFFFFF',
    marginTop: 8,
  },
  bigButtonSub: {
    fontSize: Typography.sizes.xs,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  challengeContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.full,
    marginBottom: Spacing.md,
  },
  truthBadge: {
    backgroundColor: '#F3E8FF',
  },
  dareBadge: {
    backgroundColor: '#FFEBF0',
  },
  typeBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  challengeText: {
    fontSize: Typography.sizes.md + 2,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: Spacing.lg,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  passBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Spacing.borderRadius.md,
    backgroundColor: '#F1F2F6',
    alignItems: 'center',
  },
  passBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  doneBtn: {
    flex: 1.5,
    paddingVertical: 12,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
  },
  doneBtnTruth: {
    backgroundColor: '#A18CD1',
  },
  doneBtnDare: {
    backgroundColor: Colors.primary,
  },
  doneBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  completedBox: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  completedText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: '#2ED573',
  },
  nextBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: Spacing.lg,
    borderRadius: Spacing.borderRadius.full,
    marginTop: Spacing.xs,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.sm,
  },
});
