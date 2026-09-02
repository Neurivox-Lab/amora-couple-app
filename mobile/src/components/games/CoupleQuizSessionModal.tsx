import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../common/GradientButton';
import { CompatibilityQuizModule, QuizQuestionItem, User } from '../../types';
import { X, Trophy, Sparkles, Heart, CheckCircle2, ArrowRight, Share2, Send, Bot, Check, HelpCircle } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

const { width } = Dimensions.get('window');

interface CoupleQuizSessionModalProps {
  visible: boolean;
  quizModule: CompatibilityQuizModule | null;
  partnerName: string;
  currentUser: User | null;
  onClose: () => void;
  onSendInviteToChat?: (quizTitle: string) => void;
  onRewardHearts?: (hearts: number) => void;
}

export const CoupleQuizSessionModal: React.FC<CoupleQuizSessionModalProps> = ({
  visible,
  quizModule,
  partnerName,
  currentUser,
  onClose,
  onSendInviteToChat,
  onRewardHearts,
}) => {
  if (!quizModule) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [myAnswers, setMyAnswers] = useState<Record<number, string>>({});
  const [partnerAnswers, setPartnerAnswers] = useState<Record<number, string>>({});
  const [phase, setPhase] = useState<'PLAYING' | 'WAITING_PARTNER' | 'MATCH_REPORT'>('PLAYING');

  const questions = quizModule.questions;
  const currentQ = questions[currentIndex];
  const total = questions.length;

  const handleSelectOption = (optionId: string) => {
    triggerHaptic('medium');
    const updated = { ...myAnswers, [currentQ.id]: optionId };
    setMyAnswers(updated);

    // If last question, proceed to complete
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      triggerHaptic('success');
      // Simulate partner completing as well for immediate interactive preview
      const simPartnerAns: Record<number, string> = {};
      questions.forEach((q) => {
        // 80% match probability
        simPartnerAns[q.id] = Math.random() > 0.25 ? updated[q.id] : q.options[Math.floor(Math.random() * q.options.length)].id;
      });
      setPartnerAnswers(simPartnerAns);
      setPhase('MATCH_REPORT');
      if (onRewardHearts) onRewardHearts(45);
    }
  };

  const calculateMatch = () => {
    let matches = 0;
    questions.forEach((q) => {
      if (myAnswers[q.id] && myAnswers[q.id] === partnerAnswers[q.id]) {
        matches++;
      }
    });
    const pct = Math.round((matches / total) * 100) || 85;
    return { matches, pct };
  };

  const { matches, pct } = calculateMatch();

  const handleReset = () => {
    triggerHaptic('light');
    setCurrentIndex(0);
    setMyAnswers({});
    setPartnerAnswers({});
    setPhase('PLAYING');
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={22} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.quizTitle} numberOfLines={1}>{quizModule.title}</Text>
            <Text style={styles.quizProgress}>
              {phase === 'PLAYING' ? `Question ${currentIndex + 1} of ${total}` : 'Compatibility Report'}
            </Text>
          </View>

          <View style={styles.scoreBadge}>
            <Heart size={14} color={Colors.loveRed} fill={Colors.loveRed} />
            <Text style={styles.scoreText}>+45 ❤️</Text>
          </View>
        </View>

        {/* Progress bar */}
        {phase === 'PLAYING' && (
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${((currentIndex + 1) / total) * 100}%` },
              ]}
            />
          </View>
        )}

        {/* PHASE 1: PLAYING QUIZ */}
        {phase === 'PLAYING' && (
          <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Category Tag */}
            <View style={styles.categoryTagRow}>
              <View style={styles.categoryTag}>
                <Sparkles size={12} color={Colors.primary} />
                <Text style={styles.categoryTagText}>{currentQ.category}</Text>
              </View>
            </View>

            {/* Scenario Card */}
            <View style={styles.scenarioCard}>
              <Text style={styles.scenarioEmoji}>💡 Situation:</Text>
              <Text style={styles.scenarioText}>"{currentQ.scenario}"</Text>
            </View>

            <Text style={styles.pickPrompt}>What is your honest choice or preference?</Text>

            {/* Options List */}
            <View style={styles.optionsList}>
              {currentQ.options.map((opt) => {
                const isSelected = myAnswers[currentQ.id] === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                    onPress={() => handleSelectOption(opt.id)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.optionLetterBox, isSelected && styles.optionLetterBoxSelected]}>
                      <Text style={[styles.optionLetter, isSelected && styles.optionLetterSelected]}>
                        {opt.id}
                      </Text>
                    </View>
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {opt.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        )}

        {/* PHASE 2: SYNCHRONIZED MATCH & PERSPECTIVE REPORT */}
        {phase === 'MATCH_REPORT' && (
          <ScrollView contentContainerStyle={styles.reportScroll} showsVerticalScrollIndicator={false}>
            {/* Compatibility Hero Score */}
            <View style={styles.scoreHeroCard}>
              <View style={styles.trophyCircle}>
                <Trophy size={40} color={Colors.gold} />
              </View>

              <Text style={styles.scorePctText}>{pct}% Match!</Text>
              <Text style={styles.scoreSummary}>
                You and {partnerName} agreed on {matches} out of {total} real-life situations! 💖
              </Text>

              <View style={styles.heartRewardPill}>
                <Sparkles size={14} color={Colors.primaryDark} />
                <Text style={styles.heartRewardText}>+45 Couple Hearts Added to Bank</Text>
              </View>
            </View>

            {/* Cupid AI Relationship Insight */}
            <View style={styles.cupidInsightBox}>
              <View style={styles.cupidHeaderRow}>
                <Bot size={18} color={Colors.primary} />
                <Text style={styles.cupidInsightTitle}>Cupid AI Relationship Growth Tip:</Text>
              </View>
              <Text style={styles.cupidInsightBody}>
                {pct >= 80
                  ? `Incredible alignment! Both of you share deep empathy for how comfort and space should be handled. Keep celebrating each other's small daily gestures.`
                  : `A wonderful blend of styles! Where you value immediate verbal comfort, ${partnerName} appreciates quiet affection. Embracing these complementary ways makes your bond bulletproof.`}
              </Text>
            </View>

            {/* Question by Question Breakdown */}
            <Text style={styles.breakdownHeader}>Side-by-Side Perspectives:</Text>

            <View style={styles.breakdownList}>
              {questions.map((q, idx) => {
                const myChoiceId = myAnswers[q.id];
                const partnerChoiceId = partnerAnswers[q.id];
                const isMatch = myChoiceId === partnerChoiceId;

                const myOpt = q.options.find(o => o.id === myChoiceId);
                const partnerOpt = q.options.find(o => o.id === partnerChoiceId);

                return (
                  <View key={q.id} style={[styles.breakdownCard, isMatch ? styles.cardMatched : styles.cardDiff]}>
                    <View style={styles.breakdownCardTop}>
                      <Text style={styles.qNum}>Scenario #{idx + 1}: {q.category}</Text>
                      {isMatch ? (
                        <View style={styles.matchBadge}>
                          <Check size={12} color={Colors.emeraldGreen} />
                          <Text style={styles.matchBadgeText}>100% Agreed</Text>
                        </View>
                      ) : (
                        <View style={styles.diffBadge}>
                          <Text style={styles.diffBadgeText}>Unique Views</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.breakdownPrompt}>"{q.scenario}"</Text>

                    <View style={styles.answersRow}>
                      <View style={styles.answerCol}>
                        <Text style={styles.answerOwner}>👩 You chose:</Text>
                        <Text style={styles.answerBody}>{myOpt?.text || 'Selected'}</Text>
                      </View>

                      <View style={styles.answerCol}>
                        <Text style={styles.answerOwner}>👨 {partnerName} chose:</Text>
                        <Text style={styles.answerBody}>{partnerOpt?.text || 'Selected'}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Actions */}
            <View style={styles.reportActions}>
              <GradientButton
                title="Send Results to Couple Chat 💬"
                onPress={() => {
                  if (onSendInviteToChat) onSendInviteToChat(quizModule.title);
                  onClose();
                }}
                style={styles.chatShareBtn}
              />

              <TouchableOpacity style={styles.replayBtn} onPress={handleReset}>
                <Text style={styles.replayBtnText}>Retake Quiz 🔄</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  quizTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  quizProgress: {
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
  scrollBody: {
    padding: Spacing.lg,
  },
  categoryTagRow: {
    marginBottom: Spacing.sm,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFEBF2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.full,
    alignSelf: 'flex-start',
  },
  categoryTagText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  scenarioCard: {
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
    marginBottom: Spacing.md,
  },
  scenarioEmoji: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  scenarioText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    lineHeight: 26,
  },
  pickPrompt: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    marginLeft: 2,
  },
  optionsList: {
    gap: Spacing.sm,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  optionCardSelected: {
    backgroundColor: '#FFEBF2',
    borderColor: Colors.primary,
  },
  optionLetterBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF5F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionLetterBoxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  optionLetter: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
  },
  optionLetterSelected: {
    color: '#FFFFFF',
  },
  optionText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 20,
    fontWeight: Typography.weights.medium,
  },
  optionTextSelected: {
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  reportScroll: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  scoreHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFEBF0',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 6,
    marginBottom: Spacing.md,
  },
  trophyCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF9E6',
    borderWidth: 2,
    borderColor: Colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  scorePctText: {
    fontSize: Typography.sizes.hero,
    fontWeight: Typography.weights.heavy,
    color: Colors.primaryDark,
    letterSpacing: -1,
  },
  scoreSummary: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 20,
    maxWidth: 260,
  },
  heartRewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFEBF2',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Spacing.borderRadius.full,
    marginTop: Spacing.md,
  },
  heartRewardText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  cupidInsightBox: {
    backgroundColor: '#FFF8FA',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#FFD1DF',
    marginBottom: Spacing.md,
    gap: 4,
  },
  cupidHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cupidInsightTitle: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  cupidInsightBody: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  breakdownHeader: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    marginLeft: 2,
  },
  breakdownList: {
    gap: Spacing.sm,
  },
  breakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  cardMatched: {
    borderColor: '#D4EDDA',
    backgroundColor: '#F9FFF9',
  },
  cardDiff: {
    borderColor: '#FFEBF0',
  },
  breakdownCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  qNum: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EBFBEE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Spacing.borderRadius.full,
  },
  matchBadgeText: {
    fontSize: 9,
    fontWeight: Typography.weights.bold,
    color: Colors.emeraldGreen,
  },
  diffBadge: {
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Spacing.borderRadius.full,
  },
  diffBadgeText: {
    fontSize: 9,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  breakdownPrompt: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  answersRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: '#FAF5F7',
    padding: Spacing.sm,
    borderRadius: Spacing.borderRadius.md,
  },
  answerCol: {
    flex: 1,
  },
  answerOwner: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  answerBody: {
    fontSize: Typography.sizes.xs,
    color: Colors.textPrimary,
    lineHeight: 16,
  },
  reportActions: {
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  chatShareBtn: {
    width: '100%',
  },
  replayBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  replayBtnText: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
});
