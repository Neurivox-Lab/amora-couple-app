import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Sparkles, Heart } from 'lucide-react-native';

const LOVE_LANGUAGES = [
  { name: 'Quality Time ⏳', score1: 95, score2: 90, color: '#FF6B8B' },
  { name: 'Physical Touch 🫂', score1: 85, score2: 95, color: '#FF8E53' },
  { name: 'Words of Affirmation 💌', score1: 90, score2: 80, color: '#A18CD1' },
  { name: 'Acts of Service ☕', score1: 75, score2: 85, color: '#2ED573' },
  { name: 'Receiving Gifts 🎁', score1: 70, score2: 65, color: '#FFD166' },
];

export const LoveRadar: React.FC<{ partner1Name: string; partner2Name: string }> = ({
  partner1Name,
  partner2Name,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Sparkles size={14} color={Colors.primary} />
          <Text style={styles.badgeText}>Love Languages & Harmony</Text>
        </View>
        <Text style={styles.scoreText}>94% Match ❤️</Text>
      </View>

      <Text style={styles.subtitle}>
        How both of you naturally give and receive love in your relationship:
      </Text>

      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
          <Text style={styles.legendText}>{partner1Name}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4FACFE' }]} />
          <Text style={styles.legendText}>{partner2Name}</Text>
        </View>
      </View>

      {/* Language Breakdown Bars */}
      <View style={styles.barsList}>
        {LOVE_LANGUAGES.map((lang) => (
          <View key={lang.name} style={styles.langRow}>
            <View style={styles.langTitleRow}>
              <Text style={styles.langName}>{lang.name}</Text>
              <Text style={styles.langValues}>
                {lang.score1}% / {lang.score2}%
              </Text>
            </View>

            {/* Double Bar Visual */}
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${lang.score1}%`, backgroundColor: Colors.primary }]} />
            </View>
            <View style={[styles.barTrack, styles.partnerBarTrack]}>
              <View style={[styles.barFill, { width: `${lang.score2}%`, backgroundColor: '#4FACFE' }]} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#FFEBF0',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    marginVertical: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFEBF2',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.full,
  },
  badgeText: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  scoreText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.heavy,
    color: Colors.loveRed,
  },
  subtitle: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  legendRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  barsList: {
    gap: Spacing.md,
  },
  langRow: {
    gap: 4,
  },
  langTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  langName: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
  },
  langValues: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.bold,
  },
  barTrack: {
    height: 6,
    backgroundColor: '#FAF0F4',
    borderRadius: 3,
    overflow: 'hidden',
  },
  partnerBarTrack: {
    backgroundColor: '#F0F8FF',
    marginTop: 2,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
});
