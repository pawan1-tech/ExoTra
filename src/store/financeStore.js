import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storageService } from '../services/storage';
import { getBalance, getSummary } from '../utils/finance';

const storeStorage = {
  getItem: (name) => storageService.getItem(name),
  setItem: (name, value) => storageService.setItem(name, value),
  removeItem: (name) => storageService.removeItem(name)
};

const makeId = () => `${Date.now()}-${Math.round(Math.random() * 100000)}`;

export const useFinanceStore = create(
  persist(
    (set, get) => ({
      transactions: [],
      goal: {
        monthlyTarget: 10000
      },
      hasHydrated: false,
      hydrationError: null,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      setHydrationError: (message) => set({ hydrationError: message }),
      addTransaction: (payload) => {
        const transaction = {
          id: makeId(),
          amount: Number(payload.amount) || 0,
          type: payload.type || 'expense',
          category: payload.category || 'Other',
          date: payload.date,
          notes: payload.notes || ''
        };

        set((state) => ({
          transactions: [transaction, ...state.transactions]
        }));
      },
      updateTransaction: (id, payload) => {
        set((state) => ({
          transactions: state.transactions.map((item) => {
            if (item.id !== id) {
              return item;
            }
            return {
              ...item,
              ...payload,
              amount: Number(payload.amount ?? item.amount) || 0
            };
          })
        }));
      },
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((item) => item.id !== id)
        }));
      },
      setMonthlyGoal: (amount) => {
        set({
          goal: {
            monthlyTarget: Number(amount) || 0
          }
        });
      },
      clearAllData: () => {
        set({
          transactions: [],
          goal: { monthlyTarget: 0 }
        });
      },
      getTotalIncome: () => getSummary(get().transactions).income,
      getTotalExpenses: () => getSummary(get().transactions).expenses,
      getBalance: () => getBalance(get().transactions)
    }),
    {
      name: 'finance-companion-storage',
      storage: createJSONStorage(() => storeStorage),
      partialize: (state) => ({
        transactions: state.transactions,
        goal: state.goal
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          state?.setHydrationError('Failed to load local data.');
        }
        state?.setHasHydrated(true);
      }
    }
  )
);
