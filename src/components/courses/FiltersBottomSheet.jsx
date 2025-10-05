import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Searchbar, Chip, Portal } from 'react-native-paper';
import { AirbnbRating } from 'react-native-ratings';
import Slider from '@react-native-community/slider';
import { BottomSheet } from '@gorhom/bottom-sheet';
import { useTheme } from '../../hooks/useTheme';

export default function FiltersBottomSheet({ visible, onDismiss, filters, onFiltersChange }) {
    const { theme } = useTheme();
    const { q, minPrice, maxPrice, category, rating } = filters;

    const updateFilters = (updates) => {
        onFiltersChange({ ...filters, ...updates });
    };

    const categories = [
        { id: 'programming', label: '💻 البرمجة', icon: '💻' },
        { id: 'design', label: '🎨 التصميم', icon: '🎨' },
        { id: 'business', label: '💼 الأعمال', icon: '💼' },
        { id: 'marketing', label: '📢 التسويق', icon: '📢' },
        { id: 'language', label: '🗣 اللغات', icon: '🗣' },
        { id: 'personal', label: '🎯 التطوير الشخصي', icon: '🎯' }
    ];

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.colors.background,
            paddingHorizontal: 20,
            paddingTop: 12,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 16,
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        section: {
            marginBottom: 24,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 12,
            color: theme.colors.text,
        },
        categoriesContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginHorizontal: -4,
        },
        categoryChip: {
            margin: 4,
        },
        priceContainer: {
            marginTop: 8,
        },
        priceLabels: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8,
        },
        priceLabel: {
            color: theme.colors.text,
        },
        buttonContainer: {
            flexDirection: 'row',
            paddingVertical: 16,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
        },
        button: {
            flex: 1,
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
        },
        resetButton: {
            marginRight: 8,
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.primary,
        },
        applyButton: {
            backgroundColor: theme.colors.primary,
        },
        buttonText: {
            fontWeight: '600',
        }
    });

    return (
        <Portal>
            <BottomSheet
                visible={visible}
                onDismiss={onDismiss}
                snapPoints={['75%']}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>الفلاتر</Text>
                        <TouchableOpacity onPress={onDismiss}>
                            <Text>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>البحث</Text>
                        <Searchbar
                            placeholder="ابحث عن الدورات، المدربين، أو المواضيع..."
                            value={q}
                            onChangeText={(text) => updateFilters({ q: text })}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>الفئات</Text>
                        <View style={styles.categoriesContainer}>
                            {categories.map((cat) => (
                                <Chip
                                    key={cat.id}
                                    selected={category === cat.id}
                                    onPress={() => updateFilters({ category: cat.id })}
                                    style={styles.categoryChip}
                                >
                                    {cat.label}
                                </Chip>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>نطاق السعر</Text>
                        <View style={styles.priceContainer}>
                            <Slider
                                minimumValue={0}
                                maximumValue={1000}
                                values={[minPrice || 0, maxPrice || 1000]}
                                onValuesChange={([min, max]) =>
                                    updateFilters({ minPrice: min, maxPrice: max })}
                                step={50}
                            />
                            <View style={styles.priceLabels}>
                                <Text style={styles.priceLabel}>${minPrice || 0}</Text>
                                <Text style={styles.priceLabel}>${maxPrice || 1000}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>التقييم</Text>
                        <AirbnbRating
                            count={5}
                            defaultRating={rating || 0}
                            size={24}
                            showRating={false}
                            onFinishRating={(value) => updateFilters({ rating: value })}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.resetButton]}
                            onPress={() => onFiltersChange({
                                q: '',
                                category: null,
                                minPrice: 0,
                                maxPrice: 1000,
                                rating: 0
                            })}
                        >
                            <Text style={[styles.buttonText, { color: theme.colors.primary }]}>
                                إعادة تعيين
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.applyButton]}
                            onPress={onDismiss}
                        >
                            <Text style={[styles.buttonText, { color: theme.colors.surface }]}>
                                تطبيق
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheet>
        </Portal>
    );
}