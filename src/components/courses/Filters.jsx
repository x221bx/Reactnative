import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function Filters({ q, setQ, minPrice, setMinPrice, maxPrice, setMaxPrice, cat, setCat, rating, setRating }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}> 
      <Text style={[styles.title, { color: colors.text }]}>Filters</Text>
      <Field label="Search">
        <TextInput value={q} onChangeText={setQ} placeholder="Search" placeholderTextColor={colors.muted} style={[styles.input, { borderColor: colors.border, color: colors.text }]} />
      </Field>
      <Field label="Category">
        <TextInput value={cat} onChangeText={setCat} placeholder="Category" placeholderTextColor={colors.muted} style={[styles.input, { borderColor: colors.border, color: colors.text }]} />
      </Field>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, marginRight: 6 }}>
          <Field label="Min Price"><TextInput value={String(minPrice)} onChangeText={setMinPrice} keyboardType="decimal-pad" placeholderTextColor={colors.muted} style={[styles.input, { borderColor: colors.border, color: colors.text }]} /></Field>
        </View>
        <View style={{ flex: 1, marginLeft: 6 }}>
          <Field label="Max Price"><TextInput value={String(maxPrice)} onChangeText={setMaxPrice} keyboardType="decimal-pad" placeholderTextColor={colors.muted} style={[styles.input, { borderColor: colors.border, color: colors.text }]} /></Field>
        </View>
      </View>
      <Field label={`Min Rating: ${rating || 0}`}>
        <View style={{ flexDirection: 'row' }}>
          {[0,1,2,3,4,5].map((r) => (
            <TouchableOpacity key={r} onPress={() => setRating(r)} style={[styles.pill, { borderColor: colors.border, backgroundColor: r === rating ? colors.text : 'transparent' }]}>
              <Text style={{ color: r === rating ? colors.bg : colors.text }}>{r}+</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Field>
    </View>
  );
}

function Field({ label, children }) {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: colors.muted, marginBottom: 6 }}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 12, padding: 12 },
  title: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  pill: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6, marginRight: 6 },
});

