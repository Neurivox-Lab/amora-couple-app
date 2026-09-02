import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';

interface RomanticCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'glass' | 'outlined' | 'subtle';
}

export const RomanticCard: React.FC<RomanticCardProps> = ({
  children,
  style,
  variant = 'elevated',
}) => {
  return (
    <View style={[styles.card, styles[variant], style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
  },
  elevated: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#FFF0F5',
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 107, 139, 0.2)',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 5,
  },
  outlined: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  subtle: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: '#FFEBF0',
  }
});
