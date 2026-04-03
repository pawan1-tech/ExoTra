import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from '../components/EmptyState';
import { SectionCard } from '../components/SectionCard';
import { Radius, Spacing, useThemeColors } from '../constants/theme';
import { useFinanceStore } from '../store/financeStore';
import {
  getCategoryBreakdown,
  getHighestSpendingCategory,
  getTrackingStreak,
  getMonthlyTrend,
  getWeeklyComparison
} from '../utils/finance';
import { formatCurrency } from '../utils/formatters';

const getChartConfig = (Colors) => ({
  backgroundGradientFrom: Colors.card,
  backgroundGradientTo: Colors.card,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(47, 125, 102, ${opacity})`,
  labelColor: () => Colors.textSecondary,
  propsForBackgroundLines: {
    strokeDasharray: '',
    stroke: Colors.chartGrid
  }
});

export function InsightsScreen() {
  const Colors = useThemeColors();
  const styles = createStyles(Colors);
  const chartConfig = getChartConfig(Colors);
  const { width } = useWindowDimensions();
  const transactions = useFinanceStore((state) => state.transactions);
  const hasHydrated = useFinanceStore((state) => state.hasHydrated);

  const contentWidth = Math.min(width - 24, 920);
  const chartWidth = Math.max(300, Math.min(contentWidth - 32, 620));
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
      <View style={styles.titleRow}>
        <View style={styles.titleIconWrap}>
          <Ionicons name="analytics" size={18} color={Colors.accent} />
        </View>
        <Text style={styles.title}>Insights</Text>
      </View>

      <SectionCard title="Weekly Comparison">
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Ionicons name="calendar-outline" size={16} color={Colors.accent} />
            <View>
              <Text style={styles.chipLabel}>This week</Text>
              <Text style={styles.chipValue}>{formatCurrency(weekly.thisWeek)}</Text>
            </View>
          </View>
          <View style={styles.statChip}>
            <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
            <View>
              <Text style={styles.chipLabel}>Last week</Text>
              <Text style={styles.chipValue}>{formatCurrency(weekly.lastWeek)}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.helper}>Tracking streak: {streak} days</Text>
        <Text style={[styles.delta, weekly.delta <= 0 ? styles.positive : styles.negative]}>
          {weekly.delta <= 0 ? 'You spent less than last week.' : 'Spending increased vs last week.'}
        </Text>
      </SectionCard>

      <SectionCard title="Top Spending Category">
        {topCategory ? (
          <View style={styles.topCategoryRow}>
            <View style={[styles.categoryDot, { backgroundColor: topCategory.color }]} />
            <View style={styles.categoryMeta}>
              <Text style={styles.metric}>{topCategory.name}</Text>
              <Text style={styles.helper}>{formatCurrency(topCategory.amount)}</Text>
            </View>
            <Ionicons name="trending-up" size={18} color={Colors.accent} />
          </View>
        ) : (
          <Text style={styles.helper}>No expense category data available.</Text>
        )}
      </SectionCard>

      <SectionCard title="Spending by Category">
        {categoryData.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chartScrollContent}>
            <View style={[styles.chartWrap, { width: chartWidth }]}> 
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
            </View>
          </ScrollView>
        ) : (
          <Text style={styles.helper}>No expense category data available.</Text>
        )}
      </SectionCard>

      <SectionCard title="Monthly Expense Trend">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chartScrollContent}>
          <View style={[styles.chartWrap, { width: chartWidth }]}> 
            <LineChart
              data={{ labels: monthlyTrend.labels, datasets: [{ data: monthlyTrend.data }] }}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              withVerticalLines={false}
              withShadow={false}
              fromZero
              bezier
              style={styles.lineChart}
            />
          </View>
        </ScrollView>
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
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.2
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
  metric: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary
  },
  statsRow: {
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
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2
  },
  chipValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary
  },
  topCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm
  },
  categoryDot: {
    width: 16,
    height: 16,
    borderRadius: Radius.pill
  },
  categoryMeta: {
    flex: 1
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
  },
  chartScrollContent: {
    width: '100%',
    alignItems: 'center'
  },
  chartWrap: {
    alignItems: 'center'
  },
  lineChart: {
    borderRadius: Radius.md
  }
  });
