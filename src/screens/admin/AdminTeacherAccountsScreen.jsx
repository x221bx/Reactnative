import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppHeader from '../../components/ui/AppHeader';
import { useTheme } from '../../hooks/useTheme';
import Input from '../../components/form/Input';
import Button from '../../components/form/Button';
import List from '../../components/ui/List';
import CardRow from '../../components/ui/CardRow';
import { teachersApi } from '../../api/services/teachers-api';

const USERS_KEY = '@users_db';

export default function AdminTeacherAccountsScreen({ onHome }) {
  const { colors } = useTheme();
  const [teachers, setTeachers] = useState([]);
  const [accounts, setAccounts] = useState({}); // teacherId -> { email, password }
  const [filter, setFilter] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const list = await teachersApi.getAll();
    setTeachers(list);
    try {
      const raw = await AsyncStorage.getItem(USERS_KEY);
      const users = raw ? JSON.parse(raw) : [];
      const map = {};
      (users || []).forEach((u) => {
        if (u.role === 'teacher' && u.teacherId) map[u.teacherId] = { email: u.email, password: u.password };
      });
      setAccounts(map);
    } catch {}
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const s = filter.trim().toLowerCase();
    if (!s) return teachers;
    return teachers.filter((t) => (t.name || '').toLowerCase().includes(s) || (t.subject || '').toLowerCase().includes(s));
  }, [teachers, filter]);

  const saveAccount = async (teacher) => {
    const email = accounts[teacher.id]?.email?.trim();
    const password = accounts[teacher.id]?.password || '';
    if (!email || password.length < 6) return; // simple guard
    setBusy(true);
    try {
      const raw = await AsyncStorage.getItem(USERS_KEY);
      const users = raw ? JSON.parse(raw) : [];
      // prevent duplicate emails for different users
      const emailTakenByOther = users.some((u) => u.email === email && u.teacherId !== teacher.id);
      if (emailTakenByOther) return;
      const idx = users.findIndex((u) => u.role === 'teacher' && u.teacherId === teacher.id);
      if (idx === -1) {
        users.push({ id: Date.now().toString(), role: 'teacher', teacherId: teacher.id, email, password, name: teacher.name });
      } else {
        users[idx] = { ...users[idx], email, password, name: teacher.name };
      }
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    } finally {
      setBusy(false);
    }
  };

  const updateField = (id, field, value) => {
    setAccounts((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppHeader title="Admin • Teacher Accounts" onHome={onHome} showMenu />
      <View style={{ padding: 16 }}>
        <Input label="Search" value={filter} onChangeText={setFilter} />
        <FlatList
          style={{ marginTop: 12 }}
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={true}
          renderItem={({ item }) => (
            <List>
              <List.Item right={
                <View style={{ flexDirection: 'row' }}>
                  <Button title="Save" onPress={() => saveAccount(item)} disabled={busy} />
                </View>
              }>
                <CardRow image={item.image} title={item.name} subtitle={item.subject || 'Teacher'} />
              </List.Item>
              <View style={{ height: 8 }} />
              <List.Item right={<View />}> 
                <View style={styles.row}>
                  <Input style={styles.col} label="Email" value={accounts[item.id]?.email || ''} onChangeText={(v) => updateField(item.id, 'email', v)} />
                  <Input style={styles.col} label="Password" value={accounts[item.id]?.password || ''} secureTextEntry onChangeText={(v) => updateField(item.id, 'password', v)} />
                </View>
              </List.Item>
            </List>
          )}
          ListEmptyComponent={<List.Empty>No teachers</List.Empty>}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  col: { flexBasis: '48%', marginRight: '4%' },
});
