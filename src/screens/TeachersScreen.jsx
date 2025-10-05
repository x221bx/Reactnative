import React, { useMemo, useState } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import useTeachers from "../hooks/useTeachers";
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
  const { teachers } = useTeachers();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return teachers;
    return teachers.filter((t) =>
      (t.name || "").toLowerCase().includes(s) || (t.title || t.specialization || "").toLowerCase().includes(s)
    );
  }, [teachers, q]);

  const [page, setPage] = useState(1);
  const { pageCount, paginated } = paginate(filtered, page, 10);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}> 
      <AppHeader title={t('teachers.title')} onHome={onHome} showMenu />
      <View style={{ padding: 16 }}>
        <Breadcrumbs items={[{ label: 'Home', onPress: onHome }, { label: 'Teachers' }]} />
        <SearchBar value={q} onChangeText={setQ} placeholder={t('teachers.search')} />
        <FlatList
          style={{ marginTop: 12 }}
          data={paginated}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onOpenTeacher?.(item)}>
              <List>
                <List.Item>
                  <CardRow image={item.image} title={item.name} subtitle={item.title || item.specialization || '-'} metaRight={Number(item.rating || 0).toFixed(1)} />
                </List.Item>
              </List>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<List.Empty>{t('teachers.empty')}</List.Empty>}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
        <Pagination page={page} count={pageCount} onChange={(p) => setPage(p)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
