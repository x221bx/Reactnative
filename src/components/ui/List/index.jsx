import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';

function ListRoot({ children, style }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.root, style]}>
      {children}
    </View>
  );
}

function ListItem({ left, right, children, style }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.item, { borderColor: colors.border, backgroundColor: colors.card }, style]}>
      {left}
      <View style={{ flex: 1 }}>{children}</View>
      {right}
    </View>
  );
}

function ListEmpty({ children }) {
  const { colors } = useTheme();
  return (
    <Text style={{ textAlign: 'center', color: colors.muted, marginTop: 24 }}>{children || 'No items.'}</Text>
  );
}

const styles = StyleSheet.create({
  root: { },
  item: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const List = Object.assign(ListRoot, { Item: ListItem, Empty: ListEmpty });
export default List;
