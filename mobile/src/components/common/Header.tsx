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
    openPaywall('Amora VIP Couple Pass');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.titleContainer}>
          {title ? (
            <>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </>
          ) : (
            <View style={styles.brandContainer}>
              <View style={styles.brandTitleRow}>
                <Text style={styles.brandTitle}>Amora <Text style={styles.heartIcon}>❤️</Text></Text>
                {isPremium && (
                  <View style={styles.vipTagPill}>
                    <Crown size={10} color="#8A5D00" />
                    <Text style={styles.vipTagText}>VIP</Text>
                  </View>
                )}
              </View>
              <Text style={styles.brandSubtitle}>
                {user ? `Hi, ${user.nickname || user.name}` : 'Our Private Space'}
              </Text>
            </View>
          )}
        </View>

        {showStats && (
          <View style={styles.statsRow}>
            {/* VIP Upgrade Pill */}
            {!isPremium && (
              <TouchableOpacity style={styles.vipPill} onPress={handleVipPress} activeOpacity={0.8}>
                <Crown size={12} color="#8A5D00" />
                <Text style={styles.vipPillText}>VIP ({priceDisplay})</Text>
              </TouchableOpacity>
            )}

            {/* Lofi & Ambient Couple Radio Mini Button */}
            <CoupleRadioPlayer />

            {/* Direct Couple Chat Button */}
            {onOpenChat && (
              <TouchableOpacity style={styles.chatButton} onPress={handleChatPress} activeOpacity={0.7}>
                <MessageCircle size={18} color={Colors.primary} fill="#FFEBF2" />
                <View style={styles.chatBadgeDot} />
              </TouchableOpacity>
            )}

            {/* Streak Badge */}
            <View style={styles.statBadge}>
              <Flame size={18} color="#FF7A00" fill="#FF7A00" />
              <Text style={styles.statText}>{couple?.streakCount || 1}d</Text>
            </View>

            {/* Total Hearts Currency */}
            <TouchableOpacity style={[styles.statBadge, styles.heartBadge]} onPress={handleHeartPress} activeOpacity={0.7}>
              <Heart size={16} color={Colors.loveRed} fill={Colors.loveRed} />
              <Text style={[styles.statText, { color: Colors.loveRed }]}>{couple?.totalHearts || 50}</Text>
            </TouchableOpacity>

            {/* Switch User Demo Switcher */}
            <TouchableOpacity 
              style={[styles.avatarButton, user?.id === 2 && styles.avatarButtonPartner]} 
              onPress={handleToggleUser}
              activeOpacity={0.7}
            >
              <Text style={styles.avatarEmoji}>{user?.id === 1 ? '👩' : '👨'}</Text>
              <View style={styles.switchBadge}>
                <UserCheck size={10} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.background,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  brandContainer: {
    flexDirection: 'column',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.heavy,
    color: Colors.primaryDark,
    letterSpacing: -0.5,
  },
  heartIcon: {
    fontSize: Typography.sizes.lg,
  },
  vipTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#FFF0C2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Spacing.borderRadius.sm,
    borderWidth: 0.5,
    borderColor: '#FFD700',
  },
  vipTagText: {
    fontSize: 9,
    fontWeight: Typography.weights.heavy,
    color: '#8A5D00',
  },
  vipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFF0C2',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: Spacing.borderRadius.full,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  vipPillText: {
    fontSize: 10,
    fontWeight: Typography.weights.heavy,
    color: '#8A5D00',
  },
  brandSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
    marginTop: 1,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
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
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.loveRed,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: Spacing.borderRadius.full,
    gap: 2,
  },
  heartBadge: {
    backgroundColor: '#FFEBF0',
  },
  statText: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.bold,
    color: '#D35400',
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
});
