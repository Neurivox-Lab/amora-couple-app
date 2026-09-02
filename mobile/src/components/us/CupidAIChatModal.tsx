import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../common/GradientButton';
import { X, Bot, Sparkles, Send, Copy, Check } from 'lucide-react-native';
import { api } from '../../services/api';
import { CupidAIResponse } from '../../types';
import { triggerHaptic } from '../../utils/haptics';

interface CupidAIChatModalProps {
  visible: boolean;
  onClose: () => void;
}

const CUPID_MODES = [
  { id: 'DATE_PLANNER', label: 'Plan Date 🗺️', prompt: 'Plan a cozy rainy evening date under ₹1000' },
  { id: 'LOVE_LETTER', label: 'Love Letter 💌', prompt: 'Write a sweet romantic letter thanking them for making me smile' },
  { id: 'CONFLICT_COACH', label: 'Empathy Coach 🕊️', prompt: 'How do I gently bring up that I need more quality time together without blaming them?' },
  { id: 'CONVERSATION_STARTER', label: 'Deep Talks 💭', prompt: 'Give us 5 deep questions for dinner tonight' },
  { id: 'SURPRISE_ME', label: 'Surprise Idea 🎁', prompt: 'Suggest a quick 10-minute unexpected romantic surprise' },
];

export const CupidAIChatModal: React.FC<CupidAIChatModalProps> = ({ visible, onClose }) => {
  const [selectedMode, setSelectedMode] = useState('DATE_PLANNER');
  const [promptInput, setPromptInput] = useState(CUPID_MODES[0].prompt);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CupidAIResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const handleModeChange = (mode: typeof CUPID_MODES[0]) => {
    triggerHaptic('light');
    setSelectedMode(mode.id);
    setPromptInput(mode.prompt);
    setResponse(null);
  };

  const handleAskCupid = async () => {
    if (!promptInput.trim()) return;
    triggerHaptic('heavy');
    setLoading(true);
    setCopied(false);
    try {
      const res = await api.generateCupidAI({
        mode: selectedMode,
        prompt: promptInput.trim(),
        mood: 'Romantic',
      });
      setResponse(res);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    triggerHaptic('success');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Top Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <View style={styles.botIconCircle}>
                <Bot size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.title}>Cupid AI Companion ❤️</Text>
                <Text style={styles.subtitle}>Your 24/7 romantic wingman & relationship guide</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Quick Mode Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modesScroll}>
            {CUPID_MODES.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={[styles.modeChip, selectedMode === mode.id && styles.modeChipSelected]}
                onPress={() => handleModeChange(mode)}
              >
                <Text style={[styles.modeText, selectedMode === mode.id && styles.modeTextSelected]}>
                  {mode.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.bodyScroll}>
            {/* Input Box */}
            <Text style={styles.inputLabel}>Ask Cupid Anything:</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={promptInput}
                onChangeText={setPromptInput}
                placeholder="Type your prompt..."
                placeholderTextColor={Colors.textMuted}
                multiline
              />
              <TouchableOpacity
                style={[styles.sendBtn, !promptInput.trim() && styles.sendBtnDisabled]}
                onPress={handleAskCupid}
                disabled={!promptInput.trim() || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Send size={16} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>

            {/* AI Generated Result */}
            {response && (
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>{response.title}</Text>
                  <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
                    {copied ? <Check size={16} color={Colors.emeraldGreen} /> : <Copy size={16} color={Colors.textSecondary} />}
                    <Text style={styles.copyText}>{copied ? 'Copied!' : 'Copy'}</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.resultBody}>{response.content}</Text>

                {response.suggestions && response.suggestions.length > 0 && (
                  <View style={styles.tipsBox}>
                    <Text style={styles.tipsTitle}>💡 Cupid's Advice:</Text>
                    {response.suggestions.map((s, idx) => (
                      <Text key={idx} style={styles.tipText}>• {s}</Text>
                    ))}
                  </View>
                )}
              </View>
            )}
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
  botIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.sizes.md + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  modesScroll: {
    flexDirection: 'row',
    marginVertical: Spacing.xs,
  },
  modeChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Spacing.borderRadius.full,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginRight: Spacing.xs + 2,
  },
  modeChipSelected: {
    backgroundColor: '#FFEBF0',
    borderColor: Colors.primary,
  },
  modeText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  modeTextSelected: {
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
  bodyScroll: {
    marginTop: Spacing.sm,
  },
  inputLabel: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FAF5F7',
    borderRadius: Spacing.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  textInput: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    minHeight: 48,
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: Colors.primary,
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  resultCard: {
    backgroundColor: '#FFF8FA',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#FFCCD8',
    marginBottom: Spacing.xl,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  resultTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
    flex: 1,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  copyText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.semibold,
  },
  resultBody: {
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginVertical: Spacing.xs,
  },
  tipsBox: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#FFE0E8',
  },
  tipsTitle: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  tipText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
