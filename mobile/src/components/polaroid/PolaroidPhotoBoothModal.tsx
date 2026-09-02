import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, Dimensions, Image } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../common/GradientButton';
import { Camera, Plus, Sparkles, X, Heart, Pin, RotateCcw, Share2, Image as ImageIcon } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

const { width } = Dimensions.get('window');

interface PolaroidPhoto {
  id: string;
  imageUrl: string;
  caption: string;
  dateStr: string;
  sticker: string;
  tapeColor: string;
  rotation: string;
}

const INITIAL_POLAROIDS: PolaroidPhoto[] = [
  {
    id: 'pol_1',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
    caption: 'Our Golden Sunset Walk in Goa 🌅',
    dateStr: 'March 14, 2026',
    sticker: '🧸❤️',
    tapeColor: '#FF6B8B',
    rotation: '-2deg',
  },
  {
    id: 'pol_2',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop',
    caption: 'First Time Making Pasta Together 🍝',
    dateStr: 'January 28, 2026',
    sticker: '🍓✨',
    tapeColor: '#4FACFE',
    rotation: '3deg',
  },
  {
    id: 'pol_3',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop',
    caption: 'Waterfall Cuddles in Bali 🌴',
    dateStr: 'November 12, 2025',
    sticker: '💍💖',
    tapeColor: '#38EF7D',
    rotation: '-1deg',
  },
];

interface PolaroidPhotoBoothModalProps {
  visible: boolean;
  partnerName: string;
  onClose: () => void;
  onRewardHearts?: (hearts: number) => void;
}

export const PolaroidPhotoBoothModal: React.FC<PolaroidPhotoBoothModalProps> = ({
  visible,
  partnerName,
  onClose,
  onRewardHearts,
}) => {
  const [polaroids, setPolaroids] = useState<PolaroidPhoto[]>(INITIAL_POLAROIDS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [newDate, setNewDate] = useState('Today • Just Us');
  const [selectedSticker, setSelectedSticker] = useState('🧸❤️');
  const [selectedTape, setSelectedTape] = useState('#FF6B8B');

  const handleCreatePolaroid = () => {
    if (!newCaption.trim()) return;
    triggerHaptic('success');

    const created: PolaroidPhoto = {
      id: `pol_${Date.now()}`,
      imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop',
      caption: newCaption.trim(),
      dateStr: newDate.trim() || 'Today',
      sticker: selectedSticker,
      tapeColor: selectedTape,
      rotation: Math.random() > 0.5 ? '2.5deg' : '-2.5deg',
    };

    setPolaroids(prev => [created, ...prev]);
    setNewCaption('');
    setShowCreateModal(false);

    if (onRewardHearts) onRewardHearts(35);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={22} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>Polaroid Corkboard 📸📌</Text>
            <Text style={styles.headerSub}>Vintage memory prints with {partnerName}</Text>
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              triggerHaptic('light');
              setShowCreateModal(true);
            }}
          >
            <Camera size={18} color={Colors.primaryDark} />
          </TouchableOpacity>
        </View>

        {/* Corkboard Background & Polaroids */}
        <ScrollView contentContainerStyle={styles.corkboard} showsVerticalScrollIndicator={false}>
          <View style={styles.corkboardBanner}>
            <Pin size={16} color="#8A5D00" />
            <Text style={styles.corkboardBannerText}>
              Shared Digital Corkboard • Tap '+' to print & pin a new photo!
            </Text>
          </View>

          {polaroids.map((item) => (
            <View
              key={item.id}
              style={[
                styles.polaroidFrame,
                { transform: [{ rotate: item.rotation }] },
              ]}
            >
              {/* Washi Tape Pin Top */}
              <View style={[styles.washiTape, { backgroundColor: item.tapeColor }]} />

              {/* Photo */}
              <Image source={{ uri: item.imageUrl }} style={styles.polaroidImg} />

              {/* Sticker Stamp */}
              <View style={styles.stickerBadge}>
                <Text style={styles.stickerText}>{item.sticker}</Text>
              </View>

              {/* Bottom Handwritten Caption */}
              <View style={styles.captionBox}>
                <Text style={styles.captionText}>{item.caption}</Text>
                <Text style={styles.dateText}>{item.dateStr}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* CREATE POLAROID MODAL */}
        <Modal visible={showCreateModal} animationType="slide" transparent onRequestClose={() => setShowCreateModal(false)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Print a Vintage Polaroid 📸</Text>
                <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                  <X size={20} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Handwritten caption (e.g. Sunset beach kisses...)"
                placeholderTextColor={Colors.textMuted}
                value={newCaption}
                onChangeText={setNewCaption}
              />

              <TextInput
                style={styles.input}
                placeholder="Date tag (e.g. October 14, 2026)"
                placeholderTextColor={Colors.textMuted}
                value={newDate}
                onChangeText={setNewDate}
              />

              {/* Sticker Selector */}
              <Text style={styles.selectorLabel}>Choose Cute Sticker Pin:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stickerRow}>
                {['🧸❤️', '🍓✨', '💍💖', '🌹💌', '💋🔥', '☕🥐'].map((stk) => (
                  <TouchableOpacity
                    key={stk}
                    style={[styles.stickerOption, selectedSticker === stk && styles.stickerOptionSelected]}
                    onPress={() => setSelectedSticker(stk)}
                  >
                    <Text style={{ fontSize: 20 }}>{stk}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <GradientButton
                title="Print & Pin to Corkboard 📌💖"
                onPress={handleCreatePolaroid}
                disabled={!newCaption.trim()}
                style={{ width: '100%', marginTop: Spacing.md }}
              />
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6CA', // warm corkboard parchment color
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
  headerTitleBox: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  headerSub: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  addBtn: {
    padding: Spacing.xs,
    backgroundColor: '#FFEBF2',
    borderRadius: Spacing.borderRadius.full,
  },
  corkboard: {
    padding: Spacing.md,
    gap: Spacing.lg,
    alignItems: 'center',
  },
  corkboardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF4D6',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Spacing.borderRadius.full,
    borderWidth: 1,
    borderColor: '#E6C875',
    marginBottom: Spacing.xs,
  },
  corkboardBannerText: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.bold,
    color: '#8A5D00',
  },
  polaroidFrame: {
    width: width * 0.84,
    backgroundColor: '#FFFFFF',
    padding: 12,
    paddingBottom: 20,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  washiTape: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    width: 80,
    height: 20,
    opacity: 0.8,
    borderRadius: 2,
  },
  polaroidImg: {
    width: '100%',
    height: 230,
    borderRadius: 2,
    resizeMode: 'cover',
  },
  stickerBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.full,
  },
  stickerText: {
    fontSize: 16,
  },
  captionBox: {
    marginTop: 12,
    alignItems: 'center',
  },
  captionText: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: '#2C3E50',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  dateText: {
    fontSize: Typography.sizes.xs - 2,
    color: Colors.textMuted,
    marginTop: 3,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  input: {
    backgroundColor: '#FAF5F7',
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  selectorLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  stickerRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  stickerOption: {
    padding: 8,
    borderRadius: Spacing.borderRadius.md,
    backgroundColor: '#FAF5F7',
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.xs + 2,
  },
  stickerOptionSelected: {
    backgroundColor: '#FFEBF0',
    borderColor: Colors.primary,
  },
});
