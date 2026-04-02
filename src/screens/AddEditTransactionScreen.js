import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions
} from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';
import { Colors, Radius, Spacing } from '../constants/theme';
import { useFinanceStore } from '../store/financeStore';
import { getTodayISO, getYesterdayISO, isValidISODate } from '../utils/date';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function AddEditTransactionScreen({ navigation, route }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const transactionId = route.params?.transactionId;
  const transactions = useFinanceStore((state) => state.transactions);
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const updateTransaction = useFinanceStore((state) => state.updateTransaction);
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);

  const existing = transactions.find((item) => item.id === transactionId);
  const editing = Boolean(existing);

  const [amount, setAmount] = useState(existing?.amount ? String(existing.amount) : '');
  const [type, setType] = useState(existing?.type || 'expense');
  const [category, setCategory] = useState(existing?.category || 'Food');
  const [date, setDate] = useState(existing?.date || getTodayISO());
  const [notes, setNotes] = useState(existing?.notes || '');
  const [errors, setErrors] = useState({});

  const categories = useMemo(() => (type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES), [type]);
  const contentWidth = Math.min(width - 24, 920);

  const sanitizeAmount = (value) => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return `${parts[0]}.${parts.slice(1).join('')}`;
    }
    return cleaned;
  };

  const validate = () => {
    const nextErrors = {};
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      nextErrors.amount = 'Enter an amount greater than 0.';
    }

    if (!isValidISODate(date)) {
      nextErrors.date = 'Date must be in YYYY-MM-DD format.';
    }

    if (notes.trim().length > 120) {
      nextErrors.notes = 'Keep notes under 120 characters.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSave = () => {
    if (!validate()) {
      Alert.alert('Check transaction details', 'Please correct the highlighted fields.');
      return;
    }

    const numericAmount = Number(amount);

    const payload = {
      amount: numericAmount,
      type,
      category,
      date,
      notes: notes.trim()
    };

    if (editing) {
      updateTransaction(transactionId, payload);
    } else {
      addTransaction(payload);
    }

    navigation.goBack();
  };

  const onDelete = () => {
    if (!editing) {
      return;
    }

    Alert.alert('Delete transaction', 'Are you sure you want to delete this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTransaction(transactionId);
          navigation.goBack();
        }
      }
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 72 : 0}
    >
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: Spacing.sm + Math.max(insets.top * 0.15, 0) }]}
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.container, { width: contentWidth }]}> 
      <Text style={styles.title}>{editing ? 'Edit Transaction' : 'Add Transaction'}</Text>

      <View style={styles.segmentRow}>
        {['expense', 'income'].map((value) => {
          const active = type === value;
          return (
            <Pressable
              key={value}
              onPress={() => {
                setType(value);
                setCategory(value === 'income' ? 'Salary' : 'Food');
              }}
              style={[styles.segment, active && styles.segmentActive]}
            >
              <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{value.toUpperCase()}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          value={amount}
          onChangeText={(value) => {
            setAmount(sanitizeAmount(value));
            if (errors.amount) {
              setErrors((prev) => ({ ...prev, amount: null }));
            }
          }}
          placeholder="Enter amount"
          keyboardType="decimal-pad"
          style={[styles.input, errors.amount && styles.inputError]}
          placeholderTextColor="#8A9A91"
        />
        {errors.amount ? <Text style={styles.errorText}>{errors.amount}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryWrap}>
          {categories.map((item) => {
            const active = category === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => setCategory(item.key)}
                style={[styles.categoryChip, active && { borderColor: item.color, backgroundColor: '#F6FAF8' }]}
              >
                <Text style={[styles.categoryText, active && { color: Colors.textPrimary }]}>{item.key}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
        <TextInput
          value={date}
          onChangeText={(value) => {
            setDate(value.trim());
            if (errors.date) {
              setErrors((prev) => ({ ...prev, date: null }));
            }
          }}
          placeholder="2026-04-01"
          style={[styles.input, errors.date && styles.inputError]}
          placeholderTextColor="#8A9A91"
          autoCapitalize="none"
        />
        <View style={styles.quickDateRow}>
          <Pressable onPress={() => setDate(getTodayISO())} style={styles.quickDateChip}>
            <Text style={styles.quickDateText}>Today</Text>
          </Pressable>
          <Pressable onPress={() => setDate(getYesterdayISO())} style={styles.quickDateChip}>
            <Text style={styles.quickDateText}>Yesterday</Text>
          </Pressable>
        </View>
        {errors.date ? <Text style={styles.errorText}>{errors.date}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          value={notes}
          onChangeText={(value) => {
            setNotes(value);
            if (errors.notes) {
              setErrors((prev) => ({ ...prev, notes: null }));
            }
          }}
          placeholder="Optional note"
          style={[styles.input, styles.notesInput, errors.notes && styles.inputError]}
          placeholderTextColor="#8A9A91"
          multiline
          maxLength={120}
        />
        <Text style={styles.counterText}>{notes.length}/120</Text>
        {errors.notes ? <Text style={styles.errorText}>{errors.notes}</Text> : null}
      </View>

      <PrimaryButton label={editing ? 'Update Transaction' : 'Save Transaction'} onPress={onSave} />
      {editing ? <PrimaryButton label="Delete Transaction" onPress={onDelete} variant="ghost" /> : null}
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
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
    paddingBottom: 40,
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
  segmentRow: {
    flexDirection: 'row',
    gap: Spacing.sm
  },
  segment: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.pill,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: Colors.card
  },
  segmentActive: {
    backgroundColor: Colors.accentSoft,
    borderColor: Colors.accent
  },
  segmentText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700'
  },
  segmentTextActive: {
    color: Colors.accent
  },
  field: {
    gap: 6
  },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    height: 46,
    paddingHorizontal: Spacing.md,
    color: Colors.textPrimary
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: Spacing.sm
  },
  quickDateRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: 6
  },
  quickDateChip: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    borderRadius: Radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12
  },
  quickDateText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600'
  },
  inputError: {
    borderColor: Colors.expense
  },
  errorText: {
    color: Colors.expense,
    fontSize: 12,
    marginTop: 4
  },
  counterText: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'right'
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.card
  },
  categoryText: {
    color: Colors.textSecondary,
    fontWeight: '600'
  }
});
