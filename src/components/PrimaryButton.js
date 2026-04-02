import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors, Radius, Spacing } from '../constants/theme';

export function PrimaryButton({ label, onPress, variant = 'solid', style }) {
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

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.pill,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42
  },
  solid: {
    backgroundColor: Colors.accent
  },
  ghost: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card
  },
  label: {
    fontSize: 14,
    fontWeight: '700'
  },
  labelSolid: {
    color: '#FFFFFF'
  },
  labelGhost: {
    color: Colors.textPrimary
  },
  pressed: {
    opacity: 0.85
  }
});
