import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../common/GradientButton';
import { X, Sparkles, MapPin, Clock, DollarSign } from 'lucide-react-native';
import { api } from '../../services/api';
import { CupidAIResponse } from '../../types';
import { triggerHaptic } from '../../utils/haptics';

interface DateGeneratorModalProps {
  visible: boolean;
  onClose: () => void;
  onSavePlan?: (plan: any) => void;
}

const MOODS = ['Romantic ❤️', 'Fun & Silly 😂', 'Relaxing 🌿', 'Adventure 🏔️', 'Foodie 🍕', 'Movie Night 🎬'];
const BUDGETS = ['₹0–500 (Budget)', '₹500–1500 (Moderate)', '₹1500+ (Special)'];
const DURATIONS = ['2 Hours', 'Half Day (4-5 hrs)', 'Full Day'];

export const DateGeneratorModal: React.FC<DateGeneratorModalProps> = ({ visible, onClose, onSavePlan }) => {
  const [selectedMood, setSelectedMood] = useState(MOODS[0]);
  const [selectedBudget, setSelectedBudget] = useState(BUDGETS[1]);
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[1]);
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<CupidAIResponse | null>(null);

  const handleGenerate = async () => {
    triggerHaptic('heavy');
    setLoading(true);
    try {
      const response = await api.generateCupidAI({
        mode: 'DATE_PLANNER',
        mood: selectedMood.split(' ')[0],
        budget: selectedBudget.split(' ')[0],
        duration: selectedDuration,
      });
      setGeneratedPlan(response);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setGeneratedPlan(null);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <Sparkles size={20} color={Colors.primary} />
              <Text style={styles.title}>AI Date Planner ❤️</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {!generatedPlan ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionTitle}>1. What's Your Couple Mood?</Text>
              <View style={styles.chipGrid}>
                {MOODS.map((mood) => (
                  <TouchableOpacity
                    key={mood}
                    style={[styles.chip, selectedMood === mood && styles.chipSelected]}
                    onPress={() => {
                      triggerHaptic('light');
                      setSelectedMood(mood);
                    }}
                  >
                    <Text style={[styles.chipText, selectedMood === mood && styles.chipTextSelected]}>
                      {mood}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>2. Estimated Budget</Text>
              <View style={styles.chipGrid}>
                {BUDGETS.map((budget) => (
                  <TouchableOpacity
                    key={budget}
                    style={[styles.chip, selectedBudget === budget && styles.chipSelected]}
                    onPress={() => {
                      triggerHaptic('light');
                      setSelectedBudget(budget);
                    }}
                  >
                    <Text style={[styles.chipText, selectedBudget === budget && styles.chipTextSelected]}>
                      {budget}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>3. Time Available</Text>
              <View style={styles.chipGrid}>
                {DURATIONS.map((dur) => (
                  <TouchableOpacity
                    key={dur}
                    style={[styles.chip, selectedDuration === dur && styles.chipSelected]}
                    onPress={() => {
                      triggerHaptic('light');
                      setSelectedDuration(dur);
                    }}
                  >
                    <Text style={[styles.chipText, selectedDuration === dur && styles.chipTextSelected]}>
                      {dur}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <GradientButton
                title="Generate Dream Date Plan ✨"
                onPress={handleGenerate}
                loading={loading}
                style={styles.generateButton}
              />
            </ScrollView>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>{generatedPlan.title}</Text>

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <DollarSign size={14} color={Colors.emeraldGreen} />
                    <Text style={styles.metaText}>{generatedPlan.estimatedCost || '₹1,200'}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Clock size={14} color={Colors.primary} />
                    <Text style={styles.metaText}>{selectedDuration}</Text>
                  </View>
                </View>

                <View style={styles.itineraryBox}>
                  <Text style={styles.itineraryText}>{generatedPlan.content}</Text>
                </View>

                {generatedPlan.suggestions && generatedPlan.suggestions.length > 0 && (
                  <View style={styles.tipsBox}>
                    <Text style={styles.tipsHeader}>💡 Romantic Pro-Tips:</Text>
                    {generatedPlan.suggestions.map((tip, index) => (
                      <Text key={index} style={styles.tipItem}>• {tip}</Text>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.resultActions}>
                <TouchableOpacity style={styles.secondaryBtn} onPress={handleReset}>
                  <Text style={styles.secondaryBtnText}>Try Another Mood 🔄</Text>
                </TouchableOpacity>
                <GradientButton
                  title="Save Date Plan ❤️"
                  onPress={() => {
                    triggerHaptic('success');
                    if (onSavePlan) onSavePlan(generatedPlan);
                    onClose();
                  }}
                  style={styles.saveBtn}
                />
              </View>
            </ScrollView>
          )}
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
    maxHeight: '85%',
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
    marginBottom: Spacing.md,
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
  sectionTitle: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs + 2,
    marginBottom: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Spacing.borderRadius.full,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: '#FFEBF0',
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  chipTextSelected: {
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
  generateButton: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  resultCard: {
    backgroundColor: '#FFF8FA',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#FFCCD8',
    marginBottom: Spacing.md,
  },
  resultTitle: {
    fontSize: Typography.sizes.md + 2,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
    marginBottom: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  itineraryBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
    marginVertical: Spacing.xs,
  },
  itineraryText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  tipsBox: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#FFE0E8',
  },
  tipsHeader: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  tipItem: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  resultActions: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  secondaryBtn: {
    paddingVertical: 12,
    borderRadius: Spacing.borderRadius.lg,
    backgroundColor: '#F1F2F6',
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  saveBtn: {
    marginTop: 0,
  },
});
