import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Dimensions, ScrollView } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../common/GradientButton';
import { CoupleStory } from '../../types';
import { X, Mic, Type, Camera, Sparkles, Image as ImageIcon, Heart, Play, Square } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

const { width } = Dimensions.get('window');

const STORY_GRADIENTS: readonly [string, string][] = [
  ['#FF6B8B', '#FF8E53'],
  ['#667EEA', '#764BA2'],
  ['#FA709A', '#FEE140'],
  ['#11998E', '#38EF7D'],
  ['#A18CD1', '#FBC2EB'],
  ['#2E3192', '#1BFFFF'],
];

const STICKER_EMOJIS = ['🧸', '💖', '🥰', '💌', '🌹', '🍓', '✨', '💋', '☕', '💍', '🔥'];

interface CreateStoryModalProps {
  visible: boolean;
  onClose: () => void;
  onPostStory: (story: Omit<CoupleStory, 'id' | 'createdAt' | 'expiresAt' | 'reactions' | 'repliesCount'>) => void;
}

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  visible,
  onClose,
  onPostStory,
}) => {
  const [storyType, setStoryType] = useState<'NOTE' | 'VOICE' | 'VIDEO_PHOTO'>('NOTE');
  const [textContent, setTextContent] = useState('');
  const [selectedGradient, setSelectedGradient] = useState<readonly [string, string]>(STORY_GRADIENTS[0]);
  const [caption, setCaption] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedDuration, setRecordedDuration] = useState(0);

  const handleToggleRecord = () => {
    triggerHaptic('heavy');
    if (!isRecording) {
      setIsRecording(true);
      setRecordedDuration(0);
      const interval = setInterval(() => {
        setRecordedDuration(d => {
          if (d >= 30) {
            clearInterval(interval);
            setIsRecording(false);
            return 30;
          }
          return d + 1;
        });
      }, 1000);
    } else {
      setIsRecording(false);
    }
  };

  const handlePost = () => {
    triggerHaptic('success');
    if (storyType === 'NOTE' && !textContent.trim()) return;

    onPostStory({
      authorId: 1,
      authorName: 'Srinija',
      type: storyType,
      content: storyType === 'NOTE' ? textContent.trim() : storyType === 'VOICE' ? `Voice Note (${recordedDuration || 12}s)` : 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop',
      caption: caption.trim() || undefined,
      bgGradient: selectedGradient,
      audioDurationSec: storyType === 'VOICE' ? (recordedDuration || 12) : undefined,
    });

    // Reset
    setTextContent('');
    setCaption('');
    setRecordedDuration(0);
    setIsRecording(false);
    onClose();
  };

  const handleAddSticker = (emoji: string) => {
    triggerHaptic('light');
    setTextContent(prev => prev + ' ' + emoji);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Add Couple Story 🧸</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Story Type Selector Tabs */}
        <View style={styles.typeSelectorRow}>
          <TouchableOpacity
            style={[styles.typeBtn, storyType === 'NOTE' && styles.typeBtnActive]}
            onPress={() => {
              triggerHaptic('light');
              setStoryType('NOTE');
            }}
          >
            <Type size={16} color={storyType === 'NOTE' ? '#FFFFFF' : Colors.textSecondary} />
            <Text style={[styles.typeBtnText, storyType === 'NOTE' && styles.typeBtnTextActive]}>
              Cute Note 📝
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeBtn, storyType === 'VOICE' && styles.typeBtnActive]}
            onPress={() => {
              triggerHaptic('light');
              setStoryType('VOICE');
            }}
          >
            <Mic size={16} color={storyType === 'VOICE' ? '#FFFFFF' : Colors.textSecondary} />
            <Text style={[styles.typeBtnText, storyType === 'VOICE' && styles.typeBtnTextActive]}>
              Voice Story 🎙️
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeBtn, storyType === 'VIDEO_PHOTO' && styles.typeBtnActive]}
            onPress={() => {
              triggerHaptic('light');
              setStoryType('VIDEO_PHOTO');
            }}
          >
            <Camera size={16} color={storyType === 'VIDEO_PHOTO' ? '#FFFFFF' : Colors.textSecondary} />
            <Text style={[styles.typeBtnText, storyType === 'VIDEO_PHOTO' && styles.typeBtnTextActive]}>
              Photo/Video 📹
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
          {/* STORY CANVAS PREVIEW */}
          <View style={[styles.previewCanvas, { backgroundColor: selectedGradient[0] }]}>
            {storyType === 'NOTE' && (
              <TextInput
                style={styles.canvasNoteInput}
                placeholder="Type your romantic message, cute thought or love quote..."
                placeholderTextColor="rgba(255,255,255,0.8)"
                value={textContent}
                onChangeText={setTextContent}
                multiline
                autoFocus
              />
            )}

            {storyType === 'VOICE' && (
              <View style={styles.voicePreviewBox}>
                <Text style={styles.voiceIconBig}>🎙️</Text>
                <Text style={styles.voiceTitle}>Record a Sweet Voice Note</Text>
                <Text style={styles.voiceDuration}>
                  {isRecording ? `Recording... 00:${recordedDuration < 10 ? '0' : ''}${recordedDuration}` : recordedDuration > 0 ? `Ready: 00:${recordedDuration}s audio` : 'Tap button below to start'}
                </Text>

                <TouchableOpacity
                  style={[styles.recordCircleBtn, isRecording && styles.recordingPulse]}
                  onPress={handleToggleRecord}
                >
                  {isRecording ? <Square size={24} color="#FFFFFF" fill="#FFFFFF" /> : <Mic size={28} color="#FFFFFF" />}
                </TouchableOpacity>
              </View>
            )}

            {storyType === 'VIDEO_PHOTO' && (
              <View style={styles.mediaPreviewBox}>
                <ImageIcon size={48} color="#FFFFFF" />
                <Text style={styles.mediaPrompt}>Romantic Couple Moment 📸</Text>
                <TextInput
                  style={styles.mediaCaptionInput}
                  placeholder="Add a sweet caption..."
                  placeholderTextColor="rgba(255,255,255,0.8)"
                  value={caption}
                  onChangeText={setCaption}
                />
              </View>
            )}
          </View>

          {/* GRADIENT PALETTES (FOR NOTE STORIES) */}
          {storyType === 'NOTE' && (
            <View style={styles.paletteSection}>
              <Text style={styles.sectionLabel}>Story Background Gradient:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gradientRow}>
                {STORY_GRADIENTS.map((grad, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.gradientCircle,
                      { backgroundColor: grad[0] },
                      selectedGradient === grad && styles.gradientCircleSelected,
                    ]}
                    onPress={() => setSelectedGradient(grad)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* CUTE STICKERS BAR */}
          <View style={styles.paletteSection}>
            <Text style={styles.sectionLabel}>Add Quick Cute Stickers:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stickerRow}>
              {STICKER_EMOJIS.map((emoji, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.stickerChip}
                  onPress={() => handleAddSticker(emoji)}
                >
                  <Text style={styles.stickerEmoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>

        {/* Post Button */}
        <View style={styles.footer}>
          <GradientButton
            title="Share to Our Story (24h) 💖"
            onPress={handlePost}
            style={styles.postBtn}
          />
        </View>
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
  title: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    padding: Spacing.sm,
    backgroundColor: '#FFFFFF',
    gap: Spacing.xs,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: Spacing.borderRadius.full,
    backgroundColor: '#FAF5F7',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  typeBtnText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
  },
  typeBtnTextActive: {
    color: '#FFFFFF',
  },
  scrollBody: {
    padding: Spacing.md,
  },
  previewCanvas: {
    width: '100%',
    height: 380,
    borderRadius: Spacing.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  canvasNoteInput: {
    width: '100%',
    color: '#FFFFFF',
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    textAlign: 'center',
    lineHeight: 32,
  },
  voicePreviewBox: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  voiceIconBig: {
    fontSize: 54,
    marginBottom: Spacing.xs,
  },
  voiceTitle: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
  },
  voiceDuration: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: Typography.sizes.xs + 1,
    marginBottom: Spacing.md,
  },
  recordCircleBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  recordingPulse: {
    backgroundColor: '#D32F2F',
    transform: [{ scale: 1.1 }],
  },
  mediaPreviewBox: {
    alignItems: 'center',
    gap: Spacing.md,
    width: '100%',
  },
  mediaPrompt: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
  },
  mediaCaptionInput: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: Spacing.borderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    color: '#FFFFFF',
    width: '90%',
    textAlign: 'center',
    fontSize: Typography.sizes.sm,
  },
  paletteSection: {
    marginTop: Spacing.md,
  },
  sectionLabel: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  gradientRow: {
    flexDirection: 'row',
  },
  gradientCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: Spacing.sm,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  gradientCircleSelected: {
    borderColor: Colors.primaryDark,
    transform: [{ scale: 1.15 }],
  },
  stickerRow: {
    flexDirection: 'row',
  },
  stickerChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.sm,
    marginRight: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stickerEmoji: {
    fontSize: 22,
  },
  footer: {
    padding: Spacing.md,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  postBtn: {
    width: '100%',
  },
});
