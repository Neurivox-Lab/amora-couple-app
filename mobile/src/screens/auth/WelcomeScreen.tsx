import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../../components/common/GradientButton';
import { useAuth } from '../../context/AuthContext';
import { Heart, Sparkles, ShieldCheck, Phone, Lock, User } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

interface WelcomeScreenProps {
  navigation: any;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const { loginCoupleDirect, login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<'SIGNIN' | 'REGISTER' | 'COUPLE'>('SIGNIN');

  // Sign In Form State (Mobile Number + Password)
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Individual Register State
  const [regName, setRegName] = useState('');
  const [regNickname, setRegNickname] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCoupleCode, setRegCoupleCode] = useState('');

  // Direct Couple Form State (Her & Him)
  const [herName, setHerName] = useState('');
  const [herNickname, setHerNickname] = useState('');
  const [herPhone, setHerPhone] = useState('');
  const [hisName, setHisName] = useState('');
  const [hisNickname, setHisNickname] = useState('');
  const [hisPhone, setHisPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!loginPhone.trim() || !loginPassword.trim()) {
      setError('Please enter your Mobile Number and Password');
      return;
    }
    setError(null);
    setLoading(true);
    triggerHaptic('medium');
    try {
      await login(loginPhone.trim(), loginPassword.trim());
    } catch (e: any) {
      setError(e.message || 'Login failed. Check your mobile number and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!regName.trim() || !regPhone.trim() || !regPassword.trim()) {
      setError('Please fill in Name, Mobile Number, and Password');
      return;
    }
    setError(null);
    setLoading(true);
    triggerHaptic('heartbeat');
    try {
      await register({
        name: regName.trim(),
        nickname: regNickname.trim() || regName.trim(),
        phone: regPhone.trim(),
        password: regPassword.trim(),
        coupleCode: regCoupleCode.trim() || undefined,
      });
      navigation.navigate('Pairing');
    } catch (e: any) {
      setError(e.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

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
        partner1Phone: herPhone.trim() || '9876543210',
        partner2Name: hisName.trim(),
        partner2Nickname: hisNickname.trim() || hisName.trim(),
        partner2Phone: hisPhone.trim() || '9876543211',
        daysTogether: 1,
      });
    } catch (e: any) {
      setError(e.message || 'Failed to enter sanctuary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
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
          <Text style={styles.subtitle}>Our Private Couple Sanctuary</Text>
          <Text style={styles.tagline}>
            A private space for two people to play 30 games, take 500 quizzes, sync moods, and preserve memories.
          </Text>
        </View>

        {/* 2. Top Mode Switcher */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'SIGNIN' && styles.tabItemActive]}
            onPress={() => {
              triggerHaptic('light');
              setActiveTab('SIGNIN');
              setError(null);
            }}
          >
            <Text style={[styles.tabLabel, activeTab === 'SIGNIN' && styles.tabLabelActive]}>
              🔑 Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'REGISTER' && styles.tabItemActive]}
            onPress={() => {
              triggerHaptic('light');
              setActiveTab('REGISTER');
              setError(null);
            }}
          >
            <Text style={[styles.tabLabel, activeTab === 'REGISTER' && styles.tabLabelActive]}>
              ✍️ Register
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'COUPLE' && styles.tabItemActive]}
            onPress={() => {
              triggerHaptic('light');
              setActiveTab('COUPLE');
              setError(null);
            }}
          >
            <Text style={[styles.tabLabel, activeTab === 'COUPLE' && styles.tabLabelActive]}>
              💑 Fast Setup
            </Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* 3. TAB 1: SIGN IN (MOBILE + PASSWORD) */}
        {activeTab === 'SIGNIN' && (
          <View style={styles.cardBox}>
            <Text style={styles.cardTitle}>Sign In to Your Space 🔑</Text>
            <Text style={styles.cardDesc}>
              Enter your registered mobile number and password to access your couple sanctuary.
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Mobile Number *</Text>
              <View style={styles.inputContainer}>
                <Phone size={16} color={Colors.primary} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 9876543210"
                  placeholderTextColor={Colors.textMuted}
                  value={loginPhone}
                  onChangeText={setLoginPhone}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password *</Text>
              <View style={styles.inputContainer}>
                <Lock size={16} color={Colors.primary} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.textMuted}
                  value={loginPassword}
                  onChangeText={setLoginPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <GradientButton
              title="Sign In ❤️"
              onPress={handleSignIn}
              loading={loading}
              style={styles.enterBtn}
            />

            <View style={styles.securityNote}>
              <ShieldCheck size={14} color={Colors.emeraldGreen} />
              <Text style={styles.securityNoteText}>Secure end-to-end encrypted for 2 people</Text>
            </View>
          </View>
        )}

        {/* 4. TAB 2: REGISTER ACCOUNT (MANDATORY MOBILE & PASSWORD) */}
        {activeTab === 'REGISTER' && (
          <View style={styles.cardBox}>
            <Text style={styles.cardTitle}>Register New Couple Account ❤️</Text>
            <Text style={styles.cardDesc}>
              Create your account with your mobile number to pair with your partner.
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Your Full Name *</Text>
              <View style={styles.inputContainer}>
                <User size={16} color={Colors.primary} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Srinija"
                  placeholderTextColor={Colors.textMuted}
                  value={regName}
                  onChangeText={setRegName}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Cute Nickname (optional)</Text>
              <View style={styles.inputContainer}>
                <Heart size={16} color={Colors.loveRed} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Sri 💖, My Queen, Babe..."
                  placeholderTextColor={Colors.textMuted}
                  value={regNickname}
                  onChangeText={setRegNickname}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Mobile Number (Mandatory for Login) *</Text>
              <View style={styles.inputContainer}>
                <Phone size={16} color={Colors.primary} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 9876543210"
                  placeholderTextColor={Colors.textMuted}
                  value={regPhone}
                  onChangeText={setRegPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Create Password *</Text>
              <View style={styles.inputContainer}>
                <Lock size={16} color={Colors.primary} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.textMuted}
                  value={regPassword}
                  onChangeText={setRegPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Partner's Couple Code (optional if joining)</Text>
              <View style={styles.inputContainer}>
                <Sparkles size={16} color={Colors.gold} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. CF-8X7K (leave blank if creating new)"
                  placeholderTextColor={Colors.textMuted}
                  value={regCoupleCode}
                  onChangeText={setRegCoupleCode}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <GradientButton
              title="Continue to Pair Partner →"
              onPress={handleRegister}
              loading={loading}
              style={styles.enterBtn}
            />
          </View>
        )}

        {/* 5. TAB 3: FAST DIRECT SETUP (HER & HIM) */}
        {activeTab === 'COUPLE' && (
          <View style={styles.cardBox}>
            <View style={styles.cardHeaderRow}>
              <Sparkles size={16} color={Colors.primaryDark} />
              <Text style={styles.cardTitle}>Fast Direct Setup (Her & Him)</Text>
            </View>
            <Text style={styles.cardDesc}>
              Enter details for both of you to attach your unique accounts and start on Day 1.
            </Text>

            {/* Partner 1 (Her) */}
            <View style={styles.partnerSection}>
              <View style={styles.partnerHeader}>
                <Text style={styles.avatarEmoji}>👩</Text>
                <Text style={styles.partnerHeading}>Her Details (Partner 1)</Text>
              </View>
              <View style={styles.inputRow}>
                <View style={styles.inputFlex}>
                  <Text style={styles.label}>Her Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Srinija"
                    placeholderTextColor={Colors.textMuted}
                    value={herName}
                    onChangeText={setHerName}
                  />
                </View>
                <View style={styles.inputFlex}>
                  <Text style={styles.label}>Her Nickname</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Sri 💖"
                    placeholderTextColor={Colors.textMuted}
                    value={herNickname}
                    onChangeText={setHerNickname}
                  />
                </View>
              </View>
              <Text style={[styles.label, { marginTop: 4 }]}>Her Mobile Number</Text>
              <TextInput
                style={styles.input}
                placeholder="9876543210"
                placeholderTextColor={Colors.textMuted}
                value={herPhone}
                onChangeText={setHerPhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Partner 2 (Him) */}
            <View style={styles.partnerSection}>
              <View style={styles.partnerHeader}>
                <Text style={styles.avatarEmoji}>👨</Text>
                <Text style={styles.partnerHeading}>Him Details (Partner 2)</Text>
              </View>
              <View style={styles.inputRow}>
                <View style={styles.inputFlex}>
                  <Text style={styles.label}>His Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Rohit"
                    placeholderTextColor={Colors.textMuted}
                    value={hisName}
                    onChangeText={setHisName}
                  />
                </View>
                <View style={styles.inputFlex}>
                  <Text style={styles.label}>His Nickname</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. My Love 🧸"
                    placeholderTextColor={Colors.textMuted}
                    value={hisNickname}
                    onChangeText={setHisNickname}
                  />
                </View>
              </View>
              <Text style={[styles.label, { marginTop: 4 }]}>His Mobile Number</Text>
              <TextInput
                style={styles.input}
                placeholder="9876543211"
                placeholderTextColor={Colors.textMuted}
                value={hisPhone}
                onChangeText={setHisPhone}
                keyboardType="phone-pad"
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
              <Text style={styles.securityNoteText}>Starts with 0 hearts • Build your memories together</Text>
            </View>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: 150,
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
    width: '100%',
    maxWidth: 440,
  },
  logoWrapper: {
    width: 90,
    height: 90,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginBottom: Spacing.xs,
  },
  appLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: Typography.sizes.xl + 1,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  subtitle: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
    marginTop: 1,
    marginBottom: 2,
  },
  heart: {
    fontSize: Typography.sizes.lg,
  },
  tagline: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: Spacing.sm,
    maxWidth: 360,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FAF5F7',
    borderRadius: Spacing.borderRadius.lg,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: Spacing.sm,
    width: '100%',
    maxWidth: 440,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 9,
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
    fontSize: Typography.sizes.xs - 1,
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
    marginBottom: Spacing.sm,
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
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  cardDesc: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 16,
  },
  partnerSection: {
    backgroundColor: '#FFF9FB',
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: '#FFEBF2',
  },
  partnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  avatarEmoji: {
    fontSize: 15,
  },
  partnerHeading: {
    fontSize: Typography.sizes.xs,
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
    marginBottom: Spacing.xs + 2,
  },
  label: {
    fontSize: Typography.sizes.xs - 2,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.md,
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  input: {
    flex: 1,
    paddingVertical: 7,
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textPrimary,
  },
  enterBtn: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 4,
  },
  securityNoteText: {
    fontSize: Typography.sizes.xs - 2,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
});
