import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../common/GradientButton';
import { Moon, Sparkles, X, Heart, Play, Pause, Volume2, CloudMoon, BedDouble, Stars } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

const { width } = Dimensions.get('window');

interface SleepStory {
  id: string;
  title: string;
  duration: string;
  narrator: string;
  preview: string;
  emoji: string;
}

const SLEEP_STORIES: SleepStory[] = [
  {
    id: 'st_1',
    title: 'The Enchanted Lavender Forest 🌲🌙',
    duration: '14 mins',
    narrator: 'Soft Calming Voice',
    preview: 'A peaceful walk under midnight stars, gentle wind rustling through lavender hills, drifting into deep sleep...',
    emoji: '🌲',
  },
  {
    id: 'st_2',
    title: 'Starlight Cabin in the Alps ❄️🕯️',
    duration: '18 mins',
    narrator: 'Cozy Whispers',
    preview: 'Warm fireplace crackles, heavy wool blankets, snow falling softly outside the frosted window pane...',
    emoji: '🏔️',
  },
  {
    id: 'st_3',
    title: 'Warm Ocean Rain on Coconut Leaves 🌧️🌴',
    duration: '22 mins',
    narrator: 'Rain Soundscape',
    preview: 'Tropical night rainfall, rhythmic ocean waves hitting the shore, holding each other in absolute calm...',
    emoji: '🌧️',
  },
];

interface BedtimeSyncModalProps {
  visible: boolean;
  partnerName: string;
  onClose: () => void;
  onSendGoodnightToChat?: (text: string) => void;
}

export const BedtimeSyncModal: React.FC<BedtimeSyncModalProps> = ({
  visible,
  partnerName,
  onClose,
  onSendGoodnightToChat,
}) => {
  const [activeStory, setActiveStory] = useState<SleepStory | null>(null);
  const [isPlayingStory, setIsPlayingStory] = useState(false);
  const [goodnightSent, setGoodnightSent] = useState(false);

  const handleSendGoodnight = () => {
    triggerHaptic('heartbeat');
    setGoodnightSent(true);
    if (onSendGoodnightToChat) {
      onSendGoodnightToChat(`🌙 Sent a Synchronized Goodnight Sleep Hug & Sweet Dreams Whisper! Sleep tight my love 🧸💖`);
    }
  };

  const handleToggleStory = (story: SleepStory) => {
    triggerHaptic('light');
    if (activeStory?.id === story.id && isPlayingStory) {
      setIsPlayingStory(false);
    } else {
      setActiveStory(story);
      setIsPlayingStory(true);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>Bedtime Sync & Goodnight Hug 🌙</Text>
            <Text style={styles.headerSub}>Drift into sweet dreams together with {partnerName}</Text>
          </View>

          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* GOODNIGHT SYNC HERO CARD */}
          <View style={styles.heroNightCard}>
            <View style={styles.moonCircle}>
              <Moon size={36} color="#FFE680" fill="#FFE680" />
            </View>

            <Text style={styles.heroNightTitle}>
              {goodnightSent ? `Goodnight Hug Delivered to ${partnerName}! 🧸💖` : `Ready for Sleep, My Love? 🌙`}
            </Text>
            <Text style={styles.heroNightSub}>
              {goodnightSent
                ? `Synchronized sleep vibration sent. Your partner will feel your warmth.`
                : `Tap below to send a synchronized warm heartbeat vibration and sweet dreams whisper to ${partnerName}'s phone.`}
            </Text>

            <GradientButton
              title={goodnightSent ? "Goodnight Sent • Sleep Tight 😴✨" : "Send Synchronized Goodnight Hug 🌙💖"}
              onPress={handleSendGoodnight}
              style={styles.goodnightBtn}
            />
          </View>

          {/* BEDTIME SLEEP STORIES */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Stars size={16} color="#FFE680" />
              <Text style={styles.sectionTitle}>Couple Romantic Bedtime Stories 📖</Text>
            </View>
            <Text style={styles.sectionSub}>Soothing audio tales to fall asleep listening together</Text>
          </View>

          <View style={styles.storiesList}>
            {SLEEP_STORIES.map((story) => {
              const isSelected = activeStory?.id === story.id;
              const isPlaying = isSelected && isPlayingStory;

              return (
                <TouchableOpacity
                  key={story.id}
                  style={[styles.storyCard, isSelected && styles.storyCardActive]}
                  onPress={() => handleToggleStory(story)}
                  activeOpacity={0.85}
                >
                  <View style={styles.storyTop}>
                    <Text style={styles.storyEmoji}>{story.emoji}</Text>
                    <View style={styles.storyMetaRow}>
                      <Text style={styles.storyDuration}>⏱️ {story.duration}</Text>
                      <Text style={styles.storyNarrator}>• {story.narrator}</Text>
                    </View>
                  </View>

                  <Text style={styles.storyTitle}>{story.title}</Text>
                  <Text style={styles.storyPreview}>{story.preview}</Text>

                  <View style={styles.storyFooter}>
                    <View style={styles.playMiniPill}>
                      {isPlaying ? (
                        <Pause size={12} color="#FFFFFF" fill="#FFFFFF" />
                      ) : (
                        <Play size={12} color="#FFFFFF" fill="#FFFFFF" />
                      )}
                      <Text style={styles.playMiniText}>{isPlaying ? 'Playing Audio...' : 'Play Bedtime Story'}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0C20', // deep starry night background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  headerTitleBox: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.heavy,
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: Typography.sizes.xs - 2,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  scroll: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  heroNightCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  moonCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,230,128,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFE680',
    marginBottom: Spacing.xs,
  },
  heroNightTitle: {
    fontSize: Typography.sizes.md + 1,
    fontWeight: Typography.weights.heavy,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 4,
  },
  heroNightSub: {
    fontSize: Typography.sizes.xs,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
    marginBottom: Spacing.md,
    maxWidth: 280,
  },
  goodnightBtn: {
    width: '100%',
  },
  sectionHeader: {
    marginTop: Spacing.xs,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  sectionSub: {
    fontSize: Typography.sizes.xs - 1,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  storiesList: {
    gap: Spacing.sm,
  },
  storyCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  storyCardActive: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: '#FFE680',
  },
  storyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  storyEmoji: {
    fontSize: 22,
  },
  storyMetaRow: {
    flexDirection: 'row',
    gap: 4,
  },
  storyDuration: {
    fontSize: Typography.sizes.xs - 2,
    color: '#FFE680',
    fontWeight: Typography.weights.bold,
  },
  storyNarrator: {
    fontSize: Typography.sizes.xs - 2,
    color: 'rgba(255,255,255,0.6)',
  },
  storyTitle: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
    marginTop: 2,
  },
  storyPreview: {
    fontSize: Typography.sizes.xs,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 16,
    marginTop: 3,
  },
  storyFooter: {
    marginTop: Spacing.sm,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  playMiniPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryDark,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.full,
  },
  playMiniText: {
    fontSize: 9,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
});
