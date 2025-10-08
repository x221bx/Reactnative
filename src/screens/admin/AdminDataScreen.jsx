import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { courses as mockCourses } from '../../api/mock/courses-data';
import { teachers as mockTeachers } from '../../api/mock/teachers-data';
import { useTheme } from '../../hooks/useTheme';
import AppHeader from '../../components/ui/AppHeader';

const COURSES_KEY = '@courses_db';
const TEACHERS_KEY = '@teachers_db';
const USERS_KEY = '@users_db';

export default function AdminDataScreen() {
  const { theme } = useTheme();
  const [counts, setCounts] = useState({ courses: 0, teachers: 0, users: 0 });
  const [busy, setBusy] = useState(false);

  const loadCounts = useCallback(async () => {
    const [cRaw, tRaw, uRaw] = await Promise.all([
      AsyncStorage.getItem(COURSES_KEY),
      AsyncStorage.getItem(TEACHERS_KEY),
      AsyncStorage.getItem(USERS_KEY),
    ]);
    const c = cRaw ? JSON.parse(cRaw) : [];
    const t = tRaw ? JSON.parse(tRaw) : [];
    const u = uRaw ? JSON.parse(uRaw) : [];
    setCounts({ courses: Array.isArray(c) ? c.length : 0, teachers: Array.isArray(t) ? t.length : 0, users: Array.isArray(u) ? u.length : 0 });
  }, []);

  useEffect(() => { loadCounts(); }, [loadCounts]);

  const seedFromMock = async () => {
    setBusy(true);
    try {
      await AsyncStorage.setItem(COURSES_KEY, JSON.stringify(mockCourses));
      await AsyncStorage.setItem(TEACHERS_KEY, JSON.stringify(mockTeachers));
      await loadCounts();
    } finally {
      setBusy(false);
    }
  };

  const resetAll = async () => {
    setBusy(true);
    try {
      const keys = await AsyncStorage.getAllKeys();
      const targets = keys.filter((k) => k === 'auth_user' || k === COURSES_KEY || k === TEACHERS_KEY || k === USERS_KEY || k.startsWith('@profile_'));
      if (targets.length) await AsyncStorage.multiRemove(targets);
      await loadCounts();
    } finally {
      setBusy(false);
    }
  };

  const Button = ({ title, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: theme.colors.primary }, style]} disabled={busy}>
      <Text style={{ color: theme.colors.onPrimary, fontWeight: '700' }}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <AppHeader title="Admin • Data" showMenu />
      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
        <Text style={{ color: theme.colors.onSurface }}>Courses: {counts.courses}</Text>
        <Text style={{ color: theme.colors.onSurface }}>Teachers: {counts.teachers}</Text>
        <Text style={{ color: theme.colors.onSurface }}>Users: {counts.users}</Text>
      </View>

      <Button title="Seed from Mock" onPress={seedFromMock} />
      <Button title="Reset Local Data" onPress={resetAll} style={{ backgroundColor: theme.colors.warning, marginTop: 8 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  button: { paddingVertical: 12, alignItems: 'center', borderRadius: 10, marginTop: 4 },
});
