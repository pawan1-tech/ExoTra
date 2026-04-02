import { CATEGORIES } from '../constants/categories';
import { addDays, getStartOfWeek } from './date';

const toAmount = (value) => Number(value) || 0;

export const getSummary = (transactions) => {
  return transactions.reduce(
    (acc, item) => {
      const amount = toAmount(item.amount);
      if (item.type === 'income') {
        acc.income += amount;
      } else {
        acc.expenses += amount;
      }
      return acc;
    },
    { income: 0, expenses: 0 }
  );
};

export const getBalance = (transactions) => {
  const { income, expenses } = getSummary(transactions);
  return income - expenses;
};

export const getCurrentMonthSavings = (transactions) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthTx = transactions.filter((item) => {
    const date = new Date(item.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  return getBalance(thisMonthTx);
};

export const getCategoryBreakdown = (transactions) => {
  const expenseMap = {};
  transactions
    .filter((item) => item.type === 'expense')
    .forEach((item) => {
      const amount = toAmount(item.amount);
      expenseMap[item.category] = (expenseMap[item.category] || 0) + amount;
    });

  return Object.keys(expenseMap).map((category) => {
    const found = CATEGORIES.find((item) => item.key === category);
    return {
      name: category,
      amount: expenseMap[category],
      color: found?.color || '#82908A'
    };
  });
};

export const getWeeklyTrend = (transactions) => {
  const start = getStartOfWeek();
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = labels.map((_, index) => {
    const dayStart = addDays(start, index);
    const dayEnd = addDays(dayStart, 1);

    return transactions
      .filter((item) => item.type === 'expense')
      .filter((item) => {
        const date = new Date(item.date);
        return date >= dayStart && date < dayEnd;
      })
      .reduce((total, item) => total + toAmount(item.amount), 0);
  });

  return { labels, data };
};

export const getWeeklyComparison = (transactions) => {
  const currentWeekStart = getStartOfWeek();
  const previousWeekStart = addDays(currentWeekStart, -7);

  const totalForRange = (start, end) => {
    return transactions
      .filter((item) => item.type === 'expense')
      .filter((item) => {
        const date = new Date(item.date);
        return date >= start && date < end;
      })
      .reduce((sum, item) => sum + toAmount(item.amount), 0);
  };

  const thisWeek = totalForRange(currentWeekStart, addDays(currentWeekStart, 7));
  const lastWeek = totalForRange(previousWeekStart, currentWeekStart);
  const delta = thisWeek - lastWeek;

  return { thisWeek, lastWeek, delta };
};

export const getHighestSpendingCategory = (transactions) => {
  const breakdown = getCategoryBreakdown(transactions);
  if (!breakdown.length) {
    return null;
  }

  return breakdown.reduce((maxItem, item) => {
    if (!maxItem || item.amount > maxItem.amount) {
      return item;
    }
    return maxItem;
  }, null);
};

export const getMonthlyTrend = (transactions, count = 6) => {
  const labels = [];
  const data = [];
  const now = new Date();

  for (let i = count - 1; i >= 0; i -= 1) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = monthDate.getMonth();
    const year = monthDate.getFullYear();

    labels.push(monthDate.toLocaleDateString('en-IN', { month: 'short' }));

    const totalExpenses = transactions
      .filter((item) => item.type === 'expense')
      .filter((item) => {
        const date = new Date(item.date);
        return date.getMonth() === month && date.getFullYear() === year;
      })
      .reduce((sum, item) => sum + toAmount(item.amount), 0);

    data.push(totalExpenses);
  }

  return { labels, data };
};

export const getTrackingStreak = (transactions) => {
  if (!transactions.length) {
    return 0;
  }

  const daySet = new Set(
    transactions
      .map((item) => item.date)
      .filter(Boolean)
  );

  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (daySet.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
};

export const getMoneyCoachMessage = (transactions) => {
  if (!transactions.length) {
    return 'Track one transaction today to unlock your first insight.';
  }

  const weekly = getWeeklyComparison(transactions);
  const topCategory = getHighestSpendingCategory(transactions);

  if (weekly.delta > 0) {
    return `You are spending ${toAmount(weekly.delta).toFixed(0)} more than last week. Consider setting a small cap for ${topCategory?.name || 'top expenses'}.`;
  }

  if (weekly.delta < 0) {
    return `Great job. You reduced weekly spending by ${toAmount(Math.abs(weekly.delta)).toFixed(0)}.`;
  }

  if (topCategory) {
    return `${topCategory.name} is your highest spend category. A 10% cut here can improve monthly savings quickly.`;
  }

  return 'Keep logging daily. Your money patterns will get smarter with more data.';
};
