import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function HowItWorks() {
  const { colors } = useTheme();
  const steps = [
    { title: 'Browse', desc: 'Find courses by category, rating, and price.' },
    { title: 'Join', desc: 'Enroll to access content and ask questions.' },
    { title: 'Learn', desc: 'Track progress, rate courses, and keep learning.' },
  ];
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 6 }}>How it works</Text>
      <View style={{ flexDirection: 'row' }}>
        {steps.map((s) => (
          <View key={s.title} style={{ flex: 1, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, borderRadius: 12, padding: 12, marginRight: 8 }}>
            <Text style={{ color: colors.text, fontWeight: '800' }}>{s.title}</Text>
            <Text style={{ color: colors.muted }}>{s.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

