import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../common/GradientButton';
import { X, Mail, Lock, Sparkles, Heart } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

interface CreateLoveNoteModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (note: any) => void;
  onCupidHelp?: () => void;
}

const NOTE_TYPES = [
  { id: 'LOVE_NOTE', label: 'Direct Love Note 💌', sub: 'Opens immediately' },
  { id: 'OPEN_WHEN', label: 'Open When... 🔒', sub: 'Locked until specific moment' },
  { id: 'TIME_CAPSULE', label: 'Anniversary Capsule ⏳', sub: 'Locked until milestone' },
];

const UNLOCK_CONDITIONS = [
  'Open when you are having a rough day at work 💼',
  'Open when you miss me like crazy 🥺',
  'Open when you cannot fall asleep 🌙',
  'Open on our next anniversary 💍',
  'Open when you need an extra boost of love ❤️',
];

const PAPER_THEMES = [
  { id: 'rose', label: 'Rose Blush 🌸', bg: '#FFF0F5', border: '#FFCCD8' },
  { id: 'lavender', label: 'Lavender Dream 💜', bg: '#F8F0FF', border: '#E2CCFF' },
  { id: 'champagne', label: 'Warm Champagne 🥂', bg: '#FFF9F0', border: '#FFE5C2' },
];

export const CreateLoveNoteModal: React.FC<CreateLoveNoteModalProps> = ({
  visible,
  onClose,
  onSave,
  onCupidHelp,
}) => {
  const [selectedType, setSelectedType] = useState('LOVE_NOTE');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedCondition, setSelectedCondition] = useState(UNLOCK_CONDITIONS[0]);
  const [selectedPaper, setSelectedPaper] = useState('rose');

  const handleSave = () => {
    if (!message.trim()) return;
    triggerHaptic('success');
    onSave({
      category: selectedType,
      title: title.trim() || (selectedType === 'OPEN_WHEN' ? selectedCondition : 'Sweet Love Note'),
      message: message.trim(),
      unlockCondition: selectedType === 'OPEN_WHEN' ? selectedCondition : undefined,
      paperTheme: selectedPaper,
    });
    setTitle('');
    setMessage('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <Mail size={20} color={Colors.primary} />
              <Text style={styles.title}>Write Sealed Letter 💌</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Note Type Selector */}
            <Text style={styles.label}>1. Select Letter Type</Text>
            <View style={styles.typeGrid}>
              {NOTE_TYPES.map((t) => {
                const isSelected = selectedType === t.id;
                return (
                  <TouchableOpacity
                    key={t.id}
                    style={[styles.typeCard, isSelected && styles.typeCardSelected]}
                    onPress={() => {
                      triggerHaptic('light');
                      setSelectedType(t.id);
                    }}
                  >
                    <Text style={[styles.typeLabel, isSelected && styles.typeLabelSelected]}>
                      {t.label}
                    </Text>
                    <Text style={styles.typeSub}>{t.sub}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* If Open When condition */}
            {selectedType === 'OPEN_WHEN' && (
              <>
                <Text style={styles.label}>When should your partner open this?</Text>
                <View style={styles.conditionBox}>
                  {UNLOCK_CONDITIONS.map((cond) => (
                    <TouchableOpacity
                      key={cond}
                      style={[styles.conditionChip, selectedCondition === cond && styles.conditionChipSelected]}
                      onPress={() => {
                        triggerHaptic('light');
                        setSelectedCondition(cond);
                      }}
                    >
                      <Text style={[styles.condText, selectedCondition === cond && styles.condTextSelected]}>
                        {cond}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* Paper Theme */}
            <Text style={styles.label}>Paper Style</Text>
            <View style={styles.paperRow}>
              {PAPER_THEMES.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.paperChip,
                    { backgroundColor: p.bg, borderColor: p.border },
                    selectedPaper === p.id && styles.paperChipSelected,
                  ]}
                  onPress={() => {
                    triggerHaptic('light');
                    setSelectedPaper(p.id);
                  }}
                >
                  <Text style={styles.paperText}>{p.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Letter Content */}
            <View style={styles.messageHeader}>
              <Text style={styles.label}>Letter Message</Text>
              {onCupidHelp && (
                <TouchableOpacity style={styles.cupidAssist} onPress={onCupidHelp}>
                  <Sparkles size={14} color={Colors.primary} />
                  <Text style={styles.cupidText}>Cupid AI Polish ✨</Text>
                </TouchableOpacity>
              )}
            </View>

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Pour your heart out... Write words they will cherish forever ❤️"
              placeholderTextColor={Colors.textMuted}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={6}
            />

            <GradientButton
              title={selectedType === 'OPEN_WHEN' ? "Seal 'Open When' Capsule 🔒" : "Send Love Note ❤️"}
              onPress={handleSave}
              disabled={!message.trim()}
              style={styles.saveBtn}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 13, 22, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: Spacing.borderRadius.xl,
    borderTopRightRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  label: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
    marginBottom: 6,
  },
  typeGrid: {
    gap: Spacing.xs + 2,
    marginBottom: Spacing.xs,
  },
  typeCard: {
    padding: Spacing.sm + 2,
    borderRadius: Spacing.borderRadius.md,
    backgroundColor: '#FAF5F7',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  typeCardSelected: {
    backgroundColor: '#FFEBF0',
    borderColor: Colors.primary,
  },
  typeLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  typeLabelSelected: {
    color: Colors.primaryDark,
  },
  typeSub: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  conditionBox: {
    gap: 6,
    marginBottom: Spacing.xs,
  },
  conditionChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Spacing.borderRadius.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  conditionChipSelected: {
    backgroundColor: '#FFEBF2',
    borderColor: Colors.primary,
  },
  condText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  condTextSelected: {
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
  paperRow: {
    flexDirection: 'row',
    gap: Spacing.xs + 2,
    marginBottom: Spacing.xs,
  },
  paperChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  paperChipSelected: {
    borderWidth: 2,
    borderColor: Colors.primaryDark,
  },
  paperText: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  cupidAssist: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Spacing.borderRadius.full,
  },
  cupidText: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  input: {
    backgroundColor: '#FAF5F7',
    borderRadius: Spacing.borderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
    lineHeight: 20,
  },
  saveBtn: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
});
