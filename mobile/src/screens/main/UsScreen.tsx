import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Header } from '../../components/common/Header';
import { RomanticCard } from '../../components/common/RomanticCard';
import { LoveRadar } from '../../components/us/LoveRadar';
import { CupidAIChatModal } from '../../components/us/CupidAIChatModal';
import { useAuth } from '../../context/AuthContext';
import { useCouple } from '../../context/CoupleContext';
import { 
  Heart, 
  Sparkles, 
  Bot, 
  Award, 
  Bell, 
  Moon, 
  ShieldCheck, 
  LogOut, 
  UserCheck,
  ChevronRight,
  Flame,
  Camera,
  Compass
} from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

const ACHIEVEMENTS = [
  { id: 1, title: 'First Spark ⚡', desc: 'Paired your accounts together', unlocked: true, icon: '❤️' },
  { id: 2, title: 'Streak Champions 🔥', desc: '14 days active couple streak', unlocked: true, icon: '🔥' },
  { id: 3, title: 'Memory Makers 📸', desc: 'Saved 3+ scrapbook memories', unlocked: true, icon: '📸' },
  { id: 4, title: 'Quiz Masters 🧠', desc: 'Matched 10+ game questions', unlocked: true, icon: '🏆' },
  { id: 5, title: 'Romantic Explorers 🗺️', desc: 'Created 5 date night plans', unlocked: false, icon: '🔒' },
  { id: 6, title: 'Time Travelers ⏳', desc: 'Opened a sealed time capsule', unlocked: true, icon: '💌' },
];

export const UsScreen: React.FC = () => {
  const { user, couple, logout, switchUserRole } = useAuth();
  const { triggerHeartCelebration } = useCouple();
  const [showCupidModal, setShowCupidModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  const partner1Name = couple?.partner1?.nickname || couple?.partner1?.name || 'Srinija';
  const partner2Name = couple?.partner2?.nickname || couple?.partner2?.name || 'Partner';

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your couple space?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            triggerHaptic('medium');
            logout();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Us & Profile ❤️" subtitle="Our shared bond, radar & Cupid AI" />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* 1. Couple Profile Banner */}
        <RomanticCard style={styles.profileCard} variant="glass">
          <View style={styles.avatarRow}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarEmoji}>👩</Text>
              <Text style={styles.avatarName}>{partner1Name}</Text>
            </View>

            <View style={styles.centerHeartBox}>
              <Heart size={26} color={Colors.loveRed} fill={Colors.loveRed} />
              <Text style={styles.coupleCodeBadge}>{couple?.coupleCode || 'AM-8X7K'}</Text>
            </View>

            <View style={styles.avatarBox}>
              <Text style={styles.avatarEmoji}>👨</Text>
              <Text style={styles.avatarName}>{partner2Name}</Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>{couple?.daysTogether || 428}</Text>
              <Text style={styles.metricLabel}>Days Together</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>{couple?.streakCount || 14} 🔥</Text>
              <Text style={styles.metricLabel}>Day Streak</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>{couple?.totalHearts || 480} ❤️</Text>
              <Text style={styles.metricLabel}>Love Hearts</Text>
            </View>
          </View>
        </RomanticCard>

        {/* 2. Cupid AI Assistant Banner */}
        <TouchableOpacity
          style={styles.cupidBanner}
          onPress={() => {
            triggerHaptic('heavy');
            setShowCupidModal(true);
          }}
          activeOpacity={0.85}
        >
          <View style={styles.cupidLeft}>
            <View style={styles.botIconCircle}>
              <Bot size={24} color="#FFFFFF" />
            </View>
            <View>
              <View style={styles.cupidTitleRow}>
                <Text style={styles.cupidTitle}>Cupid AI Relationship Coach</Text>
                <Sparkles size={16} color={Colors.gold} />
              </View>
              <Text style={styles.cupidSub}>
                Generate customized date itineraries, poems & conversation advice
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={Colors.primary} />
        </TouchableOpacity>

        {/* 3. 5 Love Languages Radar */}
        <LoveRadar partner1Name={partner1Name} partner2Name={partner2Name} />

        {/* 4. Couple Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shared Milestones & Trophies 🏆</Text>
          <View style={styles.achievementsGrid}>
            {ACHIEVEMENTS.map((ach) => (
              <View key={ach.id} style={[styles.achCard, !ach.unlocked && styles.achCardLocked]}>
                <Text style={styles.achEmoji}>{ach.icon}</Text>
                <Text style={styles.achTitle}>{ach.title}</Text>
                <Text style={styles.achDesc}>{ach.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 5. Switch Active User Role (Demo Testing) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Switch Partner View (Demo Mode)</Text>
          <View style={styles.switchRoleBox}>
            <TouchableOpacity
              style={[styles.roleBtn, user?.id === 1 && styles.roleBtnActive]}
              onPress={() => switchUserRole('partner1')}
            >
              <Text style={styles.roleBtnEmoji}>👩</Text>
              <Text style={[styles.roleBtnText, user?.id === 1 && styles.roleBtnTextActive]}>
                View as {partner1Name} (User 1)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleBtn, user?.id === 2 && styles.roleBtnActive]}
              onPress={() => switchUserRole('partner2')}
            >
              <Text style={styles.roleBtnEmoji}>👨</Text>
              <Text style={[styles.roleBtnText, user?.id === 2 && styles.roleBtnTextActive]}>
                View as {partner2Name} (User 2)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 6. Settings & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences & Privacy</Text>
          <RomanticCard style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLabelRow}>
                <Bell size={18} color={Colors.primary} />
                <Text style={styles.settingText}>Relationship Reminders & Daily Questions</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#DDD', true: Colors.primaryLight }}
                thumbColor={notificationsEnabled ? Colors.primary : '#FFF'}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLabelRow}>
                <Sparkles size={18} color={Colors.primary} />
                <Text style={styles.settingText}>Romantic Haptic Vibrations</Text>
              </View>
              <Switch
                value={hapticsEnabled}
                onValueChange={setHapticsEnabled}
                trackColor={{ false: '#DDD', true: Colors.primaryLight }}
                thumbColor={hapticsEnabled ? Colors.primary : '#FFF'}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLabelRow}>
                <ShieldCheck size={18} color={Colors.emeraldGreen} />
                <Text style={styles.settingText}>End-to-End Private Couple Space</Text>
              </View>
              <Text style={styles.activePill}>Secured 🔒</Text>
            </View>
          </RomanticCard>
        </View>

        {/* 7. Logout Action */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color={Colors.loveRed} />
          <Text style={styles.logoutText}>Log Out of Amora</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Cupid AI Chat Modal */}
      <CupidAIChatModal
        visible={showCupidModal}
        onClose={() => setShowCupidModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  profileCard: {
    marginVertical: Spacing.xs,
    padding: Spacing.md,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarBox: {
    alignItems: 'center',
    width: 90,
  },
  avatarEmoji: {
    fontSize: 38,
  },
  avatarName: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  centerHeartBox: {
    alignItems: 'center',
    gap: 4,
  },
  coupleCodeBadge: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
    backgroundColor: '#FFEBF2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Spacing.borderRadius.full,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF8FA',
    paddingVertical: Spacing.sm + 2,
    borderRadius: Spacing.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#FFEBF0',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricVal: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  metricLabel: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  cupidBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.md,
    marginVertical: Spacing.xs,
    borderWidth: 1.5,
    borderColor: '#FFEBF2',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  cupidLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  botIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cupidTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cupidTitle: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  cupidSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    maxWidth: 220,
  },
  section: {
    marginVertical: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    marginLeft: 2,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs + 2,
  },
  achCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.sm + 2,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
    alignItems: 'center',
  },
  achCardLocked: {
    opacity: 0.5,
    backgroundColor: '#F8FAFC',
  },
  achEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  achTitle: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  achDesc: {
    fontSize: Typography.sizes.xs - 2,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  switchRoleBox: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: Spacing.xs,
    borderRadius: Spacing.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  roleBtnActive: {
    backgroundColor: '#FFEBF2',
    borderColor: Colors.primary,
  },
  roleBtnEmoji: {
    fontSize: 18,
  },
  roleBtnText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  roleBtnTextActive: {
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
  settingsCard: {
    padding: Spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  settingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  settingText: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textPrimary,
    fontWeight: Typography.weights.medium,
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#FAF0F4',
    marginVertical: 4,
  },
  activePill: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.bold,
    color: Colors.emeraldGreen,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  logoutText: {
    color: Colors.loveRed,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
});
