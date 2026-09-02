import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../../components/common/GradientButton';
import { Heart, Sparkles, ShieldCheck, Users } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface WelcomeScreenProps {
  navigation: any;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Hero Logo Section */}
      <View style={styles.heroSection}>
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../../assets/icon.png')}
            style={styles.appLogo}
          />
        </View>
        <View style={styles.badgeRow}>
          <Sparkles size={14} color={Colors.primary} />
          <Text style={styles.badgeText}>#1 Couple-Friendly Companion</Text>
        </View>
      </View>

      {/* Brand & Value Proposition */}
      <View style={styles.textSection}>
        <Text style={styles.title}>Couple-Friendly <Text style={styles.heart}>❤️</Text></Text>
        <Text style={styles.subtitle}>Our Private Couple Space & Games</Text>
        <Text style={styles.tagline}>
          A private world for you & your partner to play seductive games, sync moods, plan dreamy dates, and preserve memories together.
        </Text>

        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🎮</Text>
            <Text style={styles.featureText}>Synchronized Games</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>💌</Text>
            <Text style={styles.featureText}>Virtual Hugs</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🤖</Text>
            <Text style={styles.featureText}>Cupid AI</Text>
          </View>
        </View>

        <View style={styles.securityPill}>
          <ShieldCheck size={14} color={Colors.emeraldGreen} />
          <Text style={styles.securityText}>100% Private • Just for the Two of You</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionSection}>
        <GradientButton
          title="Get Started Together ❤️"
          onPress={() => navigation.navigate('Register')}
          style={styles.getStartedBtn}
        />

        <GradientButton
          title="Already paired? Sign In"
          onPress={() => navigation.navigate('Login')}
          variant="outline"
          style={styles.signInBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  logoWrapper: {
    width: 140,
    height: 140,
    borderRadius: 36,
    overflow: 'hidden',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginBottom: Spacing.sm,
  },
  appLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFEBF2',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Spacing.borderRadius.full,
    marginTop: 4,
  },
  badgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  textSection: {
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  title: {
    fontSize: Typography.sizes.hero,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
    marginTop: -2,
    marginBottom: Spacing.xs,
  },
  heart: {
    fontSize: Typography.sizes.xxl,
  },
  tagline: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.sm,
  },
  featuresRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  featureItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureEmoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  featureText: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  securityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.md,
  },
  securityText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  actionSection: {
    gap: Spacing.sm,
  },
  getStartedBtn: {
    width: '100%',
  },
  signInBtn: {
    width: '100%',
  },
});
