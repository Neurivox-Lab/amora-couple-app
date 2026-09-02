import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../common/GradientButton';
import { Lock, Unlock, Key, Plus, Heart, Sparkles, X, Mail, Clock, Calendar, Check } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

const { width } = Dimensions.get('window');

interface TimeCapsule {
  id: string;
  title: string;
  senderName: string;
  condition: string;
  message: string;
  unlockDate?: string;
  isLocked: boolean;
  waxSealEmoji: string;
  createdAt: string;
}

const INITIAL_CAPSULES: TimeCapsule[] = [
  {
    id: 'c1',
    title: 'Open on Our 2nd Anniversary 💍',
    senderName: 'Srinija',
    condition: 'Locked until October 14, 2026',
    message: 'Happy 2nd Anniversary my soulmate! If you are reading this, we have survived another 365 days of belly laughs, Goa trips, and stolen blankets. I love you more than words could ever describe.',
    unlockDate: '2026-10-14',
    isLocked: true,
    waxSealEmoji: '💍',
    createdAt: '2026-03-01',
  },
  {
    id: 'c2',
    title: 'Open When You Are Having a Rough Day 🥺',
    senderName: 'Partner',
    condition: 'Emotional Unlock • Tap to open',
    message: 'Take a deep breath and close your eyes. You are the strongest, most resilient person I know. Whatever happened today cannot take away your magic. Come home, I will have warm tea and infinite hugs waiting.',
    isLocked: false,
    waxSealEmoji: '🧸',
    createdAt: '2026-02-15',
  },
  {
    id: 'c3',
    title: 'Open When We Have Our First Disagreement 🕊️',
    senderName: 'Srinija',
    condition: 'Reconciliation Unlock • Tap to open',
    message: 'Hey... I love you even when we disagree. It is you and me against the problem, never you versus me. Let us take a 10-minute breath, hold hands, and talk softly.',
    isLocked: false,
    waxSealEmoji: '🕊️',
    createdAt: '2026-01-20',
  },
  {
    id: 'c4',
    title: 'Open When You Miss My Cuddles 🧸',
    senderName: 'Partner',
    condition: 'Affection Unlock • Tap to open',
    message: 'Wrap yourself in your softest blanket right now and pretend my arms are wrapped around your waist. You are never alone as long as my heart beats.',
    isLocked: false,
    waxSealEmoji: '💖',
    createdAt: '2026-02-01',
  },
];

interface LoveVaultModalProps {
  visible: boolean;
  partnerName: string;
  onClose: () => void;
  onRewardHearts?: (hearts: number) => void;
}

export const LoveVaultModal: React.FC<LoveVaultModalProps> = ({
  visible,
  partnerName,
  onClose,
  onRewardHearts,
}) => {
  const [capsules, setCapsules] = useState<TimeCapsule[]>(INITIAL_CAPSULES);
  const [selectedCapsule, setSelectedCapsule] = useState<TimeCapsule | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newCondition, setNewCondition] = useState('Open on our Next Milestone');

  const handleOpenCapsule = (cap: TimeCapsule) => {
    triggerHaptic('heartbeat');
    if (cap.isLocked) {
      triggerHaptic('heavy');
      alert(`🔒 This capsule is time-locked until ${cap.unlockDate}! No peeking allowed! 🙈`);
      return;
    }
    setSelectedCapsule(cap);
    if (onRewardHearts) onRewardHearts(25);
  };

  const handleCreateCapsule = () => {
    if (!newTitle.trim() || !newMessage.trim()) return;
    triggerHaptic('success');

    const created: TimeCapsule = {
      id: `cap_${Date.now()}`,
      title: newTitle.trim(),
      senderName: 'Srinija',
      condition: newCondition,
      message: newMessage.trim(),
      isLocked: false,
      waxSealEmoji: '💌',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCapsules(prev => [created, ...prev]);
    setNewTitle('');
    setNewMessage('');
    setShowCreateModal(false);
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
            <Text style={styles.headerTitle}>Secret Love Vault 💌🔐</Text>
            <Text style={styles.headerSub}>Time capsules & "Open When" letters for {partnerName}</Text>
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              triggerHaptic('light');
              setShowCreateModal(true);
            }}
          >
            <Plus size={18} color={Colors.primaryDark} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Vault Banner */}
          <View style={styles.vaultBanner}>
            <View style={styles.vaultIconCircle}>
              <Lock size={24} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.vaultBannerTitle}>Encrypted Couple Vault</Text>
              <Text style={styles.vaultBannerSub}>
                Letters sealed with digital wax stamps. Some unlock on future dates, others open when your heart needs them most.
              </Text>
            </View>
          </View>

          {/* Capsule Cards Grid */}
          <View style={styles.capsuleList}>
            {capsules.map((cap) => (
              <TouchableOpacity
                key={cap.id}
                style={[styles.capsuleCard, cap.isLocked && styles.capsuleCardLocked]}
                onPress={() => handleOpenCapsule(cap)}
                activeOpacity={0.8}
              >
                <View style={styles.capsuleTop}>
                  <View style={styles.waxSeal}>
                    <Text style={styles.waxSealEmoji}>{cap.waxSealEmoji}</Text>
                  </View>
                  <View style={[styles.statusBadge, cap.isLocked ? styles.badgeLocked : styles.badgeUnlocked]}>
                    {cap.isLocked ? <Lock size={12} color="#D35400" /> : <Unlock size={12} color={Colors.emeraldGreen} />}
                    <Text style={[styles.statusBadgeText, cap.isLocked ? styles.textLocked : styles.textUnlocked]}>
                      {cap.isLocked ? 'TIME LOCKED' : 'READY TO READ'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.capsuleTitle}>{cap.title}</Text>
                <Text style={styles.capsuleCondition}>{cap.condition}</Text>

                <View style={styles.capsuleFooter}>
                  <Text style={styles.capsuleSender}>✍️ By {cap.senderName}</Text>
                  <Text style={styles.capsuleDate}>{cap.createdAt}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* LETTER VIEWER MODAL */}
        {selectedCapsule && (
          <Modal visible={!!selectedCapsule} animationType="fade" transparent onRequestClose={() => setSelectedCapsule(null)}>
            <View style={styles.letterBackdrop}>
              <View style={styles.letterPaper}>
                <TouchableOpacity style={styles.letterCloseBtn} onPress={() => setSelectedCapsule(null)}>
                  <X size={20} color={Colors.textSecondary} />
                </TouchableOpacity>

                <View style={styles.letterWaxStamp}>
                  <Text style={styles.letterWaxEmoji}>{selectedCapsule.waxSealEmoji}</Text>
                </View>

                <Text style={styles.letterTitle}>{selectedCapsule.title}</Text>
                <Text style={styles.letterCondition}>Condition: {selectedCapsule.condition}</Text>

                <ScrollView style={styles.letterScroll} showsVerticalScrollIndicator={false}>
                  <Text style={styles.letterBodyText}>"{selectedCapsule.message}"</Text>
                </ScrollView>

                <Text style={styles.letterSignature}>Forever yours, {selectedCapsule.senderName} ❤️</Text>

                <GradientButton
                  title="Close Letter 💖"
                  onPress={() => setSelectedCapsule(null)}
                  style={styles.closeLetterBtn}
                />
              </View>
            </View>
          </Modal>
        )}

        {/* CREATE CAPSULE MODAL */}
        <Modal visible={showCreateModal} animationType="slide" transparent onRequestClose={() => setShowCreateModal(false)}>
          <View style={styles.letterBackdrop}>
            <View style={styles.createPaper}>
              <View style={styles.createHeader}>
                <Text style={styles.createTitle}>Write a Sealed Love Letter ✍️💌</Text>
                <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                  <X size={20} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.inputTitle}
                placeholder="Letter Title (e.g. Open When You Miss Me)"
                placeholderTextColor={Colors.textMuted}
                value={newTitle}
                onChangeText={setNewTitle}
              />

              <TextInput
                style={styles.inputCondition}
                placeholder="Unlock Condition (e.g. When feeling stressed / Next Anniversary)"
                placeholderTextColor={Colors.textMuted}
                value={newCondition}
                onChangeText={setNewCondition}
              />

              <TextInput
                style={styles.inputBody}
                placeholder="Pour your heart into this letter for your partner..."
                placeholderTextColor={Colors.textMuted}
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
              />

              <GradientButton
                title="Seal with Wax & Lock in Vault 🔐"
                onPress={handleCreateCapsule}
                disabled={!newTitle.trim() || !newMessage.trim()}
                style={{ width: '100%' }}
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
  },
  vaultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: '#FFF8FA',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.xl,
    borderWidth: 1.5,
    borderColor: '#FFD1DF',
    marginBottom: Spacing.md,
  },
  vaultIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFEBF2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vaultBannerTitle: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  vaultBannerSub: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  capsuleList: {
    gap: Spacing.sm,
  },
  capsuleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  capsuleCardLocked: {
    backgroundColor: '#FFFAF5',
    borderColor: '#FFE2CC',
  },
  capsuleTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  waxSeal: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFEBF2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  waxSealEmoji: {
    fontSize: 18,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Spacing.borderRadius.full,
  },
  badgeLocked: {
    backgroundColor: '#FFF0E6',
  },
  badgeUnlocked: {
    backgroundColor: '#EBFBEE',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: Typography.weights.heavy,
  },
  textLocked: {
    color: '#D35400',
  },
  textUnlocked: {
    color: Colors.emeraldGreen,
  },
  capsuleTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  capsuleCondition: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  capsuleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#FAF0F4',
  },
  capsuleSender: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  capsuleDate: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textMuted,
  },
  letterBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  letterPaper: {
    width: '100%',
    backgroundColor: '#FFFDF9',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: '#E8DCC4',
    position: 'relative',
    maxHeight: '80%',
  },
  letterCloseBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    padding: 6,
  },
  letterWaxStamp: {
    alignSelf: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFEBF2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: Spacing.xs,
  },
  letterWaxEmoji: {
    fontSize: 24,
  },
  letterTitle: {
    fontSize: Typography.sizes.md + 1,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  letterCondition: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  letterScroll: {
    maxHeight: 220,
    backgroundColor: '#FFF9EF',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: '#EFE3CE',
  },
  letterBodyText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  letterSignature: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
    textAlign: 'right',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  closeLetterBtn: {
    width: '100%',
  },
  createPaper: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
  },
  createHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  createTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  inputTitle: {
    backgroundColor: '#FAF5F7',
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs + 2,
  },
  inputCondition: {
    backgroundColor: '#FAF5F7',
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs + 2,
  },
  inputBody: {
    backgroundColor: '#FAF5F7',
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    minHeight: 120,
    marginBottom: Spacing.md,
  },
});
