import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { Spacing } from '../../../theme/spacing';
import { Trophy, RotateCcw, Sparkles } from 'lucide-react-native';
import { triggerHaptic } from '../../../utils/haptics';

const { width } = Dimensions.get('window');

const CARD_ICONS = ['❤️', '💍', '💌', '🌹', '🍓', '🥂'];

interface MemoryMatchMiniGameProps {
  partner1Name: string;
  partner2Name: string;
  onWin: (winner: string) => void;
}

interface CardItem {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryMatchMiniGame: React.FC<MemoryMatchMiniGameProps> = ({
  partner1Name,
  partner2Name,
  onWin,
}) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [turn, setTurn] = useState<'p1' | 'p2'>('p1');
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    initDeck();
  }, []);

  const initDeck = () => {
    const deck = [...CARD_ICONS, ...CARD_ICONS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(deck);
    setSelectedCards([]);
    setScore1(0);
    setScore2(0);
    setTurn('p1');
    setWinner(null);
  };

  const handleCardPress = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || selectedCards.length === 2 || winner) return;
    triggerHaptic('light');

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (newCards[first].emoji === newCards[second].emoji) {
        // MATCH!
        triggerHaptic('success');
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setCards(newCards);
        setSelectedCards([]);

        if (turn === 'p1') setScore1(s => s + 1);
        else setScore2(s => s + 1);

        // Check if all matched
        if (newCards.every(c => c.isMatched)) {
          const winName = score1 >= score2 ? partner1Name : partner2Name;
          setWinner(winName);
          onWin(winName);
        }
      } else {
        // NO MATCH - Flip back
        setTimeout(() => {
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setCards(newCards);
          setSelectedCards([]);
          setTurn(t => (t === 'p1' ? 'p2' : 'p1'));
        }, 800);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Score Tracker */}
      <View style={styles.scoreRow}>
        <View style={[styles.playerBox, turn === 'p1' && styles.playerBoxActive1]}>
          <Text style={styles.playerEmoji}>👩</Text>
          <Text style={styles.playerName}>{partner1Name}</Text>
          <Text style={styles.playerScore}>{score1} Pairs</Text>
        </View>

        <View style={styles.vsCircle}>
          <Sparkles size={16} color={Colors.primary} />
        </View>

        <View style={[styles.playerBox, turn === 'p2' && styles.playerBoxActive2]}>
          <Text style={styles.playerEmoji}>👨</Text>
          <Text style={styles.playerName}>{partner2Name}</Text>
          <Text style={styles.playerScore}>{score2} Pairs</Text>
        </View>
      </View>

      {/* 4x3 Cards Grid */}
      <View style={styles.grid}>
        {cards.map((card, idx) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.card,
              (card.isFlipped || card.isMatched) && styles.cardFlipped,
              card.isMatched && styles.cardMatched,
            ]}
            onPress={() => handleCardPress(idx)}
            activeOpacity={0.8}
          >
            <Text style={styles.cardEmoji}>
              {card.isFlipped || card.isMatched ? card.emoji : '❓'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Winner Banner */}
      {winner && (
        <View style={styles.winnerCard}>
          <Trophy size={28} color={Colors.gold} />
          <Text style={styles.winnerText}>🏆 {winner} Won the Memory Duel! (+30 ❤️)</Text>
          <TouchableOpacity style={styles.resetBtn} onPress={initDeck}>
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
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.md,
  },
  playerBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  playerBoxActive1: {
    backgroundColor: '#FFEBF2',
    borderColor: Colors.primary,
  },
  playerBoxActive2: {
    backgroundColor: '#EBF4FF',
    borderColor: '#4FACFE',
  },
  playerEmoji: {
    fontSize: 20,
  },
  playerName: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  playerScore: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.heavy,
    color: Colors.primaryDark,
  },
  vsCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF5F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    width: width - 48,
  },
  card: {
    width: (width - 80) / 4,
    height: 72,
    backgroundColor: '#FAF5F7',
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 1.5,
    borderColor: '#FFE5EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFlipped: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.primary,
  },
  cardMatched: {
    backgroundColor: '#EBFBEE',
    borderColor: Colors.emeraldGreen,
  },
  cardEmoji: {
    fontSize: 28,
  },
  winnerCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    alignItems: 'center',
    gap: Spacing.xs,
    width: '100%',
    marginTop: Spacing.md,
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
