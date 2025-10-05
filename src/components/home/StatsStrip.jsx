import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import useCourses from '../../hooks/useCourses';
import useTeachers from '../../hooks/useTeachers';
import { LinearGradient } from 'expo-linear-gradient';

export default function StatsStrip() {
  const { colors } = useTheme();
  const { courses } = useCourses();
  const { teachers } = useTeachers();
  const stats = useMemo(() => ({
    courses: courses.length,
    teachers: teachers.length,
    students: Math.max(200, Math.round(courses.length * 15)),
  }), [courses, teachers]);
  return (
    <View style={styles.row}>
      <Stat icon="🎓" label="Students" value={stats.students} colors={["#7F7FD5", "#86A8E7", "#91EAE4"]} />
      <Stat icon="📚" label="Courses" value={stats.courses} colors={["#a18cd1", "#fbc2eb"]} />
      <Stat icon="👥" label="Teachers" value={stats.teachers} colors={["#F7971E", "#FFD200"]} />
    </View>
  );
}

function Stat({ icon, label, value, colors: grad }) {
  const { colors } = useTheme();
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={grad}
      style={styles.statWrap}
    >
      <View style={[styles.statCard, { borderColor: colors.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          {!!icon && <Text style={{ fontSize: 14, marginRight: 6 }}>{icon}</Text>}
          <Text style={{ color: '#ffffffcc', fontSize: 12 }}>{label}</Text>
        </View>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>{value}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statWrap: { flex: 1, borderRadius: 12, marginRight: 8 },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'transparent',
    ...Platform.select({
      web: {
        boxShadow: '0 3px 6px rgba(0,0,0,0.25)',
      },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
      },
    }),
  },
});
