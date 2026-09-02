import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from './GradientButton';
import { X, Heart, Sparkles } from 'lucide-react-native';
import { useCouple } from '../../context/CoupleContext';
import { triggerHaptic } from '../../utils/haptics';

interface HeartNudgeModalProps {
  visible: boolean;
  onClose: () => void;
}

const NUDGE_TYPES = [
  { type: 'HUG', label: 'Virtual Hug', emoji: '🤗', sub: 'Wrap your partner in warmth' },
  { type: 'KISS', label: 'Sweet Kiss', emoji: '💋', sub: 'A gentle tap of love' },
  { type: 'HEARTBEAT', label: 'Heartbeat', emoji: '💓', sub: 'Send real rhythmic haptic vibrations' },
  { type: 'MISS_YOU', label: 'I Miss You', emoji: '🥺', sub: 'Thinking of you right now' },
] as const;

export const HeartNudgeModal: React.FC<HeartNudgeModalProps> = ({ visible, onClose }) => {
  const { sendVirtualNudge } = useCouple();
  const [selectedType, setSelectedType] = useState<'HUG' | 'KISS' | 'HEARTBEAT' | 'MISS_YOU'>('HUG');
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    setIsSending(true);
    try {
      await sendVirtualNudge(selectedType, customMessage.trim() || undefined);
      setCustomMessage('');
      onClose();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <Text style={styles.titleIcon}>💌</Text>
              <Text style={styles.title}>Send Love Nudge</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Instantly vibrate your partner's phone and shower their screen with love!
          </Text>

          {/* Nudge Types Grid */}
          <View style={styles.nudgeGrid}>
            {NUDGE_TYPES.map((item) => {
              const isSelected = selectedType === item.type;
              return (
                <TouchableOpacity
                  key={item.type}
                  style={[styles.nudgeCard, isSelected && styles.nudgeCardSelected]}
                  onPress={() => {
                    triggerHaptic('medium');
                    setSelectedType(item.type);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.nudgeEmoji}>{item.emoji}</Text>
                  <Text style={[styles.nudgeLabel, isSelected && styles.nudgeLabelSelected]}>
                    {item.label}
                  </Text>
                  <Text style={styles.nudgeSub}>{item.sub}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Optional Message */}
          <TextInput
            style={styles.input}
            placeholder="Add a sweet secret note... (optional)"
            placeholderTextColor={Colors.textMuted}
            value={customMessage}
            onChangeText={setCustomMessage}
            maxLength={120}
          />

          <GradientButton
            title={`Send ${selectedType.replace('_', ' ')} ❤️`}
            onPress={handleSend}
            loading={isSending}
            style={styles.sendButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 13, 22, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 380,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  titleIcon: {
    fontSize: 22,
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  nudgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  nudgeCard: {
    width: '48%',
    padding: Spacing.sm + 2,
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: '#FFF8FA',
    alignItems: 'center',
  },
  nudgeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#FFEBF2',
  },
  nudgeEmoji: {
    fontSize: 26,
    marginBottom: 4,
  },
  nudgeLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  nudgeLabelSelected: {
    color: Colors.primaryDark,
  },
  nudgeSub: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  input: {
    backgroundColor: '#FAF5F7',
    borderRadius: Spacing.borderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  sendButton: {
    marginTop: Spacing.xs,
  },
});
