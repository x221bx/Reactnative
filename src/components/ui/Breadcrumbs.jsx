import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function Breadcrumbs({ items }) {
  const { colors } = useTheme();
  if (!items || !items.length) return null;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
      {items.map((it, idx) => (
        <View key={idx} style={{ flexDirection: 'row', alignItems: 'center' }}>
          {idx > 0 && <Text style={{ color: colors.muted, marginHorizontal: 6 }}>/</Text>}
          {it.onPress ? (
            <TouchableOpacity onPress={it.onPress}><Text style={{ color: colors.text, fontWeight: '700' }}>{it.label}</Text></TouchableOpacity>
          ) : (
            <Text style={{ color: colors.muted }}>{it.label}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

