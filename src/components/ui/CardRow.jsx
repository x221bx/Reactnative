import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function CardRow({ image, title, subtitle, metaRight }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      {!!image && <Image source={{ uri: image }} style={styles.image} />}
      <View style={{ flex: 1 }}>
        {!!title && <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{title}</Text>}
        {!!subtitle && <Text style={[styles.subtitle, { color: colors.muted }]} numberOfLines={1}>{subtitle}</Text>}
      </View>
      {!!metaRight && <Text style={[styles.meta, { color: colors.text }]}>{metaRight}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  image: { width: 54, height: 54, borderRadius: 8, marginRight: 12 },
  title: { fontSize: 16, fontWeight: '700' },
  subtitle: { fontSize: 13 },
  meta: { fontWeight: '700' },
});
