import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Chip, useTheme } from 'react-native-paper';
import BottomSheet from '@gorhom/bottom-sheet';
import Slider from '@react-native-community/slider';

const CATEGORIES = [
    'All',
    'Development',
    'Business',
    'Design',
    'Marketing',
    'Photography',
    'Music',
];

const RATINGS = [
    { value: 0, label: 'Any Rating' },
    { value: 4.5, label: '4.5 & up' },
    { value: 4.0, label: '4.0 & up' },
    { value: 3.5, label: '3.5 & up' },
    { value: 3.0, label: '3.0 & up' },
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const FiltersBottomSheet = ({
    bottomSheetRef,
    filters,
    onFiltersChange,
    onApplyFilters,
}) => {
    const { colors } = useTheme();
    const snapPoints = ['25%', '50%', '75%'];

    const handleCategoryPress = useCallback((category) => {
        onFiltersChange({
            ...filters,
            category: category === 'All' ? null : category,
        });
    }, [filters, onFiltersChange]);

    const handleRatingPress = useCallback((rating) => {
        onFiltersChange({
            ...filters,
            minRating: rating,
        });
    }, [filters, onFiltersChange]);

    const handlePriceChange = useCallback((price) => {
        onFiltersChange({
            ...filters,
            maxPrice: price,
        });
    }, [filters, onFiltersChange]);

    const handleMinPriceChange = useCallback((price) => {
        const clamped = Math.min(price, filters.maxPrice);
        onFiltersChange({
            ...filters,
            minPrice: clamped,
        });
    }, [filters, onFiltersChange]);

    const handleLevelPress = useCallback((level) => {
        onFiltersChange({
            ...filters,
            level: filters.level === level ? null : level,
        });
    }, [filters, onFiltersChange]);

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            backgroundStyle={{ backgroundColor: colors.surface }}
        >
            <View style={styles.container}>
                <Text variant="titleLarge" style={styles.title}>
                    Filter Courses
                </Text>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        Category
                    </Text>
                    <View style={styles.categories}>
                        {CATEGORIES.map((category) => (
                            <Chip
                                key={category}
                                mode="outlined"
                                selected={
                                    category === 'All'
                                        ? !filters.category
                                        : filters.category === category
                                }
                                onPress={() => handleCategoryPress(category)}
                                style={styles.chip}
                            >
                                {category}
                            </Chip>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        Rating
                    </Text>
                    <View style={styles.ratings}>
                        {RATINGS.map(({ value, label }) => (
                            <Chip
                                key={value}
                                mode="outlined"
                                selected={filters.minRating === value}
                                onPress={() => handleRatingPress(value)}
                                style={styles.chip}
                            >
                                {label}
                            </Chip>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        Level
                    </Text>
                    <View style={styles.ratings}>
                        {LEVELS.map((lvl) => (
                            <Chip
                                key={lvl}
                                mode="outlined"
                                selected={filters.level === lvl}
                                onPress={() => handleLevelPress(lvl)}
                                style={styles.chip}
                            >
                                {lvl}
                            </Chip>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        Minimum Price
                    </Text>
                    <View style={styles.priceContainer}>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={200}
                            value={filters.minPrice}
                            onValueChange={handleMinPriceChange}
                            minimumTrackTintColor={colors.primary}
                            maximumTrackTintColor={colors.disabled}
                            thumbTintColor={colors.primary}
                        />
                        <Text variant="titleMedium" style={{ color: colors.primary }}>
                            ${Math.round(filters.minPrice)}
                        </Text>
                    </View>
                </View>

                <Button
                    mode="contained"
                    onPress={onApplyFilters}
                    style={styles.applyButton}
                >
                    Apply Filters
                </Button>
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        marginBottom: 16,
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        marginBottom: 12,
    },
    categories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    ratings: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        marginRight: 8,
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    slider: {
        flex: 1,
        height: 40,
    },
    applyButton: {
        marginTop: 16,
    },
});

export default FiltersBottomSheet;
