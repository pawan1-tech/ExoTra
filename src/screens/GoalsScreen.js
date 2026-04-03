import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionCard } from '../components/SectionCard';
import { Radius, Spacing, useThemeColors } from '../constants/theme';
import { useFinanceStore } from '../store/financeStore';
import { getCurrentMonthSavings } from '../utils/finance';
import { formatCurrency } from '../utils/formatters';

export function GoalsScreen() {
  const Colors = useThemeColors();
  const styles = createStyles(Colors);
  const { width } = useWindowDimensions();
  const goal = useFinanceStore((state) => state.goal);
  const transactions = useFinanceStore((state) => state.transactions);
  const setMonthlyGoal = useFinanceStore((state) => state.setMonthlyGoal);

  const [value, setValue] = useState(String(goal.monthlyTarget || ''));

  const monthlySavings = getCurrentMonthSavings(transactions);
  const contentWidth = Math.min(width - 24, 920);
  const monthlyTarget = Number(goal.monthlyTarget) || 0;
  const progress = monthlyTarget > 0 ? Math.min((monthlySavings / monthlyTarget) * 100, 100) : 0;

  const motivation = useMemo(() => {
    if (!monthlyTarget) {
      return 'Set a target to start your savings challenge.';
    }
    if (progress >= 100) {
      return 'Goal complete. Great discipline this month.';
    }
    if (progress >= 70) {
      return 'Almost there. Keep this pace.';
    }
    if (progress > 0) {
      return 'Solid start. Keep tracking daily.';
    }
    return 'You can start small. Every saved amount counts.';
  }, [monthlyTarget, progress]);

  const onSave = () => {
    setMonthlyGoal(Number(value) || 0);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={[styles.container, { width: contentWidth }]}> 
      <View style={styles.titleRow}>
        <View style={styles.titleIconWrap}>
          <Ionicons name="trophy-outline" size={18} color={Colors.accent} />
        </View>
        <Text style={styles.title}>Goals</Text>
      </View>

      <SectionCard title="Monthly Savings Target">
        <View style={styles.targetHintRow}>
          <Ionicons name="wallet-outline" size={15} color={Colors.textSecondary} />
          <Text style={styles.targetHintText}>Set your monthly amount goal</Text>
        </View>
        <TextInput
          value={value}
          onChangeText={setValue}
          keyboardType="number-pad"
          placeholder="Enter target amount"
          placeholderTextColor={Colors.placeholder}
          style={styles.input}
        />
        <PrimaryButton label="Save Goal" onPress={onSave} />
      </SectionCard>

      <SectionCard title="Current Progress" rightNode={<Text style={styles.percent}>{Math.round(progress)}%</Text>}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.max(progress, 2)}%` }]} />
        </View>
        <View style={styles.statRow}>
          <View style={styles.statChip}>
            <Ionicons name="arrow-down-circle-outline" size={16} color={Colors.income} />
            <View>
              <Text style={styles.chipLabel}>Saved</Text>
              <Text style={styles.chipValue}>{formatCurrency(monthlySavings)}</Text>
            </View>
          </View>
          <View style={styles.statChip}>
            <Ionicons name="flag-outline" size={16} color={Colors.accent} />
            <View>
              <Text style={styles.chipLabel}>Target</Text>
              <Text style={styles.chipValue}>{formatCurrency(monthlyTarget)}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.motivation}>{motivation}</Text>
      </SectionCard>
      </View>
    </ScrollView>
  );
}

const createStyles = (Colors) =>
  StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.md,
    paddingBottom: 132,
    alignItems: 'center'
  },
  container: {
    gap: Spacing.md
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  titleIconWrap: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.2
  },
  targetHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  targetHintText: {
    color: Colors.textSecondary,
    fontSize: 13
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    height: 50,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm
  },
  percent: {
    color: Colors.accent,
    fontWeight: '700'
  },
  progressTrack: {
    width: '100%',
    height: 12,
    borderRadius: 999,
    backgroundColor: Colors.accentSoft,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 999
  },
  statRow: {
    flexDirection: 'row',
    gap: Spacing.sm
  },
  statChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm
  },
  chipLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginBottom: 2
  },
  chipValue: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700'
  },
  motivation: {
    marginTop: Spacing.xs,
    color: Colors.textPrimary,
    fontWeight: '600'
  }
  });
