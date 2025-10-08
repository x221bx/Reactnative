import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AppHeader from '../../components/ui/AppHeader';
import { useTheme } from '../../hooks/useTheme';
import Input from '../../components/form/Input';
import Button from '../../components/form/Button';
import ConfirmModal from '../../components/ui/ConfirmModal';
import List from '../../components/ui/List';
import CardRow from '../../components/ui/CardRow';
import Pagination from '../../components/ui/Pagination';
import { paginate } from '../../utils/paginate';
import useCourses from '../../hooks/useCourses';
import useTeachers from '../../hooks/useTeachers';

function validateCourse(data) {
  const errs = {};
  if (!data.title || data.title.trim().length < 3) errs.title = 'Title is required';
  if (!data.category) errs.category = 'Category is required';
  if (data.price == null || isNaN(Number(data.price))) errs.price = 'Price must be a number';
  return errs;
}

export default function AdminCoursesScreen({ onHome }) {
  const { colors } = useTheme();
  const { courses, addCourse, updateCourse, removeCourse } = useCourses();
  const { teachers } = useTeachers();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', category: 'General', price: 0, teacherId: '' });
  const [errors, setErrors] = useState({});
  const [confirm, setConfirm] = useState({ show: false, id: null });

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return courses;
    return courses.filter((c) => (c.title || '').toLowerCase().includes(s) || (c.category || '').toLowerCase().includes(s));
  }, [courses, q]);

  const { pageCount, paginated } = paginate(filtered, page, 8);

  const submit = () => {
    const errs = validateCourse(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (editing) updateCourse({ ...form, id: editing.id }); else addCourse(form);
    setForm({ title: '', category: 'General', price: 0, teacherId: '' });
    setEditing(null);
  };

  const askDelete = (id) => setConfirm({ show: true, id });
  const doDelete = () => { if (confirm.id) removeCourse(confirm.id); setConfirm({ show: false, id: null }); };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppHeader title="Admin • Courses" onHome={onHome} showMenu />
      <View style={{ padding: 16 }}>
        <Text style={[styles.section, { color: colors.text }]}>{editing ? 'Edit Course' : 'Add Course'}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Input style={{ flexBasis: '100%' }} label="Title" value={form.title} onChangeText={(v) => setForm((s) => ({ ...s, title: v }))} error={errors.title} />
          <Input style={{ flexBasis: '48%' }} label="Category" value={form.category} onChangeText={(v) => setForm((s) => ({ ...s, category: v }))} error={errors.category} />
          <Input style={{ flexBasis: '48%' }} label="Price" keyboardType="decimal-pad" value={String(form.price)} onChangeText={(v) => setForm((s) => ({ ...s, price: v }))} error={errors.price} />
          <Input style={{ flexBasis: '100%' }} label="Teacher ID" value={form.teacherId} onChangeText={(v) => setForm((s) => ({ ...s, teacherId: v }))} />
          <Button title={editing ? 'Save' : 'Add'} onPress={submit} />
          {editing && <Button variant="outline" title="Cancel" onPress={() => { setEditing(null); setForm({ title: '', category: 'General', price: 0, teacherId: '' }); setErrors({}); }} />}
        </View>

        <View style={{ height: 16 }} />
        <Input label="Search" value={q} onChangeText={(v) => { setQ(v); setPage(1); }} />

        <FlatList
          style={{ marginTop: 12 }}
          data={paginated}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <List>
              <List.Item
                right={<View style={{ flexDirection: 'row' }}><Button title="Edit" onPress={() => { setEditing(item); setForm({ title: item.title, category: item.category, price: item.price, teacherId: item.teacherId || '' }); }} /><View style={{ width: 8 }} /><Button title="Delete" onPress={() => askDelete(item.id)} /></View>}
              >
                <CardRow image={item.image} title={item.title} subtitle={item.category} metaRight={typeof item.price === 'number' ? `$${Number(item.price).toFixed(2)}` : ''} />
              </List.Item>
            </List>
          )}
          ListEmptyComponent={<List.Empty>No courses</List.Empty>}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
        <Pagination page={page} count={pageCount} onChange={(p) => setPage(p)} />
      </View>

      <ConfirmModal
        visible={confirm.show}
        title="Confirm"
        message="Are you sure you want to delete this course?"
        onCancel={() => setConfirm({ show: false, id: null })}
        onConfirm={doDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
});
