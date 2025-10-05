import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function ConfirmModal({ visible, title, message, onCancel, onConfirm }) {
  const { colors } = useTheme();
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          {!!title && <Text style={[styles.title, { color: colors.text }]}>{title}</Text>}
          {!!message && <Text style={[styles.msg, { color: colors.muted }]}>{message}</Text>}
          <View style={styles.row}>
            <TouchableOpacity onPress={onCancel} style={[styles.btn, { borderColor: colors.border }]}>
              <Text style={{ color: colors.text }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={[styles.btn, { borderColor: colors.border, backgroundColor: colors.text }]}>
              <Text style={{ color: colors.bg }}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 420, borderRadius: 12, borderWidth: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '800' },
  msg: { fontSize: 14, marginTop: 8 },
  row: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
});
