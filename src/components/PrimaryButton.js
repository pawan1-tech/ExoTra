import { Pressable, StyleSheet, Text } from 'react-native';
import { Radius, Spacing, useThemeColors } from '../constants/theme';

export function PrimaryButton({ label, onPress, variant = 'solid', style }) {
  const Colors = useThemeColors();
  const styles = createStyles(Colors);
  const isGhost = variant === 'ghost';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isGhost ? styles.ghost : styles.solid,
        pressed && styles.pressed,
        style
      ]}
    >
      <Text style={[styles.label, isGhost ? styles.labelGhost : styles.labelSolid]}>{label}</Text>
    </Pressable>
  );
}

const createStyles = (Colors) =>
  StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50
  },
  solid: {
    backgroundColor: Colors.accent,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3
  },
  ghost: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card
  },
  label: {
    fontSize: 15,
    fontWeight: '700'
  },
  labelSolid: {
    color: '#FFFFFF'
  },
  labelGhost: {
    color: Colors.textPrimary
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }]
  }
  });
