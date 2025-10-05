import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function Testimonials() {
  const { colors } = useTheme();
  const items = [
    { name: 'Sara', text: 'Great platform—my son loved the math course!' },
    { name: 'Ali', text: 'Helpful mentors and clear lessons.' },
    { name: 'Lina', text: 'Loved the projects—very engaging.' },
  ];
  return (
    <View style={{ marginTop: 8, marginBottom: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 6 }}>What learners say</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map((it) => (
          <View key={it.name} style={{ width: 260, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, borderRadius: 12, padding: 12, marginRight: 10 }}>
            <Text style={{ color: colors.text, fontWeight: '800' }}>{it.name}</Text>
            <Text style={{ color: colors.muted }}>{it.text}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

