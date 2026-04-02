import { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { PrimaryButton } from '../components/PrimaryButton';
import { TransactionItem } from '../components/TransactionItem';
import { Colors, Radius, Spacing } from '../constants/theme';
import { useFinanceStore } from '../store/financeStore';

const FILTERS = ['all', 'income', 'expense'];

export function TransactionsScreen({ navigation }) {
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
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <PrimaryButton label="Add" onPress={openAdd} style={styles.headerButton} />
      </View>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search by note, amount, or category"
        placeholderTextColor="#8A9A91"
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

      {filtered.length === 0 ? (
        <EmptyState
          title={transactions.length ? 'No matching transactions' : 'No transactions yet'}
          subtitle={transactions.length ? 'Try another search or filter.' : 'Add your first transaction to get started.'}
          actionLabel="Add Transaction"
          onActionPress={openAdd}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionItem
              item={item}
              onPress={() => openEdit(item.id)}
              onLongPress={() => confirmDelete(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
        />
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm
  },
  container: {
    flex: 1,
    gap: Spacing.sm
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    color: Colors.textPrimary,
    fontWeight: '800'
  },
  headerButton: {
    minWidth: 90
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
    marginBottom: Spacing.sm
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
  list: {
    paddingBottom: 120
  }
});
