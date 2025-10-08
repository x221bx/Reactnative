import React, { useState, useMemo, useRef, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Platform } from 'react-native';
import { Searchbar, ActivityIndicator, Text, Menu, Button as PaperButton, Chip, Portal, Modal, Button } from 'react-native-paper';
import LoadingState from '../components/common/LoadingState';
import { useNavigation, useIsFocused, DrawerActions, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useCourses from '../hooks/useCourses';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../i18n/i18n';
import CourseCard from '../components/ui/CourseCard';
import FiltersBottomSheet from '../components/ui/FiltersBottomSheet';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import AppHeader from '../components/ui/AppHeader';

export default function CoursesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef(null);
  const { courses, status, error, reload } = useCourses();
  const isFocused = useIsFocused();
  const isLoading = status === 'loading';
  const hasMore = false;

  const styles = React.useMemo(() => getStyles(theme), [theme]);

  // State
  const [isGridView, setIsGridView] = useState(true);
  const [filters, setFilters] = useState({
    q: '',
    category: route?.params?.category || null,
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
    sortBy: 'popular'
  });
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const quickCats = ['All', 'Development', 'Business', 'Design', 'Marketing', 'Photography', 'Music'];
  const sortOptions = [
    { key: 'popular', label: t('courses.sort.popular', 'Most Popular') },
    { key: 'rating', label: t('courses.sort.rating', 'Top Rated') },
    { key: 'newest', label: t('courses.sort.newest', 'Newest') },
    { key: 'price-low', label: t('courses.sort.priceLow', 'Price: Low to High') },
    { key: 'price-high', label: t('courses.sort.priceHigh', 'Price: High to Low') },
  ];
  const [filtersDialog, setFiltersDialog] = useState(false);
  React.useEffect(() => {
    const cat = route?.params?.category;
    if (cat !== undefined) setFilters((f) => ({ ...f, category: cat || null }));
  }, [route?.params?.category]);

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
        const toMs = (x) => {
          const d = x?.createdAt || x?.updatedAt || 0;
          try {
            const { toMillis } = require('../utils/date');
            return toMillis(d);
          } catch (_) {
            const dd = new Date(d);
            return isNaN(dd.getTime()) ? 0 : dd.getTime();
          }
        };
        result.sort((a, b) => toMs(b) - toMs(a));
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
    if (Platform.OS === 'web') setFiltersDialog(true);
    else bottomSheetRef.current?.expand();
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
    <View style={[styles.container, { paddingTop: 0 }]}>
      <AppHeader title={t('courses.title')} showMenu />
      <View style={styles.toolbar}>
        <Menu
          visible={sortMenuVisible}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={<PaperButton mode="outlined" onPress={() => setSortMenuVisible(true)} icon="sort">{t('courses.sort.title','Sort')}</PaperButton>}
          contentStyle={{ maxHeight: 300 }}
        >
          <Menu.Item onPress={() => { setFilters((f) => ({ ...f, sortBy: 'popular' })); setSortMenuVisible(false); }} title={t('courses.sort.popular', 'Most Popular')} />
          <Menu.Item onPress={() => { setFilters((f) => ({ ...f, sortBy: 'rating' })); setSortMenuVisible(false); }} title={t('courses.sort.rating', 'Top Rated')} />
          <Menu.Item onPress={() => { setFilters((f) => ({ ...f, sortBy: 'newest' })); setSortMenuVisible(false); }} title={t('courses.sort.newest', 'Newest')} />
          <Menu.Item onPress={() => { setFilters((f) => ({ ...f, sortBy: 'price-low' })); setSortMenuVisible(false); }} title={t('courses.sort.priceLow', 'Price: Low to High')} />
          <Menu.Item onPress={() => { setFilters((f) => ({ ...f, sortBy: 'price-high' })); setSortMenuVisible(false); }} title={t('courses.sort.priceHigh', 'Price: High to Low')} />
        </Menu>
        <PaperButton mode="outlined" icon={isGridView ? 'view-list' : 'view-grid'} onPress={toggleView} style={{ marginLeft: 8 }}>
          {isGridView ? t('courses.view.list','List') : t('courses.view.grid','Grid')}
        </PaperButton>
        <PaperButton mode="contained" icon="filter" onPress={openFilters} style={{ marginLeft: 8 }}>
          {t('courses.filters','Filters')}
        </PaperButton>
      </View>
      <View style={styles.sortChips}>
        {sortOptions.map((opt) => (
          <Chip key={opt.key} mode="outlined" selected={filters.sortBy === opt.key} onPress={() => setFilters((f) => ({ ...f, sortBy: opt.key }))} style={{ marginRight: 6, marginTop: 8 }}>{opt.label}</Chip>
        ))}
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder={t('courses.search', 'Search courses')}
          onChangeText={handleSearch}
          value={filters.q}
          style={styles.searchbar}
        />
        <View style={styles.quickRow}>
          {quickCats.map((c) => {
            const selected = (c === 'All' && !filters.category) || (c !== 'All' && filters.category === c);
            return (
              <Chip key={c} mode="outlined" selected={selected} onPress={() => setFilters((f) => ({ ...f, category: c === 'All' ? null : c }))} style={{ marginRight: 6, marginTop: 8 }}>{c}</Chip>
            );
          })}
        </View>
      </View>

      <Breadcrumbs
        items={[
          { label: t('nav.home', 'Home'), onPress: () => navigation.navigate('Home') },
          { label: t('nav.courses', 'Courses') }
        ]}
        rightExtra={<Text style={{ color: theme.colors.muted }}>{t('courses.resultsCount', { count: filteredCourses.length })}</Text>}
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
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={reload}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        onEndReached={null}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />
      {isLoading && filteredCourses.length === 0 && (
        <LoadingState loading={true} message="Loading courses..." />
      )}

      <FiltersBottomSheet
        bottomSheetRef={bottomSheetRef}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onApplyFilters={handleApplyFilters}
      />
      <Portal>
        <Modal visible={filtersDialog} onDismiss={() => setFiltersDialog(false)} contentContainerStyle={{ backgroundColor: theme.colors.surface, margin: 16, padding: 16, borderRadius: 12 }}>
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>{t('courses.filters','Filters')}</Text>
          <Text style={{ marginBottom: 6 }}>{t('courses.category','Category')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {quickCats.map((c) => {
              const selected = (c === 'All' && !filters.category) || (c !== 'All' && filters.category === c);
              return (
                <Chip key={c} mode="outlined" selected={selected} onPress={() => setFilters((f) => ({ ...f, category: c === 'All' ? null : c }))} style={{ marginRight: 6, marginTop: 8 }}>{c}</Chip>
              );
            })}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
            <Button mode="outlined" onPress={() => setFiltersDialog(false)} style={{ marginRight: 8 }}>{t('action.cancel','Cancel')}</Button>
            <Button mode="contained" onPress={() => setFiltersDialog(false)}>{t('action.apply','Apply')}</Button>
          </View>
        </Modal>
      </Portal>
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
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: theme.colors.surface,
  },
  sortChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: theme.colors.surface,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: theme.colors.surface,
  },
  searchbar: {
    elevation: 2,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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

