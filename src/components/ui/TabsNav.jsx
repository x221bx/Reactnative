import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function TabsNav({ active, onNavigate }) {
  const { colors } = useTheme();
  const tabs = [
    { key: 'home', label: 'Home' },
    { key: 'teachers', label: 'Teachers' },
    { key: 'courses', label: 'Courses' },
  ];
  return (
    <View style={[styles.navbar, { borderColor: colors.border, backgroundColor: colors.card }]}> 
      {tabs.map((t) => (
        <TouchableOpacity
          key={t.key}
          onPress={() => onNavigate?.(t.key)}
          style={[styles.navBtn, active === t.key && { backgroundColor: colors.text }]}
        >
          <Text style={[styles.navText, { color: active === t.key ? colors.bg : colors.text }]}>{t.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    padding: 8,
    justifyContent: 'space-around',
  },
  navBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  navText: { fontWeight: '700' },
});

