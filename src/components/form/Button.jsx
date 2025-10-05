import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function Button({ title, onPress, variant = 'primary', style }) {
  const { colors } = useTheme();
  const bg = variant === 'primary' ? colors.text : 'transparent';
  const border = colors.border;
  const textColor = variant === 'primary' ? colors.bg : colors.text;
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

