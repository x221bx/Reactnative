import React, { useMemo, useState, useCallback } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Image } from "react-native";
import { Chip } from 'react-native-paper';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import useTeachers from "../hooks/useTeachers";
import LoadingState from "../components/common/LoadingState";
import { useTheme } from "../hooks/useTheme";
import AppHeader from "../components/ui/AppHeader";
import SearchBar from "../components/ui/SearchBar";
import List from "../components/ui/List";
import CardRow from "../components/ui/CardRow";
import Pagination from "../components/ui/Pagination";
import { paginate } from "../utils/paginate";
import { useTranslation } from "../i18n/i18n";
import Breadcrumbs from "../components/ui/Breadcrumbs";

export default function TeachersScreen({ onOpenTeacher, onHome }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { teachers, status, error, reload } = useTeachers();
  const isLoading = status === 'loading';
  const navigation = useNavigation();
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState('All');

  const subjects = useMemo(() => {
    const set = new Set();
    (teachers || []).forEach((t) => {
      const s = t.subject || t.specialization || '';
      if (s) set.add(String(s));
    });
    return ['All', ...Array.from(set)];
  }, [teachers]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return teachers;
    let res = teachers.filter((t) =>
      (t.name || "").toLowerCase().includes(s) || (t.title || t.specialization || "").toLowerCase().includes(s)
    );
    if (subject && subject !== 'All') {
      res = res.filter((t) => String(t.subject || t.specialization || '') === subject);
    }
    return res;
  }, [teachers, q, subject]);

  const [page, setPage] = useState(1);
  const { pageCount, paginated } = paginate(filtered, page, 10);

  const TeacherTile = ({ item }) => (
    <TouchableOpacity onPress={() => (onOpenTeacher ? onOpenTeacher(item) : navigation.navigate('TeacherDetail', { teacherId: item.id }))} style={[styles.tile, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <Text style={{ color: colors.text, fontWeight: '700', textAlign: 'center' }} numberOfLines={1}>{item.name}</Text>
      <Text style={{ color: colors.muted, textAlign: 'center', marginTop: 2 }} numberOfLines={1}>{item.title || item.specialization || '-'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}> 
      <AppHeader title={t('teachers.title')} onHome={onHome} showMenu />
      <View style={{ padding: 16 }}>
        <Breadcrumbs items={[{ label: t('nav.home','Home'), onPress: onHome }, { label: t('nav.teachers','Teachers') }]} rightExtra={<Text style={{ color: colors.muted }}>{t('teachers.results',{count: filtered.length})}</Text>} />
        <SearchBar value={q} onChangeText={setQ} placeholder={t('teachers.search')} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
          {subjects.map((s) => (
            <Chip key={s} mode="outlined" selected={subject === s} onPress={() => setSubject(s)} style={{ marginRight: 6, marginTop: 6 }}>{s}</Chip>
          ))}
        </View>
        {!!error && <Text style={{ color: '#e74c3c' }}>{String(error)}</Text>}
        <FlatList
          style={{ marginTop: 12 }}
          data={paginated}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={true}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={reload} colors={[colors.primary]} tintColor={colors.primary} />
          }
          renderItem={({ item }) => <TeacherTile item={item} />}
          ListEmptyComponent={<List.Empty>{t('teachers.empty')}</List.Empty>}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
        {isLoading && paginated.length === 0 && (
          <LoadingState loading={true} message="Loading teachers..." />
        )}
        <Pagination page={page} count={pageCount} onChange={(p) => setPage(p)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tile: { width: '49%', borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 12, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
});
