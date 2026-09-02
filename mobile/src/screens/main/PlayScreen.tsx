import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Header } from '../../components/common/Header';
import { RomanticCard } from '../../components/common/RomanticCard';
import { GradientButton } from '../../components/common/GradientButton';
import { DecisionWheel } from '../../components/games/DecisionWheel';
import { GameArenaModal } from '../../components/games/GameArenaModal';
import { ArcadeGameLauncherModal } from '../../components/games/ArcadeGameLauncherModal';
import { CoupleQuizSessionModal } from '../../components/games/CoupleQuizSessionModal';
import { CoupleChatModal } from '../../components/chat/CoupleChatModal';
import { CupidAIChatModal } from '../../components/us/CupidAIChatModal';
import { useAuth } from '../../context/AuthContext';
import { useCouple } from '../../context/CoupleContext';
import { usePremium } from '../../context/PremiumContext';
import { ARCADE_30_GAMES, ArcadeGame } from '../../services/gamesCatalog';
import { ALL_GAME_DECKS, GameDeck } from '../../services/gamesData';
import { DEEP_COMPATIBILITY_QUIZZES } from '../../services/deepQuizCatalog';
import { CompatibilityQuizModule } from '../../types';
import { Flame, Heart, Sparkles, Zap, Award, Smile, Play, Bot, Dices, Trophy, Star, MessageCircle, CheckCircle2, Crown, Lock } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

const { width } = Dimensions.get('window');

const ARCADE_TABS = [
  { id: 'ALL', label: 'All 30 Games 🎮' },
  { id: 'BOARD', label: 'Board & Ludo 🎲' },
  { id: 'CAR_RACING', label: 'Car Racing 🏎️' },
  { id: 'ACTION', label: 'Action & Duels ⚡' },
  { id: 'PUZZLE', label: 'Brain & Memory 🧩' },
  { id: 'CARDS', label: 'Cards & Uno 🃏' },
  { id: 'ARCADE', label: 'Casual & Rhythm 🎵' },
];

export const PlayScreen: React.FC = () => {
  const { user } = useAuth();
  const { couple, triggerHeartCelebration } = useCouple();
  const { isPremium, isFeatureLocked, openPaywall, priceDisplay } = usePremium();
  const [selectedArcadeTab, setSelectedArcadeTab] = useState('ALL');
  const [activeArcadeGame, setActiveArcadeGame] = useState<ArcadeGame | null>(null);
  const [activeQADeck, setActiveQADeck] = useState<GameDeck | null>(null);
  const [activeDeepQuiz, setActiveDeepQuiz] = useState<CompatibilityQuizModule | null>(null);
  const [showCupidModal, setShowCupidModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  const partner1Name = couple?.partner1?.nickname || couple?.partner1?.name || 'Srinija';
  const partner2Name = couple?.partner2?.nickname || couple?.partner2?.name || 'Partner';
  const partnerName = user?.id === 1 ? partner2Name : partner1Name;

  const filteredArcadeGames = selectedArcadeTab === 'ALL'
    ? ARCADE_30_GAMES
    : ARCADE_30_GAMES.filter(g => g.category === selectedArcadeTab);

  const handleLaunchArcade = (game: ArcadeGame) => {
    if (isFeatureLocked('game_' + game.id)) {
      openPaywall(game.title);
      return;
    }
    triggerHaptic('heavy');
    setActiveArcadeGame(game);
  };

  const handleLaunchQA = (deck: GameDeck) => {
    triggerHaptic('medium');
    setActiveQADeck(deck);
  };

  const handleLaunchDeepQuiz = (quiz: CompatibilityQuizModule) => {
    triggerHaptic('heavy');
    setActiveDeepQuiz(quiz);
  };

  const handleReward = (hearts: number) => {
    triggerHeartCelebration();
  };

  return (
    <View style={styles.container}>
      <Header
        title="Couples Games & Quizzes 🎮"
        subtitle="30 Mini-games & 500+ situation quizzes"
        onOpenChat={() => setShowChatModal(true)}
      />

      {/* ARCADE CATEGORY TABS */}
      <View style={styles.tabScrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          {ARCADE_TABS.map((tab) => {
            const isSelected = selectedArcadeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabChip, isSelected && styles.tabChipSelected]}
                onPress={() => {
                  triggerHaptic('light');
                  setSelectedArcadeTab(tab.id);
                }}
              >
                <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>
                  {tab.label}
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
      >
        {/* 1. 500+ SCENARIOS & COMPATIBILITY QUIZZES HERO */}
        <RomanticCard style={styles.deepQuizHeroCard} variant="glass">
          <View style={styles.deepQuizHeroTop}>
            <View style={styles.deepQuizBadge}>
              <Sparkles size={14} color={Colors.primary} />
              <Text style={styles.deepQuizBadgeText}>500+ SITUATION & OPINION QUIZZES</Text>
            </View>
            <Text style={styles.matchSyncTag}>2-Player Match Sync</Text>
          </View>

          <Text style={styles.deepQuizTitle}>Couple Situations & Decision Analysis 🧠</Text>
          <Text style={styles.deepQuizSub}>
            Play first & send invitation to {partnerName}. Once both complete, reveal your synchronized % compatibility and breakdown!
          </Text>

          <View style={styles.deepQuizModulesScroll}>
            {DEEP_COMPATIBILITY_QUIZZES.map((quiz) => (
              <TouchableOpacity
                key={quiz.id}
                style={styles.deepQuizCard}
                onPress={() => handleLaunchDeepQuiz(quiz)}
                activeOpacity={0.8}
              >
                <Text style={styles.deepQuizEmoji}>{quiz.iconEmoji}</Text>
                <Text style={styles.deepQuizCardTitle} numberOfLines={1}>{quiz.title}</Text>
                <Text style={styles.deepQuizCardTagline} numberOfLines={2}>{quiz.tagline}</Text>
                <View style={styles.deepQuizFooter}>
                  <Text style={styles.deepQuizCount}>{quiz.totalQuestions} Questions</Text>
                  <View style={styles.playQuizPill}>
                    <Text style={styles.playQuizText}>Start Quiz 🚀</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </RomanticCard>

        {/* 2. 30 ARCADE GAMES GRID */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>30 Playable Couple Arcade Games ({filteredArcadeGames.length})</Text>
            <Text style={styles.sectionSub}>Ludo, Car Racing, Snakes & Ladders, Chess & Uno</Text>
          </View>
        </View>

        <View style={styles.arcadeGrid}>
          {filteredArcadeGames.map((game) => {
            const isLocked = isFeatureLocked('game_' + game.id);

            return (
              <TouchableOpacity
                key={game.id}
                style={[styles.arcadeCard, isLocked && styles.arcadeCardLocked]}
                onPress={() => handleLaunchArcade(game)}
                activeOpacity={0.85}
              >
                <View style={styles.arcadeTopRow}>
                  <View style={[styles.arcadeIconBox, { backgroundColor: game.gradient[0] + '22' }]}>
                    <Text style={styles.arcadeEmoji}>{game.iconEmoji}</Text>
                  </View>
                  {isLocked ? (
                    <View style={styles.vipBadge}>
                      <Crown size={10} color="#8A5D00" />
                      <Text style={styles.vipBadgeText}>VIP ({priceDisplay})</Text>
                    </View>
                  ) : game.badge ? (
                    <View style={styles.arcadeBadge}>
                      <Text style={styles.arcadeBadgeText}>{game.badge}</Text>
                    </View>
                  ) : null}
                </View>

                <Text style={styles.arcadeCardTitle} numberOfLines={1}>{game.title}</Text>
                <Text style={styles.arcadeCardTagline} numberOfLines={2}>{game.tagline}</Text>

                <View style={styles.arcadeFooter}>
                  <View style={styles.metaCol}>
                    <Text style={styles.playersTag}>{game.players}</Text>
                    <Text style={styles.ratingText}>⭐ {game.rating}</Text>
                  </View>

                  <View style={[styles.playMiniBtn, isLocked && styles.playMiniBtnLocked]}>
                    {isLocked ? (
                      <Lock size={10} color="#8A5D00" />
                    ) : (
                      <Play size={10} color="#FFFFFF" fill="#FFFFFF" />
                    )}
                    <Text style={[styles.playMiniBtnText, isLocked && styles.playMiniBtnTextLocked]}>
                      {isLocked ? 'Unlock' : 'Play'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 3. COUPLE Q&A & SPICY CHALLENGES SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Spicy Challenges & Intimacy Decks 🔥</Text>
          <Text style={styles.sectionSub}>Would you rather, truth or dare, and secret quizzes</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.qaScroll}>
          {ALL_GAME_DECKS.map((deck) => (
            <TouchableOpacity
              key={deck.id}
              style={styles.qaCard}
              onPress={() => handleLaunchQA(deck)}
              activeOpacity={0.85}
            >
              <View style={styles.qaTop}>
                <Text style={styles.qaEmoji}>
                  {deck.icon === 'Flame' ? '🔥' : deck.icon === 'Heart' ? '💍' : deck.icon === 'Zap' ? '⚡' : deck.icon === 'Smile' ? '🙈' : '🧠'}
                </Text>
                <Text style={styles.qaSpice}>{'🌶️'.repeat(deck.spiceLevel)}</Text>
              </View>
              <Text style={styles.qaTitle}>{deck.title}</Text>
              <Text style={styles.qaSub} numberOfLines={2}>{deck.subtitle}</Text>
              <Text style={styles.qaCount}>{deck.questions.length} Questions</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 4. DECISION SPINNER */}
        <View style={styles.spinnerSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Couples Decision Spinner 🎡</Text>
            <Text style={styles.sectionSub}>Can't agree on dinner or date night? Spin it!</Text>
          </View>
          <DecisionWheel />
        </View>

        {/* 5. CUPID AI CUSTOM GAME GENERATOR */}
        <TouchableOpacity
          style={styles.aiQuizBanner}
          onPress={() => {
            triggerHaptic('heavy');
            setShowCupidModal(true);
          }}
          activeOpacity={0.85}
        >
          <View style={styles.aiIconCircle}>
            <Bot size={24} color="#FFFFFF" />
          </View>
          <View style={styles.aiQuizInfo}>
            <View style={styles.aiQuizTitleRow}>
              <Text style={styles.aiQuizTitle}>Cupid AI Custom Game Architect</Text>
              <Sparkles size={14} color={Colors.gold} />
            </View>
            <Text style={styles.aiQuizSub}>
              Ask Cupid AI to generate custom romantic trivia or roleplay scenarios for tonight!
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Deep Scenario Quiz Session Modal */}
      <CoupleQuizSessionModal
        visible={!!activeDeepQuiz}
        quizModule={activeDeepQuiz}
        partnerName={partnerName}
        currentUser={user}
        onClose={() => setActiveDeepQuiz(null)}
        onSendInviteToChat={(title) => {
          setShowChatModal(true);
        }}
        onRewardHearts={handleReward}
      />

      {/* Arcade Game Launcher Modal */}
      <ArcadeGameLauncherModal
        visible={!!activeArcadeGame}
        game={activeArcadeGame}
        partner1Name={partner1Name}
        partner2Name={partner2Name}
        onClose={() => setActiveArcadeGame(null)}
        onRewardHearts={handleReward}
      />

      {/* Q&A Game Arena Modal */}
      <GameArenaModal
        visible={!!activeQADeck}
        deck={activeQADeck}
        partnerName={partnerName}
        onClose={() => setActiveQADeck(null)}
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
  tabScrollContainer: {
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.background,
  },
  tabScroll: {
    paddingHorizontal: Spacing.md,
  },
  tabChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
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
  tabText: {
    fontSize: Typography.sizes.xs + 1,
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
  deepQuizHeroCard: {
    marginVertical: Spacing.xs,
    padding: Spacing.md,
  },
  deepQuizHeroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  deepQuizBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFEBF2',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.full,
  },
  deepQuizBadgeText: {
    fontSize: Typography.sizes.xs - 2,
    fontWeight: Typography.weights.heavy,
    color: Colors.primaryDark,
  },
  matchSyncTag: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.bold,
    color: Colors.emeraldGreen,
  },
  deepQuizTitle: {
    fontSize: Typography.sizes.md + 2,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  deepQuizSub: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  deepQuizModulesScroll: {
    gap: Spacing.sm,
  },
  deepQuizCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
    gap: 4,
  },
  deepQuizEmoji: {
    fontSize: 26,
    marginBottom: 2,
  },
  deepQuizCardTitle: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  deepQuizCardTagline: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  deepQuizFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#FAF0F4',
  },
  deepQuizCount: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  playQuizPill: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.full,
  },
  playQuizText: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  sectionHeader: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    marginLeft: 2,
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  sectionSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  arcadeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs + 2,
    marginTop: Spacing.xs,
  },
  arcadeCard: {
    width: (width - 44) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.sm + 2,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  arcadeCardLocked: {
    borderColor: '#FFE082',
    backgroundColor: '#FFFDF7',
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFF0C2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Spacing.borderRadius.sm,
    borderWidth: 0.5,
    borderColor: '#FFD700',
  },
  vipBadgeText: {
    fontSize: 8,
    fontWeight: Typography.weights.heavy,
    color: '#8A5D00',
  },
  playMiniBtnLocked: {
    backgroundColor: '#FFF0C2',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  playMiniBtnTextLocked: {
    color: '#8A5D00',
  },
  arcadeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  arcadeIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arcadeEmoji: {
    fontSize: 20,
  },
  arcadeBadge: {
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Spacing.borderRadius.sm,
  },
  arcadeBadgeText: {
    fontSize: 8,
    fontWeight: Typography.weights.heavy,
    color: '#D35400',
  },
  arcadeCardTitle: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  arcadeCardTagline: {
    fontSize: Typography.sizes.xs - 2,
    color: Colors.textSecondary,
    lineHeight: 14,
    marginTop: 2,
    height: 28,
  },
  arcadeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#FAF0F4',
  },
  metaCol: {
    gap: 1,
  },
  playersTag: {
    fontSize: 9,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
  },
  ratingText: {
    fontSize: 9,
    fontWeight: Typography.weights.bold,
    color: '#B7791F',
  },
  playMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.full,
  },
  playMiniBtnText: {
    fontSize: 9,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  qaScroll: {
    marginTop: Spacing.xs,
  },
  qaCard: {
    width: 170,
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.sm,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
    marginRight: Spacing.sm,
  },
  qaTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  qaEmoji: {
    fontSize: 22,
  },
  qaSpice: {
    fontSize: 10,
  },
  qaTitle: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  qaSub: {
    fontSize: Typography.sizes.xs - 2,
    color: Colors.textSecondary,
    marginTop: 2,
    height: 26,
  },
  qaCount: {
    fontSize: Typography.sizes.xs - 2,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
    marginTop: 4,
  },
  spinnerSection: {
    marginVertical: Spacing.sm,
  },
  aiQuizBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: '#FFF8FA',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#FFCCD8',
    marginTop: Spacing.sm,
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
  aiQuizInfo: {
    flex: 1,
  },
  aiQuizTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiQuizTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  aiQuizSub: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
});
