import { useMemo, useState } from 'react';
import { Alert, Pressable, SectionList, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from '../components/EmptyState';
import { TransactionItem } from '../components/TransactionItem';
import { Radius, Spacing, useThemeColors } from '../constants/theme';
import { useFinanceStore } from '../store/financeStore';
import { getTodayISO, getYesterdayISO } from '../utils/date';

const FILTERS = ['all', 'income', 'expense'];

export function TransactionsScreen({ navigation }) {
  const Colors = useThemeColors();
  const styles = createStyles(Colors);
  const { width } = useWindowDimensions();
  const transactions = useFinanceStore((state) => state.transactions);
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);
  const hasHydrated = useFinanceStore((state) => state.hasHydrated);

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const contentWidth = Math.min(width - 24, 920);

  const openAdd = () => navigation.getParent()?.navigate('AddEditTransaction');

  const filtered = transactions
    .filter((item) => (activeFilter === 'all' ? true : item.type === activeFilter))
    .filter((item) => {
      if (!query.trim()) {
        return true;
      }
      const term = query.toLowerCase();
      return (
        item.category.toLowerCase().includes(term) ||
        item.notes.toLowerCase().includes(term) ||
        String(item.amount).includes(term)
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const sections = useMemo(() => {
    const grouped = [];
    const map = new Map();

    filtered.forEach((item) => {
      let title = item.date;
      if (item.date === getTodayISO()) {
        title = 'Today';
      } else if (item.date === getYesterdayISO()) {
        title = 'Yesterday';
      }

      if (!map.has(title)) {
        const nextSection = { title, data: [] };
        map.set(title, nextSection);
        grouped.push(nextSection);
      }

      map.get(title).data.push(item);
    });

    return grouped;
  }, [filtered]);

  const confirmDelete = (id) => {
    Alert.alert('Delete transaction', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteTransaction(id)
      }
    ]);
  };

  const openEdit = (id) => navigation.getParent()?.navigate('AddEditTransaction', { transactionId: id });

  if (!hasHydrated) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loading}>Loading transactions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.container, { width: contentWidth }]}> 
      <View style={styles.topRow}>
        <Text style={styles.title}>Transaction</Text>
        <Pressable style={styles.actionIcon} onPress={openAdd}>
          <Ionicons name="add" size={20} color={Colors.accent} />
        </Pressable>
      </View>

      <Pressable style={styles.reportBanner} onPress={() => navigation.navigate('Insights')}>
        <Text style={styles.reportText}>See your financial insight</Text>
        <Ionicons name="chevron-forward" size={18} color={Colors.accent} />
      </Pressable>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search transaction"
        placeholderTextColor={Colors.placeholder}
        style={styles.search}
      />

      <View style={styles.filters}>
        {FILTERS.map((filter) => {
          const active = activeFilter === filter;
          return (
            <Pressable
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[styles.filterPill, active && styles.filterPillActive]}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{filter.toUpperCase()}</Text>
            </Pressable>
          );
        })}
      </View>

      {sections.length === 0 ? (
        <EmptyState
          title={transactions.length ? 'No matching transactions' : 'No transactions yet'}
          subtitle={transactions.length ? 'Try another search or filter.' : 'Add your first transaction to get started.'}
          actionLabel="Add Transaction"
          onActionPress={openAdd}
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section }) => <Text style={styles.sectionTitle}>{section.title}</Text>}
          renderItem={({ item }) => (
            <TransactionItem
              item={item}
              onPress={() => openEdit(item.id)}
              onLongPress={() => confirmDelete(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
        />
      )}
      </View>
    </View>
  );
}

const createStyles = (Colors) =>
  StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
    alignItems: 'center'
  },
  container: {
    flex: 1,
    gap: Spacing.md
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0.2
  },
  actionIcon: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center'
  },
  reportBanner: {
    marginTop: Spacing.xs,
    borderRadius: Radius.md,
    backgroundColor: Colors.accentSoft,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  reportText: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: '600'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background
  },
  loading: {
    color: Colors.textSecondary,
    fontSize: 15
  },
  search: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 46,
    color: Colors.textPrimary
  },
  filters: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xs
  },
  filterPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card
  },
  filterPillActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentSoft
  },
  filterText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 12
  },
  filterTextActive: {
    color: Colors.accent
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 30,
    fontWeight: '800',
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm
  },
  list: {
    paddingBottom: 132
  }
  });
