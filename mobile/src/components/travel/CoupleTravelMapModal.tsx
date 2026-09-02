import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, Dimensions, Image } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../common/GradientButton';
import { MapPin, Plane, Plus, Sparkles, X, Compass, Calendar, Camera, Heart, CheckCircle2 } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

const { width } = Dimensions.get('window');

interface TravelPin {
  id: string;
  cityName: string;
  country: string;
  status: 'VISITED' | 'WISHLIST';
  dateOrYear?: string;
  notes: string;
  imageUrl: string;
  flagEmoji: string;
}

const INITIAL_PINS: TravelPin[] = [
  {
    id: 'p1',
    cityName: 'Goa',
    country: 'India',
    status: 'VISITED',
    dateOrYear: 'March 2026',
    notes: 'Sunset walks, coconut water, laughing till our bellies hurt, and midnight beach strolls.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
    flagEmoji: '🏖️',
  },
  {
    id: 'p2',
    cityName: 'Kyoto',
    country: 'Japan',
    status: 'WISHLIST',
    dateOrYear: 'Spring 2027',
    notes: 'Walk hand-in-hand beneath pink cherry blossoms and eat fresh matcha soft serve.',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop',
    flagEmoji: '🌸',
  },
  {
    id: 'p3',
    cityName: 'Paris',
    country: 'France',
    status: 'WISHLIST',
    dateOrYear: 'Autumn 2027',
    notes: 'Picnic by the Eiffel Tower with fresh croissants and vintage wine.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop',
    flagEmoji: '🥐',
  },
  {
    id: 'p4',
    cityName: 'Bali',
    country: 'Indonesia',
    status: 'VISITED',
    dateOrYear: 'November 2025',
    notes: 'Floating breakfast in the infinity pool and tropical waterfall adventures.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop',
    flagEmoji: '🌴',
  },
];

interface CoupleTravelMapModalProps {
  visible: boolean;
  partnerName: string;
  onClose: () => void;
  onRewardHearts?: (hearts: number) => void;
}

export const CoupleTravelMapModal: React.FC<CoupleTravelMapModalProps> = ({
  visible,
  partnerName,
  onClose,
  onRewardHearts,
}) => {
  const [pins, setPins] = useState<TravelPin[]>(INITIAL_PINS);
  const [activeTab, setActiveTab] = useState<'ALL' | 'VISITED' | 'WISHLIST'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [notes, setNotes] = useState('');
  const [isVisited, setIsVisited] = useState(true);

  const filteredPins = activeTab === 'ALL'
    ? pins
    : pins.filter(p => p.status === activeTab);

  const visitedCount = pins.filter(p => p.status === 'VISITED').length;
  const wishlistCount = pins.filter(p => p.status === 'WISHLIST').length;

  const handleAddPin = () => {
    if (!cityName.trim()) return;
    triggerHaptic('success');

    const newPin: TravelPin = {
      id: `pin_${Date.now()}`,
      cityName: cityName.trim(),
      country: country.trim() || 'World',
      status: isVisited ? 'VISITED' : 'WISHLIST',
      dateOrYear: isVisited ? 'Recently' : 'Upcoming Dream',
      notes: notes.trim() || 'Another unforgettable adventure together!',
      imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop',
      flagEmoji: '✈️',
    };

    setPins(prev => [newPin, ...prev]);
    setCityName('');
    setCountry('');
    setNotes('');
    setShowAddModal(false);

    if (onRewardHearts) onRewardHearts(30);
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
            <Text style={styles.headerTitle}>Our Travel Scratch Map 🗺️✈️</Text>
            <Text style={styles.headerSub}>Places we’ve loved & dream trips with {partnerName}</Text>
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              triggerHaptic('light');
              setShowAddModal(true);
            }}
          >
            <Plus size={18} color={Colors.primaryDark} />
          </TouchableOpacity>
        </View>

        {/* Travel Stats Metrics Card */}
        <View style={styles.statsCard}>
          <View style={styles.statCol}>
            <Text style={styles.statVal}>{visitedCount}</Text>
            <Text style={styles.statLabel}>Places Visited 📍</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statVal}>{wishlistCount}</Text>
            <Text style={styles.statLabel}>Wishlist Trips ✈️</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statVal}>12,400</Text>
            <Text style={styles.statLabel}>Km Traveled 💖</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabChip, activeTab === 'ALL' && styles.tabChipActive]}
            onPress={() => setActiveTab('ALL')}
          >
            <Text style={[styles.tabText, activeTab === 'ALL' && styles.tabTextActive]}>
              All Pins ({pins.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabChip, activeTab === 'VISITED' && styles.tabChipActive]}
            onPress={() => setActiveTab('VISITED')}
          >
            <Text style={[styles.tabText, activeTab === 'VISITED' && styles.tabTextActive]}>
              Visited ({visitedCount}) 📍
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabChip, activeTab === 'WISHLIST' && styles.tabChipActive]}
            onPress={() => setActiveTab('WISHLIST')}
          >
            <Text style={[styles.tabText, activeTab === 'WISHLIST' && styles.tabTextActive]}>
              Wishlist ({wishlistCount}) ✨
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pins List */}
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {filteredPins.map((pin) => (
            <View key={pin.id} style={styles.pinCard}>
              <Image source={{ uri: pin.imageUrl }} style={styles.pinImage} />

              <View style={styles.pinInfo}>
                <View style={styles.pinTopRow}>
                  <View style={styles.pinTitleRow}>
                    <Text style={styles.pinFlag}>{pin.flagEmoji}</Text>
                    <Text style={styles.pinCity}>{pin.cityName}, {pin.country}</Text>
                  </View>
                  <View style={[styles.statusTag, pin.status === 'VISITED' ? styles.tagVisited : styles.tagWishlist]}>
                    <Text style={[styles.statusTagText, pin.status === 'VISITED' ? styles.textVisited : styles.textWishlist]}>
                      {pin.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.pinDate}>{pin.dateOrYear}</Text>
                <Text style={styles.pinNotes}>"{pin.notes}"</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* ADD PIN MODAL */}
        <Modal visible={showAddModal} animationType="slide" transparent onRequestClose={() => setShowAddModal(false)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Pin a City or Dream Trip 📍</Text>
                <TouchableOpacity onPress={() => setShowAddModal(false)}>
                  <X size={20} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Visited vs Wishlist toggle */}
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[styles.toggleBtn, isVisited && styles.toggleBtnActive]}
                  onPress={() => setIsVisited(true)}
                >
                  <Text style={[styles.toggleText, isVisited && styles.toggleTextActive]}>
                    We Visited Here 📍
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.toggleBtn, !isVisited && styles.toggleBtnActive]}
                  onPress={() => setIsVisited(false)}
                >
                  <Text style={[styles.toggleText, !isVisited && styles.toggleTextActive]}>
                    Dream Wishlist ✨
                  </Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="City Name (e.g. Rome / Tokyo)"
                placeholderTextColor={Colors.textMuted}
                value={cityName}
                onChangeText={setCityName}
              />

              <TextInput
                style={styles.input}
                placeholder="Country (e.g. Italy / Japan)"
                placeholderTextColor={Colors.textMuted}
                value={country}
                onChangeText={setCountry}
              />

              <TextInput
                style={[styles.input, { minHeight: 70 }]}
                placeholder="Our favorite memories or what we want to do there..."
                placeholderTextColor={Colors.textMuted}
                value={notes}
                onChangeText={setNotes}
                multiline
              />

              <GradientButton
                title="Save Pin to Our World Map ✈️💖"
                onPress={handleAddPin}
                disabled={!cityName.trim()}
                style={{ width: '100%', marginTop: Spacing.sm }}
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
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    margin: Spacing.md,
    marginBottom: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.borderRadius.xl,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
  },
  statCol: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.heavy,
    color: Colors.primaryDark,
  },
  statLabel: {
    fontSize: Typography.sizes.xs - 2,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.bold,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#FFE0EB',
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    gap: Spacing.xs + 2,
  },
  tabChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Spacing.borderRadius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabChipActive: {
    backgroundColor: '#FFEBF2',
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.semibold,
  },
  tabTextActive: {
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
  scroll: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  pinCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  pinImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  pinInfo: {
    padding: Spacing.md,
  },
  pinTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pinTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pinFlag: {
    fontSize: 18,
  },
  pinCity: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Spacing.borderRadius.full,
  },
  tagVisited: {
    backgroundColor: '#E8F8EE',
  },
  tagWishlist: {
    backgroundColor: '#FFF0F5',
  },
  statusTagText: {
    fontSize: 9,
    fontWeight: Typography.weights.heavy,
  },
  textVisited: {
    color: Colors.emeraldGreen,
  },
  textWishlist: {
    color: Colors.primaryDark,
  },
  pinDate: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textMuted,
    marginTop: 2,
  },
  pinNotes: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
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
  toggleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Spacing.borderRadius.full,
    alignItems: 'center',
    backgroundColor: '#FAF5F7',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  toggleText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
  },
  toggleTextActive: {
    color: '#FFFFFF',
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
});
