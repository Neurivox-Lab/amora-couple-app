import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Animated } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Music, Play, Pause, Volume2, VolumeX, Sparkles, X, Disc3, Radio } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

export interface SoundTrack {
  id: string;
  title: string;
  emoji: string;
  vibe: string;
  gradient: readonly [string, string];
}

export const SOUND_TRACKS: SoundTrack[] = [
  { id: 'lofi_cafe', title: 'Midnight Café Lofi Beats', emoji: '☕', vibe: 'Chill & Cozy Chillhop', gradient: ['#FF6B8B', '#FF8E53'] },
  { id: 'rain_piano', title: 'Rain on Window & Soft Piano', emoji: '🌧️', vibe: 'Deep Relaxation & Rain', gradient: ['#4FACFE', '#00F2FE'] },
  { id: 'fireplace_guitar', title: 'Fireplace & Acoustic Guitar', emoji: '🕯️', vibe: 'Warm Hearth & Romance', gradient: ['#FA709A', '#FEE140'] },
  { id: 'ocean_sunset', title: 'Ocean Waves & Sunset Breeze', emoji: '🌊', vibe: 'Peaceful Island Calms', gradient: ['#11998E', '#38EF7D'] },
  { id: 'sensual_jazz', title: 'Late Night Sensual Jazz Sax', emoji: '🎷', vibe: 'Intimate Candlelight', gradient: ['#667EEA', '#764BA2'] },
  { id: 'stargazing', title: 'Stargazing Ambient Dreamscape', emoji: '🌌', vibe: 'Dreamy Floating Space', gradient: ['#A18CD1', '#FBC2EB'] },
];

interface CoupleRadioPlayerProps {
  visible?: boolean;
}

export const CoupleRadioPlayer: React.FC<CoupleRadioPlayerProps> = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrack, setActiveTrack] = useState<SoundTrack>(SOUND_TRACKS[0]);
  const [showModal, setShowModal] = useState(false);
  const [spinValue] = useState(new Animated.Value(0));

  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;
    if (isPlaying) {
      loop = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        })
      );
      loop.start();
    } else {
      spinValue.setValue(0);
    }
    return () => {
      if (loop) loop.stop();
    };
  }, [isPlaying]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const togglePlay = () => {
    triggerHaptic('light');
    setIsPlaying(prev => !prev);
  };

  const handleSelectTrack = (track: SoundTrack) => {
    triggerHaptic('medium');
    setActiveTrack(track);
    setIsPlaying(true);
  };

  return (
    <>
      {/* Mini Floating Radio Pill */}
      <TouchableOpacity
        style={[styles.miniRadioPill, isPlaying && styles.miniRadioPillPlaying]}
        onPress={() => {
          triggerHaptic('light');
          setShowModal(true);
        }}
        activeOpacity={0.85}
      >
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Disc3 size={16} color={isPlaying ? Colors.primaryDark : Colors.textSecondary} />
        </Animated.View>
        <Text style={[styles.miniRadioText, isPlaying && styles.miniRadioTextPlaying]} numberOfLines={1}>
          {isPlaying ? `${activeTrack.emoji} ${activeTrack.title}` : '🎵 Love Radio'}
        </Text>
        <TouchableOpacity
          style={styles.miniPlayBtn}
          onPress={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        >
          {isPlaying ? (
            <Pause size={12} color="#FFFFFF" fill="#FFFFFF" />
          ) : (
            <Play size={12} color="#FFFFFF" fill="#FFFFFF" />
          )}
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Full Radio Modal */}
      <Modal visible={showModal} animationType="slide" transparent onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.titleRow}>
                <Radio size={20} color={Colors.primary} />
                <Text style={styles.modalTitle}>Couple Love Ambiance Radio 🎵</Text>
              </View>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeBtn}>
                <X size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Play shared soothing ambient music while browsing the app, chatting, or playing games!
            </Text>

            {/* Now Playing Banner */}
            <View style={[styles.nowPlayingCard, { backgroundColor: activeTrack.gradient[0] }]}>
              <Text style={styles.nowPlayingEmoji}>{activeTrack.emoji}</Text>
              <Text style={styles.nowPlayingTitle}>{activeTrack.title}</Text>
              <Text style={styles.nowPlayingVibe}>{activeTrack.vibe}</Text>

              <View style={styles.nowPlayingControls}>
                <TouchableOpacity style={styles.playBigBtn} onPress={togglePlay}>
                  {isPlaying ? (
                    <Pause size={24} color={activeTrack.gradient[0]} fill={activeTrack.gradient[0]} />
                  ) : (
                    <Play size={24} color={activeTrack.gradient[0]} fill={activeTrack.gradient[0]} />
                  )}
                </TouchableOpacity>
                <Text style={styles.playStatusText}>
                  {isPlaying ? 'Playing in background • Synced' : 'Paused • Tap to Play'}
                </Text>
              </View>
            </View>

            {/* Soundscape List */}
            <Text style={styles.tracklistHeading}>Choose Couple Soundscape:</Text>
            <ScrollView style={styles.tracklist} showsVerticalScrollIndicator={false}>
              {SOUND_TRACKS.map((track) => {
                const isSelected = activeTrack.id === track.id;
                return (
                  <TouchableOpacity
                    key={track.id}
                    style={[styles.trackItem, isSelected && styles.trackItemSelected]}
                    onPress={() => handleSelectTrack(track)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.trackEmoji}>{track.emoji}</Text>
                    <View style={styles.trackInfo}>
                      <Text style={[styles.trackTitle, isSelected && styles.trackTitleSelected]}>
                        {track.title}
                      </Text>
                      <Text style={styles.trackVibe}>{track.vibe}</Text>
                    </View>
                    {isSelected && isPlaying && (
                      <View style={styles.playingBadge}>
                        <Sparkles size={12} color={Colors.primary} />
                        <Text style={styles.playingBadgeText}>LIVE</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  miniRadioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Spacing.borderRadius.full,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    maxWidth: 160,
  },
  miniRadioPillPlaying: {
    borderColor: Colors.primary,
    backgroundColor: '#FFF0F5',
  },
  miniRadioText: {
    fontSize: Typography.sizes.xs - 2,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
    flex: 1,
  },
  miniRadioTextPlaying: {
    color: Colors.primaryDark,
  },
  miniPlayBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: Spacing.borderRadius.xl,
    borderTopRightRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalTitle: {
    fontSize: Typography.sizes.md + 1,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  modalSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 16,
  },
  nowPlayingCard: {
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  nowPlayingEmoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  nowPlayingTitle: {
    fontSize: Typography.sizes.md + 1,
    fontWeight: Typography.weights.heavy,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  nowPlayingVibe: {
    fontSize: Typography.sizes.xs,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  nowPlayingControls: {
    alignItems: 'center',
    gap: 6,
  },
  playBigBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  playStatusText: {
    fontSize: Typography.sizes.xs - 1,
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
  },
  tracklistHeading: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  tracklist: {
    maxHeight: 220,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: '#FFFFFF',
    marginBottom: Spacing.xs,
  },
  trackItemSelected: {
    backgroundColor: '#FFF0F5',
    borderColor: Colors.primary,
  },
  trackEmoji: {
    fontSize: 22,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  trackTitleSelected: {
    color: Colors.primaryDark,
  },
  trackVibe: {
    fontSize: Typography.sizes.xs - 2,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  playingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFEBF2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Spacing.borderRadius.full,
  },
  playingBadgeText: {
    fontSize: 9,
    fontWeight: Typography.weights.heavy,
    color: Colors.primaryDark,
  },
});
