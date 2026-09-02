import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, Animated, TextInput, Image } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { CoupleStory } from '../../types';
import { X, Heart, Send, MessageCircle, Play, Mic } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

const { width, height } = Dimensions.get('window');

interface StoryViewerModalProps {
  visible: boolean;
  story: CoupleStory | null;
  onClose: () => void;
  onReplyToStory: (story: CoupleStory, replyText: string) => void;
  onReact: (emoji: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  visible,
  story,
  onClose,
  onReplyToStory,
  onReact,
}) => {
  if (!story) return null;

  const [replyText, setReplyText] = useState('');
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      progressAnim.setValue(0);
      const storyTimer = Animated.timing(progressAnim, {
        toValue: 1,
        duration: story.type === 'VOICE' ? (story.audioDurationSec || 10) * 1000 : 7000,
        useNativeDriver: false,
      });

      storyTimer.start(({ finished }) => {
        if (finished) {
          onClose();
        }
      });

      return () => storyTimer.stop();
    }
  }, [visible, story]);

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    triggerHaptic('success');
    onReplyToStory(story, replyText.trim());
    setReplyText('');
    onClose();
  };

  const handleQuickReact = (emoji: string) => {
    triggerHaptic('heartbeat');
    onReact(emoji);
    onReplyToStory(story, `Sent a reaction: ${emoji}`);
    onClose();
  };

  const bgGradient = story.bgGradient || ['#FF6B8B', '#FF8E53'];

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: bgGradient[0] }]}>
        {/* Top Progress Bar */}
        <View style={styles.progressBarTrack}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>

        {/* Top Author Bar */}
        <View style={styles.topAuthorBar}>
          <View style={styles.authorInfo}>
            <View style={styles.avatarMini}>
              <Text style={styles.avatarMiniEmoji}>👩</Text>
            </View>
            <View>
              <Text style={styles.authorName}>{story.authorName}</Text>
              <Text style={styles.storyTime}>Active Story (24h)</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* STORY CONTENT BODY */}
        <View style={styles.storyBody}>
          {story.type === 'NOTE' && (
            <View style={styles.noteContentBox}>
              <Text style={styles.noteText}>{story.content}</Text>
            </View>
          )}

          {story.type === 'VOICE' && (
            <View style={styles.voiceContentBox}>
              <View style={styles.voicePlayCircle}>
                <Mic size={40} color="#FFFFFF" />
              </View>
              <Text style={styles.voiceDurationText}>🎙️ Voice Story ({story.audioDurationSec || 12}s)</Text>
              <Text style={styles.voiceSub}>Playing intimate voice memo...</Text>
            </View>
          )}

          {story.type === 'VIDEO_PHOTO' && (
            <View style={styles.photoContentBox}>
              <Image
                source={{ uri: story.content || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop' }}
                style={styles.storyImage}
              />
              {story.caption && (
                <View style={styles.captionPill}>
                  <Text style={styles.captionText}>{story.caption}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Bottom Reaction & Reply Bar */}
        <View style={styles.bottomBar}>
          {/* Quick Emoji Reactions */}
          <View style={styles.quickReactionsRow}>
            {['🧸', '💖', '😍', '🔥', '💋', '🥺'].map((emoji, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.reactionBtn}
                onPress={() => handleQuickReact(emoji)}
              >
                <Text style={styles.reactionEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Text Reply Input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.replyInput}
              placeholder={`Send message to ${story.authorName}...`}
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={replyText}
              onChangeText={setReplyText}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSendReply}>
              <Send size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  progressBarTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: Spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  topAuthorBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatarMini: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarMiniEmoji: {
    fontSize: 20,
  },
  authorName: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
  },
  storyTime: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: Typography.sizes.xs - 1,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  storyBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  noteContentBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteText: {
    fontSize: Typography.sizes.xl + 4,
    color: '#FFFFFF',
    fontWeight: Typography.weights.heavy,
    textAlign: 'center',
    lineHeight: 38,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  voiceContentBox: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  voicePlayCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  voiceDurationText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.heavy,
    color: '#FFFFFF',
  },
  voiceSub: {
    fontSize: Typography.sizes.xs + 1,
    color: 'rgba(255,255,255,0.85)',
  },
  photoContentBox: {
    width: '100%',
    height: height * 0.55,
    borderRadius: Spacing.borderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  captionPill: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    borderRadius: Spacing.borderRadius.full,
  },
  captionText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
  bottomBar: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  quickReactionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 4,
  },
  reactionBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Spacing.borderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  reactionEmoji: {
    fontSize: 22,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Spacing.borderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  replyInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: Typography.sizes.sm,
    paddingVertical: 8,
  },
  sendBtn: {
    backgroundColor: Colors.primaryDark,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
