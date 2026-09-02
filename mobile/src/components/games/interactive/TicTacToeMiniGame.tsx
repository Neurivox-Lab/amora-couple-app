import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { Spacing } from '../../../theme/spacing';
import { Trophy, RotateCcw, Heart } from 'lucide-react-native';
import { triggerHaptic } from '../../../utils/haptics';

const { width } = Dimensions.get('window');

interface TicTacToeMiniGameProps {
  partner1Name: string;
  partner2Name: string;
  onWin: (winner: string) => void;
}

type CellValue = 'X' | 'O' | null;

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export const TicTacToeMiniGame: React.FC<TicTacToeMiniGameProps> = ({
  partner1Name,
  partner2Name,
  onWin,
}) => {
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<'X' | 'O'>('X'); // X = Partner1, O = Partner2
  const [winner, setWinner] = useState<string | null>(null);
  const [isDraw, setIsDraw] = useState(false);

  const checkWinner = (newBoard: CellValue[]) => {
    for (let line of WIN_LINES) {
      const [a, b, c] = line;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return newBoard[a];
      }
    }
    return null;
  };

  const handleCellPress = (index: number) => {
    if (board[index] || winner || isDraw) return;
    triggerHaptic('medium');

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const winSymbol = checkWinner(newBoard);
    if (winSymbol) {
      triggerHaptic('success');
      const winName = winSymbol === 'X' ? partner1Name : partner2Name;
      setWinner(winName);
      onWin(winName);
    } else if (newBoard.every(cell => cell !== null)) {
      setIsDraw(true);
    } else {
      setTurn(turn === 'X' ? 'O' : 'X');
    }
  };

  const handleRestart = () => {
    triggerHaptic('light');
    setBoard(Array(9).fill(null));
    setTurn('X');
    setWinner(null);
    setIsDraw(false);
  };

  return (
    <View style={styles.container}>
      {/* Player Turn Bar */}
      <View style={styles.turnBar}>
        <View style={[styles.playerChip, turn === 'X' && !winner && styles.playerChipActiveX]}>
          <Text style={styles.playerEmoji}>👩</Text>
          <Text style={[styles.playerName, turn === 'X' && styles.playerNameActive]}>
            {partner1Name} (💋 X)
          </Text>
        </View>

        <Text style={styles.vsText}>VS</Text>

        <View style={[styles.playerChip, turn === 'O' && !winner && styles.playerChipActiveO]}>
          <Text style={styles.playerEmoji}>👨</Text>
          <Text style={[styles.playerName, turn === 'O' && styles.playerNameActive]}>
            {partner2Name} (🤗 O)
          </Text>
        </View>
      </View>

      {/* 3x3 Grid */}
      <View style={styles.gridContainer}>
        {board.map((cell, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.gridCell, cell && styles.gridCellFilled]}
            onPress={() => handleCellPress(idx)}
            activeOpacity={0.8}
          >
            {cell === 'X' ? (
              <Text style={styles.cellX}>💋</Text>
            ) : cell === 'O' ? (
              <Text style={styles.cellO}>🤗</Text>
            ) : null}
          </TouchableOpacity>
        ))}
      </View>

      {/* Result Card */}
      {(winner || isDraw) && (
        <View style={styles.resultBox}>
          {winner ? (
            <>
              <Trophy size={28} color={Colors.gold} />
              <Text style={styles.resultTitle}>🎉 {winner} Wins 3-in-a-Row!</Text>
              <Text style={styles.resultReward}>Prize: 1 Passionate Kiss & +25 ❤️</Text>
            </>
          ) : (
            <Text style={styles.resultTitle}>🤝 Perfect Love Match! It’s a Draw!</Text>
          )}

          <TouchableOpacity style={styles.resetBtn} onPress={handleRestart}>
            <RotateCcw size={16} color="#FFFFFF" />
            <Text style={styles.resetBtnText}>Play Again</Text>
          </TouchableOpacity>
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
  turnBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.sm,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
    marginBottom: Spacing.md,
  },
  playerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Spacing.borderRadius.md,
    backgroundColor: '#FAF5F7',
  },
  playerChipActiveX: {
    backgroundColor: '#FFEBF2',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  playerChipActiveO: {
    backgroundColor: '#EBF4FF',
    borderWidth: 1.5,
    borderColor: '#4FACFE',
  },
  playerEmoji: {
    fontSize: 16,
  },
  playerName: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
  },
  playerNameActive: {
    color: Colors.textPrimary,
  },
  vsText: {
    fontSize: Typography.sizes.xs - 2,
    fontWeight: Typography.weights.heavy,
    color: Colors.textMuted,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width - 64,
    height: width - 64,
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: 8,
    borderWidth: 2,
    borderColor: '#FFEBF0',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  gridCell: {
    width: '33.33%',
    height: '33.33%',
    borderWidth: 1,
    borderColor: '#FFE5EC',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFBFD',
  },
  gridCellFilled: {
    backgroundColor: '#FFFFFF',
  },
  cellX: {
    fontSize: 36,
  },
  cellO: {
    fontSize: 36,
  },
  resultBox: {
    marginTop: Spacing.md,
    backgroundColor: '#FFF9E6',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    alignItems: 'center',
    width: '100%',
    gap: 4,
  },
  resultTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.heavy,
    color: '#B7791F',
  },
  resultReward: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    borderRadius: Spacing.borderRadius.full,
    marginTop: 6,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.xs + 1,
  },
});
