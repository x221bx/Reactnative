import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function Input({ label, error, style, ...props }) {
  const { colors } = useTheme();
  return (
    <View style={style}>
      {!!label && <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>}
      <TextInput
        {...props}
        style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]}
        placeholderTextColor={colors.muted}
      />
      {!!error && <Text style={[styles.error]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  error: { color: '#e74c3c', marginTop: 4, fontSize: 12 },
});

