import { StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Spacing } from '../constants/theme';

export function SummaryCard({ title, value, tone = 'neutral' }) {
  const toneStyle = tone === 'income' ? styles.income : tone === 'expense' ? styles.expense : styles.neutral;

  return (
    <View style={[styles.card, toneStyle]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    minHeight: 90
  },
  neutral: {
    backgroundColor: Colors.card,
    borderColor: Colors.border
  },
  income: {
    backgroundColor: '#E8F6ED',
    borderColor: '#C9EAD6'
  },
  expense: {
    backgroundColor: '#FDECEC',
    borderColor: '#F8D1D1'
  },
  title: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: Spacing.xs
  },
  value: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '700'
  }
});
