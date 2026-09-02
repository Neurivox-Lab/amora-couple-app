import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { ChatMessage, User } from '../../types';
import { X, Send, Heart, Mic, Image as ImageIcon, Smile, Sparkles, CheckCheck, Play } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

const { width } = Dimensions.get('window');

interface CoupleChatModalProps {
  visible: boolean;
  partnerName: string;
  currentUser: User | null;
  initialReplyStory?: {
    storyId: string;
    storyType: 'NOTE' | 'VOICE' | 'VIDEO_PHOTO';
    snippet: string;
  } | null;
  onClose: () => void;
  onOpenQuizFromChat?: (quizId: string) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    senderId: 2,
    senderName: 'Partner',
    text: 'Good morning my love! Hope you slept like an angel 🧸❤️',
    type: 'TEXT',
    timestamp: '09:15 AM',
    isDelivered: true,
    isRead: true,
  },
  {
    id: 'm2',
    senderId: 1,
    senderName: 'Srinija',
    text: 'Good morning babe! Check the story I just posted for you 💌✨',
    type: 'TEXT',
    timestamp: '09:20 AM',
    isDelivered: true,
    isRead: true,
  },
  {
    id: 'm3',
    senderId: 2,
    senderName: 'Partner',
    text: 'Aww my heart just melted! You look so gorgeous in that video 🥰',
    type: 'STORY_REPLY',
    storyReplyQuote: {
      storyId: 's1',
      storyType: 'NOTE',
      snippet: 'Thinking of you while having coffee ☕❤️',
    },
    timestamp: '09:22 AM',
    isDelivered: true,
    isRead: true,
  },
];

const CHAT_STICKERS = ['🧸', '💖', '💋', '🍓', '🌹', '🥰', '🥺', '💍', '🔥'];

export const CoupleChatModal: React.FC<CoupleChatModalProps> = ({
  visible,
  partnerName,
  currentUser,
  initialReplyStory,
  onClose,
  onOpenQuizFromChat,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputMsg, setInputMsg] = useState('');
  const [activeStoryQuote, setActiveStoryQuote] = useState(initialReplyStory);

  const handleSend = (textToSend?: string) => {
    const content = (textToSend || inputMsg).trim();
    if (!content) return;
    triggerHaptic('success');

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser?.id || 1,
      senderName: currentUser?.nickname || currentUser?.name || 'Srinija',
      text: content,
      type: activeStoryQuote ? 'STORY_REPLY' : 'TEXT',
      storyReplyQuote: activeStoryQuote || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDelivered: true,
      isRead: false,
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');
    setActiveStoryQuote(null);
  };

  const handleSendSticker = (sticker: string) => {
    triggerHaptic('heartbeat');
    handleSend(sticker);
  };

  const handleSendVoiceMemo = () => {
    triggerHaptic('heavy');
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser?.id || 1,
      senderName: currentUser?.name || 'Srinija',
      text: '🎙️ Voice Note (0:14)',
      type: 'VOICE',
      audioDurationSec: 14,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDelivered: true,
      isRead: false,
    };
    setMessages(prev => [...prev, newMsg]);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={22} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.partnerHead}>
            <View style={styles.partnerAvatar}>
              <Text style={styles.partnerAvatarEmoji}>👨</Text>
            </View>
            <View>
              <Text style={styles.partnerName}>{partnerName} ❤️</Text>
              <Text style={styles.partnerStatus}>Online • Private Couple Chat</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.heartNudgeBtn}
            onPress={() => {
              triggerHaptic('heartbeat');
              handleSend('🧸 Sending you infinite hugs and kisses right now! 💖');
            }}
          >
            <Heart size={20} color={Colors.loveRed} fill={Colors.loveRed} />
          </TouchableOpacity>
        </View>

        {/* Message Thread */}
        <ScrollView
          style={styles.thread}
          contentContainerStyle={styles.threadContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => {
            const isMe = msg.senderId === (currentUser?.id || 1);

            return (
              <View
                key={msg.id}
                style={[styles.msgWrapper, isMe ? styles.msgWrapperMe : styles.msgWrapperPartner]}
              >
                {/* Story Reply Snippet if present */}
                {msg.storyReplyQuote && (
                  <View style={[styles.storyQuoteBox, isMe ? styles.storyQuoteMe : styles.storyQuotePartner]}>
                    <Text style={styles.storyQuoteTitle}>
                      Replying to {isMe ? 'Story' : `${partnerName}'s Story`}:
                    </Text>
                    <Text style={styles.storyQuoteSnippet} numberOfLines={1}>
                      "{msg.storyReplyQuote.snippet}"
                    </Text>
                  </View>
                )}

                {/* Voice Message Bubble */}
                {msg.type === 'VOICE' ? (
                  <View style={[styles.msgBubble, isMe ? styles.msgBubbleMe : styles.msgBubblePartner]}>
                    <View style={styles.voiceRow}>
                      <View style={styles.voicePlayMini}>
                        <Play size={14} color={isMe ? Colors.primary : '#FFFFFF'} fill={isMe ? Colors.primary : '#FFFFFF'} />
                      </View>
                      <Text style={[styles.msgText, isMe && styles.msgTextMe]}>
                        🎙️ Voice Memo ({msg.audioDurationSec}s)
                      </Text>
                    </View>
                    <Text style={[styles.msgTime, isMe && styles.msgTimeMe]}>{msg.timestamp}</Text>
                  </View>
                ) : (
                  /* Standard Text Bubble */
                  <View style={[styles.msgBubble, isMe ? styles.msgBubbleMe : styles.msgBubblePartner]}>
                    <Text style={[styles.msgText, isMe && styles.msgTextMe]}>{msg.text}</Text>
                    <View style={styles.timeRow}>
                      <Text style={[styles.msgTime, isMe && styles.msgTimeMe]}>{msg.timestamp}</Text>
                      {isMe && <CheckCheck size={12} color="rgba(255,255,255,0.8)" />}
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Story Reply Bar if active */}
        {activeStoryQuote && (
          <View style={styles.activeQuoteBar}>
            <View style={{ flex: 1 }}>
              <Text style={styles.activeQuoteTitle}>Replying to Story:</Text>
              <Text style={styles.activeQuoteText} numberOfLines={1}>{activeStoryQuote.snippet}</Text>
            </View>
            <TouchableOpacity onPress={() => setActiveStoryQuote(null)}>
              <X size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Stickers Bar */}
        <View style={styles.stickerTray}>
          {CHAT_STICKERS.map((stk, idx) => (
            <TouchableOpacity key={idx} style={styles.stickerBtn} onPress={() => handleSendSticker(stk)}>
              <Text style={styles.stickerEmoji}>{stk}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.voiceBtn} onPress={handleSendVoiceMemo}>
            <Mic size={20} color={Colors.primary} />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder="Send a sweet message..."
            placeholderTextColor={Colors.textMuted}
            value={inputMsg}
            onChangeText={setInputMsg}
          />

          <TouchableOpacity
            style={[styles.sendCircle, !inputMsg.trim() && styles.sendCircleDisabled]}
            onPress={() => handleSend()}
            disabled={!inputMsg.trim()}
          >
            <Send size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
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
  partnerHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  partnerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFEBF0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  partnerAvatarEmoji: {
    fontSize: 20,
  },
  partnerName: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  partnerStatus: {
    fontSize: Typography.sizes.xs - 2,
    color: Colors.emeraldGreen,
    fontWeight: Typography.weights.semibold,
  },
  heartNudgeBtn: {
    padding: Spacing.xs,
    backgroundColor: '#FFEBF2',
    borderRadius: Spacing.borderRadius.full,
  },
  thread: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  threadContent: {
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  msgWrapper: {
    maxWidth: '82%',
  },
  msgWrapperMe: {
    alignSelf: 'flex-end',
  },
  msgWrapperPartner: {
    alignSelf: 'flex-start',
  },
  storyQuoteBox: {
    padding: Spacing.xs + 2,
    borderRadius: Spacing.borderRadius.md,
    marginBottom: 2,
    borderLeftWidth: 3,
  },
  storyQuoteMe: {
    backgroundColor: '#FFE5EC',
    borderLeftColor: Colors.primaryDark,
  },
  storyQuotePartner: {
    backgroundColor: '#E2EEFF',
    borderLeftColor: '#1E90FF',
  },
  storyQuoteTitle: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
  },
  storyQuoteSnippet: {
    fontSize: Typography.sizes.xs,
    color: Colors.textPrimary,
    fontStyle: 'italic',
  },
  msgBubble: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: Spacing.borderRadius.lg,
  },
  msgBubbleMe: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 2,
  },
  msgBubblePartner: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 2,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
  },
  msgText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  msgTextMe: {
    color: '#FFFFFF',
  },
  voiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  voicePlayMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 2,
  },
  msgTime: {
    fontSize: 9,
    color: Colors.textMuted,
  },
  msgTimeMe: {
    color: 'rgba(255,255,255,0.7)',
  },
  activeQuoteBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBF2',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#FFD1E0',
  },
  activeQuoteTitle: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  activeQuoteText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textPrimary,
  },
  stickerTray: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  stickerBtn: {
    padding: 4,
  },
  stickerEmoji: {
    fontSize: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: '#FFFFFF',
  },
  voiceBtn: {
    padding: Spacing.xs,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FAF5F7',
    borderRadius: Spacing.borderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
  },
  sendCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendCircleDisabled: {
    opacity: 0.4,
  },
});
