import React, { useMemo, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import AppHeader from '../components/ui/AppHeader';
import { useTheme } from '../hooks/useTheme';
import List from '../components/ui/List';
import CardRow from '../components/ui/CardRow';
import Pagination from '../components/ui/Pagination';
import { paginate } from '../utils/paginate';
import { useSelector, useDispatch } from 'react-redux';
import { selectFavorites, removeFavorite } from '../redux/slices/favoritesSlice';
import useCourses from '../hooks/useCourses';

export default function FavoritesScreen({ onHome }) {
  const { colors } = useTheme();
  const { courses } = useCourses();
  const ids = useSelector(selectFavorites);
  const dispatch = useDispatch();
  const items = useMemo(() => courses.filter(c => ids.includes(String(c.id))), [ids, courses]);
  const [page, setPage] = useState(1);
  const { pageCount, paginated } = paginate(items, page, 8);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppHeader title="Favorites" onHome={onHome} showMenu />
      <View style={{ padding: 16 }}>
        <FlatList
          data={paginated}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <List>
              <List.Item right={<View style={{ flexDirection: 'row' }}><Text></Text></View>}>
                <CardRow image={item.image} title={item.title} subtitle={item.category} metaRight={typeof item.price === 'number' ? `$${Number(item.price).toFixed(2)}` : ''} />
              </List.Item>
              <View style={{ height: 8 }} />
              <List.Item right={<View style={{ flexDirection: 'row' }}><Text></Text></View>}>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => dispatch(removeFavorite(item.id))} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.border }}>
                    <Text style={{ color: colors.text }}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </List.Item>
            </List>
          )}
          ListEmptyComponent={<List.Empty>No items</List.Empty>}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
        <Pagination page={page} count={pageCount} onChange={(p) => setPage(p)} />
      </View>
    </View>
  );
}
