import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { EmptyState } from '../components/EmptyState';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionCard } from '../components/SectionCard';
import { SummaryCard } from '../components/SummaryCard';
import { Colors, Spacing } from '../constants/theme';
import { useFinanceStore } from '../store/financeStore';
import { getCategoryBreakdown, getCurrentMonthSavings, getMoneyCoachMessage, getTrackingStreak, getWeeklyTrend } from '../utils/finance';
import { formatCurrency } from '../utils/formatters';

const chartConfig = {
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientTo: '#FFFFFF',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(47, 125, 102, ${opacity})`,
  labelColor: () => Colors.textSecondary,
  propsForBackgroundLines: {
    strokeDasharray: '',
    stroke: '#E6ECE8'
  }
};

export function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const hasHydrated = useFinanceStore((state) => state.hasHydrated);
  const hydrationError = useFinanceStore((state) => state.hydrationError);
  const transactions = useFinanceStore((state) => state.transactions);
  const goal = useFinanceStore((state) => state.goal);
  const totalIncome = useFinanceStore((state) => state.getTotalIncome());
  const totalExpenses = useFinanceStore((state) => state.getTotalExpenses());
  const balance = useFinanceStore((state) => state.getBalance());

  const contentWidth = Math.min(width - 24, 920);
  const isLargeScreen = width >= 768;
  const chartWidth = Math.max(contentWidth - 32, 260);
  const categoryData = getCategoryBreakdown(transactions);
  const weeklyTrend = getWeeklyTrend(transactions);
  const monthlySavings = getCurrentMonthSavings(transactions);
  const trackingStreak = getTrackingStreak(transactions);
  const coachMessage = getMoneyCoachMessage(transactions);
  const goalTarget = Number(goal.monthlyTarget) || 0;
  const progress = goalTarget > 0 ? Math.min((monthlySavings / goalTarget) * 100, 100) : 0;

  const openAdd = () => navigation.getParent()?.navigate('AddEditTransaction');

  if (!hasHydrated) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loading}>Loading your finance snapshot...</Text>
      </View>
    );
  }

  if (hydrationError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{hydrationError}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={[styles.container, { width: contentWidth }]}> 
      <View>
        <Text style={styles.heading}>Personal Finance Companion</Text>
        <Text style={styles.subheading}>Daily clarity for your money choices</Text>
      </View>

      <SummaryCard title="Current Balance" value={formatCurrency(balance)} />

      <View style={[styles.row, isLargeScreen && styles.rowWide]}>
        <SummaryCard title="Income" value={formatCurrency(totalIncome)} tone="income" />
        <SummaryCard title="Expenses" value={formatCurrency(totalExpenses)} tone="expense" />
      </View>

      <SectionCard title="Money Coach" rightNode={<Text style={styles.goalText}>{trackingStreak} day streak</Text>}>
        <Text style={styles.helperText}>{coachMessage}</Text>
      </SectionCard>

      <SectionCard title="Savings Goal Progress" rightNode={<Text style={styles.goalText}>{Math.round(progress)}%</Text>}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.max(progress, 2)}%` }]} />
        </View>
        <Text style={styles.helperText}>
          {formatCurrency(monthlySavings)} saved of {formatCurrency(goalTarget || 0)} target this month.
        </Text>
      </SectionCard>

      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          subtitle="Start tracking your income and expenses to unlock insights."
          actionLabel="Add Transaction"
          onActionPress={openAdd}
        />
      ) : (
        <>
          <SectionCard title="Category Breakdown">
            {categoryData.length ? (
              <PieChart
                data={categoryData.map((item) => ({
                  name: item.name,
                  population: item.amount,
                  color: item.color,
                  legendFontColor: Colors.textSecondary,
                  legendFontSize: 12
                }))}
                width={chartWidth}
                height={200}
                accessor="population"
                backgroundColor="transparent"
                chartConfig={chartConfig}
                paddingLeft="0"
                absolute
              />
            ) : (
              <Text style={styles.helperText}>No expense data to show yet.</Text>
            )}
          </SectionCard>

          <SectionCard title="Weekly Spending Trend">
            <LineChart
              data={{ labels: weeklyTrend.labels, datasets: [{ data: weeklyTrend.data }] }}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              withVerticalLines={false}
              withShadow={false}
              fromZero
              bezier
              style={styles.chart}
            />
          </SectionCard>
        </>
      )}

      <PrimaryButton label="Add Transaction" onPress={openAdd} />
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
    paddingBottom: 100,
    gap: Spacing.md,
    alignItems: 'center'
  },
  container: {
    gap: Spacing.md
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: Spacing.sm
  },
  subheading: {
    marginTop: 4,
    color: Colors.textSecondary,
    fontSize: 14
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm
  },
  rowWide: {
    gap: Spacing.md
  },
  goalText: {
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
  helperText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20
  },
  chart: {
    borderRadius: 12
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.lg
  },
  loading: {
    color: Colors.textSecondary,
    fontSize: 15
  },
  error: {
    color: Colors.expense,
    fontSize: 15,
    textAlign: 'center'
  }
});
