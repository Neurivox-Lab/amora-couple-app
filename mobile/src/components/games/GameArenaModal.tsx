import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../common/GradientButton';
import { GameDeck } from '../../services/gamesData';
import { X, Sparkles, Heart, Flame, ArrowLeft, ArrowRight, CheckCircle2, Lock, RotateCcw, Trophy } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

const { width } = Dimensions.get('window');

interface GameArenaModalProps {
  visible: boolean;
  deck: GameDeck | null;
  partnerName: string;
  onClose: () => void;
  onRewardHearts?: (hearts: number) => void;
}

export const GameArenaModal: React.FC<GameArenaModalProps> = ({
  visible,
  deck,
  partnerName,
  onClose,
  onRewardHearts,
}) => {
  if (!deck) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [partnerAnswers, setPartnerAnswers] = useState<Record<number, string>>({});
  const [truthsDaresMode, setTruthsDaresMode] = useState<Record<number, 'TRUTH' | 'DARE'>>({});
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = deck.questions;
  const currentQ = questions[currentIndex];
  const total = questions.length;

  const handleSelectOption = (option: string) => {
    if (userAnswers[currentQ.id]) return;
    triggerHaptic('medium');

    // Save answer
    const newAnswers = { ...userAnswers, [currentQ.id]: option };
    setUserAnswers(newAnswers);

    // Simulate partner response
    const partnerChoice = Math.random() > 0.3 ? option : (currentQ.optionB === option ? currentQ.optionA : currentQ.optionB) || option;
    const newPartnerAnswers = { ...partnerAnswers, [currentQ.id]: partnerChoice };
    setPartnerAnswers(newPartnerAnswers);

    // Check match
    const isMatch = option === partnerChoice;
    setScore(prev => prev + (isMatch ? 15 : 10));
    if (isMatch) {
      triggerHaptic('success');
    }
  };

  const handleSelectTruthDare = (type: 'TRUTH' | 'DARE') => {
    triggerHaptic('heavy');
    setTruthsDaresMode(prev => ({ ...prev, [currentQ.id]: type }));
    setUserAnswers(prev => ({ ...prev, [currentQ.id]: type }));
    setScore(prev => prev + 20);
  };

  const handleNext = () => {
    triggerHaptic('light');
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      triggerHaptic('success');
      setIsCompleted(true);
      if (onRewardHearts) onRewardHearts(score + 30);
    }
  };

  const handlePrev = () => {
    triggerHaptic('light');
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRestart = () => {
    triggerHaptic('medium');
    setCurrentIndex(0);
    setUserAnswers({});
    setPartnerAnswers({});
    setTruthsDaresMode({});
    setScore(0);
    setIsCompleted(false);
  };

  const myAns = userAnswers[currentQ?.id];
  const partnerAns = partnerAnswers[currentQ?.id];
  const isAnswered = !!myAns;
  const isMatch = isAnswered && myAns === partnerAns;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={onClose}>
            <X size={22} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.deckTitle} numberOfLines={1}>{deck.title}</Text>
            <Text style={styles.progressText}>
              Question {currentIndex + 1} of {total}
            </Text>
          </View>

          <View style={styles.scoreBadge}>
            <Heart size={14} color={Colors.loveRed} fill={Colors.loveRed} />
            <Text style={styles.scoreText}>+{score}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${((currentIndex + 1) / total) * 100}%` },
            ]}
          />
        </View>

        {!isCompleted ? (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Spice Badge */}
            <View style={styles.spiceRow}>
              <View style={styles.categoryPill}>
                <Sparkles size={14} color={Colors.primary} />
                <Text style={styles.categoryPillText}>{deck.category}</Text>
              </View>
              <View style={styles.spicePill}>
                <Text style={styles.spicePillText}>
                  {'🌶️'.repeat(deck.spiceLevel)} {deck.spiceLevel === 3 ? 'Spicy 🔥' : deck.spiceLevel === 2 ? 'Flirty 💕' : 'Sweet 🌸'}
                </Text>
              </View>
            </View>

            {/* Question Card */}
            <View style={styles.questionBox}>
              <Text style={styles.prompt}>{currentQ.prompt}</Text>
            </View>

            {/* RENDER WYR / KNOW ME OPTIONS */}
            {(currentQ.type === 'WYR' || currentQ.type === 'KNOW_ME') && currentQ.optionA && currentQ.optionB && (
              <View style={styles.optionsContainer}>
                {/* Option A */}
                <TouchableOpacity
                  style={[
                    styles.optionBtn,
                    styles.optionBtnA,
                    myAns === currentQ.optionA && styles.optionSelectedA,
                  ]}
                  onPress={() => handleSelectOption(currentQ.optionA!)}
                  disabled={isAnswered}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionText, myAns === currentQ.optionA && styles.optionTextSelected]}>
                    {currentQ.optionA}
                  </Text>
                  {myAns === currentQ.optionA && (
                    <View style={styles.checkIcon}>
                      <CheckCircle2 size={20} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>

                {/* OR Divider */}
                <View style={styles.orRow}>
                  <View style={styles.orLine} />
                  <View style={styles.orCircle}>
                    <Text style={styles.orText}>OR</Text>
                  </View>
                  <View style={styles.orLine} />
                </View>

                {/* Option B */}
                <TouchableOpacity
                  style={[
                    styles.optionBtn,
                    styles.optionBtnB,
                    myAns === currentQ.optionB && styles.optionSelectedB,
                  ]}
                  onPress={() => handleSelectOption(currentQ.optionB!)}
                  disabled={isAnswered}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionText, myAns === currentQ.optionB && styles.optionTextSelected]}>
                    {currentQ.optionB}
                  </Text>
                  {myAns === currentQ.optionB && (
                    <View style={styles.checkIcon}>
                      <CheckCircle2 size={20} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* RENDER WHO IS MORE LIKELY OPTIONS */}
            {currentQ.type === 'LIKELY' && (
              <View style={styles.likelyRow}>
                <TouchableOpacity
                  style={[styles.likelyBtn, myAns === 'ME' && styles.likelySelectedMe]}
                  onPress={() => handleSelectOption('ME')}
                  disabled={isAnswered}
                  activeOpacity={0.8}
                >
                  <Text style={styles.likelyEmoji}>🙋‍♀️</Text>
                  <Text style={[styles.likelyLabel, myAns === 'ME' && styles.likelyLabelSelected]}>Definitely Me</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.likelyBtn, myAns === 'BOTH' && styles.likelySelectedBoth]}
                  onPress={() => handleSelectOption('BOTH')}
                  disabled={isAnswered}
                  activeOpacity={0.8}
                >
                  <Text style={styles.likelyEmoji}>👫</Text>
                  <Text style={[styles.likelyLabel, myAns === 'BOTH' && styles.likelyLabelSelected]}>Both of Us</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.likelyBtn, myAns === 'PARTNER' && styles.likelySelectedPartner]}
                  onPress={() => handleSelectOption('PARTNER')}
                  disabled={isAnswered}
                  activeOpacity={0.8}
                >
                  <Text style={styles.likelyEmoji}>🙋‍♂️</Text>
                  <Text style={[styles.likelyLabel, myAns === 'PARTNER' && styles.likelyLabelSelected]}>{partnerName}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* RENDER TRUTH OR DARE CHOICES */}
            {currentQ.type === 'TRUTH_DARE' && (
              <View style={styles.truthDareContainer}>
                {!truthsDaresMode[currentQ.id] ? (
                  <View style={styles.tdChoiceRow}>
                    <TouchableOpacity
                      style={[styles.tdBtn, styles.tdTruthBtn]}
                      onPress={() => handleSelectTruthDare('TRUTH')}
                      activeOpacity={0.8}
                    >
                      <Heart size={28} color="#FFFFFF" fill="#FFFFFF" />
                      <Text style={styles.tdBtnText}>TRUTH 💭</Text>
                      <Text style={styles.tdBtnSub}>Deep confession</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.tdBtn, styles.tdDareBtn]}
                      onPress={() => handleSelectTruthDare('DARE')}
                      activeOpacity={0.8}
                    >
                      <Flame size={28} color="#FFFFFF" fill="#FFFFFF" />
                      <Text style={styles.tdBtnText}>DARE 🔥</Text>
                      <Text style={styles.tdBtnSub}>Romantic challenge</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.tdActionCard}>
                    <View style={styles.tdBadge}>
                      <Text style={styles.tdBadgeText}>
                        {truthsDaresMode[currentQ.id] === 'TRUTH' ? '💭 TRUTH QUESTION' : '🔥 YOUR DARE'}
                      </Text>
                    </View>
                    <Text style={styles.tdPromptText}>
                      {truthsDaresMode[currentQ.id] === 'TRUTH' ? currentQ.truth : currentQ.dare}
                    </Text>
                    <View style={styles.tdCompletedBanner}>
                      <CheckCircle2 size={18} color={Colors.emeraldGreen} />
                      <Text style={styles.tdCompletedText}>Challenge Active! +20 ❤️</Text>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* RENDER NEVER HAVE I EVER */}
            {currentQ.type === 'NEVER_EVER' && (
              <View style={styles.neverContainer}>
                <View style={styles.neverChoicesRow}>
                  <TouchableOpacity
                    style={[styles.neverBtn, myAns === 'I_HAVE' && styles.neverSelectedHave]}
                    onPress={() => handleSelectOption('I_HAVE')}
                    disabled={isAnswered}
                  >
                    <Text style={styles.neverEmoji}>🙋‍♀️</Text>
                    <Text style={[styles.neverText, myAns === 'I_HAVE' && styles.neverTextSelected]}>I Have!</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.neverBtn, myAns === 'NEVER' && styles.neverSelectedNever]}
                    onPress={() => handleSelectOption('NEVER')}
                    disabled={isAnswered}
                  >
                    <Text style={styles.neverEmoji}>🙅‍♂️</Text>
                    <Text style={[styles.neverText, myAns === 'NEVER' && styles.neverTextSelected]}>Never!</Text>
                  </TouchableOpacity>
                </View>

                {currentQ.forfeit && (
                  <View style={styles.forfeitBox}>
                    <Text style={styles.forfeitLabel}>💋 Forfeit If Guilty:</Text>
                    <Text style={styles.forfeitText}>{currentQ.forfeit}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Live Reveal Banner */}
            {isAnswered && (
              <View style={[styles.revealBanner, isMatch ? styles.revealBannerMatch : styles.revealBannerNormal]}>
                <Heart size={20} color={isMatch ? Colors.loveRed : Colors.primary} fill={isMatch ? Colors.loveRed : 'none'} />
                <View style={styles.revealInfo}>
                  <Text style={[styles.revealTitle, isMatch && styles.revealTitleMatch]}>
                    {isMatch ? "🎉 Match Made in Heaven! Both agreed!" : `${partnerName} chose: ${partnerAns}`}
                  </Text>
                  <Text style={styles.revealSub}>
                    {isMatch ? "+15 Couple Hearts Earned ❤️" : "+10 Hearts Earned ✨"}
                  </Text>
                </View>
              </View>
            )}

            {/* Footer Navigation */}
            <View style={styles.navRow}>
              <TouchableOpacity
                style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
                onPress={handlePrev}
                disabled={currentIndex === 0}
              >
                <ArrowLeft size={18} color={currentIndex === 0 ? Colors.textMuted : Colors.textPrimary} />
                <Text style={[styles.navBtnText, currentIndex === 0 && styles.navBtnTextDisabled]}>Previous</Text>
              </TouchableOpacity>

              <GradientButton
                title={currentIndex === total - 1 ? "Complete Game 🎉" : "Next Question →"}
                onPress={handleNext}
                disabled={!isAnswered}
                style={styles.nextBtn}
              />
            </View>
          </ScrollView>
        ) : (
          /* ROUND COMPLETED CELEBRATION SCREEN */
          <View style={styles.completedContainer}>
            <View style={styles.trophyCircle}>
              <Trophy size={48} color={Colors.gold} />
            </View>

            <Text style={styles.completedTitle}>Game Round Completed! 🎉</Text>
            <Text style={styles.completedSub}>
              You and {partnerName} scored high chemistry on <Text style={{ fontWeight: 'bold' }}>{deck.title}</Text>!
            </Text>

            <View style={styles.statSummaryCard}>
              <View style={styles.statCol}>
                <Text style={styles.statBigVal}>92%</Text>
                <Text style={styles.statSubLabel}>Chemistry Match</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statCol}>
                <Text style={[styles.statBigVal, { color: Colors.loveRed }]}>+{score} ❤️</Text>
                <Text style={styles.statSubLabel}>Hearts Earned</Text>
              </View>
            </View>

            <View style={styles.completedActions}>
              <GradientButton
                title="Claim Rewards & Back to Hub ❤️"
                onPress={onClose}
                style={styles.claimBtn}
              />

              <TouchableOpacity style={styles.replayBtn} onPress={handleRestart}>
                <RotateCcw size={16} color={Colors.primary} />
                <Text style={styles.replayBtnText}>Play Again / Shuffle</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  },
  headerIconBtn: {
    padding: Spacing.xs,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  deckTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  progressText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFEBF0',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: Spacing.borderRadius.full,
  },
  scoreText: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.loveRed,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: '#FAF0F4',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  spiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFEBF2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.full,
  },
  categoryPillText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  spicePill: {
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.full,
  },
  spicePillText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: '#B7791F',
  },
  questionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: Spacing.lg,
    minHeight: 110,
    justifyContent: 'center',
  },
  prompt: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 26,
  },
  optionsContainer: {
    gap: Spacing.xs,
  },
  optionBtn: {
    padding: Spacing.lg,
    borderRadius: Spacing.borderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 64,
  },
  optionBtnA: {
    backgroundColor: '#FFF5F8',
    borderColor: '#FFD6E2',
  },
  optionSelectedA: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  optionBtnB: {
    backgroundColor: '#F3F8FF',
    borderColor: '#D4E6FF',
  },
  optionSelectedB: {
    backgroundColor: '#4FACFE',
    borderColor: '#1E90FF',
  },
  optionText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  checkIcon: {
    position: 'absolute',
    right: 16,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  orCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FAF5F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Spacing.sm,
  },
  orText: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.heavy,
    color: Colors.textSecondary,
  },
  likelyRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  likelyBtn: {
    flex: 1,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xs,
    borderRadius: Spacing.borderRadius.lg,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  likelySelectedMe: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  likelySelectedBoth: {
    backgroundColor: Colors.lavender,
    borderColor: '#9354C8',
  },
  likelySelectedPartner: {
    backgroundColor: '#4FACFE',
    borderColor: '#1E90FF',
  },
  likelyEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  likelyLabel: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  likelyLabelSelected: {
    color: '#FFFFFF',
  },
  truthDareContainer: {
    marginVertical: Spacing.sm,
  },
  tdChoiceRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  tdBtn: {
    flex: 1,
    paddingVertical: Spacing.xl,
    borderRadius: Spacing.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tdTruthBtn: {
    backgroundColor: '#A18CD1',
  },
  tdDareBtn: {
    backgroundColor: Colors.primary,
  },
  tdBtnText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.heavy,
    color: '#FFFFFF',
    marginTop: 6,
  },
  tdBtnSub: {
    fontSize: Typography.sizes.xs,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  tdActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: '#FFEBF2',
    alignItems: 'center',
  },
  tdBadge: {
    backgroundColor: '#FFEBF0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.full,
    marginBottom: Spacing.sm,
  },
  tdBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  tdPromptText: {
    fontSize: Typography.sizes.md + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  tdCompletedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tdCompletedText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.emeraldGreen,
  },
  neverContainer: {
    gap: Spacing.md,
  },
  neverChoicesRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  neverBtn: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: Spacing.borderRadius.lg,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  neverSelectedHave: {
    backgroundColor: '#FF6B8B',
    borderColor: Colors.primaryDark,
  },
  neverSelectedNever: {
    backgroundColor: '#4FACFE',
    borderColor: '#1E90FF',
  },
  neverEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  neverText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  neverTextSelected: {
    color: '#FFFFFF',
  },
  forfeitBox: {
    backgroundColor: '#FFF0F5',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    alignItems: 'center',
  },
  forfeitLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
    marginBottom: 2,
  },
  forfeitText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
  },
  revealBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.lg,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  revealBannerMatch: {
    backgroundColor: '#FFEBF0',
    borderWidth: 1.5,
    borderColor: '#FFB8CE',
  },
  revealBannerNormal: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  revealInfo: {
    flex: 1,
  },
  revealTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  revealTitleMatch: {
    color: Colors.loveRed,
  },
  revealSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.borderRadius.lg,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  navBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  navBtnTextDisabled: {
    color: Colors.textMuted,
  },
  nextBtn: {
    flex: 1,
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  trophyCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFF9E6',
    borderWidth: 3,
    borderColor: Colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  completedTitle: {
    fontSize: Typography.sizes.xl + 2,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  completedSub: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  statSummaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
    width: '100%',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: Spacing.xl,
  },
  statCol: {
    alignItems: 'center',
  },
  statBigVal: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.heavy,
    color: Colors.primaryDark,
  },
  statSubLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.border,
  },
  completedActions: {
    width: '100%',
    gap: Spacing.sm,
  },
  claimBtn: {
    width: '100%',
  },
  replayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  replayBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
});
