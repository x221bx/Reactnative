import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function Pagination({ page, count, onChange }) {
  const { colors } = useTheme();
  if (!count || count <= 1) return null;
  const items = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(count, start + 4);
  for (let p = start; p <= end; p++) items.push(p);
  return (
    <View style={[styles.row, { borderColor: colors.border }]}>
      <TouchableOpacity onPress={() => onChange(Math.max(1, page - 1))} style={[styles.btn, { borderColor: colors.border }]}>
        <Text style={{ color: colors.text }}>Prev</Text>
      </TouchableOpacity>
      {items.map((p) => (
        <TouchableOpacity key={p} onPress={() => onChange(p)} style={[styles.btn, { borderColor: colors.border, backgroundColor: p === page ? colors.text : 'transparent' }]}>
          <Text style={{ color: p === page ? colors.bg : colors.text }}>{p}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={() => onChange(Math.min(count, page + 1))} style={[styles.btn, { borderColor: colors.border }]}>
        <Text style={{ color: colors.text }}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 8 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, marginHorizontal: 4 },
});
