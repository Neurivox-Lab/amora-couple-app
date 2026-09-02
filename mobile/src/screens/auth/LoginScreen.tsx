import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../../components/common/GradientButton';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, User, Lock, Sparkles } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!identifier.trim()) {
      setError('Please enter your email or phone number');
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

  const handleQuickDemo = async (type: 'srinija' | 'partner') => {
    triggerHaptic('heavy');
    setLoading(true);
    try {
      if (type === 'srinija') {
        await login('srinija@amora.love', 'Password123!');
      } else {
        await login('partner@amora.love', 'Password123!');
      }
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
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <Text style={styles.title}>Welcome Back ❤️</Text>
        <Text style={styles.subtitle}>Log in to enter your shared couple sanctuary.</Text>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Text style={styles.label}>Email or Phone Number</Text>
          <View style={styles.inputContainer}>
            <User size={18} color={Colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="srinija@amora.love"
              placeholderTextColor={Colors.textMuted}
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Lock size={18} color={Colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <GradientButton
          title="Sign In ❤️"
          onPress={handleLogin}
          loading={loading}
          style={styles.loginBtn}
        />

        {/* 1-Tap Quick Demo Logins for Pair Testing */}
        <View style={styles.demoSection}>
          <View style={styles.demoHeader}>
            <Sparkles size={14} color={Colors.gold} />
            <Text style={styles.demoHeaderText}>Quick 1-Tap Demo Switcher:</Text>
          </View>
          <View style={styles.demoRow}>
            <TouchableOpacity style={styles.demoBtn} onPress={() => handleQuickDemo('srinija')}>
              <Text style={styles.demoBtnText}>👩 Log In as Srinija</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.demoBtn, styles.demoBtnPartner]} onPress={() => handleQuickDemo('partner')}>
              <Text style={styles.demoBtnText}>👨 Log In as Partner</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>New to Amora? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Create Account</Text>
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
    marginBottom: Spacing.md,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  scroll: {
    flex: 1,
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
  loginBtn: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  demoSection: {
    backgroundColor: '#FFF9EB',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#FFE5A3',
    marginBottom: Spacing.lg,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  demoHeaderText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: '#B7791F',
  },
  demoRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  demoBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  demoBtnPartner: {
    borderColor: '#4FACFE',
  },
  demoBtnText: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
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
