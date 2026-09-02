import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../common/GradientButton';
import { Calendar, Clock, Plus, Sparkles, X, Heart, PartyPopper, Flame } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

const { width } = Dimensions.get('window');

interface MilestoneItem {
  id: string;
  title: string;
  targetDate: string; // YYYY-MM-DD
  emoji: string;
  category: string;
  gradient: readonly [string, string];
}

const INITIAL_MILESTONES: MilestoneItem[] = [
  {
    id: 'm1',
    title: 'Our 2nd Anniversary 💍',
    targetDate: '2026-10-14',
    emoji: '💍',
    category: 'Relationship Milestone',
    gradient: ['#FF6B8B', '#FF8E53'],
  },
  {
    id: 'm2',
    title: "Partner's Birthday 🎂",
    targetDate: '2026-12-04',
    emoji: '🎂',
    category: 'Birthday Celebration',
    gradient: ['#FA709A', '#FEE140'],
  },
  {
    id: 'm3',
    title: 'Goa Summer Vacation 🏖️',
    targetDate: '2026-05-20',
    emoji: '🏖️',
    category: 'Travel & Vacation',
    gradient: ['#11998E', '#38EF7D'],
  },
  {
    id: 'm4',
    title: 'First "I Love You" Day 💌',
    targetDate: '2026-07-19',
    emoji: '💌',
    category: 'Romantic Memory',
    gradient: ['#667EEA', '#764BA2'],
  },
];

interface MilestoneCountdownsModalProps {
  visible: boolean;
  partnerName: string;
  onClose: () => void;
  onRewardHearts?: (hearts: number) => void;
}

export const MilestoneCountdownsModal: React.FC<MilestoneCountdownsModalProps> = ({
  visible,
  partnerName,
  onClose,
  onRewardHearts,
}) => {
  const [milestones, setMilestones] = useState<MilestoneItem[]>(INITIAL_MILESTONES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-11-01');
  const [selectedEmoji, setSelectedEmoji] = useState('💍');
  const [timeState, setTimeState] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setTimeState(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateRemaining = (targetDateStr: string) => {
    const target = new Date(targetDateStr).getTime();
    const diff = Math.max(0, target - timeState);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, mins, secs };
  };

  const handleAddMilestone = () => {
    if (!newTitle.trim()) return;
    triggerHaptic('success');

    const created: MilestoneItem = {
      id: `ms_${Date.now()}`,
      title: newTitle.trim(),
      targetDate: newDate,
      emoji: selectedEmoji,
      category: 'Special Milestone',
      gradient: ['#FF6B8B', '#FF8E53'],
    };

    setMilestones(prev => [created, ...prev]);
    setNewTitle('');
    setShowAddModal(false);

    if (onRewardHearts) onRewardHearts(30);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={22} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>Milestone Countdowns ⏳💍</Text>
            <Text style={styles.headerSub}>Live timers counting down to our special moments</Text>
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              triggerHaptic('light');
              setShowAddModal(true);
            }}
          >
            <Plus size={18} color={Colors.primaryDark} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {milestones.map((item) => {
            const { days, hours, mins, secs } = calculateRemaining(item.targetDate);

            return (
              <View key={item.id} style={styles.milestoneCard}>
                <View style={styles.cardTopRow}>
                  <View style={styles.badgePill}>
                    <Sparkles size={12} color={Colors.primaryDark} />
                    <Text style={styles.badgePillText}>{item.category}</Text>
                  </View>
                  <Text style={styles.targetDateText}>{item.targetDate}</Text>
                </View>

                <View style={styles.titleCenter}>
                  <Text style={styles.itemEmoji}>{item.emoji}</Text>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                </View>

                {/* COUNTDOWN DIGITS GRID */}
                <View style={styles.countdownRow}>
                  <View style={styles.digitBox}>
                    <Text style={styles.digitNumber}>{days}</Text>
                    <Text style={styles.digitLabel}>DAYS</Text>
                  </View>

                  <Text style={styles.digitColon}>:</Text>

                  <View style={styles.digitBox}>
                    <Text style={styles.digitNumber}>{hours < 10 ? '0' : ''}{hours}</Text>
                    <Text style={styles.digitLabel}>HOURS</Text>
                  </View>

                  <Text style={styles.digitColon}>:</Text>

                  <View style={styles.digitBox}>
                    <Text style={styles.digitNumber}>{mins < 10 ? '0' : ''}{mins}</Text>
                    <Text style={styles.digitLabel}>MINS</Text>
                  </View>

                  <Text style={styles.digitColon}>:</Text>

                  <View style={styles.digitBox}>
                    <Text style={styles.digitNumber}>{secs < 10 ? '0' : ''}{secs}</Text>
                    <Text style={styles.digitLabel}>SECS</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* ADD MILESTONE MODAL */}
        <Modal visible={showAddModal} animationType="slide" transparent onRequestClose={() => setShowAddModal(false)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Milestone Countdown ⏳</Text>
                <TouchableOpacity onPress={() => setShowAddModal(false)}>
                  <X size={20} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Milestone Title (e.g. Moving In Together / Paris Trip)"
                placeholderTextColor={Colors.textMuted}
                value={newTitle}
                onChangeText={setNewTitle}
              />

              <TextInput
                style={styles.input}
                placeholder="Target Date (YYYY-MM-DD e.g. 2026-11-20)"
                placeholderTextColor={Colors.textMuted}
                value={newDate}
                onChangeText={setNewDate}
              />

              {/* Emoji Selector */}
              <Text style={styles.selectorLabel}>Choose Icon:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiRow}>
                {['💍', '🎂', '🏖️', '💌', '🏡', '🐶', '✈️', '🥂'].map((em) => (
                  <TouchableOpacity
                    key={em}
                    style={[styles.emojiChip, selectedEmoji === em && styles.emojiChipSelected]}
                    onPress={() => setSelectedEmoji(em)}
                  >
                    <Text style={{ fontSize: 22 }}>{em}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <GradientButton
                title="Start Live Countdown ⏳💖"
                onPress={handleAddMilestone}
                disabled={!newTitle.trim()}
                style={{ width: '100%', marginTop: Spacing.md }}
              />
            </View>
          </View>
        </Modal>
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
  headerTitleBox: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  headerSub: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  addBtn: {
    padding: Spacing.xs,
    backgroundColor: '#FFEBF2',
    borderRadius: Spacing.borderRadius.full,
  },
  scroll: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  milestoneCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFEBF2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Spacing.borderRadius.full,
  },
  badgePillText: {
    fontSize: 9,
    fontWeight: Typography.weights.heavy,
    color: Colors.primaryDark,
  },
  targetDateText: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  titleCenter: {
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  itemEmoji: {
    fontSize: 32,
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: Typography.sizes.md + 1,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  countdownRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: 6,
  },
  digitBox: {
    width: 60,
    backgroundColor: '#FAF5F7',
    borderRadius: Spacing.borderRadius.md,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD1DF',
  },
  digitNumber: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.heavy,
    color: Colors.primaryDark,
  },
  digitLabel: {
    fontSize: 8,
    fontWeight: Typography.weights.heavy,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  digitColon: {
    fontSize: 20,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
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
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  input: {
    backgroundColor: '#FAF5F7',
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  selectorLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emojiRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  emojiChip: {
    padding: 8,
    borderRadius: Spacing.borderRadius.md,
    backgroundColor: '#FAF5F7',
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.xs + 2,
  },
  emojiChipSelected: {
    backgroundColor: '#FFEBF0',
    borderColor: Colors.primary,
  },
});
