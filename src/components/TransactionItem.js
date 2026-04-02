import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Spacing } from '../constants/theme';
import { formatCurrency, formatDate } from '../utils/formatters';

export function TransactionItem({ item, onPress, onLongPress }) {
  const isIncome = item.type === 'income';

  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <View style={styles.left}>
        <View style={[styles.badge, isIncome ? styles.badgeIncome : styles.badgeExpense]}>
          <Text style={styles.badgeText}>{isIncome ? 'IN' : 'EX'}</Text>
        </View>
        <View style={styles.metaWrap}>
          <Text style={styles.category}>{item.category}</Text>
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

const styles = StyleSheet.create({
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
  badge: {
    width: 34,
    height: 34,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeIncome: {
    backgroundColor: '#DDF0E8'
  },
  badgeExpense: {
    backgroundColor: '#FDE1E1'
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textPrimary
  },
  category: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary
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
