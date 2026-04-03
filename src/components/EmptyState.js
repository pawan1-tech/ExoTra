import { StyleSheet, Text, View } from 'react-native';
import { Spacing, useThemeColors } from '../constants/theme';
import { PrimaryButton } from './PrimaryButton';

export function EmptyState({ title, subtitle, actionLabel, onActionPress }) {
  const Colors = useThemeColors();
  const styles = createStyles(Colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {actionLabel ? <PrimaryButton label={actionLabel} onPress={onActionPress} style={styles.button} /> : null}
    </View>
  );
}

const createStyles = (Colors) =>
  StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: Colors.textSecondary
  },
  button: {
    marginTop: Spacing.sm,
    minWidth: 180
  }
  });
