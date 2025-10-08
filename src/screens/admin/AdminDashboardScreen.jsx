import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppHeader from '../../components/ui/AppHeader';
import { useTheme } from '../../hooks/useTheme';
import useCourses from '../../hooks/useCourses';
import useTeachers from '../../hooks/useTeachers';

export default function AdminDashboardScreen({ onHome }) {
  const { colors } = useTheme();
  const { courses } = useCourses();
  const { teachers } = useTeachers();
  const totalCourses = courses.length;
  const totalTeachers = teachers.length;
  const avgPrice = useMemo(() => {
    const priced = courses.filter(c => typeof c.price === 'number');
    if (!priced.length) return 0;
    const sum = priced.reduce((s, c) => s + (c.price || 0), 0);
    return Math.round((sum / priced.length) * 100) / 100;
  }, [courses]);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppHeader title="Admin • Dashboard" onHome={onHome} showMenu />
      <View style={{ padding: 16 }}>
        <View style={styles.row}>
          <Stat title="Total Courses" value={totalCourses} />
          <Stat title="Total Teachers" value={totalTeachers} />
          <Stat title="Avg Price" value={`$${avgPrice}`} />
        </View>
      </View>
    </View>
  );
}

function Stat({ title, value }) {
  return (
    <View style={{ flex: 1, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#eee' }}>
      <Text style={{ fontSize: 12, color: '#666' }}>{title}</Text>
      <Text style={{ fontSize: 18, fontWeight: '800' }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
});

