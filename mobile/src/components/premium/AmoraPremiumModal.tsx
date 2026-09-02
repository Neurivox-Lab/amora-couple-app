import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../common/GradientButton';
import { usePremium } from '../../context/PremiumContext';
import { Crown, Sparkles, Check, X, Heart, Flame, ShieldCheck, Zap, Star, Gift } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

const { width } = Dimensions.get('window');

const VIP_PERKS = [
  { icon: '🎮', title: 'Unlock All 30 Couple Arcade Games', desc: 'Ludo Supreme 4P, 3D Neon Car Racing, Snakes & Ladders Royale' },
  { icon: '🧠', title: 'Unlock All 500+ Deep Couple Quizzes', desc: 'Access 12 relationship categories with sync match reveal' },
  { icon: '🎨', title: 'Live Shared Touch Canvas & Heartbeat Bursts', desc: 'Real-time collaborative drawing with synchronized haptics' },
  { icon: '🔐', title: 'Secret Love Vault & Wax-Sealed Time Capsules', desc: 'Lock emotional letters & future anniversary milestone surprises' },
  { icon: '🎵', title: 'All 6 Couple Lofi & Ambiance Radio Channels', desc: 'Midnight Café, Rain on Window, Fireplace, Sensual Sax' },
  { icon: '🌙', title: 'Bedtime Sync & Calming Sleep Stories', desc: 'Romantic audio stories to drift into sweet dreams together' },
  { icon: '📸', title: 'Unlimited Vintage Polaroid Photo Booth', desc: 'Custom tape stickers & digital memory corkboard prints' },
  { icon: '👑', title: 'Golden VIP Crown Profile Badges', desc: 'Exclusive VIP flair next to your & your partner\'s names' },
];

export const AmoraPremiumModal: React.FC = () => {
  const {
    isPremium,
    showPaywall,
    lockedFeatureName,
    currency,
    priceDisplay,
    originalPriceDisplay,
    setCurrency,
    unlockPremium,
    closePaywall,
  } = usePremium();

  const [isProcessing, setIsProcessing] = useState(false);
  const [successCelebration, setSuccessCelebration] = useState(false);

  if (!showPaywall) return null;

  const handleSubscribe = async () => {
    triggerHaptic('heartbeat');
    setIsProcessing(true);

    // Simulate instant secure payment checkout
    setTimeout(async () => {
      setIsProcessing(false);
      setSuccessCelebration(true);
      await unlockPremium();
      setTimeout(() => {
        setSuccessCelebration(false);
      }, 2500);
    }, 1200);
  };

  return (
    <Modal visible={showPaywall} animationType="slide" transparent onRequestClose={closePaywall}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={closePaywall}>
            <X size={20} color={Colors.textPrimary} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {/* Golden Crown Header */}
            <View style={styles.crownCircle}>
              <Crown size={38} color={Colors.gold} fill="#FFD700" />
            </View>

            <View style={styles.titleArea}>
              <View style={styles.badgePill}>
                <Sparkles size={12} color={Colors.primaryDark} />
                <Text style={styles.badgePillText}>LIFETIME COUPLE PASS</Text>
              </View>
              <Text style={styles.mainTitle}>Couple-Friendly VIP 👑</Text>
              <Text style={styles.subTitle}>
                {lockedFeatureName
                  ? `Unlock ${lockedFeatureName} and all 30 games, 500 quizzes & secret tools for both of you!`
                  : 'One pass unlocks everything forever for both you & your partner!'}
              </Text>
            </View>

            {/* Currency Selector (India ₹99 vs International $15) */}
            <View style={styles.currencyToggleRow}>
              <TouchableOpacity
                style={[styles.currencyBtn, currency === 'INR' && styles.currencyBtnActive]}
                onPress={() => {
                  triggerHaptic('light');
                  setCurrency('INR');
                }}
              >
                <Text style={[styles.currencyText, currency === 'INR' && styles.currencyTextActive]}>
                  🇮🇳 India (₹99)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.currencyBtn, currency === 'USD' && styles.currencyBtnActive]}
                onPress={() => {
                  triggerHaptic('light');
                  setCurrency('USD');
                }}
              >
                <Text style={[styles.currencyText, currency === 'USD' && styles.currencyTextActive]}>
                  🌍 International ($15)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Pricing Box */}
            <View style={styles.pricingBox}>
              <View style={styles.saveTag}>
                <Text style={styles.saveTagText}>
                  {currency === 'INR' ? '🔥 80% OFF SPECIAL LAUNCH' : '🔥 70% OFF LAUNCH PASS'}
                </Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.originalPrice}>{originalPriceDisplay}</Text>
                <Text style={styles.currentPrice}>{priceDisplay}</Text>
                <Text style={styles.pricePeriod}>/ Lifetime Couple Access</Text>
              </View>
              <Text style={styles.singlePaymentNote}>
                ✨ 1 Single payment unlocks all features on BOTH partners' phones forever.
              </Text>
            </View>

            {/* Perks List */}
            <Text style={styles.perksHeader}>Everything Included in VIP:</Text>
            <View style={styles.perksList}>
              {VIP_PERKS.map((perk, idx) => (
                <View key={idx} style={styles.perkItem}>
                  <Text style={styles.perkEmoji}>{perk.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.perkTitle}>{perk.title}</Text>
                    <Text style={styles.perkDesc}>{perk.desc}</Text>
                  </View>
                  <Check size={16} color={Colors.emeraldGreen} />
                </View>
              ))}
            </View>

            {/* Trust Badges */}
            <View style={styles.trustRow}>
              <View style={styles.trustItem}>
                <ShieldCheck size={14} color={Colors.textSecondary} />
                <Text style={styles.trustText}>Secure Checkout</Text>
              </View>
              <View style={styles.trustItem}>
                <Heart size={14} color={Colors.loveRed} />
                <Text style={styles.trustText}>Both Partners Included</Text>
              </View>
            </View>
          </ScrollView>

          {/* Sticky Checkout CTA */}
          <View style={styles.ctaBox}>
            {successCelebration ? (
              <View style={styles.successBox}>
                <Text style={styles.successEmoji}>🎉👑💖</Text>
                <Text style={styles.successText}>Welcome to Couple-Friendly VIP!</Text>
                <Text style={styles.successSub}>All 30 games, 500 quizzes & tools unlocked!</Text>
              </View>
            ) : (
              <GradientButton
                title={isProcessing ? "Activating VIP Pass... ✨" : `Get Couple-Friendly VIP • ${priceDisplay}`}
                onPress={handleSubscribe}
                loading={isProcessing}
                style={styles.payBtn}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  modalCard: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    paddingTop: Spacing.lg,
    borderWidth: 2,
    borderColor: '#FFE082',
    position: 'relative',
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF5F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    alignItems: 'center',
  },
  crownCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF9E6',
    borderWidth: 2.5,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: Spacing.xs,
  },
  titleArea: {
    alignItems: 'center',
    marginVertical: 4,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF0C2',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Spacing.borderRadius.full,
    marginBottom: 4,
  },
  badgePillText: {
    fontSize: 9,
    fontWeight: Typography.weights.heavy,
    color: '#8A5D00',
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  subTitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 16,
    maxWidth: 290,
  },
  currencyToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#FAF5F7',
    borderRadius: Spacing.borderRadius.full,
    padding: 3,
    marginVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '100%',
  },
  currencyBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: Spacing.borderRadius.full,
    alignItems: 'center',
  },
  currencyBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  currencyText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  currencyTextActive: {
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
  pricingBox: {
    width: '100%',
    backgroundColor: '#FFFDF5',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFE082',
    marginVertical: Spacing.xs,
  },
  saveTag: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Spacing.borderRadius.full,
    marginBottom: 4,
  },
  saveTagText: {
    fontSize: 9,
    fontWeight: Typography.weights.heavy,
    color: '#FFFFFF',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  originalPrice: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  currentPrice: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  pricePeriod: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  singlePaymentNote: {
    fontSize: Typography.sizes.xs - 2,
    color: Colors.emeraldGreen,
    fontWeight: Typography.weights.bold,
    marginTop: 4,
    textAlign: 'center',
  },
  perksHeader: {
    alignSelf: 'flex-start',
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
    marginBottom: 6,
  },
  perksList: {
    width: '100%',
    gap: 6,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#FAF5F7',
    padding: 8,
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  perkEmoji: {
    fontSize: 18,
  },
  perkTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  perkDesc: {
    fontSize: 9,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginVertical: Spacing.sm,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustText: {
    fontSize: Typography.sizes.xs - 2,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  ctaBox: {
    padding: Spacing.md,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  payBtn: {
    width: '100%',
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  successEmoji: {
    fontSize: 28,
  },
  successText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.heavy,
    color: Colors.emeraldGreen,
  },
  successSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
});
