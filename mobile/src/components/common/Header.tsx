import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Flame, Heart, Sparkles, UserCheck, MessageCircle, Crown } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useCouple } from '../../context/CoupleContext';
import { usePremium } from '../../context/PremiumContext';
import { CoupleRadioPlayer } from './CoupleRadioPlayer';
import { triggerHaptic } from '../../utils/haptics';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showStats?: boolean;
  onOpenChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, showStats = true, onOpenChat }) => {
  const { user, couple, switchUserRole } = useAuth();
  const { triggerHeartCelebration } = useCouple();
  const { isPremium, openPaywall, priceDisplay } = usePremium();

  const handleToggleUser = () => {
    triggerHaptic('medium');
    if (user?.id === 1) {
      switchUserRole('partner2');
    } else {
      switchUserRole('partner1');
    }
  };

  const handleHeartPress = () => {
    triggerHaptic('heartbeat');
    triggerHeartCelebration();
  };

  const handleChatPress = () => {
    triggerHaptic('medium');
    if (onOpenChat) onOpenChat();
  };

  const handleVipPress = () => {
    triggerHaptic('light');
    openPaywall('Couple-Friendly VIP Pass');
  };

  const greetingName = user?.nickname || user?.name || 'My Love';

  return (
    <View style={styles.container}>
      {/* ROW 1: Brand Title & Top Icon Controls */}
      <View style={styles.topRow}>
        <View style={styles.titleContainer}>
          {title ? (
            <View>
              <Text style={styles.screenTitle}>{title}</Text>
              {subtitle && <Text style={styles.screenSubtitle}>{subtitle}</Text>}
            </View>
          ) : (
            <View style={styles.brandTitleRow}>
              <Text style={styles.brandTitle}>Couple-Friendly</Text>
              <Text style={styles.heartIcon}>❤️</Text>
              {isPremium && (
                <View style={styles.vipTagPill}>
                  <Crown size={10} color="#8A5D00" />
                  <Text style={styles.vipTagText}>VIP</Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.topActionsRow}>
          {/* Lofi & Ambient Couple Radio Player */}
          <CoupleRadioPlayer />

          {/* Direct Couple Chat Button */}
          {onOpenChat && (
            <TouchableOpacity style={styles.chatButton} onPress={handleChatPress} activeOpacity={0.7}>
              <MessageCircle size={18} color={Colors.primary} fill="#FFEBF2" />
              <View style={styles.chatBadgeDot} />
            </TouchableOpacity>
          )}

          {/* Switch User Avatar Button */}
          <TouchableOpacity
            style={[styles.avatarButton, user?.id === 2 && styles.avatarButtonPartner]}
            onPress={handleToggleUser}
            activeOpacity={0.7}
          >
            <Text style={styles.avatarEmoji}>{user?.id === 1 ? '👩' : '👨'}</Text>
            <View style={styles.switchBadge}>
              <UserCheck size={9} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ROW 2: Clean Subtitle Greeting & Live Couple Stats Bar */}
      {showStats && !title && (
        <View style={styles.bottomStatsRow}>
          <View style={styles.greetingPill}>
            <Text style={styles.greetingText} numberOfLines={1}>
              Hi, <Text style={styles.greetingNameText}>{greetingName}</Text> 🥰
            </Text>
          </View>

          <View style={styles.statsBadgesWrap}>
            {/* VIP Upgrade Pill if not upgraded */}
            {!isPremium && (
              <TouchableOpacity style={styles.vipPill} onPress={handleVipPress} activeOpacity={0.8}>
                <Crown size={11} color="#8A5D00" />
                <Text style={styles.vipPillText}>VIP ({priceDisplay})</Text>
              </TouchableOpacity>
            )}

            {/* Streak Badge */}
            <View style={styles.statBadge}>
              <Flame size={14} color="#FF7A00" fill="#FF7A00" />
              <Text style={styles.statText}>{couple?.streakCount || 1}d</Text>
            </View>

            {/* Hearts Badge */}
            <TouchableOpacity style={[styles.statBadge, styles.heartBadge]} onPress={handleHeartPress} activeOpacity={0.7}>
              <Heart size={13} color={Colors.loveRed} fill={Colors.loveRed} />
              <Text style={[styles.statText, { color: Colors.loveRed }]}>{couple?.totalHearts || 50}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs + 2,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#FFF0F5',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 40,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.heavy,
    color: Colors.primaryDark,
    letterSpacing: -0.3,
  },
  heartIcon: {
    fontSize: Typography.sizes.md,
  },
  screenTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  screenSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  vipTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#FFF0C2',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: Spacing.borderRadius.sm,
    borderWidth: 0.5,
    borderColor: '#FFD700',
    marginLeft: 2,
  },
  vipTagText: {
    fontSize: 9,
    fontWeight: Typography.weights.heavy,
    color: '#8A5D00',
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  chatBadgeDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.loveRed,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  avatarButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFEBF2',
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarButtonPartner: {
    borderColor: '#4FACFE',
    backgroundColor: '#E6F4FF',
  },
  avatarEmoji: {
    fontSize: 15,
  },
  switchBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.primaryDark,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 4,
    borderTopWidth: 0.5,
    borderTopColor: '#FFF5F8',
  },
  greetingPill: {
    flex: 1,
    marginRight: 6,
  },
  greetingText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  greetingNameText: {
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  statsBadgesWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  vipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFF0C2',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: Spacing.borderRadius.full,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  vipPillText: {
    fontSize: 10,
    fontWeight: Typography.weights.heavy,
    color: '#8A5D00',
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Spacing.borderRadius.full,
    gap: 2,
  },
  heartBadge: {
    backgroundColor: '#FFEBF0',
  },
  statText: {
    fontSize: Typography.sizes.xs - 2,
    fontWeight: Typography.weights.bold,
    color: '#D35400',
  },
});
