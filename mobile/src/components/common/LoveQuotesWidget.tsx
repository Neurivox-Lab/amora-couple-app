import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from './GradientButton';
import { Heart, Sparkles, Send, Plus, RefreshCw, Quote, BellRing, X, Check } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

const { width } = Dimensions.get('window');

const CURATED_CUTE_QUOTES = [
  {
    id: 1,
    quote: "You are my favorite notification in the entire world. 📱💖",
    author: "Daily Reminder 🧸",
    emoji: "🧸",
  },
  {
    id: 2,
    quote: "In a world full of temporary things, you are my perpetual feeling. 💍✨",
    author: "Romantic Quote",
    emoji: "🌹",
  },
  {
    id: 3,
    quote: "Just a gentle reminder: Someone is smiling like an idiot right now thinking about you. 🥰",
    author: "Sweet Truth",
    emoji: "💌",
  },
  {
    id: 4,
    quote: "I love you not only for what you are, but for who I am when I am with you. 💖",
    author: "Love Letter",
    emoji: "🌸",
  },
  {
    id: 5,
    quote: "My heart is, and always will be, yours. 🔐❤️",
    author: "Forever Promise",
    emoji: "👑",
  },
  {
    id: 6,
    quote: "Distance means so little when someone means so much. Thinking of you always! 🌍✈️",
    author: "Warm Hugs",
    emoji: "🤗",
  },
  {
    id: 7,
    quote: "You’re the butter to my toast, the strawberry to my shake, and the peace to my chaos. 🍓🍞",
    author: "Cute Foodie Love",
    emoji: "🍓",
  },
];

interface LoveQuotesWidgetProps {
  partnerName: string;
  onSendQuoteNotification: (quoteText: string) => void;
}

export const LoveQuotesWidget: React.FC<LoveQuotesWidgetProps> = ({
  partnerName,
  onSendQuoteNotification,
}) => {
  const [quotesList, setQuotesList] = useState(CURATED_CUTE_QUOTES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customQuoteText, setCustomQuoteText] = useState('');
  const [customAuthorText, setCustomAuthorText] = useState('');
  const [notificationSentMsg, setNotificationSentMsg] = useState<string | null>(null);

  const currentQuote = quotesList[currentIndex];

  const handleNextQuote = () => {
    triggerHaptic('light');
    setCurrentIndex(prev => (prev + 1) % quotesList.length);
  };

  const handleSendToPartner = () => {
    triggerHaptic('heartbeat');
    onSendQuoteNotification(currentQuote.quote);
    setNotificationSentMsg(`Sent sweet reminder to ${partnerName}'s phone! 🔔💖`);
    setTimeout(() => setNotificationSentMsg(null), 3000);
  };

  const handleSaveCustomQuote = () => {
    if (!customQuoteText.trim()) return;
    triggerHaptic('success');

    const newQuote = {
      id: Date.now(),
      quote: customQuoteText.trim(),
      author: customAuthorText.trim() ? `Note from ${customAuthorText.trim()} 🧸` : `Custom Note for ${partnerName} 💖`,
      emoji: '🧸❤️',
    };

    setQuotesList(prev => [newQuote, ...prev]);
    setCurrentIndex(0);
    setCustomQuoteText('');
    setCustomAuthorText('');
    setShowCustomModal(false);

    // Also trigger notification
    onSendQuoteNotification(newQuote.quote);
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Quote size={16} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Daily Love Reminders & Quotes 💖</Text>
        </View>

        <TouchableOpacity
          style={styles.addCustomBtn}
          onPress={() => {
            triggerHaptic('light');
            setShowCustomModal(true);
          }}
        >
          <Plus size={14} color={Colors.primaryDark} />
          <Text style={styles.addCustomBtnText}>Add Custom</Text>
        </TouchableOpacity>
      </View>

      {/* Quote Display Card */}
      <View style={styles.quoteCard}>
        <View style={styles.quoteTop}>
          <Text style={styles.quoteEmoji}>{currentQuote.emoji}</Text>
          <Text style={styles.quoteAuthor}>{currentQuote.author}</Text>
          <TouchableOpacity style={styles.shuffleBtn} onPress={handleNextQuote}>
            <RefreshCw size={14} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.quoteText}>"{currentQuote.quote}"</Text>

        {/* Notification Sent Alert Toast */}
        {notificationSentMsg && (
          <View style={styles.sentToast}>
            <Check size={14} color={Colors.emeraldGreen} />
            <Text style={styles.sentToastText}>{notificationSentMsg}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.quoteActions}>
          <TouchableOpacity
            style={styles.sendNotificationBtn}
            onPress={handleSendToPartner}
            activeOpacity={0.8}
          >
            <BellRing size={16} color="#FFFFFF" />
            <Text style={styles.sendNotificationText}>
              Send as Notification to {partnerName} 🔔
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CUSTOM QUOTE CREATOR MODAL */}
      <Modal visible={showCustomModal} animationType="slide" transparent onRequestClose={() => setShowCustomModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Write a Custom Love Quote ✍️💖</Text>
              <TouchableOpacity onPress={() => setShowCustomModal(false)}>
                <X size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Pin a personal romantic quote or sweet secret reminder for {partnerName} to see on the Home screen!
            </Text>

            <TextInput
              style={styles.customQuoteInput}
              placeholder="e.g. You are the sweetest part of my day... I love you to the moon and back! 🧸"
              placeholderTextColor={Colors.textMuted}
              value={customQuoteText}
              onChangeText={setCustomQuoteText}
              multiline
              autoFocus
            />

            <TextInput
              style={styles.customAuthorInput}
              placeholder="Sign as (e.g. Your Cutie / Sri ❤️)"
              placeholderTextColor={Colors.textMuted}
              value={customAuthorText}
              onChangeText={setCustomAuthorText}
            />

            <GradientButton
              title="Pin & Send Notification to Partner 🔔"
              onPress={handleSaveCustomQuote}
              disabled={!customQuoteText.trim()}
              style={styles.saveBtn}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    paddingHorizontal: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  addCustomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFEBF2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.full,
  },
  addCustomBtnText: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  quoteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  quoteTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  quoteEmoji: {
    fontSize: 20,
  },
  quoteAuthor: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Spacing.borderRadius.sm,
  },
  shuffleBtn: {
    padding: 4,
  },
  quoteText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    lineHeight: 24,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: Spacing.sm,
  },
  sentToast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EBFBEE',
    paddingVertical: 6,
    borderRadius: Spacing.borderRadius.md,
    marginBottom: Spacing.xs,
  },
  sentToastText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.emeraldGreen,
  },
  quoteActions: {
    marginTop: Spacing.xs,
  },
  sendNotificationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: Spacing.borderRadius.full,
  },
  sendNotificationText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  modalTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  modalSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: Spacing.md,
  },
  customQuoteInput: {
    backgroundColor: '#FAF5F7',
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    minHeight: 80,
    marginBottom: Spacing.sm,
  },
  customAuthorInput: {
    backgroundColor: '#FAF5F7',
    borderRadius: Spacing.borderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  saveBtn: {
    width: '100%',
  },
});
