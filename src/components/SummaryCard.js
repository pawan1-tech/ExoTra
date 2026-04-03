import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing, useThemeColors } from '../constants/theme';

export function SummaryCard({ title, value, tone = 'neutral', iconName }) {
  const Colors = useThemeColors();
  const styles = createStyles(Colors);
  const toneStyle = tone === 'income' ? styles.income : tone === 'expense' ? styles.expense : styles.neutral;
  const iconColor = tone === 'income' ? Colors.income : tone === 'expense' ? Colors.expense : Colors.accent;

  return (
    <View style={[styles.card, toneStyle]}>
      <View style={styles.headerRow}>
        {iconName ? (
          <View style={styles.iconWrap}>
            <Ionicons name={iconName} size={16} color={iconColor} />
          </View>
        ) : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const createStyles = (Colors) =>
  StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    minHeight: 100,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2
  },
  neutral: {
    backgroundColor: Colors.card,
    borderColor: Colors.border
  },
  income: {
    backgroundColor: Colors.incomeSoft,
    borderColor: Colors.incomeBorder
  },
  expense: {
    backgroundColor: Colors.expenseSoft,
    borderColor: Colors.expenseBorder
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: Colors.textSecondary,
    fontSize: 12,
    letterSpacing: 0.4,
    marginBottom: Spacing.xs
  },
  value: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '800'
  }
  });
