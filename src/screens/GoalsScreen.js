import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionCard } from '../components/SectionCard';
import { Colors, Radius, Spacing } from '../constants/theme';
import { useFinanceStore } from '../store/financeStore';
import { getCurrentMonthSavings } from '../utils/finance';
import { formatCurrency } from '../utils/formatters';

export function GoalsScreen() {
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
      <Text style={styles.title}>Goals</Text>

      <SectionCard title="Monthly Savings Target">
        <TextInput
          value={value}
          onChangeText={setValue}
          keyboardType="number-pad"
          placeholder="Enter target amount"
          placeholderTextColor="#8A9A91"
          style={styles.input}
        />
        <PrimaryButton label="Save Goal" onPress={onSave} />
      </SectionCard>

      <SectionCard title="Current Progress" rightNode={<Text style={styles.percent}>{Math.round(progress)}%</Text>}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.max(progress, 2)}%` }]} />
        </View>
        <Text style={styles.valueText}>Saved this month: {formatCurrency(monthlySavings)}</Text>
        <Text style={styles.valueText}>Target: {formatCurrency(monthlyTarget)}</Text>
        <Text style={styles.motivation}>{motivation}</Text>
      </SectionCard>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.md,
    paddingBottom: 100,
    alignItems: 'center'
  },
  container: {
    gap: Spacing.md
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    height: 46,
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
    backgroundColor: '#E4EEE8',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 999
  },
  valueText: {
    color: Colors.textSecondary,
    fontSize: 14
  },
  motivation: {
    marginTop: Spacing.xs,
    color: Colors.textPrimary,
    fontWeight: '600'
  }
});
