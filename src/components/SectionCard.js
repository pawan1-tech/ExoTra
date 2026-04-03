import { StyleSheet, Text, View } from 'react-native';
import { Radius, Spacing, useThemeColors } from '../constants/theme';

export function SectionCard({ title, children, rightNode }) {
  const Colors = useThemeColors();
  const styles = createStyles(Colors);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {rightNode}
      </View>
      {children}
    </View>
  );
}

const createStyles = (Colors) =>
  StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary
  }
  });
