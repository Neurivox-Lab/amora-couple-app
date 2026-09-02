import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../common/GradientButton';
import { X, Camera, MapPin, Calendar, Heart, Image as ImageIcon } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

interface CreateMemoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (memory: any) => void;
}

const SAMPLE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop',
];

const MOOD_TAGS = ['Romantic 🕯️', 'Trip ✈️', 'Milestone 💍', 'Fun 😂', 'Foodie 🍕', 'Firsts ✨'];

export const CreateMemoryModal: React.FC<CreateMemoryModalProps> = ({ visible, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(SAMPLE_PHOTO_PRESETS[0]);
  const [selectedTag, setSelectedTag] = useState('Romantic');
  const [isFavorite, setIsFavorite] = useState(false);

  const handleSave = () => {
    if (!title.trim()) return;
    triggerHaptic('success');
    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      locationName: locationName.trim() || undefined,
      mediaUrls: selectedPhoto,
      moodTag: selectedTag,
      isFavorite,
      memoryDate: new Date().toISOString().split('T')[0],
    });
    setTitle('');
    setDescription('');
    setLocationName('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <Camera size={20} color={Colors.primary} />
              <Text style={styles.title}>Capture Memory 📸</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Selected Photo Preview */}
            <View style={styles.photoPreviewWrapper}>
              <Image source={{ uri: selectedPhoto }} style={styles.photoPreview} />
              <View style={styles.photoBadge}>
                <ImageIcon size={14} color="#FFFFFF" />
                <Text style={styles.photoBadgeText}>Select Photo</Text>
              </View>
            </View>

            {/* Photo Preset Selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
              {SAMPLE_PHOTO_PRESETS.map((photo, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.thumbBox, selectedPhoto === photo && styles.thumbBoxSelected]}
                  onPress={() => {
                    triggerHaptic('light');
                    setSelectedPhoto(photo);
                  }}
                >
                  <Image source={{ uri: photo }} style={styles.thumbImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>Memory Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Sunset in Goa, Cozy Coffee Date..."
              placeholderTextColor={Colors.textMuted}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Location / Place (optional)</Text>
            <View style={styles.inputWithIcon}>
              <MapPin size={18} color={Colors.primary} />
              <TextInput
                style={styles.innerInput}
                placeholder="e.g. Palolem Beach, Skyline Cafe..."
                placeholderTextColor={Colors.textMuted}
                value={locationName}
                onChangeText={setLocationName}
              />
            </View>

            <Text style={styles.label}>Category Tag</Text>
            <View style={styles.tagGrid}>
              {MOOD_TAGS.map((tag) => {
                const tagClean = tag.split(' ')[0];
                const isSelected = selectedTag === tagClean;
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.tagChip, isSelected && styles.tagChipSelected]}
                    onPress={() => {
                      triggerHaptic('light');
                      setSelectedTag(tagClean);
                    }}
                  >
                    <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>What happened? (Our Story)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Write the sweet details of what made this moment unforgettable..."
              placeholderTextColor={Colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            {/* Favorite Toggle */}
            <TouchableOpacity
              style={styles.favoriteRow}
              onPress={() => {
                triggerHaptic('light');
                setIsFavorite(!isFavorite);
              }}
            >
              <Heart size={20} color={isFavorite ? Colors.loveRed : Colors.textSecondary} fill={isFavorite ? Colors.loveRed : 'none'} />
              <Text style={styles.favoriteText}>Add to Favorite Highlights</Text>
            </TouchableOpacity>

            <GradientButton
              title="Save to Our Scrapbook ❤️"
              onPress={handleSave}
              disabled={!title.trim()}
              style={styles.saveBtn}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 13, 22, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: Spacing.borderRadius.xl,
    borderTopRightRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  photoPreviewWrapper: {
    width: '100%',
    height: 180,
    borderRadius: Spacing.borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: Spacing.xs,
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  photoBadgeText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  presetScroll: {
    flexDirection: 'row',
    marginVertical: Spacing.xs,
  },
  thumbBox: {
    width: 60,
    height: 60,
    borderRadius: Spacing.borderRadius.md,
    overflow: 'hidden',
    marginRight: Spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbBoxSelected: {
    borderColor: Colors.primary,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FAF5F7',
    borderRadius: Spacing.borderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5F7',
    borderRadius: Spacing.borderRadius.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  innerInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs + 2,
    marginBottom: 4,
  },
  tagChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Spacing.borderRadius.full,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  tagChipSelected: {
    backgroundColor: '#FFEBF0',
    borderColor: Colors.primary,
  },
  tagText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  tagTextSelected: {
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
  favoriteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  favoriteText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
  },
  saveBtn: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
});
