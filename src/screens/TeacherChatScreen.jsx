import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AppHeader from '../components/ui/AppHeader';
import { useTheme } from '../hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import useAuth from '../hooks/useAuth';
import { nowISO } from '../utils/date';

export default function TeacherChatScreen() {
  const { colors } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const teacherId = route?.params?.teacherId;
  const studentIdParam = route?.params?.studentId || null;
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const storageKey = useMemo(() => {
    // If a teacher is opening a conversation with a specific student, use student's id to target the same thread
    if (user?.role === 'teacher' && studentIdParam) return `chat_${teacherId}_${studentIdParam}`;
    return `chat_${teacherId}_${user?.uid || 'guest'}`;
  }, [teacherId, user?.uid, user?.role, studentIdParam]);

  useEffect(() => {
    (async () => {
      try {
        if (!teacherId) return;
        const raw = await AsyncStorage.getItem(storageKey);
        if (raw) setMessages(JSON.parse(raw));
      } catch {}
    })();
  }, [storageKey, teacherId]);

  useEffect(() => {
    (async () => {
      try { if (!teacherId) return; await AsyncStorage.setItem(storageKey, JSON.stringify(messages)); } catch {}
    })();
  }, [messages, storageKey, teacherId]);

  const send = () => {
    if (!text.trim()) return;
    if (!user) {
      navigation.navigate('Auth');
      return;
    }
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        me: true,
        text,
        at: nowISO(),
        senderId: user.uid,
        senderName: user.displayName || user.email,
        teacherId,
      },
    ]);
    setText('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppHeader title="Chat" onBack={() => navigation.goBack()} showMenu />
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        renderItem={({ item }) => {
          const isMe = !!item.me;
          const bubbleStyle = [
            styles.bubble,
            isMe ? styles.bubbleMe : styles.bubbleOther,
            {
              borderColor: colors.outline,
              backgroundColor: isMe ? colors.primary : colors.surfaceVariant,
            },
          ];
          const textColor = isMe ? (colors.onPrimary || '#fff') : colors.onSurface;
          return (
            <View style={bubbleStyle}>
              {!isMe && !!item.senderName && (
                <Text style={{ color: colors.muted, marginBottom: 2 }}>{item.senderName}</Text>
              )}
              <Text style={{ color: textColor }}>{item.text}</Text>
            </View>
          );
        }}
      />
      <View style={[styles.inputBar, { borderTopColor: colors.border }]}> 
        <TextInput
          placeholder="Type a message"
          value={text}
          onChangeText={setText}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          placeholderTextColor={colors.muted}
        />
        <TouchableOpacity onPress={send} style={[styles.sendBtn, { backgroundColor: colors.primary }]}> 
          <Text style={{ color: colors.onPrimary || '#fff', fontWeight: '700' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: { padding: 10, borderRadius: 12, marginVertical: 4, maxWidth: '80%', borderWidth: 1 },
  bubbleMe: { alignSelf: 'flex-end' },
  bubbleOther: { alignSelf: 'flex-start' },
  inputBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 8, borderTopWidth: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' },
  input: { flex: 1, padding: 10, borderWidth: 1, borderRadius: 8, marginRight: 8 },
  sendBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
});
