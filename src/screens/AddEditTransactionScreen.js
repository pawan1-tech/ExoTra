import { useMemo, useRef, useState } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '../components/PrimaryButton';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';
import { Radius, Spacing, useThemeColors } from '../constants/theme';
import { useFinanceStore } from '../store/financeStore';
import { getTodayISO, getYesterdayISO, isValidISODate } from '../utils/date';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function AddEditTransactionScreen({ navigation, route }) {
  const Colors = useThemeColors();
  const styles = createStyles(Colors);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState(existing?.notes || '');
  const [errors, setErrors] = useState({});

  const categories = useMemo(() => (type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES), [type]);
  const contentWidth = Math.min(width - 24, 920);
  const selectedDate = useMemo(() => {
    const parsedDate = new Date(date);
    return Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  }, [date]);

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

  const onCancel = () => {
    navigation.goBack();
  };

  const onDateChange = (_, nextDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (!nextDate) {
      return;
    }

    setDate(nextDate.toISOString().slice(0, 10));
    if (errors.date) {
      setErrors((prev) => ({ ...prev, date: null }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 72 : 0}
    >
    <ScrollView
      ref={scrollRef}
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Spacing.sm + Math.max(insets.top * 0.15, 0),
          paddingBottom: Math.max(insets.bottom + 56, 72)
        }
      ]}
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.container, { width: contentWidth }]}> 
      <View style={styles.headerRow}>
        <Pressable style={styles.backButton} onPress={onCancel}>
          <Ionicons name="chevron-back" size={18} color={Colors.textPrimary} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>{editing ? 'Edit Transaction' : 'Add Transaction'}</Text>
      </View>

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
          placeholderTextColor={Colors.placeholder}
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
                style={[styles.categoryChip, active && { borderColor: item.color, backgroundColor: Colors.accentSoft }]}
              >
                <Text style={[styles.categoryText, active && { color: Colors.textPrimary }]}>{item.key}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
        <Pressable
          style={[styles.input, styles.dateInput, errors.date && styles.inputError]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateValue}>{date}</Text>
          <Ionicons name="calendar-outline" size={18} color={Colors.textSecondary} />
        </Pressable>
        {showDatePicker ? (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        ) : null}
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
          onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
          placeholder="Optional note"
          style={[styles.input, styles.notesInput, errors.notes && styles.inputError]}
          placeholderTextColor={Colors.placeholder}
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

const createStyles = (Colors) =>
  StyleSheet.create({
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card
  },
  backText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600'
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
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  dateValue: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '500'
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
