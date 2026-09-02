import React, { useEffect } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { CoupleProvider, useCouple } from './src/context/CoupleContext';
import { PremiumProvider, usePremium } from './src/context/PremiumContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { FloatingHearts } from './src/components/common/FloatingHearts';
import { AmoraPremiumModal } from './src/components/premium/AmoraPremiumModal';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Colors } from './src/theme/colors';
import { triggerHaptic } from './src/utils/haptics';

const MainContent: React.FC = () => {
  const { showHeartShower, triggerHeartCelebration } = useCouple();
  const { isPremium, openPaywall } = usePremium();

  // Trigger exuberant Teddy Bear & Love Symbol spam upon opening the app
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerHaptic('heartbeat');
      triggerHeartCelebration();
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.appContainer}>
      <RootNavigator />

      {/* Floating Teddy & Love Spam Burst Component */}
      <FloatingHearts visible={showHeartShower} count={38} />

      {/* Floating Quick Love Sparks / VIP Button */}
      <TouchableOpacity
        style={[styles.floatingLoveBtn, isPremium && styles.floatingVipBtn]}
        onPress={() => {
          if (!isPremium) {
            openPaywall('Amora VIP Couple Pass');
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
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" backgroundColor={Colors.background} />
        <AuthProvider>
          <CoupleProvider>
            <PremiumProvider>
              <NavigationContainer>
                <MainContent />
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
  appContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    position: 'relative',
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
