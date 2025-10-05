import React, { useState, useMemo, useRef, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, Searchbar, ActivityIndicator, FAB, Portal, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
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
  const { courses, isLoading, error, loadMore, hasMore } = useCourses();

  const styles = React.useMemo(() => getStyles(theme), [theme]);

  // State
  const [isGridView, setIsGridView] = useState(true);
  const [filters, setFilters] = useState({
    q: '',
    category: null,
    minPrice: 0,
    maxPrice: 1000,
    rating: 0,
    sortBy: 'popular'
  });

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Apply search filter
    if (filters.q) {
      const searchTerm = filters.q.toLowerCase();
      result = result.filter(course =>
        course.title.toLowerCase().includes(searchTerm) ||
        course.instructor.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (filters.category) {
      result = result.filter(course => course.category === filters.category);
    }

    // Apply price filter
    result = result.filter(course => {
      const price = course.price || 0;
      return price >= filters.minPrice && price <= filters.maxPrice;
    });

    // Apply rating filter
    if (filters.rating > 0) {
      result = result.filter(course => (course.rating || 0) >= filters.rating);
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
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator animating />
      </View>
    );
  };

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
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={t('courses.title')} />
        <Appbar.Action
          icon="sort"
          onPress={() => { }}
        />
        <Appbar.Action
          icon={isGridView ? 'view-list' : 'view-grid'}
          onPress={toggleView}
        />
      </Appbar.Header>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder={t('courses.searchPlaceholder')}
          onChangeText={handleSearch}
          value={filters.q}
          style={styles.searchbar}
        />
      </View>

      <Breadcrumbs
        items={[
          { label: t('navigation.home'), onPress: () => navigation.navigate('Home') },
          { label: t('navigation.courses') }
        ]}
      />

      <FlatList
        data={filteredCourses}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            horizontal={!isGridView}
          />
        )}
        key={isGridView ? 'grid' : 'list'}
        numColumns={isGridView ? 2 : 1}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
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
        onEndReached={hasMore ? loadMore : null}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />

      <Portal>
        <FAB
          style={styles.fab}
          icon="filter"
          onPress={openFilters}
          label={t('courses.filters')}
        />
      </Portal>

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
  },
});
