import React, { createContext, useContext, useState, useEffect } from 'react';
import { Couple, Nudge } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { triggerHaptic } from '../utils/haptics';

interface CoupleContextType {
  couple: Couple | null;
  activeNudge: Nudge | null;
  showHeartShower: boolean;
  updateMood: (mood: string) => Promise<void>;
  sendVirtualNudge: (type: 'HUG' | 'KISS' | 'HEARTBEAT' | 'MISS_YOU', message?: string) => Promise<void>;
  pairPartner: (code: string, startDate?: string) => Promise<Couple>;
  dismissNudge: () => void;
  triggerHeartCelebration: () => void;
}

const CoupleContext = createContext<CoupleContextType | undefined>(undefined);

export const CoupleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { couple: authCouple, refreshCouple } = useAuth();
  const [couple, setCouple] = useState<Couple | null>(authCouple);
  const [activeNudge, setActiveNudge] = useState<Nudge | null>(null);
  const [showHeartShower, setShowHeartShower] = useState(false);

  useEffect(() => {
    setCouple(authCouple);
  }, [authCouple]);

  const updateMood = async (mood: string) => {
    triggerHaptic('medium');
    try {
      const updated = await api.updateMood(mood);
      if (updated) setCouple(updated);
    } catch (e) {
      console.warn('Failed to update mood', e);
    }
  };

  const sendVirtualNudge = async (type: 'HUG' | 'KISS' | 'HEARTBEAT' | 'MISS_YOU', message?: string) => {
    triggerHaptic('heartbeat');
    triggerHeartCelebration();
    try {
      const nudge = await api.sendNudge(type, message);
      setActiveNudge(nudge);
      await refreshCouple();
    } catch (e) {
      console.warn('Failed to send nudge', e);
    }
  };

  const pairPartner = async (code: string, startDate?: string) => {
    triggerHaptic('success');
    const paired = await api.pairWithCode(code, startDate);
    setCouple(paired);
    triggerHeartCelebration();
    return paired;
  };

  const triggerHeartCelebration = () => {
    setShowHeartShower(true);
    setTimeout(() => setShowHeartShower(false), 3500);
  };

  const dismissNudge = () => {
    setActiveNudge(null);
  };

  return (
    <CoupleContext.Provider
      value={{
        couple,
        activeNudge,
        showHeartShower,
        updateMood,
        sendVirtualNudge,
        pairPartner,
        dismissNudge,
        triggerHeartCelebration,
      }}
    >
      {children}
    </CoupleContext.Provider>
  );
};

export const useCouple = () => {
  const context = useContext(CoupleContext);
  if (!context) throw new Error('useCouple must be used within a CoupleProvider');
  return context;
};
