import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { ArcadeGame } from '../../services/gamesCatalog';
import { LudoBoardMiniGame } from './interactive/LudoBoardMiniGame';
import { CarRacerMiniGame } from './interactive/CarRacerMiniGame';
import { TicTacToeMiniGame } from './interactive/TicTacToeMiniGame';
import { MemoryMatchMiniGame } from './interactive/MemoryMatchMiniGame';
import { ReactionTapMiniGame } from './interactive/ReactionTapMiniGame';
import { GradientButton } from '../common/GradientButton';
import { X, Trophy, Heart, Sparkles, Flame, Play, ShieldAlert, Award } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

const { width } = Dimensions.get('window');

interface ArcadeGameLauncherModalProps {
  visible: boolean;
  game: ArcadeGame | null;
  partner1Name: string;
  partner2Name: string;
  onClose: () => void;
  onRewardHearts: (hearts: number) => void;
}

export const ArcadeGameLauncherModal: React.FC<ArcadeGameLauncherModalProps> = ({
  visible,
  game,
  partner1Name,
  partner2Name,
  onClose,
  onRewardHearts,
}) => {
  if (!game) return null;

  const [sessionScore, setSessionScore] = useState(0);
  const [genericWinner, setGenericWinner] = useState<string | null>(null);

  const handleWin = (winner: string) => {
    triggerHaptic('success');
    setSessionScore(prev => prev + 35);
    onRewardHearts(35);
  };

  const handleGenericAction = (winner: string) => {
    setGenericWinner(winner);
    handleWin(winner);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={22} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.gameTitle} numberOfLines={1}>{game.title}</Text>
            <Text style={styles.gameTagline}>{game.players} • ⭐ {game.rating}</Text>
          </View>

          <View style={styles.scoreBadge}>
            <Heart size={14} color={Colors.loveRed} fill={Colors.loveRed} />
            <Text style={styles.scoreText}>+{sessionScore}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* RENDER SPECIFIC INTERACTIVE GAME ENGINES */}
          {game.type === 'LUDO' && (
            <LudoBoardMiniGame
              partner1Name={partner1Name}
              partner2Name={partner2Name}
              onWin={handleWin}
            />
          )}

          {game.type === 'SNAKE_LADDER' && (
            <LudoBoardMiniGame
              partner1Name={partner1Name}
              partner2Name={partner2Name}
              isSnakeLadder={true}
              onWin={handleWin}
            />
          )}

          {(game.type === 'CAR_RACE' || game.type === 'TURBO_KART') && (
            <CarRacerMiniGame
              partner1Name={partner1Name}
              partner2Name={partner2Name}
              onWin={handleWin}
            />
          )}

          {game.type === 'TIC_TAC_TOE' && (
            <TicTacToeMiniGame
              partner1Name={partner1Name}
              partner2Name={partner2Name}
              onWin={handleWin}
            />
          )}

          {game.type === 'MEMORY_MATCH' && (
            <MemoryMatchMiniGame
              partner1Name={partner1Name}
              partner2Name={partner2Name}
              onWin={handleWin}
            />
          )}

          {game.type === 'REACTION_TAP' && (
            <ReactionTapMiniGame
              partner1Name={partner1Name}
              partner2Name={partner2Name}
              onWin={handleWin}
            />
          )}

          {/* UNIVERSAL ROMANTIC DUEL ENGINE (FOR CHESS, UNO, BOWLING, POKER, AIR HOCKEY, ETC) */}
          {game.type !== 'LUDO' &&
            game.type !== 'SNAKE_LADDER' &&
            game.type !== 'CAR_RACE' &&
            game.type !== 'TURBO_KART' &&
            game.type !== 'TIC_TAC_TOE' &&
            game.type !== 'MEMORY_MATCH' &&
            game.type !== 'REACTION_TAP' && (
              <View style={styles.universalDuelBox}>
                <View style={styles.universalHero}>
                  <Text style={styles.universalEmoji}>{game.iconEmoji}</Text>
                  <Text style={styles.universalTitle}>{game.title}</Text>
                  <Text style={styles.universalTagline}>{game.tagline}</Text>
                </View>

                <View style={styles.rulesCard}>
                  <Text style={styles.rulesHeader}>📜 Romantic Match Rules:</Text>
                  <Text style={styles.rulesBody}>
                    1. Play a real-life or in-app round of <Text style={{ fontWeight: 'bold' }}>{game.title}</Text>.
                  </Text>
                  <Text style={styles.rulesBody}>
                    2. Winner gets to claim a romantic prize (Kiss, Coffee in bed, Massage, or Choosing dinner)!
                  </Text>
                  <Text style={styles.rulesBody}>
                    3. Loser must complete 1 sweet couple forfeit challenge.
                  </Text>
                </View>

                {genericWinner ? (
                  <View style={styles.genericWinnerCard}>
                    <Trophy size={32} color={Colors.gold} />
                    <Text style={styles.genericWinnerText}>🏆 {genericWinner} Declared Champion!</Text>
                    <Text style={styles.genericRewardText}>+35 Couple Hearts Awarded ❤️</Text>
                    <TouchableOpacity
                      style={styles.rematchBtn}
                      onPress={() => setGenericWinner(null)}
                    >
                      <Text style={styles.rematchBtnText}>Play Next Round 🔄</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.declareSection}>
                    <Text style={styles.declareTitle}>Declare Round Winner:</Text>
                    <View style={styles.declareRow}>
                      <TouchableOpacity
                        style={[styles.declareBtn, styles.declareBtnP1]}
                        onPress={() => handleGenericAction(partner1Name)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.declareEmoji}>👩</Text>
                        <Text style={styles.declareText}>{partner1Name} Won!</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.declareBtn, styles.declareBtnP2]}
                        onPress={() => handleGenericAction(partner2Name)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.declareEmoji}>👨</Text>
                        <Text style={styles.declareText}>{partner2Name} Won!</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  gameTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  gameTagline: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFEBF0',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: Spacing.borderRadius.full,
  },
  scoreText: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.loveRed,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  universalDuelBox: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  universalHero: {
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  universalEmoji: {
    fontSize: 56,
    marginBottom: Spacing.xs,
  },
  universalTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  universalTagline: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  rulesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
    width: '100%',
    gap: 6,
  },
  rulesHeader: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  rulesBody: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  declareSection: {
    width: '100%',
    marginTop: Spacing.sm,
  },
  declareTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  declareRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  declareBtn: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: Spacing.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  declareBtnP1: {
    backgroundColor: '#FFEBF2',
    borderColor: Colors.primary,
  },
  declareBtnP2: {
    backgroundColor: '#EBF4FF',
    borderColor: '#4FACFE',
  },
  declareEmoji: {
    fontSize: 28,
  },
  declareText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  genericWinnerCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    alignItems: 'center',
    gap: Spacing.xs,
    width: '100%',
  },
  genericWinnerText: {
    fontSize: Typography.sizes.md + 1,
    fontWeight: Typography.weights.heavy,
    color: '#B7791F',
  },
  genericRewardText: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textSecondary,
  },
  rematchBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 10,
    borderRadius: Spacing.borderRadius.full,
    marginTop: Spacing.xs,
  },
  rematchBtnText: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.xs + 1,
  },
});
