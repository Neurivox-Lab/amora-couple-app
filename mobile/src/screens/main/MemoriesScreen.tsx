import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Header } from '../../components/common/Header';
import { RomanticCard } from '../../components/common/RomanticCard';
import { CreateMemoryModal } from '../../components/memories/CreateMemoryModal';
import { CreateLoveNoteModal } from '../../components/memories/CreateLoveNoteModal';
import { api } from '../../services/api';
import { Memory, LoveNote } from '../../types';
import { Camera, Mail, Plus, Lock, Heart, MapPin, Calendar, Clock, Unlock } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

const { width } = Dimensions.get('window');

export const MemoriesScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SCRAPBOOK' | 'TIMELINE' | 'NOTES'>('SCRAPBOOK');
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loveNotes, setLoveNotes] = useState<LoveNote[]>([]);
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [mems, notes] = await Promise.all([
        api.getMemories(),
        api.getLoveNotes(),
      ]);
      setMemories(mems);
      setLoveNotes(notes);
    } catch (e) {
      console.warn('Failed to load memories data', e);
    }
  };

  const handleSaveMemory = async (data: any) => {
    try {
      await api.createMemory(data);
      const updated = await api.getMemories();
      setMemories(updated);
    } catch (e) {
      console.warn('Failed to save memory', e);
    }
  };

  const handleSaveNote = async (data: any) => {
    try {
      await api.createLoveNote(data);
      const updated = await api.getLoveNotes();
      setLoveNotes(updated);
    } catch (e) {
      console.warn('Failed to save note', e);
    }
  };

  const handleOpenNote = async (id: number) => {
    triggerHaptic('success');
    try {
      await api.openLoveNote(id);
      const updated = await api.getLoveNotes();
      setLoveNotes(updated);
    } catch (e) {
      console.warn('Failed to open note', e);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Our Memories 📸" subtitle="Private couple scrapbook & timeline" />

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'SCRAPBOOK' && styles.tabBtnActive]}
          onPress={() => {
            triggerHaptic('light');
            setActiveTab('SCRAPBOOK');
          }}
        >
          <Text style={[styles.tabBtnText, activeTab === 'SCRAPBOOK' && styles.tabBtnTextActive]}>
            Scrapbook 📸
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'TIMELINE' && styles.tabBtnActive]}
          onPress={() => {
            triggerHaptic('light');
            setActiveTab('TIMELINE');
          }}
        >
          <Text style={[styles.tabBtnText, activeTab === 'TIMELINE' && styles.tabBtnTextActive]}>
            Our Story 🕰️
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'NOTES' && styles.tabBtnActive]}
          onPress={() => {
            triggerHaptic('light');
            setActiveTab('NOTES');
          }}
        >
          <Text style={[styles.tabBtnText, activeTab === 'NOTES' && styles.tabBtnTextActive]}>
            Love Letters 💌
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* TAB 1: SCRAPBOOK */}
        {activeTab === 'SCRAPBOOK' && (
          <View style={styles.tabContent}>
            <View style={styles.headerActionRow}>
              <Text style={styles.sectionTitle}>Shared Scrapbook Moments</Text>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  triggerHaptic('light');
                  setShowMemoryModal(true);
                }}
              >
                <Plus size={16} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>Add Photo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.polaroidGrid}>
              {memories.map((mem) => (
                <View key={mem.id} style={styles.polaroidCard}>
                  <Image
                    source={{ uri: mem.mediaUrls || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop' }}
                    style={styles.polaroidImage}
                  />
                  <View style={styles.polaroidCaptionBox}>
                    <View style={styles.captionTop}>
                      <Text style={styles.polaroidTitle} numberOfLines={1}>{mem.title}</Text>
                      {mem.isFavorite && <Heart size={14} color={Colors.loveRed} fill={Colors.loveRed} />}
                    </View>
                    <Text style={styles.polaroidDate}>
                      {mem.memoryDate} • {mem.locationName || 'Our Special Spot'}
                    </Text>
                    {mem.description && (
                      <Text style={styles.polaroidDesc} numberOfLines={2}>{mem.description}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TAB 2: OUR STORY TIMELINE */}
        {activeTab === 'TIMELINE' && (
          <View style={styles.tabContent}>
            <View style={styles.headerActionRow}>
              <Text style={styles.sectionTitle}>Our Love Story Timeline</Text>
            </View>

            <View style={styles.timelineLadder}>
              {[
                { title: 'First Text & Chat 💬', date: 'Dec 18, 2022', desc: 'The conversation that started it all.' },
                { title: 'First Coffee Date ☕', date: 'Jan 02, 2023', desc: 'You smiled and my heart raced.' },
                { title: 'Relationship Started Officially ❤️', date: 'Jan 12, 2023', desc: 'Promised each other forever.' },
                { title: 'First Beach Trip to Goa 🌴', date: 'Mar 14, 2023', desc: 'Sunsets, scooters, and beach walks.' },
                { title: '1 Year Anniversary Celebration 💍', date: 'Jan 12, 2024', desc: '365 days of unconditional love.' },
                { title: 'Today & Beyond ✨', date: '428 Days Together', desc: 'Writing new chapters every single day.' },
              ].map((item, idx) => (
                <View key={idx} style={styles.timelineNode}>
                  <View style={styles.timelineLeft}>
                    <View style={styles.nodeCircle}>
                      <Text style={styles.nodeEmoji}>❤️</Text>
                    </View>
                    {idx < 5 && <View style={styles.nodeConnector} />}
                  </View>
                  <RomanticCard style={styles.timelineCard}>
                    <Text style={styles.nodeTitle}>{item.title}</Text>
                    <Text style={styles.nodeDate}>{item.date}</Text>
                    <Text style={styles.nodeDesc}>{item.desc}</Text>
                  </RomanticCard>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TAB 3: LOVE LETTERS & TIME CAPSULES */}
        {activeTab === 'NOTES' && (
          <View style={styles.tabContent}>
            <View style={styles.headerActionRow}>
              <Text style={styles.sectionTitle}>Sealed Love Letters</Text>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  triggerHaptic('light');
                  setShowNoteModal(true);
                }}
              >
                <Plus size={16} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>Write Letter</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.notesList}>
              {loveNotes.map((note) => {
                const isLocked = !note.isOpened && note.category === 'OPEN_WHEN';
                return (
                  <RomanticCard key={note.id} style={styles.noteCard}>
                    <View style={styles.noteHeader}>
                      <Text style={styles.noteTitle}>{note.title || 'Love Letter'}</Text>
                      {isLocked ? (
                        <View style={styles.lockBadge}>
                          <Lock size={12} color="#D35400" />
                          <Text style={styles.lockBadgeText}>LOCKED CAPSULE</Text>
                        </View>
                      ) : (
                        <View style={styles.openBadge}>
                          <Unlock size={12} color={Colors.emeraldGreen} />
                          <Text style={styles.openBadgeText}>OPENED</Text>
                        </View>
                      )}
                    </View>

                    {isLocked ? (
                      <View style={styles.lockedNoteBody}>
                        <Text style={styles.conditionPrompt}>
                          Condition to unlock: {note.unlockCondition}
                        </Text>
                        <TouchableOpacity
                          style={styles.openNowBtn}
                          onPress={() => handleOpenNote(note.id)}
                        >
                          <Text style={styles.openNowBtnText}>I Need This Now — Unlock 🔓</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <Text style={styles.noteMessage}>{note.message}</Text>
                    )}

                    <Text style={styles.noteFrom}>From: {note.sender?.name || 'Partner'} ❤️</Text>
                  </RomanticCard>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <CreateMemoryModal
        visible={showMemoryModal}
        onClose={() => setShowMemoryModal(false)}
        onSave={handleSaveMemory}
      />

      <CreateLoveNoteModal
        visible={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        onSave={handleSaveNote}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FAF5F7',
    marginHorizontal: Spacing.md,
    borderRadius: Spacing.borderRadius.lg,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xs,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  tabBtnTextActive: {
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
  scroll: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  tabContent: {
    paddingVertical: Spacing.xs,
  },
  headerActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Spacing.borderRadius.full,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  polaroidGrid: {
    gap: Spacing.md,
  },
  polaroidCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.sm,
    borderWidth: 1.5,
    borderColor: '#FFEBF0',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  polaroidImage: {
    width: '100%',
    height: 200,
    borderRadius: Spacing.borderRadius.md,
    resizeMode: 'cover',
  },
  polaroidCaptionBox: {
    paddingHorizontal: Spacing.xs,
    paddingTop: Spacing.sm,
  },
  captionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  polaroidTitle: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    flex: 1,
  },
  polaroidDate: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  polaroidDesc: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textPrimary,
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 18,
  },
  timelineLadder: {
    marginTop: Spacing.xs,
  },
  timelineNode: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 32,
  },
  nodeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFEBF0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  nodeEmoji: {
    fontSize: 14,
  },
  nodeConnector: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.primaryLight,
    marginTop: 4,
  },
  timelineCard: {
    flex: 1,
    padding: Spacing.sm + 2,
  },
  nodeTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  nodeDate: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.primaryDark,
    fontWeight: Typography.weights.semibold,
    marginVertical: 2,
  },
  nodeDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  notesList: {
    gap: Spacing.sm,
  },
  noteCard: {
    padding: Spacing.md,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  noteTitle: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    flex: 1,
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Spacing.borderRadius.full,
  },
  lockBadgeText: {
    fontSize: Typography.sizes.xs - 2,
    fontWeight: Typography.weights.bold,
    color: '#D35400',
  },
  openBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EBFBEE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Spacing.borderRadius.full,
  },
  openBadgeText: {
    fontSize: Typography.sizes.xs - 2,
    fontWeight: Typography.weights.bold,
    color: Colors.emeraldGreen,
  },
  lockedNoteBody: {
    backgroundColor: '#FFF8FA',
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
    marginVertical: Spacing.xs,
    alignItems: 'center',
  },
  conditionPrompt: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  openNowBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.borderRadius.full,
  },
  openNowBtnText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  noteMessage: {
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    lineHeight: 22,
    fontStyle: 'italic',
    backgroundColor: '#FFFBFD',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    marginVertical: Spacing.xs,
  },
  noteFrom: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: 4,
    fontWeight: Typography.weights.semibold,
  },
});
