import React, { useMemo } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { useDispatch, useSelector } from 'react-redux';
import { selectCart, removeFromCart, clearCart } from '../redux/slices/cartSlice';
import { selectWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { joinCourse } from '../redux/slices/enrollmentSlice';
import useCourses from '../hooks/useCourses';
import useAuth from '../hooks/useAuth';
import AppHeader from '../components/ui/AppHeader';
import List from '../components/ui/List';
import CardRow from '../components/ui/CardRow';

export default function CartScreen({ onHome }) {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const wishlist = useSelector(selectWishlist);
  const { courses } = useCourses();
  const { user } = useAuth();

  const items = useMemo(() => courses.filter(c => cart.includes(String(c.id))), [courses, cart]);
  const total = useMemo(() => items.reduce((sum, c) => sum + (Number(c.price) || 0), 0), [items]);

  const checkout = () => {
    if (!user) { navigation.navigate('Auth'); return; }
    items.forEach((c) => {
      dispatch(joinCourse({ userId: user.uid, courseId: c.id }));
      if (wishlist.includes(String(c.id))) dispatch(removeFromWishlist(String(c.id)));
    });
    dispatch(clearCart());
    navigation.navigate('UserDashboard');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppHeader title={`Cart${items.length ? ` (${items.length})` : ''}`} onHome={onHome || (() => navigation.navigate('Home'))} showMenu />
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: colors.muted }}>Your cart is empty</Text>}
        renderItem={({ item }) => (
          <List>
            <List.Item right={
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => dispatch(removeFromCart(item.id))} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.outline }}>
                  <Text style={{ color: colors.text }}>Remove</Text>
                </TouchableOpacity>
              </View>
            }>
              <CardRow image={item.image} title={item.title} subtitle={item.category || item.level || 'Course'} metaRight={typeof item.price === 'number' ? `$${Number(item.price).toFixed(2)}` : ''} />
            </List.Item>
          </List>
        )}
        ListFooterComponent={items.length ? (
          <View style={{ marginTop: 16 }}>
            <Text style={{ textAlign: 'right', fontWeight: '800', color: colors.text }}>Total: ${total.toFixed(2)}</Text>
            <View style={{ height: 8 }} />
            <TouchableOpacity onPress={checkout} style={{ backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 10 }}>
              <Text style={{ textAlign: 'center', color: colors.onPrimary, fontWeight: '700' }}>Checkout</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      />
    </View>
  );
}
