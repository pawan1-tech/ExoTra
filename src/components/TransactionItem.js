import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing, useThemeColors } from '../constants/theme';
import { formatCurrency, formatDate } from '../utils/formatters';

const CATEGORY_ICONS = {
  Food: 'restaurant-outline',
  Transport: 'car-outline',
  Shopping: 'bag-outline',
  Health: 'medkit-outline',
  Bills: 'receipt-outline',
  Entertainment: 'game-controller-outline',
  Salary: 'wallet-outline',
  Freelance: 'briefcase-outline',
  Other: 'pricetag-outline'
};

export function TransactionItem({ item, onPress, onLongPress }) {
  const Colors = useThemeColors();
  const styles = createStyles(Colors);
  const isIncome = item.type === 'income';
  const iconName = CATEGORY_ICONS[item.category] || CATEGORY_ICONS.Other;

  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <View style={styles.left}>
        <View style={[styles.badge, isIncome ? styles.badgeIncome : styles.badgeExpense]}>
          <Ionicons name={iconName} size={18} color={isIncome ? Colors.income : Colors.expense} />
        </View>
        <View style={styles.metaWrap}>
          <View style={styles.categoryRow}>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.typeText}>{isIncome ? 'Income' : 'Expense'}</Text>
          </View>
          <Text style={styles.meta}>{formatDate(item.date)}</Text>
          {item.notes ? (
            <Text style={styles.note} numberOfLines={2} ellipsizeMode="tail">
              {item.notes}
            </Text>
          ) : null}
        </View>
      </View>
      <Text style={[styles.amount, isIncome ? styles.amountIncome : styles.amountExpense]}>
        {isIncome ? '+' : '-'} {formatCurrency(item.amount)}
      </Text>
    </Pressable>
  );
}

const createStyles = (Colors) =>
  StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  pressed: {
    opacity: 0.9
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
    minWidth: 0,
    paddingRight: Spacing.sm
  },
  metaWrap: {
    flex: 1,
    minWidth: 0
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeIncome: {
    backgroundColor: Colors.accentSoft
  },
  badgeExpense: {
    backgroundColor: Colors.expenseSoft
  },
  category: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary
  },
  typeText: {
    fontSize: 11,
    color: Colors.textSecondary,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: 'hidden'
  },
  meta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2
  },
  note: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    flexShrink: 0,
    marginLeft: Spacing.sm,
    alignSelf: 'flex-start'
  },
  amountIncome: {
    color: Colors.income
  },
  amountExpense: {
    color: Colors.expense
  }
  });
