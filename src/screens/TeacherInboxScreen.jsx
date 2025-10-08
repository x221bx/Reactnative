import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppHeader from '../components/ui/AppHeader';
import { useTheme } from '../hooks/useTheme';
import Text from '../components/ui/Text';
import useAuth from '../hooks/useAuth';

export default function TeacherInboxScreen({ onHome, navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);

  const load = useCallback(async () => {
    if (!user?.role || user.role !== 'teacher' || !user.teacherId) {
      setThreads([]);
      return;
    }
    try {
      const keys = await AsyncStorage.getAllKeys();
      const prefix = `chat_${user.teacherId}_`;
      const chatKeys = keys.filter((k) => k.startsWith(prefix));
      const pairs = await AsyncStorage.multiGet(chatKeys);
      const list = pairs.map(([key, raw]) => {
        const messages = raw ? JSON.parse(raw) : [];
        const last = messages[messages.length - 1] || null;
        const studentId = key.substring(prefix.length);
        const title = last?.senderName || `Student ${studentId.substring(0, 4)}`;
        const preview = last?.text || 'No messages yet';
        return { key, studentId, title, preview, at: last?.at || null };
      });
      // sort by latest
      list.sort((a, b) => (new Date(b.at || 0)).getTime() - (new Date(a.at || 0)).getTime());
      setThreads(list);
    } catch (e) {
      setThreads([]);
    }
  }, [user?.teacherId, user?.role]);

  useEffect(() => { load(); }, [load]);

  const openThread = (studentId) => {
    navigation.navigate('TeacherChat', { teacherId: user.teacherId, studentId });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppHeader title="Inbox" onHome={onHome} showMenu />
      <FlatList
        data={threads}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text color="muted">No conversations</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openThread(item.studentId)} style={[styles.item, { borderColor: colors.outline, backgroundColor: colors.card }]}> 
            <Text style={{ fontWeight: '700', color: colors.text }}>{item.title}</Text>
            <Text numberOfLines={1} style={{ color: colors.muted, marginTop: 2 }}>{item.preview}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: { padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 8 },
});

