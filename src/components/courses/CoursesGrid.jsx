import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import CourseCard from './CourseCard';
import { useTheme } from '../../hooks/useTheme';
import { useBreakpoints } from '../../utils/responsive';

export default function CoursesGrid({
    courses,
    onCoursePress,
    onAddToWishlist,
    onAddToCart,
    ListHeaderComponent,
    ListEmptyComponent
}) {
    const { theme } = useTheme();
    const { isTablet } = useBreakpoints();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        grid: {
            padding: 12,
        },
        courseCard: {
            flex: 1,
            margin: 6,
        },
        emptyContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
        },
        emptyIcon: {
            fontSize: 48,
            marginBottom: 16,
            color: theme.colors.secondary,
        },
        emptyText: {
            fontSize: 16,
            textAlign: 'center',
            color: theme.colors.secondary,
            marginBottom: 8,
        },
        emptySubText: {
            fontSize: 14,
            textAlign: 'center',
            color: theme.colors.secondary,
        },
    });

    const DefaultEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>لم يتم العثور على دورات</Text>
            <Text style={styles.emptySubText}>حاول تعديل الفلاتر للحصول على نتائج مختلفة</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={courses}
                keyExtractor={(item) => item.id.toString()}
                numColumns={isTablet ? 3 : 2}
                contentContainerStyle={styles.grid}
                ListHeaderComponent={ListHeaderComponent}
                ListEmptyComponent={ListEmptyComponent || DefaultEmptyComponent}
                renderItem={({ item }) => (
                    <CourseCard
                        course={item}
                        onPress={() => onCoursePress(item)}
                        onAddToWishlist={() => onAddToWishlist(item)}
                        onAddToCart={() => onAddToCart(item)}
                        style={styles.courseCard}
                    />
                )}
            />
        </View>
    );
}