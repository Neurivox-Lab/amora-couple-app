import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { Spacing } from '../../../theme/spacing';
import { Zap, Trophy, RotateCcw } from 'lucide-react-native';
import { triggerHaptic } from '../../../utils/haptics';

interface ReactionTapMiniGameProps {
  partner1Name: string;
  partner2Name: string;
  onWin: (winner: string) => void;
}

export const ReactionTapMiniGame: React.FC<ReactionTapMiniGameProps> = ({
  partner1Name,
  partner2Name,
  onWin,
}) => {
  const [gameState, setGameState] = useState<'WAITING' | 'READY' | 'GO' | 'FINISHED'>('WAITING');
  const [winner, setWinner] = useState<string | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);

  const startRound = () => {
    setGameState('READY');
    setWinner(null);
    setReactionTime(null);

    const delay = Math.floor(Math.random() * 2500) + 1500; // 1.5s - 4.0s
    setTimeout(() => {
      setGameState('GO');
      setStartTime(Date.now());
      triggerHaptic('heavy');
    }, delay);
  };

  const handleTap = (player: 'p1' | 'p2') => {
    if (gameState === 'READY') {
      // Early tap penalty!
      triggerHaptic('heavy');
      const winName = player === 'p1' ? partner2Name : partner1Name;
      setWinner(`${winName} (Opponent tapped too early! 😜)`);
      setGameState('FINISHED');
      onWin(winName);
    } else if (gameState === 'GO') {
      const timeMs = Date.now() - startTime;
      triggerHaptic('success');
      const winName = player === 'p1' ? partner1Name : partner2Name;
      setWinner(winName);
      setReactionTime(timeMs);
      setGameState('FINISHED');
      onWin(winName);
    }
  };

  return (
    <View style={styles.container}>
      {/* State Screen Banner */}
      <View
        style={[
          styles.screenBox,
          gameState === 'READY' && styles.screenReady,
          gameState === 'GO' && styles.screenGo,
          gameState === 'FINISHED' && styles.screenFinished,
        ]}
      >
        {gameState === 'WAITING' && (
          <View style={styles.centerPrompt}>
            <Zap size={36} color={Colors.primary} />
            <Text style={styles.promptTitle}>Reaction Speed Duel ⚡</Text>
            <Text style={styles.promptSub}>
              Tap Start, wait for the screen to turn PINK, then tap your button fastest!
            </Text>
            <TouchableOpacity style={styles.startRoundBtn} onPress={startRound}>
              <Text style={styles.startRoundBtnText}>Start Countdown ⏳</Text>
            </TouchableOpacity>
          </View>
        )}

        {gameState === 'READY' && (
          <View style={styles.centerPrompt}>
            <Text style={styles.readyTitle}>Wait for it... 🛑</Text>
            <Text style={styles.readySub}>Do not tap yet!</Text>
          </View>
        )}

        {gameState === 'GO' && (
          <View style={styles.centerPrompt}>
            <Text style={styles.goTitle}>TAP NOW! 💥</Text>
          </View>
        )}

        {gameState === 'FINISHED' && (
          <View style={styles.centerPrompt}>
            <Trophy size={32} color={Colors.gold} />
            <Text style={styles.finishedWinner}>🏆 {winner} Won!</Text>
            {reactionTime && (
              <Text style={styles.reactionText}>Lightning Reflex: {reactionTime} ms! ⚡</Text>
            )}
            <TouchableOpacity style={styles.startRoundBtn} onPress={startRound}>
              <Text style={styles.startRoundBtnText}>Play Next Round 🔄</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Split Player Tap Triggers */}
      <View style={styles.tapTriggersRow}>
        <TouchableOpacity
          style={[styles.tapTriggerBtn, styles.triggerP1]}
          onPress={() => handleTap('p1')}
          disabled={gameState === 'WAITING' || gameState === 'FINISHED'}
          activeOpacity={0.7}
        >
          <Text style={styles.triggerEmoji}>👩</Text>
          <Text style={styles.triggerLabel}>{partner1Name}</Text>
          <Text style={styles.triggerSub}>TAP HERE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tapTriggerBtn, styles.triggerP2]}
          onPress={() => handleTap('p2')}
          disabled={gameState === 'WAITING' || gameState === 'FINISHED'}
          activeOpacity={0.7}
        >
          <Text style={styles.triggerEmoji}>👨</Text>
          <Text style={styles.triggerLabel}>{partner2Name}</Text>
          <Text style={styles.triggerSub}>TAP HERE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  screenBox: {
    width: '100%',
    height: 170,
    backgroundColor: '#FAF5F7',
    borderRadius: Spacing.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFEBF0',
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  screenReady: {
    backgroundColor: '#FFF0F0',
    borderColor: '#FF7A7A',
  },
  screenGo: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  screenFinished: {
    backgroundColor: '#FFF9E6',
    borderColor: Colors.gold,
  },
  centerPrompt: {
    alignItems: 'center',
    gap: 4,
  },
  promptTitle: {
    fontSize: Typography.sizes.md + 1,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  promptSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 260,
  },
  startRoundBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    borderRadius: Spacing.borderRadius.full,
    marginTop: 6,
  },
  startRoundBtnText: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.xs + 1,
  },
  readyTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.heavy,
    color: '#D32F2F',
  },
  readySub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  goTitle: {
    fontSize: Typography.sizes.hero,
    fontWeight: Typography.weights.heavy,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  finishedWinner: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.heavy,
    color: '#B7791F',
  },
  reactionText: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.semibold,
  },
  tapTriggersRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  tapTriggerBtn: {
    flex: 1,
    height: 120,
    borderRadius: Spacing.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  triggerP1: {
    backgroundColor: '#FFF0F5',
    borderColor: Colors.primary,
  },
  triggerP2: {
    backgroundColor: '#F0F8FF',
    borderColor: '#4FACFE',
  },
  triggerEmoji: {
    fontSize: 28,
  },
  triggerLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  triggerSub: {
    fontSize: Typography.sizes.xs - 2,
    fontWeight: Typography.weights.heavy,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
