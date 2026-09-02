import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../common/GradientButton';
import { X, CheckSquare, Plus } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

interface BucketListModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (item: { title: string; category: string; notes?: string }) => void;
}

const CATEGORIES = ['TRAVEL ✈️', 'EXPERIENCES 🪂', 'ROMANCE 🕯️', 'FOOD 🍜', 'GOALS 🎯'];

export const BucketListModal: React.FC<BucketListModalProps> = ({ visible, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!title.trim()) return;
    triggerHaptic('success');
    onAdd({
      title: title.trim(),
      category: selectedCategory.split(' ')[0],
      notes: notes.trim() || undefined,
    });
    setTitle('');
    setNotes('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <CheckSquare size={20} color={Colors.primary} />
              <Text style={styles.title}>Add Bucket List Goal ❤️</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>What do you want to experience together?</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Scuba diving in Bali, Watch Northern Lights..."
            placeholderTextColor={Colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.catGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.catChip, selectedCategory === cat && styles.catChipSelected]}
                onPress={() => {
                  triggerHaptic('light');
                  setSelectedCategory(cat);
                }}
              >
                <Text style={[styles.catText, selectedCategory === cat && styles.catTextSelected]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Notes or details (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Any specific places, seasons, or romantic plans?"
            placeholderTextColor={Colors.textMuted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />

          <GradientButton
            title="Add to Our Bucket List ✨"
            onPress={handleSave}
            disabled={!title.trim()}
            style={styles.saveBtn}
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
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: Spacing.borderRadius.xl,
    borderTopRightRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
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
    marginBottom: Spacing.md,
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
    marginBottom: Spacing.xs,
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
    minHeight: 70,
    textAlignVertical: 'top',
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs + 2,
    marginBottom: Spacing.xs,
  },
  catChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Spacing.borderRadius.full,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  catChipSelected: {
    backgroundColor: '#FFEBF0',
    borderColor: Colors.primary,
  },
  catText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  catTextSelected: {
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
  saveBtn: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
});
