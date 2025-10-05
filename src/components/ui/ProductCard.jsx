import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useTheme } from '../../hooks/useTheme';

export default function ProductCard({ image, title, subtitle, price, rating, instructor, lessonsCount, onPress }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}> 
      {!!image && (
        <Image
          source={{ uri: image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      )}
      {!!title && <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{title}</Text>}
      <View style={styles.row}>
        {!!subtitle && <Text style={[styles.subtitle, { color: colors.muted }]} numberOfLines={1}>{subtitle}</Text>}
        {!!rating && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="star" size={14} color={colors.warning} />
            <Text style={[styles.rating, { color: colors.warning, marginLeft: 2 }]}>{Number(rating).toFixed(1)}</Text>
          </View>
        )}
      </View>
      {(instructor || lessonsCount) && (
        <View style={[styles.row, { marginTop: 4 }]}>
          {!!instructor && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="person" size={14} color={colors.muted} />
              <Text style={[styles.meta, { color: colors.muted, marginLeft: 4 }]} numberOfLines={1}>{instructor}</Text>
            </View>
          )}
          {!!lessonsCount && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="menu-book" size={14} color={colors.muted} />
              <Text style={[styles.meta, { color: colors.muted, marginLeft: 4 }]}>{`${lessonsCount} lessons`}</Text>
            </View>
          )}
        </View>
      )}
      {typeof price === 'number' && <Text style={[styles.price, { color: colors.text }]}>${Number(price).toFixed(2)}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, borderWidth: 1, borderRadius: 12, padding: 10 },
  image: { width: '100%', aspectRatio: 16/10, borderRadius: 8, marginBottom: 8, backgroundColor: '#111' },
  title: { fontSize: 14, fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  subtitle: { fontSize: 12 },
  meta: { fontSize: 12 },
  rating: { fontSize: 12, fontWeight: '700' },
  price: { fontSize: 14, fontWeight: '800', marginTop: 6 },
});
