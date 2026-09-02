import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Header } from '../../components/common/Header';
import { RomanticCard } from '../../components/common/RomanticCard';
import { GradientButton } from '../../components/common/GradientButton';
import { DateGeneratorModal } from '../../components/explore/DateGeneratorModal';
import { ScratchCardView } from '../../components/explore/ScratchCardView';
import { BucketListModal } from '../../components/explore/BucketListModal';
import { api } from '../../services/api';
import { BucketListItem, DatePlan } from '../../types';
import { Sparkles, Calendar, Gift, CheckSquare, Plus, ArrowRight, CheckCircle2, Circle } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

export const ExploreScreen: React.FC = () => {
  const [bucketList, setBucketList] = useState<BucketListItem[]>([]);
  const [datePlans, setDatePlans] = useState<DatePlan[]>([]);
  const [showDateGenModal, setShowDateGenModal] = useState(false);
  const [showBucketModal, setShowBucketModal] = useState(false);

  useEffect(() => {
    loadExploreData();
  }, []);

  const loadExploreData = async () => {
    try {
      const [bucket, plans] = await Promise.all([
        api.getBucketList(),
        api.getMemories(), // or plans
      ]);
      setBucketList(bucket);
    } catch (e) {
      console.warn('Failed to load explore data', e);
    }
  };

  const handleToggleBucketItem = async (id: number) => {
    triggerHaptic('success');
    try {
      await api.toggleBucketItem(id);
      const updated = await api.getBucketList();
      setBucketList(updated);
    } catch (e) {
      console.warn('Failed to toggle bucket item', e);
    }
  };

  const handleAddBucketItem = async (data: any) => {
    try {
      await api.addBucketItem(data);
      const updated = await api.getBucketList();
      setBucketList(updated);
    } catch (e) {
      console.warn('Failed to add bucket item', e);
    }
  };

  const completedCount = bucketList.filter(b => b.isCompleted).length;

  return (
    <View style={styles.container}>
      <Header title="Explore & Dates 📅" subtitle="Plan romantic dates & conquer bucket lists" />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* 1. Date Planner Hero Card */}
        <RomanticCard style={styles.datePlannerCard} variant="glass">
          <View style={styles.plannerHeader}>
            <View style={styles.plannerBadge}>
              <Sparkles size={14} color={Colors.primary} />
              <Text style={styles.plannerBadgeText}>CUPID AI DATE ARCHITECT</Text>
            </View>
            <Text style={styles.budgetTag}>Tailored Itineraries</Text>
          </View>

          <Text style={styles.plannerTitle}>Plan Your Next Unforgettable Date ❤️</Text>
          <Text style={styles.plannerSub}>
            Select your mood, time, and budget — Cupid AI generates a timed schedule with cozy spots and activities.
          </Text>

          <GradientButton
            title="Create Dream Date Plan ✨"
            onPress={() => {
              triggerHaptic('medium');
              setShowDateGenModal(true);
            }}
            style={styles.planBtn}
          />
        </RomanticCard>

        {/* 2. Mystery Scratch-Off Date Cards */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View>
              <Text style={styles.sectionTitle}>Mystery Date Scratch Cards 🎟️</Text>
              <Text style={styles.sectionSubtitle}>Scratch to reveal surprises for this weekend!</Text>
            </View>
          </View>

          <View style={styles.scratchGrid}>
            <ScratchCardView
              number={1}
              title="Midnight Stargazing & Acoustic Playlist 🌌"
              category="Romantic Night"
              isUnlocked={true}
            />
            <ScratchCardView
              number={2}
              title="Blindfold Taste Test & Cooking Challenge 🍲"
              category="Fun & Foodie"
              isUnlocked={false}
            />
            <ScratchCardView
              number={3}
              title="Sunrise Hike & Warm Coffee Thermos ☕"
              category="Adventure"
              isUnlocked={false}
            />
          </View>
        </View>

        {/* 3. Shared Couple Bucket List */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View>
              <Text style={styles.sectionTitle}>Our Shared Bucket List 🪣</Text>
              <Text style={styles.sectionSubtitle}>
                {completedCount} / {bucketList.length} Goals Completed
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => {
                triggerHaptic('light');
                setShowBucketModal(true);
              }}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.addBtnText}>Add Goal</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${bucketList.length > 0 ? (completedCount / bucketList.length) * 100 : 0}%` },
              ]}
            />
          </View>

          <View style={styles.bucketItemsList}>
            {bucketList.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.bucketCard, item.isCompleted && styles.bucketCardDone]}
                onPress={() => handleToggleBucketItem(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.checkCol}>
                  {item.isCompleted ? (
                    <CheckCircle2 size={22} color={Colors.emeraldGreen} />
                  ) : (
                    <Circle size={22} color={Colors.textMuted} />
                  )}
                </View>

                <View style={styles.bucketInfo}>
                  <Text style={[styles.bucketTitle, item.isCompleted && styles.bucketTitleDone]}>
                    {item.title}
                  </Text>
                  {item.notes && <Text style={styles.bucketNotes}>{item.notes}</Text>}
                </View>

                <View style={styles.catBadge}>
                  <Text style={styles.catBadgeText}>{item.category}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 4. 7-Day Couple Challenge */}
        <RomanticCard style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <Text style={styles.challengeBadge}>7-DAY INTIMACY CHALLENGE</Text>
            <Text style={styles.challengeDays}>Day 3 of 7</Text>
          </View>

          <Text style={styles.challengeTaskTitle}>
            Today's Mission: Send a 15-second voice message describing your favorite memory together 🎙️
          </Text>

          <View style={styles.challengeDaysRow}>
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <View key={d} style={[styles.dayCircle, d <= 2 && styles.dayCircleDone, d === 3 && styles.dayCircleCurrent]}>
                <Text style={[styles.dayText, d <= 2 && styles.dayTextDone, d === 3 && styles.dayTextCurrent]}>
                  {d <= 2 ? '✓' : `D${d}`}
                </Text>
              </View>
            ))}
          </View>
        </RomanticCard>
      </ScrollView>

      {/* Modals */}
      <DateGeneratorModal
        visible={showDateGenModal}
        onClose={() => setShowDateGenModal(false)}
      />

      <BucketListModal
        visible={showBucketModal}
        onClose={() => setShowBucketModal(false)}
        onAdd={handleAddBucketItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  datePlannerCard: {
    marginVertical: Spacing.xs,
  },
  plannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  plannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFEBF2',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Spacing.borderRadius.full,
  },
  plannerBadgeText: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  budgetTag: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.semibold,
  },
  plannerTitle: {
    fontSize: Typography.sizes.md + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  plannerSub: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  planBtn: {
    marginTop: 0,
  },
  section: {
    marginVertical: Spacing.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  scratchGrid: {
    gap: Spacing.xs,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Spacing.borderRadius.full,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#FAF0F4',
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: Spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  bucketItemsList: {
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  bucketCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  bucketCardDone: {
    backgroundColor: '#F9FFF9',
    borderColor: '#D4EDDA',
  },
  checkCol: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bucketInfo: {
    flex: 1,
  },
  bucketTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  bucketTitleDone: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  bucketNotes: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  catBadge: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Spacing.borderRadius.sm,
  },
  catBadgeText: {
    fontSize: Typography.sizes.xs - 2,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
  },
  challengeCard: {
    marginVertical: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  challengeBadge: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.heavy,
    color: '#8E44AD',
  },
  challengeDays: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
  },
  challengeTaskTitle: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    lineHeight: 20,
    marginVertical: Spacing.xs,
  },
  challengeDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F2F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleDone: {
    backgroundColor: Colors.emeraldGreen,
  },
  dayCircleCurrent: {
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.primaryDark,
  },
  dayText: {
    fontSize: Typography.sizes.xs - 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
  },
  dayTextDone: {
    color: '#FFFFFF',
  },
  dayTextCurrent: {
    color: '#FFFFFF',
  },
});
