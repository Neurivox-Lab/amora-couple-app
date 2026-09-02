import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../../components/common/GradientButton';
import { useAuth } from '../../context/AuthContext';
import { Heart, Sparkles, ShieldCheck, Users, Lock, Phone, Mail, ArrowRight, UserCheck } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

interface WelcomeScreenProps {
  navigation: any;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const { loginCoupleDirect, login } = useAuth();
  const [activeTab, setActiveTab] = useState<'COUPLE' | 'SIGNIN' | 'DEMO'>('COUPLE');

  // Direct Couple Form State (Her & Him)
  const [herName, setHerName] = useState('Srinija');
  const [herNickname, setHerNickname] = useState('Sri 💖');
  const [hisName, setHisName] = useState('Partner');
  const [hisNickname, setHisNickname] = useState('My Love 🧸');
  const [daysTogether, setDaysTogether] = useState('428');

  // Sign In Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDirectCoupleEntry = async () => {
    if (!herName.trim() || !hisName.trim()) {
      setError('Please enter both partner names');
      return;
    }
    setError(null);
    setLoading(true);
    triggerHaptic('heartbeat');
    try {
      await loginCoupleDirect({
        partner1Name: herName.trim(),
        partner1Nickname: herNickname.trim() || herName.trim(),
        partner2Name: hisName.trim(),
        partner2Nickname: hisNickname.trim() || hisName.trim(),
        daysTogether: parseInt(daysTogether) || 428,
      });
    } catch (e: any) {
      setError(e.message || 'Failed to enter sanctuary');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!identifier.trim()) {
      setError('Please enter your email, phone, or name');
      return;
    }
    setError(null);
    setLoading(true);
    triggerHaptic('medium');
    try {
      await login(identifier.trim(), password.trim() || undefined);
    } catch (e: any) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'srinija' | 'partner') => {
    setLoading(true);
    triggerHaptic('heavy');
    try {
      if (role === 'srinija') {
        await login('srinija@couplefriendly.love', 'Password123!');
      } else {
        await login('partner@couplefriendly.love', 'Password123!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1. Hero Brand Header */}
        <View style={styles.heroSection}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('../../../assets/icon.png')}
              style={styles.appLogo}
            />
          </View>
          <Text style={styles.title}>Couple-Friendly <Text style={styles.heart}>❤️</Text></Text>
          <Text style={styles.subtitle}>Our Private Space • Games & Memories</Text>
          <Text style={styles.tagline}>
            A private sanctuary for the two of you to play 30 games, take 500 quizzes, sync moods, and grow your love garden.
          </Text>
        </View>

        {/* 2. Top Mode Switcher */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'COUPLE' && styles.tabItemActive]}
            onPress={() => {
              triggerHaptic('light');
              setActiveTab('COUPLE');
            }}
          >
            <Text style={[styles.tabLabel, activeTab === 'COUPLE' && styles.tabLabelActive]}>
              💑 Him & Her
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'SIGNIN' && styles.tabItemActive]}
            onPress={() => {
              triggerHaptic('light');
              setActiveTab('SIGNIN');
            }}
          >
            <Text style={[styles.tabLabel, activeTab === 'SIGNIN' && styles.tabLabelActive]}>
              🔑 Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'DEMO' && styles.tabItemActive]}
            onPress={() => {
              triggerHaptic('light');
              setActiveTab('DEMO');
            }}
          >
            <Text style={[styles.tabLabel, activeTab === 'DEMO' && styles.tabLabelActive]}>
              ⚡ 1-Tap Demo
            </Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* 3. TAB 1: DIRECT COUPLE ENTRY (HER & HIM) */}
        {activeTab === 'COUPLE' && (
          <View style={styles.cardBox}>
            <View style={styles.cardHeaderRow}>
              <Sparkles size={16} color={Colors.primaryDark} />
              <Text style={styles.cardTitle}>Set Up Your Couple Space (Instant)</Text>
            </View>

            {/* Partner 1 (Her) */}
            <View style={styles.partnerSection}>
              <View style={styles.partnerHeader}>
                <Text style={styles.avatarEmoji}>👩</Text>
                <Text style={styles.partnerHeading}>Her / Partner 1 Details</Text>
              </View>
              <View style={styles.inputRow}>
                <View style={styles.inputFlex}>
                  <Text style={styles.label}>Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Srinija"
                    placeholderTextColor={Colors.textMuted}
                    value={herName}
                    onChangeText={setHerName}
                  />
                </View>
                <View style={styles.inputFlex}>
                  <Text style={styles.label}>Nickname</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Sri 💖"
                    placeholderTextColor={Colors.textMuted}
                    value={herNickname}
                    onChangeText={setHerNickname}
                  />
                </View>
              </View>
            </View>

            {/* Partner 2 (Him) */}
            <View style={styles.partnerSection}>
              <View style={styles.partnerHeader}>
                <Text style={styles.avatarEmoji}>👨</Text>
                <Text style={styles.partnerHeading}>Him / Partner 2 Details</Text>
              </View>
              <View style={styles.inputRow}>
                <View style={styles.inputFlex}>
                  <Text style={styles.label}>Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Rohit / Partner"
                    placeholderTextColor={Colors.textMuted}
                    value={hisName}
                    onChangeText={setHisName}
                  />
                </View>
                <View style={styles.inputFlex}>
                  <Text style={styles.label}>Nickname</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. My Love 🧸"
                    placeholderTextColor={Colors.textMuted}
                    value={hisNickname}
                    onChangeText={setHisNickname}
                  />
                </View>
              </View>
            </View>

            {/* Days Together */}
            <View style={styles.daysInputBox}>
              <Text style={styles.label}>Days in Love Together (Counter)</Text>
              <TextInput
                style={styles.input}
                placeholder="428"
                placeholderTextColor={Colors.textMuted}
                value={daysTogether}
                onChangeText={setDaysTogether}
                keyboardType="numeric"
              />
            </View>

            <GradientButton
              title="Enter Our Love Sanctuary ❤️"
              onPress={handleDirectCoupleEntry}
              loading={loading}
              style={styles.enterBtn}
            />

            <View style={styles.securityNote}>
              <ShieldCheck size={14} color={Colors.emeraldGreen} />
              <Text style={styles.securityNoteText}>100% Private • Just for the Two of You</Text>
            </View>
          </View>
        )}

        {/* 4. TAB 2: SIGN IN / CODE CONNECT */}
        {activeTab === 'SIGNIN' && (
          <View style={styles.cardBox}>
            <Text style={styles.cardTitle}>Sign In to Existing Account 🔑</Text>
            <Text style={styles.cardDesc}>
              Enter your email, phone, or name to re-enter your couple space.
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email, Phone Number or Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. srinija@gmail.com or 9876543210"
                placeholderTextColor={Colors.textMuted}
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <GradientButton
              title="Sign In ❤️"
              onPress={handleSignIn}
              loading={loading}
              style={styles.enterBtn}
            />

            <TouchableOpacity
              style={styles.registerLinkBtn}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.registerLinkText}>Need to generate a new invite code? Create Account →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 5. TAB 3: 1-TAP DEMO */}
        {activeTab === 'DEMO' && (
          <View style={styles.cardBox}>
            <Text style={styles.cardTitle}>Instant 1-Tap Entry ⚡</Text>
            <Text style={styles.cardDesc}>
              Explore the entire Couple-Friendly app immediately without typing!
            </Text>

            <TouchableOpacity
              style={styles.demoOptionBtn}
              onPress={() => handleQuickDemo('srinija')}
              activeOpacity={0.8}
            >
              <Text style={styles.demoOptionEmoji}>👩</Text>
              <View style={styles.demoOptionTextWrap}>
                <Text style={styles.demoOptionTitle}>Enter as Srinija (Partner 1)</Text>
                <Text style={styles.demoOptionSub}>Full access to 30 games & 500 quizzes</Text>
              </View>
              <ArrowRight size={18} color={Colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoOptionBtn, styles.demoOptionPartner]}
              onPress={() => handleQuickDemo('partner')}
              activeOpacity={0.8}
            >
              <Text style={styles.demoOptionEmoji}>👨</Text>
              <View style={styles.demoOptionTextWrap}>
                <Text style={styles.demoOptionTitle}>Enter as Partner (Partner 2)</Text>
                <Text style={styles.demoOptionSub}>Interactive dual-player pairing mode</Text>
              </View>
              <ArrowRight size={18} color="#4FACFE" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.md,
    width: '100%',
    maxWidth: 440,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    marginBottom: Spacing.xs,
  },
  appLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: Typography.sizes.xl + 2,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
    marginTop: 1,
    marginBottom: 4,
  },
  heart: {
    fontSize: Typography.sizes.xl,
  },
  tagline: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: Spacing.sm,
    maxWidth: 380,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FAF5F7',
    borderRadius: Spacing.borderRadius.lg,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    width: '100%',
    maxWidth: 440,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
  },
  tabItemActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  tabLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  tabLabelActive: {
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
  errorBox: {
    backgroundColor: '#FFEBF0',
    padding: Spacing.sm,
    borderRadius: Spacing.borderRadius.md,
    marginBottom: Spacing.md,
    width: '100%',
    maxWidth: 440,
  },
  errorText: {
    color: Colors.loveRed,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    textAlign: 'center',
  },
  cardBox: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.md + 2,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  cardDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    marginTop: 2,
  },
  partnerSection: {
    backgroundColor: '#FFF9FB',
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: '#FFEBF2',
  },
  partnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  avatarEmoji: {
    fontSize: 16,
  },
  partnerHeading: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  inputFlex: {
    flex: 1,
  },
  fieldGroup: {
    marginBottom: Spacing.sm,
  },
  daysInputBox: {
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
    marginBottom: 3,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 9,
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  enterBtn: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 4,
  },
  securityNoteText: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  registerLinkBtn: {
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  registerLinkText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
  demoOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9FB',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#FFE0EB',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  demoOptionPartner: {
    backgroundColor: '#F0F8FF',
    borderColor: '#D0E8FF',
  },
  demoOptionEmoji: {
    fontSize: 24,
  },
  demoOptionTextWrap: {
    flex: 1,
  },
  demoOptionTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  demoOptionSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
