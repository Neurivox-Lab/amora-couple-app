import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, PanResponder, Dimensions, Animated, ScrollView } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../common/GradientButton';
import { X, Trash2, Send, Sparkles, Heart, Palette, Wand2 } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

const { width, height } = Dimensions.get('window');

const COLOR_PALETTE = ['#FF2D55', '#FF375F', '#FF9F0A', '#30D158', '#0A84FF', '#BF5AF2', '#FFFFFF'];
const STICKER_STAMPS = ['🧸', '💖', '💋', '✨', '🌹', '🍓', '💍', '🔥'];

interface Point {
  x: number;
  y: number;
  color: string;
  size: number;
}

interface Stamp {
  x: number;
  y: number;
  emoji: string;
}

interface DrawTogetherModalProps {
  visible: boolean;
  partnerName: string;
  onClose: () => void;
  onSendDrawingToChat?: (summary: string) => void;
}

export const DrawTogetherModal: React.FC<DrawTogetherModalProps> = ({
  visible,
  partnerName,
  onClose,
  onSendDrawingToChat,
}) => {
  const [points, setPoints] = useState<Point[]>([]);
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState(10);
  const [partnerTouches, setPartnerTouches] = useState<{ x: number; y: number } | null>(null);
  const heartBurstAnim = useRef(new Animated.Value(0)).current;

  // PanResponder to track finger strokes on the canvas
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        if (selectedSticker) {
          triggerHaptic('light');
          setStamps(prev => [...prev, { x: locationX, y: locationY, emoji: selectedSticker }]);
        } else {
          setPoints(prev => [...prev, { x: locationX, y: locationY, color: selectedColor, size: brushSize }]);
        }
      },
      onPanResponderMove: (evt) => {
        if (!selectedSticker) {
          const { locationX, locationY } = evt.nativeEvent;
          setPoints(prev => [...prev, { x: locationX, y: locationY, color: selectedColor, size: brushSize }]);
        }
      },
      onPanResponderRelease: (evt) => {
        // Simulate synchronized partner touch nearby
        const { locationX, locationY } = evt.nativeEvent;
        if (Math.random() > 0.4) {
          triggerHaptic('heartbeat');
          setPartnerTouches({ x: locationX + (Math.random() * 40 - 20), y: locationY + (Math.random() * 40 - 20) });
          heartBurstAnim.setValue(0);
          Animated.spring(heartBurstAnim, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleClear = () => {
    triggerHaptic('medium');
    setPoints([]);
    setStamps([]);
    setPartnerTouches(null);
  };

  const handleSend = () => {
    triggerHaptic('success');
    if (onSendDrawingToChat) {
      onSendDrawingToChat(`🎨 Sent a neon Love Doodle drawing to you! 💖`);
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Live Touch & Draw Canvas 🎨</Text>
            <Text style={styles.headerSub}>Drawing live with {partnerName} ❤️</Text>
          </View>

          <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
            <Trash2 size={18} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        </View>

        {/* DRAWING CANVAS */}
        <View style={styles.canvasArea} {...panResponder.panHandlers}>
          {/* Instructions watermark */}
          {points.length === 0 && stamps.length === 0 && (
            <View style={styles.watermark}>
              <Sparkles size={32} color="rgba(255,255,255,0.4)" />
              <Text style={styles.watermarkText}>Touch and draw love notes together with your finger ✨</Text>
              <Text style={styles.watermarkSub}>Touches nearby trigger synchronized heartbeat bursts!</Text>
            </View>
          )}

          {/* Render Drawn Strokes */}
          {points.map((pt, idx) => (
            <View
              key={idx}
              style={[
                styles.drawnDot,
                {
                  left: pt.x - pt.size / 2,
                  top: pt.y - pt.size / 2,
                  width: pt.size,
                  height: pt.size,
                  borderRadius: pt.size / 2,
                  backgroundColor: pt.color,
                  shadowColor: pt.color,
                },
              ]}
            />
          ))}

          {/* Render Sticker Stamps */}
          {stamps.map((stamp, idx) => (
            <View key={idx} style={[styles.stampItem, { left: stamp.x - 18, top: stamp.y - 18 }]}>
              <Text style={styles.stampEmoji}>{stamp.emoji}</Text>
            </View>
          ))}

          {/* Partner Synced Touch Heart Burst */}
          {partnerTouches && (
            <Animated.View
              style={[
                styles.partnerBurst,
                {
                  left: partnerTouches.x - 30,
                  top: partnerTouches.y - 30,
                  transform: [
                    { scale: heartBurstAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.4] }) },
                  ],
                  opacity: heartBurstAnim.interpolate({ inputRange: [0, 0.8, 1], outputRange: [0, 1, 0.9] }),
                },
              ]}
            >
              <Text style={styles.burstEmoji}>💖</Text>
              <View style={styles.partnerTouchPill}>
                <Text style={styles.partnerTouchText}>{partnerName}'s touch</Text>
              </View>
            </Animated.View>
          )}
        </View>

        {/* BOTTOM TOOLBAR */}
        <View style={styles.bottomToolbar}>
          {/* Color Palette */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.paletteScroll}>
            {COLOR_PALETTE.map((color, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.colorChip,
                  { backgroundColor: color },
                  selectedColor === color && !selectedSticker && styles.colorChipSelected,
                ]}
                onPress={() => {
                  triggerHaptic('light');
                  setSelectedColor(color);
                  setSelectedSticker(null);
                }}
              />
            ))}
          </ScrollView>

          {/* Sticker Stamps Row */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stickerScroll}>
            {STICKER_STAMPS.map((emoji, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.stickerChip,
                  selectedSticker === emoji && styles.stickerChipSelected,
                ]}
                onPress={() => {
                  triggerHaptic('light');
                  setSelectedSticker(selectedSticker === emoji ? null : emoji);
                }}
              >
                <Text style={styles.stickerEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Actions */}
          <View style={styles.actionRow}>
            <GradientButton
              title="Send Doodle to Partner's Chat 💌"
              onPress={handleSend}
              style={styles.sendBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120E16',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  headerInfo: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.heavy,
  },
  headerSub: {
    color: Colors.primaryLight,
    fontSize: Typography.sizes.xs - 1,
    marginTop: 1,
  },
  clearBtn: {
    padding: Spacing.xs,
  },
  canvasArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  watermark: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    gap: 8,
  },
  watermarkText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    textAlign: 'center',
    maxWidth: 260,
  },
  watermarkSub: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: Typography.sizes.xs,
    textAlign: 'center',
  },
  drawnDot: {
    position: 'absolute',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 3,
  },
  stampItem: {
    position: 'absolute',
  },
  stampEmoji: {
    fontSize: 34,
  },
  partnerBurst: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  burstEmoji: {
    fontSize: 44,
  },
  partnerTouchPill: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Spacing.borderRadius.full,
    marginTop: -4,
  },
  partnerTouchText: {
    fontSize: 9,
    fontWeight: Typography.weights.heavy,
    color: Colors.primaryDark,
  },
  bottomToolbar: {
    backgroundColor: 'rgba(20, 15, 25, 0.95)',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    gap: Spacing.xs + 2,
  },
  paletteScroll: {
    flexDirection: 'row',
  },
  colorChip: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: Spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorChipSelected: {
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.2 }],
  },
  stickerScroll: {
    flexDirection: 'row',
  },
  stickerChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: Spacing.xs + 2,
  },
  stickerChipSelected: {
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  stickerEmoji: {
    fontSize: 22,
  },
  actionRow: {
    marginTop: 4,
  },
  sendBtn: {
    width: '100%',
  },
});
