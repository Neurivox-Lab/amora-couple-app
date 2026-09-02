import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from './GradientButton';
import { Heart, Sparkles, BellRing, X, MessageCircle } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

const { width } = Dimensions.get('window');

interface ThinkingOfYouNotificationModalProps {
  visible: boolean;
  partnerName: string;
  quoteMessage?: string;
  onClose: () => void;
  onSendLoveBack: () => void;
}

export const ThinkingOfYouNotificationModal: React.FC<ThinkingOfYouNotificationModalProps> = ({
  visible,
  partnerName,
  quoteMessage,
  onClose,
  onSendLoveBack,
}) => {
  const handleReply = () => {
    triggerHaptic('heartbeat');
    onSendLoveBack();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>🧸💭</Text>
          </View>

          <View style={styles.pillBadge}>
            <BellRing size={12} color={Colors.primaryDark} />
            <Text style={styles.pillBadgeText}>LOVE REMINDER NOTIFICATION</Text>
          </View>

          <Text style={styles.title}>{partnerName} is Thinking of You! 🥰</Text>
          <Text style={styles.sub}>
            {partnerName} just tapped "I Remembered You" from their phone right now.
          </Text>

          {quoteMessage && (
            <View style={styles.quoteBox}>
              <Text style={styles.quoteText}>"{quoteMessage}"</Text>
              <Text style={styles.quoteSender}>— From {partnerName} with Love ❤️</Text>
            </View>
          )}

          <View style={styles.actions}>
            <GradientButton
              title="Send Love & Hugs Back! 🧸💖"
              onPress={handleReply}
              style={styles.sendBackBtn}
            />

            <TouchableOpacity style={styles.dismissBtn} onPress={onClose}>
              <Text style={styles.dismissText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFEBF0',
    position: 'relative',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    padding: 6,
  },
  iconCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#FFEBF2',
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconEmoji: {
    fontSize: 34,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.full,
    marginBottom: Spacing.xs,
  },
  pillBadgeText: {
    fontSize: Typography.sizes.xs - 2,
    fontWeight: Typography.weights.heavy,
    color: Colors.primaryDark,
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 2,
  },
  sub: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  quoteBox: {
    backgroundColor: '#FFF8FA',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#FFCCD8',
    width: '100%',
    marginBottom: Spacing.lg,
  },
  quoteText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
  quoteSender: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
    textAlign: 'right',
    marginTop: 6,
  },
  actions: {
    width: '100%',
    gap: Spacing.xs,
  },
  sendBackBtn: {
    width: '100%',
  },
  dismissBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.xs + 2,
  },
  dismissText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontWeight: Typography.weights.semibold,
  },
});
