import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Share, Alert } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';
import { useCouple } from '../../context/CoupleContext';
import { 
  Heart, 
  Sparkles, 
  Settings, 
  Camera, 
  Edit3, 
  Share2, 
  CheckCircle2, 
  PlusCircle, 
  LogOut, 
  UserCheck, 
  Calendar, 
  Lock, 
  Bell, 
  X, 
  Check, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

export const UsScreen: React.FC = () => {
  const { user, couple, logout, switchUserRole, refreshCouple } = useAuth();
  const { triggerHeartCelebration } = useCouple();

  // Modals state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showTopicsModal, setShowTopicsModal] = useState(false);

  // Profile Edit State
  const isUser1 = user?.id === couple?.partner1?.id;
  const p1Name = couple?.partner1?.name || (isUser1 ? user?.name : 'Srinija') || 'Srinija';
  const p1Nick = couple?.partner1?.nickname || p1Name;
  const p2Name = couple?.partner2?.name || (!isUser1 ? user?.name : 'SRIKHAR') || 'SRIKHAR';
  const p2Nick = couple?.partner2?.nickname || p2Name;

  const [editP1, setEditP1] = useState(p1Name);
  const [editP2, setEditP2] = useState(p2Name);
  const [editDate, setEditDate] = useState('November 2, 2025');
  const [topics, setTopics] = useState<string[]>(['Travel & Adventures ✈️', 'Cooking Together 🍳', 'Movie Nights 🎬', 'Future Goals 🏡']);
  const [newTopicInput, setNewTopicInput] = useState('');

  // Calculations for Relationship Stats
  const daysTogether = Math.max(1, couple?.daysTogether || 1);
  const weeksTogether = Math.max(1, Math.floor(daysTogether / 7));
  const estimatedHeartbeats = (daysTogether * 24 * 60 * 75).toLocaleString();

  // Initial letters
  const p1Initial = p1Name.charAt(0).toUpperCase() || 'S';
  const p2Initial = p2Name.charAt(0).toUpperCase() || 'S';

  const handleShareStats = async () => {
    triggerHaptic('light');
    try {
      await Share.share({
        message: `${p1Name} & ${p2Name} — Together for ${daysTogether} days (${weeksTogether} weeks) and still in sync after ${estimatedHeartbeats} heartbeats! ❤️ #CoupleFriendly`,
      });
    } catch (e) {
      // share dismissed
    }
  };

  const handleLogout = async () => {
    triggerHaptic('heavy');
    setShowSettingsModal(false);
    await logout();
  };

  const handleToggleUser = () => {
    triggerHaptic('medium');
    if (user?.id === 1 || isUser1) {
      switchUserRole('partner2');
    } else {
      switchUserRole('partner1');
    }
    setShowSettingsModal(false);
  };

  const handleSaveProfile = async () => {
    triggerHaptic('success');
    if (couple) {
      if (couple.partner1) {
        couple.partner1.name = editP1.trim() || couple.partner1.name;
        couple.partner1.nickname = editP1.trim() || couple.partner1.nickname;
      }
      if (couple.partner2) {
        couple.partner2.name = editP2.trim() || couple.partner2.name;
        couple.partner2.nickname = editP2.trim() || couple.partner2.nickname;
      }
    }
    await refreshCouple();
    setShowEditProfileModal(false);
  };

  const handleAddTopic = () => {
    if (newTopicInput.trim()) {
      setTopics([...topics, newTopicInput.trim()]);
      setNewTopicInput('');
      triggerHaptic('light');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* TOP PURPLE HEADER BANNER */}
        <View style={styles.topPurpleSection}>
          {/* Top Gear Settings Button */}
          <View style={styles.topBarRow}>
            <View style={{ width: 40 }} />
            <TouchableOpacity
              style={styles.settingsIconBtn}
              onPress={() => {
                triggerHaptic('light');
                setShowSettingsModal(true);
              }}
              activeOpacity={0.8}
            >
              <Settings size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Overlapping Dual Initials Circle Avatars */}
          <View style={styles.avatarOverlapContainer}>
            <View style={[styles.avatarCircle, styles.avatarCircleLeft]}>
              <Text style={styles.avatarInitialText}>{p1Initial}</Text>
            </View>
            <View style={[styles.avatarCircle, styles.avatarCircleRight]}>
              <Text style={styles.avatarInitialText}>{p2Initial}</Text>
            </View>
            <TouchableOpacity
              style={styles.cameraBadge}
              onPress={() => {
                triggerHaptic('light');
                setShowEditProfileModal(true);
              }}
              activeOpacity={0.8}
            >
              <Camera size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Couple Names Header */}
          <Text style={styles.coupleNamesTitle}>{p1Name} & {p2Name}</Text>
          <Text style={styles.togetherSinceText}>Together since {editDate}</Text>
        </View>

        {/* 1. "IN OTHER WORDS" CARD */}
        <View style={styles.inOtherWordsCard}>
          <View style={styles.cardTopActionRow}>
            <TouchableOpacity onPress={() => setShowEditProfileModal(true)} activeOpacity={0.7}>
              <Edit3 size={18} color="#A799FF" />
            </TouchableOpacity>
            <Text style={styles.inOtherWordsHeading}>In other words</Text>
            <TouchableOpacity onPress={handleShareStats} activeOpacity={0.7}>
              <Share2 size={18} color="#A799FF" />
            </TouchableOpacity>
          </View>

          <View style={styles.weeksCenterBox}>
            <Text style={styles.sparkleEmoji}>✨</Text>
            <View style={styles.weeksValueColumn}>
              <Text style={styles.weeksNumber}>{weeksTogether > 1 ? weeksTogether : daysTogether}</Text>
              <Text style={styles.weeksLabel}>{weeksTogether > 1 ? 'Weeks' : 'Days'}</Text>
            </View>
            <Text style={styles.sparkleEmoji}>✨</Text>
          </View>

          <View style={styles.heartbeatsRow}>
            <Text style={styles.heartbeatEmoji}>💜</Text>
            <Text style={styles.heartbeatsText}>
              Still in sync after <Text style={styles.heartbeatsBold}>{estimatedHeartbeats}</Text> heartbeats.
            </Text>
          </View>
        </View>

        {/* 2. "COMPLETE YOUR RELATIONSHIP PROFILE" CARD */}
        <View style={styles.profileChecklistCard}>
          <View style={styles.checklistHeaderRow}>
            <View style={styles.progressCircleContainer}>
              <Text style={styles.progressCircleText}>80%</Text>
            </View>
            <Text style={styles.checklistTitle}>Complete Your{'\n'}Relationship Profile</Text>
          </View>

          {/* Checklist Items */}
          <View style={styles.checklistRowsContainer}>
            <View style={styles.checkItemRow}>
              <Text style={styles.checkItemText}>Couple anniversary</Text>
              <CheckCircle2 size={20} color="#38EF7D" fill="#205B3A" />
            </View>

            <View style={styles.checkItemRow}>
              <Text style={styles.checkItemText}>Personal information</Text>
              <CheckCircle2 size={20} color="#38EF7D" fill="#205B3A" />
            </View>

            <View style={styles.checkItemRow}>
              <Text style={styles.checkItemText}>Couple information</Text>
              <CheckCircle2 size={20} color="#38EF7D" fill="#205B3A" />
            </View>

            <View style={styles.checkItemRow}>
              <Text style={styles.checkItemText}>Profile photo</Text>
              <TouchableOpacity
                style={styles.addPillBtn}
                onPress={() => {
                  triggerHaptic('light');
                  setShowEditProfileModal(true);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.addPillText}>Add</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.checkItemRow}>
              <Text style={styles.checkItemText}>Personalized topics</Text>
              <TouchableOpacity
                style={styles.addPillBtn}
                onPress={() => {
                  triggerHaptic('light');
                  setShowTopicsModal(true);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.addPillText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* SETTINGS MODAL */}
      <Modal visible={showSettingsModal} animationType="slide" transparent onRequestClose={() => setShowSettingsModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.settingsModalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeading}>Couple Space Settings ⚙️</Text>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                <X size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.settingItemRow}>
              <View style={styles.settingItemLeft}>
                <Lock size={18} color={Colors.primary} />
                <View>
                  <Text style={styles.settingItemTitle}>Couple Secret Code</Text>
                  <Text style={styles.settingItemSub}>{couple?.coupleCode || 'CF-8X7K'}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.copySmallBtn}
                onPress={() => {
                  triggerHaptic('success');
                  Alert.alert('Copied', `Couple code ${couple?.coupleCode || 'CF-8X7K'} copied!`);
                }}
              >
                <Text style={styles.copySmallText}>Copy</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.settingItemRow}
              onPress={() => {
                setShowSettingsModal(false);
                setShowEditProfileModal(true);
              }}
            >
              <View style={styles.settingItemLeft}>
                <Edit3 size={18} color={Colors.primary} />
                <View>
                  <Text style={styles.settingItemTitle}>Edit Names & Anniversary</Text>
                  <Text style={styles.settingItemSub}>{p1Name} & {p2Name}</Text>
                </View>
              </View>
              <ChevronRight size={18} color={Colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItemRow} onPress={handleToggleUser}>
              <View style={styles.settingItemLeft}>
                <UserCheck size={18} color={Colors.emeraldGreen} />
                <View>
                  <Text style={styles.settingItemTitle}>Switch Active Role</Text>
                  <Text style={styles.settingItemSub}>Current: {user?.id === 1 || isUser1 ? p1Name : p2Name}</Text>
                </View>
              </View>
              <Text style={styles.switchRolePill}>Toggle ⇄</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingItemRow, styles.logoutRow]} onPress={handleLogout}>
              <View style={styles.settingItemLeft}>
                <LogOut size={18} color={Colors.loveRed} />
                <Text style={styles.logoutText}>Log Out of Couple Space</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* EDIT PROFILE & ANNIVERSARY MODAL */}
      <Modal visible={showEditProfileModal} animationType="slide" transparent onRequestClose={() => setShowEditProfileModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.settingsModalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeading}>Edit Couple Profile 💑</Text>
              <TouchableOpacity onPress={() => setShowEditProfileModal(false)}>
                <X size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Partner 1 Name (Her)</Text>
            <TextInput style={styles.modalInput} value={editP1} onChangeText={setEditP1} placeholder="e.g. Srinija" />

            <Text style={styles.inputLabel}>Partner 2 Name (Him)</Text>
            <TextInput style={styles.modalInput} value={editP2} onChangeText={setEditP2} placeholder="e.g. SRIKHAR" />

            <Text style={styles.inputLabel}>Relationship Anniversary Date</Text>
            <TextInput style={styles.modalInput} value={editDate} onChangeText={setEditDate} placeholder="e.g. November 2, 2025" />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
              <Text style={styles.saveBtnText}>Save Changes ❤️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* PERSONALIZED TOPICS MODAL */}
      <Modal visible={showTopicsModal} animationType="slide" transparent onRequestClose={() => setShowTopicsModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.settingsModalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeading}>Personalized Topics ✨</Text>
              <TouchableOpacity onPress={() => setShowTopicsModal(false)}>
                <X size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.topicChipsWrap}>
              {topics.map((t, idx) => (
                <View key={idx} style={styles.topicChip}>
                  <Text style={styles.topicChipText}>{t}</Text>
                </View>
              ))}
            </View>

            <View style={styles.addTopicRow}>
              <TextInput
                style={styles.topicInput}
                placeholder="Add a favorite topic (e.g. Stargazing 🌌)..."
                placeholderTextColor={Colors.textMuted}
                value={newTopicInput}
                onChangeText={setNewTopicInput}
              />
              <TouchableOpacity style={styles.addTopicBtn} onPress={handleAddTopic}>
                <Text style={styles.addTopicBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8E78E0',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 150,
  },
  topPurpleSection: {
    backgroundColor: '#8E78E0',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
  },
  topBarRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  settingsIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarOverlapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: Spacing.sm,
  },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#8E78E0',
  },
  avatarCircleLeft: {
    backgroundColor: '#D6CBFF',
    zIndex: 1,
    marginRight: -18,
  },
  avatarCircleRight: {
    backgroundColor: '#F8B4A6',
    zIndex: 2,
  },
  avatarInitialText: {
    fontSize: 32,
    fontWeight: Typography.weights.heavy,
    color: '#34295C',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    alignSelf: 'center',
    backgroundColor: '#27204A',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#8E78E0',
  },
  coupleNamesTitle: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.heavy,
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginTop: 6,
  },
  togetherSinceText: {
    fontSize: Typography.sizes.xs + 1,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 3,
    fontWeight: Typography.weights.medium,
  },
  inOtherWordsCard: {
    backgroundColor: '#1E1B38',
    marginHorizontal: Spacing.md,
    borderRadius: 24,
    padding: Spacing.lg,
    marginTop: Spacing.sm,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  cardTopActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inOtherWordsHeading: {
    fontSize: Typography.sizes.xs + 1,
    color: '#A799FF',
    fontWeight: Typography.weights.semibold,
  },
  weeksCenterBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.md,
    gap: 12,
  },
  sparkleEmoji: {
    fontSize: 22,
    color: '#D4C7FF',
  },
  weeksValueColumn: {
    alignItems: 'center',
  },
  weeksNumber: {
    fontSize: 40,
    fontWeight: Typography.weights.heavy,
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  weeksLabel: {
    fontSize: Typography.sizes.sm,
    color: '#D4C7FF',
    fontWeight: Typography.weights.semibold,
    marginTop: 2,
  },
  heartbeatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  heartbeatEmoji: {
    fontSize: 14,
  },
  heartbeatsText: {
    fontSize: Typography.sizes.xs,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  heartbeatsBold: {
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  profileChecklistCard: {
    backgroundColor: '#1E1B38',
    marginHorizontal: Spacing.md,
    borderRadius: 24,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  checklistHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  progressCircleContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#38EF7D',
    borderTopColor: '#FF6B8B',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  progressCircleText: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.heavy,
    color: '#FFFFFF',
  },
  checklistTitle: {
    fontSize: Typography.sizes.md + 2,
    fontWeight: Typography.weights.heavy,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  checklistRowsContainer: {
    gap: 10,
  },
  checkItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2A264D',
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderRadius: 14,
  },
  checkItemText: {
    fontSize: Typography.sizes.sm,
    color: '#D4C7FF',
    fontWeight: Typography.weights.medium,
  },
  addPillBtn: {
    backgroundColor: '#8E78E0',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addPillText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  settingsModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalHeading: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  settingItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F2EEF5',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  settingItemTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  settingItemSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  copySmallBtn: {
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copySmallText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  switchRolePill: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.emeraldGreen,
    backgroundColor: '#E8FBF0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  logoutRow: {
    borderBottomWidth: 0,
    marginTop: Spacing.xs,
  },
  logoutText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.loveRed,
  },
  inputLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: '#FAF5F7',
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  saveBtnText: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  topicChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: Spacing.sm,
  },
  topicChip: {
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFDCE5',
  },
  topicChipText: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.semibold,
    color: Colors.primaryDark,
  },
  addTopicRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.md,
  },
  topicInput: {
    flex: 1,
    backgroundColor: '#FAF5F7',
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: Typography.sizes.xs + 1,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addTopicBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  addTopicBtnText: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
});
