import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { Spacing } from '../../../theme/spacing';
import { Trophy, Zap, Flag, Flame, RotateCcw } from 'lucide-react-native';
import { triggerHaptic } from '../../../utils/haptics';

const { width } = Dimensions.get('window');
const TRACK_LENGTH = 100;

interface CarRacerMiniGameProps {
  partner1Name: string;
  partner2Name: string;
  onWin: (winner: string) => void;
}

export const CarRacerMiniGame: React.FC<CarRacerMiniGameProps> = ({
  partner1Name,
  partner2Name,
  onWin,
}) => {
  const [dist1, setDist1] = useState(0);
  const [dist2, setDist2] = useState(0);
  const [nitro1, setNitro1] = useState(3);
  const [nitro2, setNitro2] = useState(3);
  const [winner, setWinner] = useState<string | null>(null);

  const handleGas = (player: 'p1' | 'p2') => {
    if (winner) return;
    triggerHaptic('light');

    const step = Math.floor(Math.random() * 4) + 3;
    if (player === 'p1') {
      const next = Math.min(TRACK_LENGTH, dist1 + step);
      setDist1(next);
      if (next >= TRACK_LENGTH) handleVictory(partner1Name);
    } else {
      const next = Math.min(TRACK_LENGTH, dist2 + step);
      setDist2(next);
      if (next >= TRACK_LENGTH) handleVictory(partner2Name);
    }
  };

  const handleNitro = (player: 'p1' | 'p2') => {
    if (winner) return;
    triggerHaptic('heavy');

    if (player === 'p1' && nitro1 > 0) {
      setNitro1(prev => prev - 1);
      const next = Math.min(TRACK_LENGTH, dist1 + 12);
      setDist1(next);
      if (next >= TRACK_LENGTH) handleVictory(partner1Name);
    } else if (player === 'p2' && nitro2 > 0) {
      setNitro2(prev => prev - 1);
      const next = Math.min(TRACK_LENGTH, dist2 + 12);
      setDist2(next);
      if (next >= TRACK_LENGTH) handleVictory(partner2Name);
    }
  };

  const handleVictory = (name: string) => {
    triggerHaptic('success');
    setWinner(name);
    onWin(name);
  };

  const handleRestart = () => {
    triggerHaptic('medium');
    setDist1(0);
    setDist2(0);
    setNitro1(3);
    setNitro2(3);
    setWinner(null);
  };

  return (
    <View style={styles.container}>
      {/* Race Track Canvas */}
      <View style={styles.trackBox}>
        <View style={styles.finishBanner}>
          <Flag size={14} color="#FFFFFF" />
          <Text style={styles.finishText}>FINISH LINE</Text>
        </View>

        {/* Lane 1 (Partner 1) */}
        <View style={styles.lane}>
          <View style={styles.laneHeader}>
            <Text style={styles.carTag}>👩 {partner1Name}</Text>
            <Text style={styles.speedTag}>{dist1}% Distance</Text>
          </View>
          <View style={styles.roadStrip}>
            <View style={[styles.carPosition, { left: `${Math.min(85, dist1 * 0.85)}%` }]}>
              <Text style={styles.carEmoji}>🏎️</Text>
            </View>
          </View>
        </View>

        <View style={styles.roadDivider} />

        {/* Lane 2 (Partner 2) */}
        <View style={styles.lane}>
          <View style={styles.laneHeader}>
            <Text style={styles.carTag}>👨 {partner2Name}</Text>
            <Text style={styles.speedTag}>{dist2}% Distance</Text>
          </View>
          <View style={styles.roadStrip}>
            <View style={[styles.carPosition, { left: `${Math.min(85, dist2 * 0.85)}%` }]}>
              <Text style={styles.carEmoji}>🚗</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Winner Banner */}
      {winner ? (
        <View style={styles.winnerCard}>
          <Trophy size={32} color={Colors.gold} />
          <Text style={styles.winnerText}>🏆 {winner} Won the Grand Prix! (+30 ❤️)</Text>
          <TouchableOpacity style={styles.resetBtn} onPress={handleRestart}>
            <RotateCcw size={16} color="#FFFFFF" />
            <Text style={styles.resetBtnText}>Rematch Race</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Split Dual Controls */
        <View style={styles.controlsRow}>
          {/* P1 Controls */}
          <View style={styles.playerControls}>
            <Text style={styles.controlHeader}>👩 {partner1Name}</Text>
            <TouchableOpacity
              style={[styles.gasBtn, styles.gasBtnP1]}
              onPress={() => handleGas('p1')}
              activeOpacity={0.7}
            >
              <Text style={styles.gasBtnText}>GAS ⚡</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.nitroBtn, nitro1 === 0 && styles.nitroDisabled]}
              onPress={() => handleNitro('p1')}
              disabled={nitro1 === 0}
            >
              <Flame size={14} color="#FFFFFF" />
              <Text style={styles.nitroText}>NITRO ({nitro1})</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.controlDivider} />

          {/* P2 Controls */}
          <View style={styles.playerControls}>
            <Text style={styles.controlHeader}>👨 {partner2Name}</Text>
            <TouchableOpacity
              style={[styles.gasBtn, styles.gasBtnP2]}
              onPress={() => handleGas('p2')}
              activeOpacity={0.7}
            >
              <Text style={styles.gasBtnText}>GAS ⚡</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.nitroBtn, nitro2 === 0 && styles.nitroDisabled]}
              onPress={() => handleNitro('p2')}
              disabled={nitro2 === 0}
            >
              <Flame size={14} color="#FFFFFF" />
              <Text style={styles.nitroText}>NITRO ({nitro2})</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  trackBox: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: '#334155',
    marginBottom: Spacing.md,
    position: 'relative',
  },
  finishBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Spacing.borderRadius.sm,
    marginBottom: Spacing.xs,
  },
  finishText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: Typography.weights.heavy,
  },
  lane: {
    marginVertical: 4,
  },
  laneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  carTag: {
    color: '#F8FAFC',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  speedTag: {
    color: '#94A3B8',
    fontSize: Typography.sizes.xs - 2,
  },
  roadStrip: {
    height: 38,
    backgroundColor: '#0F172A',
    borderRadius: Spacing.borderRadius.md,
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#334155',
  },
  carPosition: {
    position: 'absolute',
  },
  carEmoji: {
    fontSize: 24,
  },
  roadDivider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 6,
  },
  controlsRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
  },
  playerControls: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  controlHeader: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  gasBtn: {
    width: '90%',
    paddingVertical: 14,
    borderRadius: Spacing.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gasBtnP1: {
    backgroundColor: Colors.primary,
  },
  gasBtnP2: {
    backgroundColor: '#4FACFE',
  },
  gasBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.heavy,
  },
  nitroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FF7A00',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Spacing.borderRadius.full,
  },
  nitroDisabled: {
    opacity: 0.3,
  },
  nitroText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.xs - 2,
    fontWeight: Typography.weights.bold,
  },
  controlDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xs,
  },
  winnerCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    alignItems: 'center',
    gap: Spacing.xs,
    width: '100%',
  },
  winnerText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: '#B7791F',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    borderRadius: Spacing.borderRadius.full,
    marginTop: Spacing.xs,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.xs + 1,
  },
});
