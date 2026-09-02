import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, FlatList } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Header } from '../../components/common/Header';
import { RomanticCard } from '../../components/common/RomanticCard';
import { GradientButton } from '../../components/common/GradientButton';
import { CoupleQuizSessionModal } from '../../components/games/CoupleQuizSessionModal';
import { CoupleChatModal } from '../../components/chat/CoupleChatModal';
import { CupidAIChatModal } from '../../components/us/CupidAIChatModal';
import { useAuth } from '../../context/AuthContext';
import { useCouple } from '../../context/CoupleContext';
import { usePremium } from '../../context/PremiumContext';
import { ALL_500_QUIZZES, QUIZ_CATEGORIES_500 } from '../../services/quizEngine500';
import { CompatibilityQuizModule } from '../../types';
import { Sparkles, Brain, Heart, Trophy, Bot, CheckCircle2, ArrowRight, Play, Star, Zap, Search, Shuffle, Dices, X, Crown, Lock } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

const { width } = Dimensions.get('window');

export const QuizScreen: React.FC = () => {
  const { user } = useAuth();
  const { couple, triggerHeartCelebration } = useCouple();
  const { isPremium, isFeatureLocked, openPaywall, priceDisplay } = usePremium();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuiz, setActiveQuiz] = useState<CompatibilityQuizModule | null>(null);
  const [showCupidModal, setShowCupidModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(30);

  const partner1Name = couple?.partner1?.nickname || couple?.partner1?.name || 'Srinija';
  const partner2Name = couple?.partner2?.nickname || couple?.partner2?.name || 'Partner';
  const partnerName = user?.id === 1 ? partner2Name : partner1Name;

  // Filter 500 quizzes by category and search term
  const filteredQuizzes = useMemo(() => {
    let list = ALL_500_QUIZZES;
    if (selectedCategory !== 'ALL') {
      list = list.filter(q => q.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const visibleQuizzes = useMemo(() => {
    return filteredQuizzes.slice(0, displayLimit);
  }, [filteredQuizzes, displayLimit]);

  const handleLaunchQuiz = (quiz: CompatibilityQuizModule) => {
    if (isFeatureLocked('quiz_cat_' + quiz.category)) {
      openPaywall(quiz.title);
      return;
    }
    triggerHaptic('heavy');
    setActiveQuiz(quiz);
  };

  const handleSurpriseMe = () => {
    triggerHaptic('heartbeat');
    const randomIdx = Math.floor(Math.random() * ALL_500_QUIZZES.length);
    const chosen = ALL_500_QUIZZES[randomIdx];
    if (isFeatureLocked('quiz_cat_' + chosen.category)) {
      openPaywall(chosen.title);
      return;
    }
    setActiveQuiz(chosen);
  };

  const handleReward = (hearts: number) => {
    triggerHeartCelebration();
  };

  const handleLoadMore = () => {
    if (displayLimit < filteredQuizzes.length) {
      setDisplayLimit(prev => Math.min(prev + 30, filteredQuizzes.length));
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="500 Couple Quizzes 🧠💖"
        subtitle="Explore all 500 situations, secrets & match tests"
        onOpenChat={() => setShowChatModal(true)}
      />

      {/* SEARCH BAR & RANDOM SHUFFLE */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={16} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search 500 quizzes (e.g. rain, ex, food, travel, fight)..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={(txt) => {
              setSearchQuery(txt);
              setDisplayLimit(30);
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.shuffleBtn} onPress={handleSurpriseMe} activeOpacity={0.8}>
          <Dices size={18} color="#FFFFFF" />
          <Text style={styles.shuffleBtnText}>Surprise Us 🎲</Text>
        </TouchableOpacity>
      </View>

      {/* CATEGORY TABS SCROLL */}
      <View style={styles.tabScrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          {QUIZ_CATEGORIES_500.map((tab) => {
            const isSelected = selectedCategory === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabChip, isSelected && styles.tabChipSelected]}
                onPress={() => {
                  triggerHaptic('light');
                  setSelectedCategory(tab.id);
                  setDisplayLimit(30);
                }}
              >
                <Text style={styles.tabEmoji}>{tab.emoji}</Text>
                <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>
                  {tab.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 200) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {/* 1. HERO 500 QUIZZES CELEBRATION CARD */}
        <RomanticCard style={styles.heroCard} variant="glass">
          <View style={styles.heroBadgeRow}>
            <View style={styles.heroBadge}>
              <Sparkles size={14} color={Colors.primary} />
              <Text style={styles.heroBadgeText}>COMPLETE 500-QUIZ COUPLE LIBRARY</Text>
            </View>
            <View style={styles.rewardPill}>
              <Heart size={14} color={Colors.loveRed} fill={Colors.loveRed} />
              <Text style={styles.rewardText}>500 Decks</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>Situations, Desires & Opinions 🧠</Text>
          <Text style={styles.heroDesc}>
            Take any quiz first, then send an invitation to {partnerName}. Answers stay sealed until both complete for a 100% genuine synchronized match reveal!
          </Text>

          <View style={styles.statsMetricsRow}>
            <View style={styles.metricCol}>
              <Text style={styles.metricVal}>500</Text>
              <Text style={styles.metricLabel}>Total Quizzes</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricCol}>
              <Text style={styles.metricVal}>12</Text>
              <Text style={styles.metricLabel}>Categories</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricCol}>
              <Text style={styles.metricVal}>94%</Text>
              <Text style={styles.metricLabel}>Avg. In Sync</Text>
            </View>
          </View>

          <GradientButton
            title="Play Featured Quiz #1 Now 🚀"
            onPress={() => handleLaunchQuiz(ALL_500_QUIZZES[0])}
            style={styles.heroBtn}
          />
        </RomanticCard>

        {/* 2. QUIZ CATALOG HEADER & COUNT */}
        <View style={styles.sectionHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>
              Showing {visibleQuizzes.length} of {filteredQuizzes.length} Quizzes
            </Text>
            <Text style={styles.sectionSub}>Tap any quiz card to start your 2-player match</Text>
          </View>

          {displayLimit < filteredQuizzes.length && (
            <TouchableOpacity onPress={() => setDisplayLimit(prev => prev + 50)}>
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 3. LIST OF ALL 500 QUIZ CARDS */}
        <View style={styles.quizList}>
          {visibleQuizzes.map((quiz, index) => {
            const isLocked = isFeatureLocked('quiz_cat_' + quiz.category);

            return (
              <TouchableOpacity
                key={quiz.id}
                style={[styles.quizCard, isLocked && styles.quizCardLocked]}
                onPress={() => handleLaunchQuiz(quiz)}
                activeOpacity={0.85}
              >
                <View style={styles.quizCardTop}>
                  <View style={[styles.quizEmojiBox, { backgroundColor: quiz.gradient[0] + '22' }]}>
                    <Text style={styles.quizEmoji}>{quiz.iconEmoji}</Text>
                  </View>

                  {isLocked ? (
                    <View style={styles.vipBadge}>
                      <Crown size={11} color="#8A5D00" />
                      <Text style={styles.vipBadgeText}>VIP ({priceDisplay})</Text>
                    </View>
                  ) : (
                    <View style={styles.quizBadgePill}>
                      <Text style={styles.quizBadgePillText}>{quiz.category.replace('_', ' ')}</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.quizCardTitle}>{quiz.title}</Text>
                <Text style={styles.quizCardTagline}>{quiz.tagline}</Text>

                <View style={styles.quizCardFooter}>
                  <View style={styles.quizMeta}>
                    <Text style={styles.metaItem}>📝 {quiz.totalQuestions} Questions</Text>
                    <Text style={styles.metaItem}>❤️ +45 Pts</Text>
                  </View>

                  <View style={[styles.takeQuizBtn, isLocked && styles.takeQuizBtnLocked]}>
                    {isLocked ? (
                      <>
                        <Lock size={12} color="#8A5D00" />
                        <Text style={[styles.takeQuizText, { color: '#8A5D00' }]}>Unlock</Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.takeQuizText}>Play</Text>
                        <ArrowRight size={12} color="#FFFFFF" />
                      </>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 4. CUPID AI CUSTOM GENERATOR */}
        <TouchableOpacity
          style={styles.aiCard}
          onPress={() => {
            triggerHaptic('heavy');
            setShowCupidModal(true);
          }}
          activeOpacity={0.85}
        >
          <View style={styles.aiIconCircle}>
            <Bot size={24} color="#FFFFFF" />
          </View>
          <View style={styles.aiInfo}>
            <View style={styles.aiTitleRow}>
              <Text style={styles.aiTitle}>Cupid AI Custom Scenario Architect</Text>
              <Sparkles size={14} color={Colors.gold} />
            </View>
            <Text style={styles.aiSub}>
              Have a hyper-specific couple scenario? Ask Cupid AI to generate a custom quiz for tonight!
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Quiz Modal */}
      <CoupleQuizSessionModal
        visible={!!activeQuiz}
        quizModule={activeQuiz}
        partnerName={partnerName}
        currentUser={user}
        onClose={() => setActiveQuiz(null)}
        onSendInviteToChat={(title) => setShowChatModal(true)}
        onRewardHearts={handleReward}
      />

      {/* Couple Chat Modal */}
      <CoupleChatModal
        visible={showChatModal}
        partnerName={partnerName}
        currentUser={user}
        onClose={() => setShowChatModal(false)}
      />

      {/* Cupid AI Chat Modal */}
      <CupidAIChatModal
        visible={showCupidModal}
        onClose={() => setShowCupidModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    gap: Spacing.xs + 2,
    backgroundColor: Colors.background,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textPrimary,
    padding: 0,
  },
  shuffleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: Spacing.borderRadius.full,
  },
  shuffleBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  tabScrollContainer: {
    paddingVertical: 4,
    backgroundColor: Colors.background,
  },
  tabScroll: {
    paddingHorizontal: Spacing.md,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Spacing.borderRadius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginRight: Spacing.xs + 2,
  },
  tabChipSelected: {
    backgroundColor: '#FFEBF2',
    borderColor: Colors.primary,
  },
  tabEmoji: {
    fontSize: 14,
  },
  tabText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  tabTextSelected: {
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: 140,
  },
  heroCard: {
    marginVertical: Spacing.xs,
    padding: Spacing.md,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFEBF2',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.full,
  },
  heroBadgeText: {
    fontSize: Typography.sizes.xs - 2,
    fontWeight: Typography.weights.heavy,
    color: Colors.primaryDark,
  },
  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFEBF0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Spacing.borderRadius.full,
  },
  rewardText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.loveRed,
  },
  heroTitle: {
    fontSize: Typography.sizes.lg + 1,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  heroDesc: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  statsMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFF8FA',
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#FFE0EB',
    marginBottom: Spacing.md,
  },
  metricCol: {
    alignItems: 'center',
  },
  metricVal: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.heavy,
    color: Colors.primaryDark,
  },
  metricLabel: {
    fontSize: Typography.sizes.xs - 2,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.bold,
    marginTop: 1,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#FFD1DF',
  },
  heroBtn: {
    marginTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    marginLeft: 2,
  },
  sectionTitle: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  sectionSub: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  loadMoreText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  quizList: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  quizCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  quizCardLocked: {
    borderColor: '#FFE082',
    backgroundColor: '#FFFDF7',
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFF0C2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Spacing.borderRadius.sm,
    borderWidth: 0.5,
    borderColor: '#FFD700',
  },
  vipBadgeText: {
    fontSize: 9,
    fontWeight: Typography.weights.heavy,
    color: '#8A5D00',
  },
  takeQuizBtnLocked: {
    backgroundColor: '#FFF0C2',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  quizCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  quizEmojiBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizEmoji: {
    fontSize: 22,
  },
  quizBadgePill: {
    backgroundColor: '#FFEBF2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Spacing.borderRadius.sm,
  },
  quizBadgePillText: {
    fontSize: 9,
    fontWeight: Typography.weights.heavy,
    color: Colors.primaryDark,
  },
  quizCardTitle: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  quizCardTagline: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  quizCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#FAF0F4',
  },
  quizMeta: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  metaItem: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  takeQuizBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Spacing.borderRadius.full,
  },
  takeQuizText: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: '#FFF8FA',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#FFCCD8',
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  aiIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiInfo: {
    flex: 1,
  },
  aiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  aiSub: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
});
