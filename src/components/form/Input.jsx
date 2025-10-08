import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function Input({ label, error, style, inputStyle, ...props }) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const borderColor = error ? '#e74c3c' : (focused ? colors.primary : colors.outline);

  return (
    <View style={style}>
      {!!label && <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>}
      <TextInput
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        style={[styles.input, { borderColor, color: colors.text, backgroundColor: colors.inputBackground }, inputStyle]}
        placeholderTextColor={colors.placeholder}
      />
      {!!error && <Text style={[styles.error]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 6, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  error: { color: '#e74c3c', marginTop: 4, fontSize: 12 },
});
