import { useColorScheme } from 'react-native';

const LightColors = {
  background: '#F5F7FC',
  card: '#FFFFFF',
  textPrimary: '#171B2A',
  textSecondary: '#737A90',
  border: '#E4E8F1',
  income: '#2FA36B',
  expense: '#E05454',
  accent: '#4F7CFF',
  accentSoft: '#E7EEFF',
  warning: '#F2A84E',
  info: '#50A2FF',
  incomeSoft: '#E7F7EF',
  incomeBorder: '#CBEFD9',
  expenseSoft: '#FFEDED',
  expenseBorder: '#FFD3D3',
  placeholder: '#9CA4BB',
  chartGrid: '#E8ECF5',
  shadow: '#111827',
  tabBar: '#FFFFFF'
};

const DarkColors = {
  background: '#0D1020',
  card: '#161A2E',
  textPrimary: '#F3F5FF',
  textSecondary: '#A3ABC6',
  border: '#2A3252',
  income: '#5BE29D',
  expense: '#FF8D8D',
  accent: '#7396FF',
  accentSoft: '#27335F',
  warning: '#F6BF72',
  info: '#8AB9FF',
  incomeSoft: '#153527',
  incomeBorder: '#23533A',
  expenseSoft: '#3B1F2A',
  expenseBorder: '#6A3147',
  placeholder: '#7680A1',
  chartGrid: '#303B64',
  shadow: '#020617',
  tabBar: '#141938'
};

export const Colors = LightColors;

export function useThemeColors() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? DarkColors : LightColors;
}

export const Spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30
};

export const Radius = {
  sm: 12,
  md: 16,
  lg: 22,
  pill: 999
};
