import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { Spacing } from '../../../theme/spacing';
import { GradientButton } from '../../common/GradientButton';
import { Dices, Trophy, Heart, Sparkles, RotateCcw } from 'lucide-react-native';
import { triggerHaptic } from '../../../utils/haptics';

const { width } = Dimensions.get('window');

interface LudoBoardMiniGameProps {
  partner1Name: string;
  partner2Name: string;
  isSnakeLadder?: boolean;
  onWin: (winner: string) => void;
}

const BOARD_CELLS = Array.from({ length: 30 }, (_, i) => i + 1);

const REWARD_CELLS: Record<number, string> = {
  5: '💋 Kiss Pass (+3)',
  9: '🪜 Ladder to 16!',
  14: '🐍 Snake down to 7',
  18: '☕ Coffee Hug (+2)',
  22: '🪜 Love Ladder to 27!',
  26: '🐍 Slippery Trap to 15',
  30: '👑 Love Winner!',
};

export const LudoBoardMiniGame: React.FC<LudoBoardMiniGameProps> = ({
  partner1Name,
  partner2Name,
  isSnakeLadder = false,
  onWin,
}) => {
  const [turn, setTurn] = useState<'p1' | 'p2'>('p1');
  const [pos1, setPos1] = useState(1);
  const [pos2, setPos2] = useState(1);
  const [lastDice, setLastDice] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [statusMsg, setStatusMsg] = useState('Roll the dice to start the race!');
  const [winner, setWinner] = useState<string | null>(null);

  const handleRollDice = () => {
    if (isRolling || winner) return;
    triggerHaptic('heavy');
    setIsRolling(true);

    const roll = Math.floor(Math.random() * 6) + 1;
    setLastDice(roll);

    setTimeout(() => {
      setIsRolling(false);
      let newPos = (turn === 'p1' ? pos1 : pos2) + roll;
      if (newPos > 30) newPos = 30;

      // Check special tiles (Snakes / Ladders / Kiss tiles)
      let bonusMsg = `${turn === 'p1' ? partner1Name : partner2Name} rolled a ${roll}!`;
      if (newPos === 9) {
        newPos = 16;
        bonusMsg += ' 🪜 Love Ladder up to tile 16!';
      } else if (newPos === 22) {
        newPos = 27;
        bonusMsg += ' 🪜 Super Ladder up to tile 27!';
      } else if (newPos === 14) {
        newPos = 7;
        bonusMsg += ' 🐍 Oops! Slipped on a snake down to tile 7!';
      } else if (newPos === 26) {
        newPos = 15;
        bonusMsg += ' 🐍 Slide down to tile 15! Forfeit: Give a hug 🤗';
      }

      setStatusMsg(bonusMsg);

      if (turn === 'p1') {
        setPos1(newPos);
        if (newPos >= 30) {
          triggerHaptic('success');
          setWinner(partner1Name);
          onWin(partner1Name);
          return;
        }
        setTurn('p2');
      } else {
        setPos2(newPos);
        if (newPos >= 30) {
          triggerHaptic('success');
          setWinner(partner2Name);
          onWin(partner2Name);
          return;
        }
        setTurn('p1');
      }
    }, 600);
  };

  const handleReset = () => {
    triggerHaptic('light');
    setPos1(1);
    setPos2(1);
    setTurn('p1');
    setLastDice(null);
    setWinner(null);
    setStatusMsg('New match started! Roll the dice.');
  };

  return (
    <View style={styles.container}>
      {/* Turn Banner */}
      <View style={styles.turnCard}>
        <View style={styles.playerPillRow}>
          <View style={[styles.playerPill, turn === 'p1' && styles.playerPillActive1]}>
            <Text style={styles.playerEmoji}>👩</Text>
            <Text style={[styles.playerPillText, turn === 'p1' && styles.playerPillTextActive]}>
              {partner1Name}: Tile {pos1}
            </Text>
          </View>

          <View style={[styles.playerPill, turn === 'p2' && styles.playerPillActive2]}>
            <Text style={styles.playerEmoji}>👨</Text>
            <Text style={[styles.playerPillText, turn === 'p2' && styles.playerPillTextActive]}>
              {partner2Name}: Tile {pos2}
            </Text>
          </View>
        </View>

        <Text style={styles.statusText}>{statusMsg}</Text>
      </View>

      {/* Board Grid (30 Tiles) */}
      <View style={styles.boardGrid}>
        {BOARD_CELLS.map((cellNum) => {
          const isP1Here = pos1 === cellNum;
          const isP2Here = pos2 === cellNum;

          return (
            <View
              key={cellNum}
              style={[
                styles.tile,
                cellNum === 30 && styles.finishTile,
                cellNum % 2 === 0 && styles.tileEven,
              ]}
            >
              <Text style={styles.tileNum}>{cellNum}</Text>

              {/* Special Tile Badges */}
              {cellNum === 9 || cellNum === 22 ? (
                <Text style={styles.specialEmoji}>🪜</Text>
              ) : cellNum === 14 || cellNum === 26 ? (
                <Text style={styles.specialEmoji}>🐍</Text>
              ) : cellNum === 5 || cellNum === 18 ? (
                <Text style={styles.specialEmoji}>💋</Text>
              ) : cellNum === 30 ? (
                <Text style={styles.specialEmoji}>👑</Text>
              ) : null}

              {/* Player Tokens */}
              <View style={styles.tokenContainer}>
                {isP1Here && <Text style={styles.playerToken}>👩</Text>}
                {isP2Here && <Text style={styles.playerToken}>👨</Text>}
              </View>
            </View>
          );
        })}
      </View>

      {/* Dice & Controls */}
      <View style={styles.controlsSection}>
        {winner ? (
          <View style={styles.winnerCard}>
            <Trophy size={28} color={Colors.gold} />
            <Text style={styles.winnerText}>🏆 {winner} Won the Race! (+30 ❤️)</Text>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <RotateCcw size={16} color="#FFFFFF" />
              <Text style={styles.resetBtnText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.diceRow}>
            <TouchableOpacity
              style={[
                styles.diceButton,
                turn === 'p1' ? styles.diceBtnP1 : styles.diceBtnP2,
                isRolling && styles.diceBtnRolling,
              ]}
              onPress={handleRollDice}
              disabled={isRolling}
              activeOpacity={0.8}
            >
              <Dices size={28} color="#FFFFFF" />
              <Text style={styles.diceBtnText}>
                {isRolling ? 'Rolling...' : `Roll Dice (${turn === 'p1' ? partner1Name : partner2Name})`}
              </Text>
            </TouchableOpacity>

            {lastDice !== null && (
              <View style={styles.diceResultBox}>
                <Text style={styles.diceNum}>{lastDice}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  turnCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  playerPillRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
  },
  playerPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: Spacing.borderRadius.md,
    backgroundColor: '#FAF5F7',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  playerPillActive1: {
    backgroundColor: '#FFEBF0',
    borderColor: Colors.primary,
  },
  playerPillActive2: {
    backgroundColor: '#EBF4FF',
    borderColor: '#4FACFE',
  },
  playerEmoji: {
    fontSize: 16,
  },
  playerPillText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
  },
  playerPillTextActive: {
    color: Colors.textPrimary,
  },
  statusText: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.primaryDark,
    fontWeight: Typography.weights.semibold,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  boardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width - 48,
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.lg,
    padding: 6,
    borderWidth: 2,
    borderColor: '#FFEBF0',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  tile: {
    width: (width - 60) / 6,
    height: 48,
    borderWidth: 0.5,
    borderColor: '#FFE5EC',
    backgroundColor: '#FFF9FB',
    justifyContent: 'space-between',
    padding: 2,
    position: 'relative',
  },
  tileEven: {
    backgroundColor: '#FFFFFF',
  },
  finishTile: {
    backgroundColor: '#FFEBF2',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  tileNum: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: Typography.weights.bold,
  },
  specialEmoji: {
    fontSize: 12,
    position: 'absolute',
    top: 2,
    right: 2,
  },
  tokenContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 1,
  },
  playerToken: {
    fontSize: 14,
  },
  controlsSection: {
    width: '100%',
    marginTop: Spacing.md,
  },
  diceRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  diceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: 14,
    borderRadius: Spacing.borderRadius.lg,
  },
  diceBtnP1: {
    backgroundColor: Colors.primary,
  },
  diceBtnP2: {
    backgroundColor: '#4FACFE',
  },
  diceBtnRolling: {
    opacity: 0.7,
  },
  diceBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
  },
  diceResultBox: {
    width: 54,
    height: 54,
    borderRadius: Spacing.borderRadius.md,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diceNum: {
    fontSize: 26,
    fontWeight: Typography.weights.heavy,
    color: Colors.primaryDark,
  },
  winnerCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    alignItems: 'center',
    gap: Spacing.xs,
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
    marginTop: 4,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.xs + 1,
  },
});
