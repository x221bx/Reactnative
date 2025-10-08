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
import useTeachers from '../../hooks/useTeachers';

function validateTeacher(data) {
  const errs = {};
  if (!data.name || data.name.trim().length < 3) errs.name = 'Name is required';
  return errs;
}

export default function AdminTeachersScreen({ onHome }) {
  const { colors } = useTheme();
  const { teachers, addTeacher, updateTeacher, removeTeacher } = useTeachers();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', subject: '', image: '', rating: 0 });
  const [errors, setErrors] = useState({});
  const [confirm, setConfirm] = useState({ show: false, id: null });

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return teachers;
    return teachers.filter((t) => (t.name || '').toLowerCase().includes(s) || (t.subject || '').toLowerCase().includes(s));
  }, [teachers, q]);

  const { pageCount, paginated } = paginate(filtered, page, 8);

  const submit = () => {
    const errs = validateTeacher(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (editing) updateTeacher({ ...form, id: editing.id }); else addTeacher(form);
    setForm({ name: '', subject: '', image: '', rating: 0 });
    setEditing(null);
  };

  const askDelete = (id) => setConfirm({ show: true, id });
  const doDelete = () => { if (confirm.id) removeTeacher(confirm.id); setConfirm({ show: false, id: null }); };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppHeader title="Admin • Teachers" onHome={onHome} showMenu />
      <View style={{ padding: 16 }}>
        <Text style={[styles.section, { color: colors.text }]}>{editing ? 'Edit Teacher' : 'Add Teacher'}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Input style={{ flexBasis: '100%' }} label="Name" value={form.name} onChangeText={(v) => setForm((s) => ({ ...s, name: v }))} error={errors.name} />
          <Input style={{ flexBasis: '48%' }} label="Subject" value={form.subject} onChangeText={(v) => setForm((s) => ({ ...s, subject: v }))} />
          <Input style={{ flexBasis: '48%' }} label="Image URL" value={form.image} onChangeText={(v) => setForm((s) => ({ ...s, image: v }))} />
          <Input style={{ flexBasis: '48%' }} label="Rating" keyboardType="decimal-pad" value={String(form.rating)} onChangeText={(v) => setForm((s) => ({ ...s, rating: v }))} />
          <Button title={editing ? 'Save' : 'Add'} onPress={submit} />
          {editing && <Button variant="outline" title="Cancel" onPress={() => { setEditing(null); setForm({ name: '', subject: '', image: '', rating: 0 }); setErrors({}); }} />}
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
                right={<View style={{ flexDirection: 'row' }}><Button title="Edit" onPress={() => { setEditing(item); setForm({ name: item.name, subject: item.subject, image: item.image, rating: item.rating || 0 }); }} /><View style={{ width: 8 }} /><Button title="Delete" onPress={() => askDelete(item.id)} /></View>}
              >
                <CardRow image={item.image} title={item.name} subtitle={item.subject} metaRight={Number(item.rating || 0).toFixed(1)} />
              </List.Item>
            </List>
          )}
          ListEmptyComponent={<List.Empty>No teachers</List.Empty>}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
        <Pagination page={page} count={pageCount} onChange={(p) => setPage(p)} />
      </View>

      <ConfirmModal
        visible={confirm.show}
        title="Confirm"
        message="Are you sure you want to delete this teacher?"
        onCancel={() => setConfirm({ show: false, id: null })}
        onConfirm={doDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
});
