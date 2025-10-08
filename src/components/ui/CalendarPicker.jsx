import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { formatDate } from '../../utils/date';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function buildMonth(year, month) {
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  // pad before
  for (let i = 0; i < startDay; i++) cells.push(null);
  // days
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}

export default function CalendarPicker({
  visible,
  value,
  onClose,
  onSelect,
  initialDate,
}) {
  const { colors } = useTheme();
  const base = value ? new Date(value) : (initialDate ? new Date(initialDate) : new Date());
  const [cursor, setCursor] = useState(new Date(base.getFullYear(), base.getMonth(), 1));
  const [selected, setSelected] = useState(value ? new Date(value) : null);
  const [showMonths, setShowMonths] = useState(false);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const cells = useMemo(() => buildMonth(year, month), [year, month]);

  const prevMonth = () => setCursor(new Date(year, month - 1, 1));
  const nextMonth = () => setCursor(new Date(year, month + 1, 1));
  const prevYear = () => setCursor(new Date(year - 1, month, 1));
  const nextYear = () => setCursor(new Date(year + 1, month, 1));

  const confirm = () => {
    if (!selected) return onClose?.();
    onSelect?.(selected.toISOString());
    onClose?.();
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.outline }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={prevYear} style={styles.iconBtn}>
              <MaterialIcons name="keyboard-double-arrow-left" size={20} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={prevMonth} style={styles.iconBtn}>
              <MaterialIcons name="chevron-left" size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowMonths((s) => !s)}>
              <Text style={[styles.title, { color: colors.text }]}>
                {formatDate(cursor, 'YYYY-MM').replace('-', ' / ')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={nextMonth} style={styles.iconBtn}>
              <MaterialIcons name="chevron-right" size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={nextYear} style={styles.iconBtn}>
              <MaterialIcons name="keyboard-double-arrow-right" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          {showMonths && (
            <View style={styles.months}>
              {Array.from({ length: 12 }).map((_, i) => (
                <TouchableOpacity key={i} style={[styles.monthBtn, { borderColor: colors.outline, backgroundColor: i === month ? colors.primary + '22' : 'transparent' }]} onPress={() => { setCursor(new Date(year, i, 1)); setShowMonths(false); }}>
                  <Text style={{ color: colors.text }}>{String(i + 1).padStart(2, '0')}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.weekRow}>
            {WEEKDAYS.map((d) => (
              <Text key={d} style={[styles.week, { color: colors.muted }]}>{d}</Text>
            ))}
          </View>
          <View style={styles.grid}>
            {cells.map((d, idx) => {
              if (!d) return <View key={`empty-${idx}`} style={styles.cell} />;
              const isSelected = selected && d.toDateString() === selected.toDateString();
              return (
                <TouchableOpacity
                  key={`d-${idx}`}
                  style={[styles.cell, isSelected && { backgroundColor: colors.primary, borderRadius: 8 }]}
                  onPress={() => setSelected(d)}
                >
                  <Text style={{ color: isSelected ? (colors.onPrimary || '#fff') : colors.text }}>{d.getDate()}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={[styles.btn, { borderColor: colors.outline }]}> 
              <Text style={{ color: colors.text }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirm} style={[styles.btn, { backgroundColor: colors.primary }]}> 
              <Text style={{ color: colors.onPrimary || '#fff' }}>Select</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 360, borderRadius: 12, borderWidth: 1, padding: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  iconBtn: { padding: 6, borderRadius: 6 },
  title: { fontWeight: '700' },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  week: { width: 36, textAlign: 'center', fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cell: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginVertical: 4 },
  actions: { marginTop: 12, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, marginLeft: 8 },
});
