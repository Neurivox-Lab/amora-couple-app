import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { triggerHaptic } from '../utils/haptics';

interface PremiumContextType {
  isPremium: boolean;
  currency: 'INR' | 'USD';
  priceDisplay: string;
  originalPriceDisplay: string;
  showPaywall: boolean;
  lockedFeatureName: string | null;
  setCurrency: (c: 'INR' | 'USD') => void;
  openPaywall: (featureName?: string) => void;
  closePaywall: () => void;
  unlockPremium: () => Promise<void>;
  resetPremium: () => Promise<void>;
  isFeatureLocked: (featureKey: string) => boolean;
}

const PREMIUM_STORAGE_KEY = '@amora_is_premium';
const CURRENCY_STORAGE_KEY = '@amora_currency';

// Free vs Premium feature permissions
const FREE_GAMES = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10'];
const FREE_QUIZ_CATEGORIES = ['DAILY_VIBES', 'FOOD_TASTE', 'FAVORITE_MEMORIES'];

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [currency, setCurrencyState] = useState<'INR' | 'USD'>('INR');
  const [showPaywall, setShowPaywall] = useState<boolean>(false);
  const [lockedFeatureName, setLockedFeatureName] = useState<string | null>(null);

  useEffect(() => {
    loadSavedState();
  }, []);

  const loadSavedState = async () => {
    try {
      const savedPrem = await AsyncStorage.getItem(PREMIUM_STORAGE_KEY);
      if (savedPrem === 'true') {
        setIsPremium(true);
      }
      const savedCurr = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
      if (savedCurr === 'INR' || savedCurr === 'USD') {
        setCurrencyState(savedCurr);
      }
    } catch (e) {
      console.warn('Failed to load premium state', e);
    }
  };

  const setCurrency = async (curr: 'INR' | 'USD') => {
    setCurrencyState(curr);
    await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, curr);
  };

  const openPaywall = (featureName?: string) => {
    triggerHaptic('medium');
    setLockedFeatureName(featureName || 'Amora VIP Couple Pass');
    setShowPaywall(true);
  };

  const closePaywall = () => {
    setShowPaywall(false);
    setLockedFeatureName(null);
  };

  const unlockPremium = async () => {
    triggerHaptic('success');
    setIsPremium(true);
    await AsyncStorage.setItem(PREMIUM_STORAGE_KEY, 'true');
    setShowPaywall(false);
  };

  const resetPremium = async () => {
    setIsPremium(false);
    await AsyncStorage.removeItem(PREMIUM_STORAGE_KEY);
  };

  const isFeatureLocked = (featureKey: string): boolean => {
    if (isPremium) return false;

    // Specific premium locked features
    if (featureKey.startsWith('game_')) {
      const gameId = featureKey.replace('game_', '');
      return !FREE_GAMES.includes(gameId);
    }

    if (featureKey.startsWith('quiz_cat_')) {
      const catId = featureKey.replace('quiz_cat_', '');
      return !FREE_QUIZ_CATEGORIES.includes(catId);
    }

    // Gated luxury features
    const gatedFeatures = ['DRAW_TOGETHER', 'LOVE_VAULT', 'BEDTIME_AUDIO', 'POLAROID_UNLIMITED', 'LOFI_RADIO_ALL'];
    return gatedFeatures.includes(featureKey);
  };

  const priceDisplay = currency === 'INR' ? '₹99' : '$15';
  const originalPriceDisplay = currency === 'INR' ? '₹499' : '$49';

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        currency,
        priceDisplay,
        originalPriceDisplay,
        showPaywall,
        lockedFeatureName,
        setCurrency,
        openPaywall,
        closePaywall,
        unlockPremium,
        resetPremium,
        isFeatureLocked,
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};
