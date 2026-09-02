import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Couple } from '../types';
import { api } from '../services/api';
import { Storage } from '../services/storage';

interface AuthContextType {
  user: User | null;
  couple: Couple | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password?: string) => Promise<void>;
  loginCoupleDirect: (params: {
    partner1Name: string;
    partner1Nickname?: string;
    partner1Phone?: string;
    partner2Name: string;
    partner2Nickname?: string;
    partner2Phone?: string;
    daysTogether?: number;
  }) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  switchUserRole: (role: 'partner1' | 'partner2') => void;
  refreshCouple: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserSession();
  }, []);

  const loadUserSession = async () => {
    try {
      await api.init();
      const currentUser = api.getCurrentUser();
      const currentCouple = api.getCurrentCouple();

      // If user had an old legacy mock session with 428 days or placeholder email, clear it so Register/Login shows first
      if (currentCouple?.daysTogether === 428 || (currentUser && (!currentUser.phone || currentUser.email === 'srinija@amora.love'))) {
        await Storage.removeItem('current_user');
        await Storage.removeItem('current_couple');
        await Storage.removeItem('auth_token');
        setUser(null);
        setCouple(null);
      } else {
        setUser(currentUser);
        setCouple(currentCouple);
      }
    } catch (e) {
      console.warn('Error initializing session', e);
    } finally {
      setIsLoading(false);
    }
  };

  const loginCoupleDirect = async (params: {
    partner1Name: string;
    partner1Nickname?: string;
    partner1Phone?: string;
    partner2Name: string;
    partner2Nickname?: string;
    partner2Phone?: string;
    daysTogether?: number;
  }) => {
    setIsLoading(true);
    try {
      const res = await api.loginCoupleDirect(params);
      setUser(res.user);
      setCouple(res.couple);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (identifier: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(identifier, password);
      setUser(res.user);
      setCouple(res.couple);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      setUser(res.user);
      setCouple(res.couple);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    api.setToken(null);
    await Storage.clear();
    setUser(null);
    setCouple(null);
  };

  const switchUserRole = (role: 'partner1' | 'partner2') => {
    const switchedUser = api.switchDemoUser(role);
    setUser({ ...switchedUser });
  };

  const refreshCouple = async () => {
    try {
      const updated = await api.getCoupleStatus();
      if (updated) setCouple(updated);
    } catch (e) {
      console.warn('Failed to refresh couple status', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        couple,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginCoupleDirect,
        register,
        logout,
        switchUserRole,
        refreshCouple,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
