import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { EmptyState } from '../components/EmptyState';
import { SectionCard } from '../components/SectionCard';
import { Colors, Spacing } from '../constants/theme';
import { useFinanceStore } from '../store/financeStore';
import {
  getCategoryBreakdown,
  getHighestSpendingCategory,
  getTrackingStreak,
  getMonthlyTrend,
  getWeeklyComparison
} from '../utils/finance';
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

export function InsightsScreen() {
  const { width } = useWindowDimensions();
  const transactions = useFinanceStore((state) => state.transactions);
  const hasHydrated = useFinanceStore((state) => state.hasHydrated);

  const contentWidth = Math.min(width - 24, 920);
  const chartWidth = Math.max(contentWidth - 32, 260);
  const categoryData = getCategoryBreakdown(transactions);
  const weekly = getWeeklyComparison(transactions);
  const topCategory = getHighestSpendingCategory(transactions);
  const monthlyTrend = getMonthlyTrend(transactions);
  const streak = getTrackingStreak(transactions);

  if (!hasHydrated) {
    return (
      <View style={styles.centered}>
        <Text style={styles.helper}>Loading insights...</Text>
      </View>
    );
  }

  if (!transactions.length) {
    return (
      <View style={styles.screen}>
        <View style={[styles.content, styles.centeredContent]}>
          <View style={[styles.container, { width: contentWidth }]}> 
          <Text style={styles.title}>Insights</Text>
          <EmptyState
            title="No insights yet"
            subtitle="Add transactions first and this screen will explain your spending patterns."
          />
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={[styles.container, { width: contentWidth }]}> 
      <Text style={styles.title}>Insights</Text>

      <SectionCard title="Weekly Comparison">
        <Text style={styles.metric}>This week: {formatCurrency(weekly.thisWeek)}</Text>
        <Text style={styles.metric}>Last week: {formatCurrency(weekly.lastWeek)}</Text>
        <Text style={styles.helper}>Tracking streak: {streak} days</Text>
        <Text style={[styles.delta, weekly.delta <= 0 ? styles.positive : styles.negative]}>
          {weekly.delta <= 0 ? 'You spent less than last week.' : 'Spending increased vs last week.'}
        </Text>
      </SectionCard>

      <SectionCard title="Top Spending Category">
        {topCategory ? (
          <>
            <Text style={styles.metric}>{topCategory.name}</Text>
            <Text style={styles.helper}>{formatCurrency(topCategory.amount)}</Text>
          </>
        ) : (
          <Text style={styles.helper}>No expense category data available.</Text>
        )}
      </SectionCard>

      <SectionCard title="Spending by Category">
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
            height={210}
            accessor="population"
            backgroundColor="transparent"
            chartConfig={chartConfig}
            paddingLeft="0"
            absolute
          />
        ) : (
          <Text style={styles.helper}>No expense category data available.</Text>
        )}
      </SectionCard>

      <SectionCard title="Monthly Expense Trend">
        <LineChart
          data={{ labels: monthlyTrend.labels, datasets: [{ data: monthlyTrend.data }] }}
          width={chartWidth}
          height={220}
          chartConfig={chartConfig}
          withVerticalLines={false}
          withShadow={false}
          fromZero
          bezier
        />
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
  centeredContent: {
    justifyContent: 'center'
  },
  container: {
    gap: Spacing.md
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  metric: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary
  },
  helper: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20
  },
  delta: {
    fontSize: 13,
    fontWeight: '700'
  },
  positive: {
    color: Colors.income
  },
  negative: {
    color: Colors.expense
  }
});
