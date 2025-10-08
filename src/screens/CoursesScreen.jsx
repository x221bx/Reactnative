import React, { useState, useMemo, useRef, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, Searchbar, ActivityIndicator, Text, Menu } from 'react-native-paper';
import { useNavigation, useIsFocused, DrawerActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useCourses from '../hooks/useCourses';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../i18n/i18n';
import CourseCard from '../components/ui/CourseCard';
import FiltersBottomSheet from '../components/ui/FiltersBottomSheet';
import Breadcrumbs from '../components/ui/Breadcrumbs';

export default function CoursesScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef(null);
  const { courses, status, error } = useCourses();
  const isFocused = useIsFocused();
  const isLoading = status === 'loading';
  const hasMore = false;

  const styles = React.useMemo(() => getStyles(theme), [theme]);

  // State
  const [isGridView, setIsGridView] = useState(true);
  const [filters, setFilters] = useState({
    q: '',
    category: null,
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
    sortBy: 'popular'
  });
  const [sortMenuVisible, setSortMenuVisible] = useState(false);

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Apply search filter
    if (filters.q) {
      const searchTerm = filters.q.toLowerCase();
      result = result.filter((course) => { const title = String(course?.title||'').toLowerCase(); const instructorName = typeof course?.instructor==='string' ? course.instructor : (course?.instructor?.name||''); const instructor = instructorName.toLowerCase(); const catStr = (course?.category || course?.level || (Array.isArray(course?.topics)? course.topics.join(' ') : '')); const category = String(catStr).toLowerCase(); return title.includes(searchTerm) || instructor.includes(searchTerm) || category.includes(searchTerm); });
    }

    // Apply category filter (category or level/topics)
    if (filters.category) {
      result = result.filter(course => {
        const cat = (course.category || course.level || (Array.isArray(course.topics) ? course.topics[0] : '')).toString();
        return cat === filters.category;
      });
    }

    // Apply level filter
    if (filters.level) {
      result = result.filter(course => (course.level || '').toString() === filters.level);
    }

    // Apply price filter
    result = result.filter(course => {
      const price = course.price || 0;
      return price >= filters.minPrice && price <= filters.maxPrice;
    });

    // Apply rating filter
    if (filters.minRating > 0) {
      result = result.filter(course => (course.rating || 0) >= filters.minRating);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'popular':
        result.sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => (isNaN(new Date(b?.createdAt||b?.updatedAt||0))?0:new Date(b?.createdAt||b?.updatedAt||0).getTime()) - (isNaN(new Date(a?.createdAt||a?.updatedAt||0))?0:new Date(a?.createdAt||a?.updatedAt||0).getTime()));
        break;
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
    }

    return result;
  }, [courses, filters]);

  const handleSearch = useCallback((query) => {
    setFilters(prev => ({ ...prev, q: query }));
  }, []);

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleApplyFilters = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const openFilters = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const toggleView = useCallback(() => {
    setIsGridView(prev => !prev);
  }, []);

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text variant="titleMedium">{t('courses.empty')}</Text>
    </View>
  );

  const renderFooter = () => null;

  if (error) {
    return (
      <View style={styles.centered}>
        <Text variant="titleMedium">Error loading courses</Text>
        <Text variant="bodyMedium">{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="menu" onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} accessibilityLabel={t('nav.menu','Menu')} />
        <Appbar.Content title={t('courses.title')} />
        <Menu
          visible={sortMenuVisible}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={<Appbar.Action icon="sort" onPress={() => setSortMenuVisible(true)} />}
          contentStyle={{ maxHeight: 300 }}
        >
          <Menu.Item onPress={() => { setFilters((f) => ({ ...f, sortBy: 'popular' })); setSortMenuVisible(false); }} title={t('courses.sort.popular', 'Most Popular')} />
          <Menu.Item onPress={() => { setFilters((f) => ({ ...f, sortBy: 'rating' })); setSortMenuVisible(false); }} title={t('courses.sort.rating', 'Top Rated')} />
          <Menu.Item onPress={() => { setFilters((f) => ({ ...f, sortBy: 'newest' })); setSortMenuVisible(false); }} title={t('courses.sort.newest', 'Newest')} />
          <Menu.Item onPress={() => { setFilters((f) => ({ ...f, sortBy: 'price-low' })); setSortMenuVisible(false); }} title={t('courses.sort.priceLow', 'Price: Low to High')} />
          <Menu.Item onPress={() => { setFilters((f) => ({ ...f, sortBy: 'price-high' })); setSortMenuVisible(false); }} title={t('courses.sort.priceHigh', 'Price: High to Low')} />
        </Menu>
        <Appbar.Action
          icon={isGridView ? 'view-list' : 'view-grid'}
          onPress={toggleView}
        />
        <Appbar.Action icon="filter" onPress={openFilters} accessibilityLabel={t('courses.filters','Filters')} />
      </Appbar.Header>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder={t('courses.search', 'Search courses')}
          onChangeText={handleSearch}
          value={filters.q}
          style={styles.searchbar}
        />
      </View>

      <Breadcrumbs
        items={[
          { label: t('nav.home', 'Home'), onPress: () => navigation.navigate('Home') },
          { label: t('nav.courses', 'Courses') }
        ]}
      />

      <FlatList
        data={filteredCourses}
        renderItem={({ item }) => (
          <View style={isGridView ? styles.gridItem : styles.listItem}>
            <CourseCard
              course={item}
              horizontal={!isGridView}
            />
          </View>
        )}
        key={isGridView ? 'grid' : 'list'}
        numColumns={isGridView ? 2 : 1}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.list, isGridView && styles.grid]}
        columnWrapperStyle={isGridView ? { gap: 8 } : undefined}
        ListEmptyComponent={!isLoading && renderEmpty()}
        ListHeaderComponent={
          filters.q ? (
            <View style={styles.resultsHeader}>
              <Text variant="titleMedium">
                {t('courses.resultsCount', { count: filteredCourses.length })}
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={renderFooter()}
        onEndReached={null}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />

      <FiltersBottomSheet
        bottomSheetRef={bottomSheetRef}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onApplyFilters={handleApplyFilters}
      />
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    elevation: 0,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: theme.colors.surface,
  },
  searchbar: {
    elevation: 2,
  },
  list: {
    padding: 8,
    paddingBottom: 80,
  },
  grid: {
    gap: 8,
  },
  gridItem: {
    flex: 1,
  },
  listItem: {
    width: '100%',
  },
  resultsHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: theme.colors.primary,
    zIndex: 1000,
    elevation: 6,
  },
});

