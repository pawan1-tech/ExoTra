export const CATEGORIES = [
  { key: 'Food', color: '#FF8F6B' },
  { key: 'Transport', color: '#5FB0FF' },
  { key: 'Shopping', color: '#A56EFF' },
  { key: 'Health', color: '#3AC6A2' },
  { key: 'Bills', color: '#FF5E7E' },
  { key: 'Entertainment', color: '#F7B955' },
  { key: 'Salary', color: '#2E9E5B' },
  { key: 'Freelance', color: '#3A8AE0' },
  { key: 'Other', color: '#82908A' }
];

export const EXPENSE_CATEGORIES = CATEGORIES.filter((category) => !['Salary', 'Freelance'].includes(category.key));
export const INCOME_CATEGORIES = CATEGORIES.filter((category) => ['Salary', 'Freelance', 'Other'].includes(category.key));
