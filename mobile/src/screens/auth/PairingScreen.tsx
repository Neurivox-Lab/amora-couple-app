import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../../components/common/GradientButton';
import { useAuth } from '../../context/AuthContext';
import { useCouple } from '../../context/CoupleContext';
import { Heart, Copy, Share2, Sparkles, Check, Users } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

interface PairingScreenProps {
  navigation: any;
}

export const PairingScreen: React.FC<PairingScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { couple, pairPartner } = useCouple();
  const [mode, setMode] = useState<'INVITE' | 'ENTER'>('INVITE');
  const [partnerCode, setPartnerCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const coupleCode = couple?.coupleCode || 'AM-8X7K';

  const handleCopyCode = () => {
    triggerHaptic('success');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePairWithCode = async () => {
    if (!partnerCode.trim()) {
      setError('Please enter your partner’s couple code');
      return;
    }
    setError(null);
    setLoading(true);
    triggerHaptic('heartbeat');
    try {
      await pairPartner(partnerCode.trim());
      // Paired successfully!
    } catch (e: any) {
      setError(e.message || 'Invalid code. Check with your partner.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Animated Couple Header */}
        <View style={styles.heroSection}>
          <View style={styles.heartPulse}>
            <Heart size={44} color="#FFFFFF" fill="#FFFFFF" />
          </View>
          <Text style={styles.title}>Connect With Your Partner 💕</Text>
          <Text style={styles.subtitle}>
            One of you shares a code, the other enters it. Once paired, your private couple space is unlocked!
          </Text>
        </View>

        {/* Tab Toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.tabBtn, mode === 'INVITE' && styles.tabBtnActive]}
            onPress={() => {
              triggerHaptic('light');
              setMode('INVITE');
            }}
          >
            <Text style={[styles.tabText, mode === 'INVITE' && styles.tabTextActive]}>
              💌 Invite Partner
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, mode === 'ENTER' && styles.tabBtnActive]}
            onPress={() => {
              triggerHaptic('light');
              setMode('ENTER');
            }}
          >
            <Text style={[styles.tabText, mode === 'ENTER' && styles.tabTextActive]}>
              🔢 Enter Partner's Code
            </Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {mode === 'INVITE' ? (
          <View style={styles.cardSection}>
            <Text style={styles.cardHeader}>Your Secret Couple Code</Text>
            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>{coupleCode}</Text>
            </View>

            <Text style={styles.codeInstructions}>
              Send this code to your partner so they can join your shared world.
            </Text>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.copyBtn} onPress={handleCopyCode} activeOpacity={0.8}>
                {copied ? <Check size={18} color={Colors.emeraldGreen} /> : <Copy size={18} color={Colors.primary} />}
                <Text style={[styles.copyBtnText, copied && { color: Colors.emeraldGreen }]}>
                  {copied ? 'Code Copied! ✨' : 'Copy Code'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareBtn} onPress={handleCopyCode} activeOpacity={0.8}>
                <Share2 size={18} color="#FFFFFF" />
                <Text style={styles.shareBtnText}>Share Invite 📲</Text>
              </TouchableOpacity>
            </View>

            {/* Waiting Pulse */}
            <View style={styles.waitingContainer}>
              <View style={styles.pulsingDot} />
              <Text style={styles.waitingText}>Waiting for partner to enter code...</Text>
            </View>
          </View>
        ) : (
          <View style={styles.cardSection}>
            <Text style={styles.cardHeader}>Enter Partner's Code</Text>
            <Text style={styles.codeInstructions}>
              Type the 6-character code your partner sent you:
            </Text>

            <TextInput
              style={styles.codeInput}
              placeholder="e.g. AM-8X7K"
              placeholderTextColor={Colors.textMuted}
              value={partnerCode}
              onChangeText={setPartnerCode}
              autoCapitalize="characters"
              maxLength={10}
            />

            <GradientButton
              title="Connect Our Hearts ❤️"
              onPress={handlePairWithCode}
              loading={loading}
              style={styles.connectBtn}
            />
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
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  scroll: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  heartPulse: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  title: {
    fontSize: Typography.sizes.xl + 2,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
    paddingHorizontal: Spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#FAF5F7',
    borderRadius: Spacing.borderRadius.lg,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  tabText: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
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
  cardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: Spacing.xl,
  },
  cardHeader: {
    fontSize: Typography.sizes.md + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  codeContainer: {
    backgroundColor: '#FFF0F5',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Spacing.borderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    borderStyle: 'dashed',
    marginVertical: Spacing.xs,
  },
  codeText: {
    fontSize: Typography.sizes.xxl + 4,
    fontWeight: Typography.weights.heavy,
    color: Colors.primaryDark,
    letterSpacing: 4,
  },
  codeInstructions: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
  },
  copyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: Spacing.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: '#FFFFFF',
  },
  copyBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: Spacing.borderRadius.lg,
    backgroundColor: Colors.primary,
  },
  shareBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  waitingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#FFF0F5',
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  waitingText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  codeInput: {
    width: '100%',
    backgroundColor: '#FAF5F7',
    borderRadius: Spacing.borderRadius.lg,
    paddingVertical: 14,
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.heavy,
    color: Colors.primaryDark,
    textAlign: 'center',
    letterSpacing: 3,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  connectBtn: {
    width: '100%',
  },
});
