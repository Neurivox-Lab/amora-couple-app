import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../../components/common/GradientButton';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, User, Phone, Lock, Heart, Sparkles } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [coupleCode, setCoupleCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!name.trim() || !phone.trim() || !password.trim()) {
      setError('Please fill in Name, Mobile Number, and Password');
      return;
    }
    setError(null);
    setLoading(true);
    triggerHaptic('heartbeat');
    try {
      await register({
        name: name.trim(),
        nickname: nickname.trim() || name.trim(),
        phone: phone.trim(),
        password: password.trim(),
        coupleCode: coupleCode.trim() || undefined,
      });
      navigation.navigate('Pairing');
    } catch (e: any) {
      setError(e.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.stepText}>Step 1 of 2: Create Account</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Register Your Account ❤️</Text>
        <Text style={styles.subtitle}>
          Sign up with your mobile number to create your couple space and pair with your partner.
        </Text>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Text style={styles.label}>Your Full Name *</Text>
          <View style={styles.inputContainer}>
            <User size={18} color={Colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="e.g. Srinija"
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>

          <Text style={styles.label}>Your Cute Nickname</Text>
          <View style={styles.inputContainer}>
            <Heart size={18} color={Colors.loveRed} />
            <TextInput
              style={styles.input}
              placeholder="e.g. Sri 💖, My Queen, Babe..."
              placeholderTextColor={Colors.textMuted}
              value={nickname}
              onChangeText={setNickname}
            />
          </View>

          <Text style={styles.label}>Mobile Number (for Login) *</Text>
          <View style={styles.inputContainer}>
            <Phone size={18} color={Colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="e.g. 9876543210"
              placeholderTextColor={Colors.textMuted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <Text style={styles.label}>Create Password *</Text>
          <View style={styles.inputContainer}>
            <Lock size={18} color={Colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Text style={styles.label}>Partner's Couple Code (optional if joining)</Text>
          <View style={styles.inputContainer}>
            <Sparkles size={18} color={Colors.gold} />
            <TextInput
              style={styles.input}
              placeholder="e.g. CF-8X7K (leave blank to get a new code)"
              placeholderTextColor={Colors.textMuted}
              value={coupleCode}
              onChangeText={setCoupleCode}
              autoCapitalize="characters"
            />
          </View>
        </View>

        <GradientButton
          title="Continue to Pair Partner →"
          onPress={handleRegister}
          loading={loading}
          style={styles.continueBtn}
        />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already registered? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  stepText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.semibold,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 150,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  errorBox: {
    backgroundColor: '#FFEBF0',
    padding: Spacing.sm,
    borderRadius: Spacing.borderRadius.md,
    marginBottom: Spacing.md,
  },
  errorText: {
    color: Colors.loveRed,
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.semibold,
  },
  form: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
  },
  continueBtn: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  footerText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  footerLink: {
    fontSize: Typography.sizes.sm,
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
});
