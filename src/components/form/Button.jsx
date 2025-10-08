import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function Button({ title, onPress, variant = 'primary', style }) {
  const { colors } = useTheme();
  const isPrimary = variant === 'primary';
  const bg = isPrimary ? colors.primary : 'transparent';
  const border = isPrimary ? colors.outline : colors.primary;
  const textColor = isPrimary ? colors.onPrimary : colors.primary;
  return (
    <TouchableOpacity onPress={onPress} style={[styles.btn, { backgroundColor: bg, borderColor: border }, style]}>
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  text: { fontWeight: '700', textAlign: 'center' },
});
