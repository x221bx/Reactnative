import React, { useMemo } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import useTeachers from "../hooks/useTeachers";
import useCourses from "../hooks/useCourses";
import { useTheme } from "../hooks/useTheme";
import AppHeader from "../components/ui/AppHeader";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import { useTranslation } from "../i18n/i18n";

export default function TeacherDetailScreen({ teacherId, onBack, onHome }) {
  const { colors } = useTheme();
  const { teachers } = useTeachers();
  const { courses } = useCourses();
  const navigation = useNavigation();
  const route = useRoute();
  const paramId = teacherId || route?.params?.teacherId;
  const { t } = useTranslation();
  const teacher = useMemo(() => teachers.find((t) => String(t.id) === String(paramId)), [teachers, paramId]);
  const teacherCourses = useMemo(
    () => courses.filter((c) => String(c.teacherId) === String(teacher?.id)),
    [courses, teacher]
  );

  if (!teacher) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}> 
        <AppHeader title="Teacher" onBack={onBack} showMenu />
        <Text style={[styles.title, { color: colors.text, textAlign: 'center', marginTop: 16 }]}>Teacher not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={{ paddingBottom: 24 }}>
      <Breadcrumbs items={[{ label: t('nav.home','Home'), onPress: onHome }, { label: t('nav.teachers','Teachers'), onPress: onBack }, { label: teacher.name }]} />
      <AppHeader title={teacher.name} onBack={onBack} onHome={onHome} showMenu />
      <Image source={{ uri: teacher.image }} style={styles.avatar} />
      <Text style={[styles.title, { color: colors.text }]}>{teacher.name}</Text>
      {!!teacher.subject && <Text style={[styles.meta, { color: colors.muted }]}>{teacher.subject}</Text>}
      <Text style={[styles.meta, { color: colors.muted }]}>Rating: {Number(teacher.rating || 0).toFixed(1)}</Text>
      {!!teacher.bio && <Text style={[styles.bio, { color: colors.text }]}>{teacher.bio}</Text>}
      <View style={{ alignItems: 'center', marginTop: 12 }}>
        <TouchableOpacity onPress={() => navigation.navigate('TeacherChat', { teacherId: teacher.id })} style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ color: colors.text }}>Message Teacher</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, { fontSize: 18, marginTop: 16, color: colors.text }]}>Courses ({teacherCourses.length})</Text>
      {teacherCourses.map((c) => (
        <TouchableOpacity key={c.id} style={styles.courseRow} onPress={() => navigation.navigate('CourseDetail', { courseId: c.id })}>
          <Image source={{ uri: c.image }} style={styles.courseImg} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.courseTitle, { color: colors.text }]}>{c.title}</Text>
            <Text style={[styles.meta, { color: colors.muted }]}>{c.category || 'General'}</Text>
          </View>
          {typeof c.price === 'number' && <Text style={[styles.price, { color: colors.text }]}>${Number(c.price || 0).toFixed(2)}</Text>}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginTop: 12, marginBottom: 10 },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  meta: { fontSize: 13, textAlign: 'center', marginTop: 4 },
  bio: { fontSize: 14, textAlign: 'center', marginTop: 8 },
  courseRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  courseImg: { width: 72, height: 48, borderRadius: 6, marginRight: 12 },
  courseTitle: { fontSize: 14, fontWeight: '700' },
  price: { fontWeight: '700', marginLeft: 8 },
});
