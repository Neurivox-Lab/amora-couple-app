import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { CoupleStory } from '../../types';
import { Plus, Mic, Type, Camera } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';

interface StoriesTrayProps {
  stories: CoupleStory[];
  onAddStoryPress: () => void;
  onViewStoryPress: (story: CoupleStory) => void;
}

export const StoriesTray: React.FC<StoriesTrayProps> = ({
  stories,
  onAddStoryPress,
  onViewStoryPress,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {/* 1. Add Story Bubble */}
        <TouchableOpacity
          style={styles.storyBubble}
          onPress={() => {
            triggerHaptic('medium');
            onAddStoryPress();
          }}
          activeOpacity={0.8}
        >
          <View style={styles.addStoryRing}>
            <View style={styles.addStoryInner}>
              <Text style={styles.addStoryEmoji}>🧸</Text>
              <View style={styles.plusBadge}>
                <Plus size={12} color="#FFFFFF" />
              </View>
            </View>
          </View>
          <Text style={styles.bubbleLabel}>Add Story</Text>
        </TouchableOpacity>

        {/* 2. Active Stories List */}
        {stories.map((story) => (
          <TouchableOpacity
            key={story.id}
            style={styles.storyBubble}
            onPress={() => {
              triggerHaptic('light');
              onViewStoryPress(story);
            }}
            activeOpacity={0.8}
          >
            <View style={[styles.storyRing, !story.isViewed && styles.storyRingUnviewed]}>
              <View style={[styles.storyInner, { backgroundColor: story.bgGradient ? story.bgGradient[0] : Colors.primaryLight }]}>
                {story.type === 'VOICE' ? (
                  <Text style={styles.storyTypeIcon}>🎙️</Text>
                ) : story.type === 'VIDEO_PHOTO' ? (
                  <Text style={styles.storyTypeIcon}>📸</Text>
                ) : (
                  <Text style={styles.storyTypeIcon}>📝</Text>
                )}
              </View>
            </View>
            <Text style={styles.bubbleLabel} numberOfLines={1}>
              {story.authorName}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xs,
  },
  scroll: {
    paddingHorizontal: Spacing.md,
  },
  storyBubble: {
    alignItems: 'center',
    marginRight: Spacing.md,
    width: 68,
  },
  addStoryRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: '#FFEBF0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  addStoryInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  addStoryEmoji: {
    fontSize: 24,
  },
  plusBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  storyRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    padding: 2.5,
    borderWidth: 2,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyRingUnviewed: {
    borderColor: Colors.primary,
    borderWidth: 2.5,
  },
  storyInner: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyTypeIcon: {
    fontSize: 22,
  },
  bubbleLabel: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textPrimary,
    fontWeight: Typography.weights.semibold,
    marginTop: 4,
    textAlign: 'center',
  },
});
