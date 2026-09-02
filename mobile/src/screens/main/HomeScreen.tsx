import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Header } from '../../components/common/Header';
import { RomanticCard } from '../../components/common/RomanticCard';
import { GradientButton } from '../../components/common/GradientButton';
import { AvatarBubble } from '../../components/common/AvatarBubble';
import { PulsingHeart } from '../../components/common/PulsingHeart';
import { AmbientBackgroundHearts } from '../../components/common/AmbientBackgroundHearts';
import { HeartNudgeModal } from '../../components/common/HeartNudgeModal';
import { StoriesTray } from '../../components/stories/StoriesTray';
import { CreateStoryModal } from '../../components/stories/CreateStoryModal';
import { StoryViewerModal } from '../../components/stories/StoryViewerModal';
import { CoupleChatModal } from '../../components/chat/CoupleChatModal';
import { LoveQuotesWidget } from '../../components/common/LoveQuotesWidget';
import { ThinkingOfYouNotificationModal } from '../../components/common/ThinkingOfYouNotificationModal';
import { LoveGardenWidget } from '../../components/garden/LoveGardenWidget';
import { DrawTogetherModal } from '../../components/canvas/DrawTogetherModal';
import { ScratchDateModal } from '../../components/explore/ScratchDateModal';
import { LoveVaultModal } from '../../components/vault/LoveVaultModal';
import { CoupleTrophyModal } from '../../components/trophies/CoupleTrophyModal';
import { CoupleTravelMapModal } from '../../components/travel/CoupleTravelMapModal';
import { PolaroidPhotoBoothModal } from '../../components/polaroid/PolaroidPhotoBoothModal';
import { CustomLoveWheelModal } from '../../components/games/CustomLoveWheelModal';
import { MilestoneCountdownsModal } from '../../components/milestones/MilestoneCountdownsModal';
import { BedtimeSyncModal } from '../../components/bedtime/BedtimeSyncModal';
import { useAuth } from '../../context/AuthContext';
import { useCouple } from '../../context/CoupleContext';
import { usePremium } from '../../context/PremiumContext';
import { api } from '../../services/api';
import { DailyQuestion, Memory, CoupleStory } from '../../types';
import { Heart, Flame, Sparkles, Send, Lock, Calendar, MessageCircle, Gamepad2, ArrowRight, Palette, Gift, Trophy, Crown, Moon, MapPin, Camera, Dices, Clock } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

const { width } = Dimensions.get('window');

const INITIAL_STORIES: CoupleStory[] = [];

const MOODS = [
  { id: 'in_love', label: 'In Love', emoji: '🥰' },
  { id: 'teddy_hugs', label: 'Teddy Hugs', emoji: '🧸' },
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'chill', label: 'Chill', emoji: '🌿' },
  { id: 'tired', label: 'Tired', emoji: '😴' },
  { id: 'need_hugs', label: 'Need Love', emoji: '🥺' },
  { id: 'stressed', label: 'Stressed', emoji: '😤' },
];

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const { couple, updateMood, triggerHeartCelebration } = useCouple();
  const { isPremium, isFeatureLocked, openPaywall } = usePremium();
  const [dailyQuestion, setDailyQuestion] = useState<DailyQuestion | null>(null);
  const [answerInput, setAnswerInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNudgeModal, setShowNudgeModal] = useState(false);

  // Stories & Chat State
  const [stories, setStories] = useState<CoupleStory[]>([]);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [activeStoryToView, setActiveStoryToView] = useState<CoupleStory | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [storyReplyToPass, setStoryReplyToPass] = useState<{
    storyId: string;
    storyType: 'NOTE' | 'VOICE' | 'VIDEO_PHOTO';
    snippet: string;
  } | null>(null);

  // Notifications
  const [showThinkingOfYouModal, setShowThinkingOfYouModal] = useState(false);
  const [activeNotificationQuote, setActiveNotificationQuote] = useState<string | undefined>(undefined);

  // Feature Modals
  const [showDrawModal, setShowDrawModal] = useState(false);
  const [showScratchModal, setShowScratchModal] = useState(false);
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [showTrophyModal, setShowTrophyModal] = useState(false);
  const [showTravelModal, setShowTravelModal] = useState(false);
  const [showPolaroidModal, setShowPolaroidModal] = useState(false);
  const [showWheelModal, setShowWheelModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showBedtimeModal, setShowBedtimeModal] = useState(false);

  useEffect(() => {
    loadDaily();
  }, [user]);

  const loadDaily = async () => {
    try {
      const dq = await api.getDailyQuestion();
      setDailyQuestion(dq);
    } catch (e) {
      console.warn('Failed to load daily question', e);
    }
  };

  const handleAnswerDaily = async () => {
    if (!answerInput.trim()) return;
    triggerHaptic('success');
    setIsSubmitting(true);
    try {
      const updated = await api.answerDailyQuestion(answerInput.trim());
      setDailyQuestion(updated);
      setAnswerInput('');
      triggerHeartCelebration();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostStory = (newStoryData: any) => {
    const created: CoupleStory = {
      id: `story_${Date.now()}`,
      ...newStoryData,
      authorId: user?.id || 1,
      authorName: user?.nickname || user?.name || 'Srinija',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      reactions: [],
      repliesCount: 0,
      isViewed: false,
    };
    setStories(prev => [created, ...prev]);
    triggerHeartCelebration();
  };

  const handleReplyToStory = (story: CoupleStory, replyText: string) => {
    setStoryReplyToPass({
      storyId: story.id,
      storyType: story.type,
      snippet: story.type === 'NOTE' ? story.content : story.caption || `${story.type} Story`,
    });
    setShowChatModal(true);
  };

  const handleSendThinkingOfYou = () => {
    triggerHaptic('heartbeat');
    triggerHeartCelebration();
    setActiveNotificationQuote("I was just doing something random and suddenly remembered your gorgeous smile. I love you endlessly! 🧸💖");
    setShowThinkingOfYouModal(true);
  };

  const isUser1 = user?.id === couple?.partner1?.id;
  const partner1Name = couple?.partner1?.nickname || couple?.partner1?.name || (isUser1 ? user?.name : 'Partner 1') || 'You';
  const partner2Name = couple?.partner2?.nickname || couple?.partner2?.name || (!isUser1 ? user?.name : 'Partner') || 'Partner';

  const myMood = isUser1 ? couple?.moodPartner1 : couple?.moodPartner2;
  const partnerName = isUser1 ? partner2Name : partner1Name;

  return (
    <View style={styles.container}>
      <AmbientBackgroundHearts />
      <Header onOpenChat={() => setShowChatModal(true)} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* 24-Hour Couple Stories Tray */}
        <StoriesTray
          stories={stories}
          onAddStoryPress={() => setShowCreateStory(true)}
          onViewStoryPress={(story) => setActiveStoryToView(story)}
        />

        {/* 1. Hero Days Together Counter */}
        <RomanticCard style={styles.heroCard} variant="glass">
          <View style={styles.heroTop}>
            <AvatarBubble
              name={partner1Name}
              emoji="👩"
              mood={couple?.moodPartner1}
              isMe={isUser1}
            />

            <View style={styles.daysCenter}>
              <PulsingHeart
                emoji="🧸❤️"
                size={54}
                onPress={triggerHeartCelebration}
              />
              <Text style={styles.daysNumber}>{couple?.daysTogether || 1}</Text>
              <Text style={styles.daysLabel}>Days in Love 💖</Text>
            </View>

            <AvatarBubble
              name={partner2Name}
              emoji="👨"
              mood={couple?.moodPartner2}
              isMe={!isUser1}
            />
          </View>

          {/* Quick "I Remembered You" Action Row */}
          <View style={styles.heroButtonsRow}>
            <TouchableOpacity
              style={styles.thinkingOfYouBtn}
              onPress={handleSendThinkingOfYou}
              activeOpacity={0.8}
            >
              <Text style={styles.thinkingEmoji}>💭</Text>
              <Text style={styles.thinkingText}>I Remembered You 🥰</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sendHugBar}
              onPress={() => {
                triggerHaptic('medium');
                setShowNudgeModal(true);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.sendHugEmoji}>🧸</Text>
              <Text style={styles.sendHugText}>Virtual Hug</Text>
            </TouchableOpacity>
          </View>
        </RomanticCard>

        {/* 2. ROMANTIC TOOLS TRAY - ROW 1 */}
        <View style={styles.toolsRow}>
          <TouchableOpacity
            style={styles.toolChip}
            onPress={() => {
              if (isFeatureLocked('DRAW_TOGETHER')) {
                openPaywall('Live Touch Canvas 🎨');
                return;
              }
              triggerHaptic('medium');
              setShowDrawModal(true);
            }}
            activeOpacity={0.8}
          >
            <View style={[styles.toolIconCircle, { backgroundColor: '#FFEBF2' }]}>
              <Palette size={18} color={Colors.primary} />
            </View>
            <Text style={styles.toolTitle}>Draw Live 🎨</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolChip}
            onPress={() => {
              triggerHaptic('medium');
              setShowScratchModal(true);
            }}
            activeOpacity={0.8}
          >
            <View style={[styles.toolIconCircle, { backgroundColor: '#FFF9E6' }]}>
              <Gift size={18} color={Colors.gold} />
            </View>
            <Text style={styles.toolTitle}>Scratch Date 🎟️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolChip}
            onPress={() => {
              if (isFeatureLocked('LOVE_VAULT')) {
                openPaywall('Secret Love Vault 🔐');
                return;
              }
              triggerHaptic('medium');
              setShowVaultModal(true);
            }}
            activeOpacity={0.8}
          >
            <View style={[styles.toolIconCircle, { backgroundColor: '#F0F8FF' }]}>
              <Lock size={18} color="#4FACFE" />
            </View>
            <Text style={styles.toolTitle}>Love Vault 🔐</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolChip}
            onPress={() => {
              if (isFeatureLocked('BEDTIME_AUDIO')) {
                openPaywall('Bedtime Audio Stories 🌙');
                return;
              }
              triggerHaptic('medium');
              setShowBedtimeModal(true);
            }}
            activeOpacity={0.8}
          >
            <View style={[styles.toolIconCircle, { backgroundColor: '#EDE7F6' }]}>
              <Moon size={18} color="#7E57C2" />
            </View>
            <Text style={styles.toolTitle}>Bedtime Hug 🌙</Text>
          </TouchableOpacity>
        </View>

        {/* 3. ROMANTIC TOOLS TRAY - ROW 2 (Travel, Polaroid, Dare Wheel, Countdowns) */}
        <View style={styles.toolsRow}>
          <TouchableOpacity
            style={styles.toolChip}
            onPress={() => {
              triggerHaptic('medium');
              setShowTravelModal(true);
            }}
            activeOpacity={0.8}
          >
            <View style={[styles.toolIconCircle, { backgroundColor: '#E0F7FA' }]}>
              <MapPin size={18} color="#00ACC1" />
            </View>
            <Text style={styles.toolTitle}>Travel Map 🗺️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolChip}
            onPress={() => {
              triggerHaptic('medium');
              setShowPolaroidModal(true);
            }}
            activeOpacity={0.8}
          >
            <View style={[styles.toolIconCircle, { backgroundColor: '#FFF3E0' }]}>
              <Camera size={18} color="#FB8C00" />
            </View>
            <Text style={styles.toolTitle}>Polaroids 📸</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolChip}
            onPress={() => {
              triggerHaptic('medium');
              setShowWheelModal(true);
            }}
            activeOpacity={0.8}
          >
            <View style={[styles.toolIconCircle, { backgroundColor: '#FCE4EC' }]}>
              <Dices size={18} color="#E91E63" />
            </View>
            <Text style={styles.toolTitle}>Dare Wheel 🎡</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolChip}
            onPress={() => {
              triggerHaptic('medium');
              setShowMilestoneModal(true);
            }}
            activeOpacity={0.8}
          >
            <View style={[styles.toolIconCircle, { backgroundColor: '#E8F5E9' }]}>
              <Clock size={18} color="#43A047" />
            </View>
            <Text style={styles.toolTitle}>Timers ⏳</Text>
          </TouchableOpacity>
        </View>

        {/* 4. VIRTUAL LOVE GARDEN WIDGET */}
        <LoveGardenWidget
          partnerName={partnerName}
          onRewardHearts={() => triggerHeartCelebration()}
        />

        {/* 5. CUTE LOVE QUOTES & CUSTOM REMINDERS WIDGET */}
        <LoveQuotesWidget
          partnerName={partnerName}
          onSendQuoteNotification={(quote) => {
            setActiveNotificationQuote(quote);
            setShowThinkingOfYouModal(true);
            triggerHeartCelebration();
          }}
        />

        {/* 6. Live Mood Bar */}
        <View style={styles.moodSection}>
          <Text style={styles.sectionHeading}>How are you feeling today?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodScroll}>
            {MOODS.map((m) => {
              const isSelected = myMood === m.id;
              return (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.moodItem, isSelected && styles.moodItemSelected]}
                  onPress={() => updateMood(m.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.moodEmoji}>{m.emoji}</Text>
                  <Text style={[styles.moodLabel, isSelected && styles.moodLabelSelected]}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 7. Daily Question ("Our Day") Synchronized Answer */}
        <RomanticCard style={styles.dailyCard}>
          <View style={styles.dailyHeader}>
            <View style={styles.dailyBadge}>
              <Sparkles size={14} color={Colors.primary} />
              <Text style={styles.dailyBadgeText}>TODAY'S QUESTION 🧸</Text>
            </View>
            <Text style={styles.rewardText}>+20 ❤️ Points</Text>
          </View>

          <Text style={styles.dailyPrompt}>
            "{dailyQuestion?.prompt || 'What was one sweet thing that made your heart flutter this week?'}"
          </Text>

          {/* Answers State */}
          {dailyQuestion?.bothAnswered ? (
            <View style={styles.revealedAnswersBox}>
              <View style={styles.answerBubbleMe}>
                <Text style={styles.answerAuthor}>You wrote:</Text>
                <Text style={styles.answerText}>{dailyQuestion.partner1Answer}</Text>
              </View>

              <View style={styles.answerBubblePartner}>
                <Text style={styles.answerAuthor}>{partnerName} wrote:</Text>
                <Text style={styles.answerText}>{dailyQuestion.partner2Answer}</Text>
              </View>

              <View style={styles.bothAnsweredBadge}>
                <Heart size={16} color={Colors.loveRed} fill={Colors.loveRed} />
                <Text style={styles.bothAnsweredText}>Both Answered Today! Streak +1 🔥</Text>
              </View>
            </View>
          ) : dailyQuestion?.isAnsweredByMe ? (
            <View style={styles.waitingPartnerBox}>
              <View style={styles.answerBubbleMe}>
                <Text style={styles.answerAuthor}>You answered:</Text>
                <Text style={styles.answerText}>{dailyQuestion.partner1Answer || 'Answer submitted! ❤️'}</Text>
              </View>

              <View style={styles.waitingLock}>
                <Lock size={18} color={Colors.textSecondary} />
                <Text style={styles.waitingLockText}>
                  {partnerName}’s answer is locked until they respond!
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.inputArea}>
              <TextInput
                style={styles.answerInput}
                placeholder="Type your heartfelt answer..."
                placeholderTextColor={Colors.textMuted}
                value={answerInput}
                onChangeText={setAnswerInput}
                multiline
              />
              <GradientButton
                title="Reveal Answer & Send Hearts 💖"
                onPress={handleAnswerDaily}
                loading={isSubmitting}
                disabled={!answerInput.trim()}
                style={styles.answerBtn}
              />
            </View>
          )}
        </RomanticCard>

        {/* 8. Quick Play 30 Games Card */}
        <TouchableOpacity
          style={styles.playQuickCard}
          onPress={() => navigation.navigate('Play')}
          activeOpacity={0.85}
        >
          <View style={styles.playLeft}>
            <View style={styles.playIconBox}>
              <Gamepad2 size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.playTitle}>30-Game Couple Arcade 🎮</Text>
              <Text style={styles.playSub}>Ludo, Car Racing, Snakes & Ladders & Quizzes</Text>
            </View>
          </View>
          <ArrowRight size={20} color={Colors.primary} />
        </TouchableOpacity>

        {/* 9. Memory Flashback */}
        <TouchableOpacity onPress={() => navigation.navigate('Memories')} activeOpacity={0.85}>
          <RomanticCard style={styles.memoryCard}>
            <View style={styles.memoryHeader}>
              <Text style={styles.memoryTag}>📸 OUR LOVE SCRAPBOOK</Text>
              <Text style={styles.memoryDate}>Day {couple?.daysTogether || 1}</Text>
            </View>

            <Text style={styles.memoryTitle}>Capture Your First Memory Together 💖</Text>
            <Text style={styles.memoryDesc}>
              Tap to add your first photo, milestone, or special moment to your private couple memory scrapbook!
            </Text>
          </RomanticCard>
        </TouchableOpacity>
      </ScrollView>

      {/* MODALS */}
      <CreateStoryModal
        visible={showCreateStory}
        onClose={() => setShowCreateStory(false)}
        onPostStory={handlePostStory}
      />

      <StoryViewerModal
        visible={!!activeStoryToView}
        story={activeStoryToView}
        onClose={() => setActiveStoryToView(null)}
        onReplyToStory={handleReplyToStory}
        onReact={() => triggerHeartCelebration()}
      />

      <CoupleChatModal
        visible={showChatModal}
        partnerName={partnerName}
        currentUser={user}
        initialReplyStory={storyReplyToPass}
        onClose={() => {
          setShowChatModal(false);
          setStoryReplyToPass(null);
        }}
      />

      <ThinkingOfYouNotificationModal
        visible={showThinkingOfYouModal}
        partnerName={partnerName}
        quoteMessage={activeNotificationQuote}
        onClose={() => setShowThinkingOfYouModal(false)}
        onSendLoveBack={() => {
          setShowChatModal(true);
        }}
      />

      <DrawTogetherModal
        visible={showDrawModal}
        partnerName={partnerName}
        onClose={() => setShowDrawModal(false)}
        onSendDrawingToChat={(summary) => {
          setShowChatModal(true);
        }}
      />

      <ScratchDateModal
        visible={showScratchModal}
        partnerName={partnerName}
        onClose={() => setShowScratchModal(false)}
        onDateScheduled={(date) => {
          triggerHeartCelebration();
          setShowChatModal(true);
        }}
      />

      <LoveVaultModal
        visible={showVaultModal}
        partnerName={partnerName}
        onClose={() => setShowVaultModal(false)}
        onRewardHearts={() => triggerHeartCelebration()}
      />

      <CoupleTrophyModal
        visible={showTrophyModal}
        partnerName={partnerName}
        onClose={() => setShowTrophyModal(false)}
      />

      <CoupleTravelMapModal
        visible={showTravelModal}
        partnerName={partnerName}
        onClose={() => setShowTravelModal(false)}
        onRewardHearts={() => triggerHeartCelebration()}
      />

      <PolaroidPhotoBoothModal
        visible={showPolaroidModal}
        partnerName={partnerName}
        onClose={() => setShowPolaroidModal(false)}
        onRewardHearts={() => triggerHeartCelebration()}
      />

      <CustomLoveWheelModal
        visible={showWheelModal}
        partnerName={partnerName}
        onClose={() => setShowWheelModal(false)}
        onRewardHearts={() => triggerHeartCelebration()}
      />

      <MilestoneCountdownsModal
        visible={showMilestoneModal}
        partnerName={partnerName}
        onClose={() => setShowMilestoneModal(false)}
        onRewardHearts={() => triggerHeartCelebration()}
      />

      <BedtimeSyncModal
        visible={showBedtimeModal}
        partnerName={partnerName}
        onClose={() => setShowBedtimeModal(false)}
        onSendGoodnightToChat={(text) => {
          setShowChatModal(true);
        }}
      />

      <HeartNudgeModal
        visible={showNudgeModal}
        onClose={() => setShowNudgeModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: 130,
  },
  heroCard: {
    marginVertical: Spacing.xs,
    padding: Spacing.md,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  daysCenter: {
    alignItems: 'center',
  },
  daysNumber: {
    fontSize: Typography.sizes.hero - 6,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    letterSpacing: -1,
    marginTop: 4,
  },
  daysLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.semibold,
  },
  heroButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.xs + 2,
    marginTop: 2,
  },
  thinkingOfYouBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBF2',
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
    borderRadius: Spacing.borderRadius.full,
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#FFCCD8',
  },
  thinkingEmoji: {
    fontSize: 16,
  },
  thinkingText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  sendHugBar: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF5F7',
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
    borderRadius: Spacing.borderRadius.full,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendHugEmoji: {
    fontSize: 16,
  },
  sendHugText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  toolsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
    gap: Spacing.xs,
  },
  toolChip: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.lg,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    gap: 4,
  },
  toolIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolTitle: {
    fontSize: 9,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  moodSection: {
    marginVertical: Spacing.sm,
  },
  sectionHeading: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    marginLeft: 2,
  },
  moodScroll: {
    flexDirection: 'row',
  },
  moodItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.borderRadius.lg,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginRight: Spacing.xs + 2,
    minWidth: 70,
  },
  moodItemSelected: {
    backgroundColor: '#FFEBF0',
    borderColor: Colors.primary,
  },
  moodEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  moodLabel: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  moodLabelSelected: {
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
  dailyCard: {
    marginVertical: Spacing.xs,
  },
  dailyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  dailyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFEBF2',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Spacing.borderRadius.full,
  },
  dailyBadgeText: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  rewardText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.loveRed,
  },
  dailyPrompt: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginVertical: Spacing.xs,
  },
  inputArea: {
    marginTop: Spacing.xs,
  },
  answerInput: {
    backgroundColor: '#FAF5F7',
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    minHeight: 60,
    marginBottom: Spacing.sm,
  },
  answerBtn: {
    marginTop: 0,
  },
  revealedAnswersBox: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  answerBubbleMe: {
    backgroundColor: '#FFF0F5',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  answerBubblePartner: {
    backgroundColor: '#F0F8FF',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: '#4FACFE',
  },
  answerAuthor: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  answerText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  bothAnsweredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFEBF0',
    padding: Spacing.sm,
    borderRadius: Spacing.borderRadius.full,
    marginTop: Spacing.xs,
  },
  bothAnsweredText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.loveRed,
  },
  waitingPartnerBox: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  waitingLock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FAF5F7',
    padding: Spacing.sm + 2,
    borderRadius: Spacing.borderRadius.md,
  },
  waitingLockText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    flex: 1,
  },
  playQuickCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.md,
    marginVertical: Spacing.xs,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  playLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  playIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playTitle: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  playSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  memoryCard: {
    marginVertical: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  memoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  memoryTag: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.heavy,
    color: Colors.primaryDark,
  },
  memoryDate: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  memoryImage: {
    width: '100%',
    height: 160,
    borderRadius: Spacing.borderRadius.md,
    marginVertical: Spacing.xs,
    resizeMode: 'cover',
  },
  memoryTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  memoryDesc: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
    lineHeight: 18,
  },
});
