import React, { useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { CoupleProvider, useCouple } from './src/context/CoupleContext';
import { PremiumProvider, usePremium } from './src/context/PremiumContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { FloatingHearts } from './src/components/common/FloatingHearts';
import { AmoraPremiumModal } from './src/components/premium/AmoraPremiumModal';
import { StyleSheet, View, TouchableOpacity, Text, useWindowDimensions, Platform } from 'react-native';
import { Colors } from './src/theme/colors';
import { triggerHaptic } from './src/utils/haptics';
import { Smartphone, Monitor, Crown, Sparkles, Heart } from 'lucide-react-native';

const MainContent: React.FC<{ isDesktopWide: boolean; viewMode: 'MOBILE' | 'EXPANDED'; onToggleView: () => void }> = ({
  isDesktopWide,
  viewMode,
  onToggleView,
}) => {
  const { showHeartShower, triggerHeartCelebration } = useCouple();
  const { isPremium, openPaywall, priceDisplay } = usePremium();

  // Trigger exuberant Teddy Bear & Love Symbol spam upon opening the app
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerHaptic('heartbeat');
      triggerHeartCelebration();
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.outerBackground, isDesktopWide && styles.desktopOuter]}>
      {/* Top Desktop Bar (Only visible on wide desktop screens) */}
      {isDesktopWide && (
        <View style={styles.desktopTopNav}>
          <View style={styles.desktopBrandRow}>
            <Heart size={20} color={Colors.loveRed} fill={Colors.loveRed} />
            <Text style={styles.desktopBrandTitle}>Couple-Friendly</Text>
            <View style={styles.webTag}>
              <Text style={styles.webTagText}>Web Edition</Text>
            </View>
          </View>

          <View style={styles.desktopActions}>
            <TouchableOpacity
              style={styles.desktopViewToggle}
              onPress={onToggleView}
              activeOpacity={0.8}
            >
              {viewMode === 'MOBILE' ? (
                <>
                  <Smartphone size={15} color={Colors.primaryDark} />
                  <Text style={styles.desktopToggleText}>Phone Mode (460px)</Text>
                </>
              ) : (
                <>
                  <Monitor size={15} color={Colors.primaryDark} />
                  <Text style={styles.desktopToggleText}>Expanded Mode</Text>
                </>
              )}
            </TouchableOpacity>

            {!isPremium && (
              <TouchableOpacity
                style={styles.desktopVipBtn}
                onPress={() => openPaywall('Couple-Friendly VIP Pass')}
                activeOpacity={0.8}
              >
                <Crown size={14} color="#8A5D00" />
                <Text style={styles.desktopVipText}>VIP ({priceDisplay})</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Main Application Container */}
      <View
        style={[
          styles.appContainer,
          isDesktopWide && viewMode === 'MOBILE' && styles.phoneFrameContainer,
          isDesktopWide && viewMode === 'EXPANDED' && styles.expandedFrameContainer,
        ]}
      >
        <RootNavigator />

        {/* Floating Teddy & Love Spam Burst Component */}
        <FloatingHearts visible={showHeartShower} count={38} />

        {/* Floating Quick Love Sparks / VIP Button */}
        <TouchableOpacity
          style={[styles.floatingLoveBtn, isPremium && styles.floatingVipBtn]}
          onPress={() => {
            if (!isPremium) {
              openPaywall('Couple-Friendly VIP Pass');
            } else {
              triggerHaptic('heavy');
              triggerHeartCelebration();
            }
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.floatingLoveEmoji}>{isPremium ? '👑💖' : '🧸✨'}</Text>
        </TouchableOpacity>

        {/* Global VIP Paywall Modal */}
        <AmoraPremiumModal />
      </View>
    </View>
  );
};

export default function App() {
  const { width } = useWindowDimensions();
  const isDesktopWide = Platform.OS === 'web' && width > 768;
  const [viewMode, setViewMode] = useState<'MOBILE' | 'EXPANDED'>('MOBILE');

  const toggleViewMode = () => {
    triggerHaptic('light');
    setViewMode(prev => (prev === 'MOBILE' ? 'EXPANDED' : 'MOBILE'));
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" backgroundColor={Colors.background} />
        <AuthProvider>
          <CoupleProvider>
            <PremiumProvider>
              <NavigationContainer>
                <MainContent
                  isDesktopWide={isDesktopWide}
                  viewMode={viewMode}
                  onToggleView={toggleViewMode}
                />
              </NavigationContainer>
            </PremiumProvider>
          </CoupleProvider>
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  outerBackground: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  desktopOuter: {
    backgroundColor: '#FFF0F5',
    alignItems: 'center',
  },
  desktopTopNav: {
    width: '100%',
    height: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#FFEBF2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 100,
  },
  desktopBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  desktopBrandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2D3436',
  },
  webTag: {
    backgroundColor: '#FFEBF2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  webTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  desktopActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  desktopViewToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FAF5F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFCCD8',
  },
  desktopToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  desktopVipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  desktopVipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A5D00',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.background,
    position: 'relative',
  },
  phoneFrameContainer: {
    maxWidth: 460,
    width: '100%',
    height: '100%',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#FFE0EB',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 8,
  },
  expandedFrameContainer: {
    maxWidth: 900,
    width: '100%',
    height: '100%',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#FFE0EB',
  },
  floatingLoveBtn: {
    position: 'absolute',
    bottom: 80,
    right: 18,
    backgroundColor: '#FFFFFF',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFEBF2',
    zIndex: 999,
  },
  floatingVipBtn: {
    borderColor: '#FFD700',
    backgroundColor: '#FFFDF0',
  },
  floatingLoveEmoji: {
    fontSize: 20,
  },
});
