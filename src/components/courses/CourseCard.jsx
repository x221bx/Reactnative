import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { AirbnbRating } from 'react-native-ratings';
import { useTheme } from '../../hooks/useTheme';

export default function CourseCard({
    course,
    onPress,
    onAddToWishlist,
    onAddToCart,
    style
}) {
    const { theme } = useTheme();
    const {
        image,
        title,
        instructor,
        price,
        rating,
        reviewsCount,
        lessonsCount,
        duration,
        enrolledCount,
        isBestseller
    } = course;

    const styles = StyleSheet.create({
        container: {
            borderRadius: 12,
            overflow: 'hidden',
            backgroundColor: theme.colors.surface,
        },
        image: {
            width: '100%',
            height: 160,
        },
        content: {
            padding: 12,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        },
        titleContainer: {
            flex: 1,
            marginRight: 8,
        },
        title: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 4,
            color: theme.colors.text,
        },
        instructor: {
            fontSize: 14,
            color: theme.colors.secondary,
            marginBottom: 8,
        },
        stats: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        statItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 12,
        },
        statText: {
            fontSize: 12,
            color: theme.colors.secondary,
            marginLeft: 4,
        },
        ratingContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        rating: {
            marginRight: 4,
        },
        reviewsCount: {
            fontSize: 12,
            color: theme.colors.secondary,
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
        },
        price: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.primary,
        },
        actions: {
            flexDirection: 'row',
        },
        bestseller: {
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
        },
        bestsellerText: {
            color: theme.colors.surface,
            fontSize: 12,
            fontWeight: 'bold',
        },
    });

    return (
        <Card style={[styles.container, style]} onPress={onPress}>
            <View>
                <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
                {isBestseller && (
                    <View style={styles.bestseller}>
                        <Text style={styles.bestsellerText}>الأكثر مبيعاً</Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title} numberOfLines={2}>{title}</Text>
                        <Text style={styles.instructor}>{instructor}</Text>
                    </View>
                </View>

                <View style={styles.ratingContainer}>
                    <AirbnbRating
                        count={5}
                        defaultRating={rating}
                        size={14}
                        showRating={false}
                        isDisabled
                        style={styles.rating}
                    />
                    <Text style={styles.reviewsCount}>({reviewsCount} تقييم)</Text>
                </View>

                <View style={styles.stats}>
                    <View style={styles.statItem}>
                        <IconButton icon="book" size={16} />
                        <Text style={styles.statText}>{lessonsCount} درس</Text>
                    </View>
                    <View style={styles.statItem}>
                        <IconButton icon="clock" size={16} />
                        <Text style={styles.statText}>{duration}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <IconButton icon="account-group" size={16} />
                        <Text style={styles.statText}>{enrolledCount} طالب</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.price}>
                        {price === 0 ? 'مجاناً' : `$${price}`}
                    </Text>
                    <View style={styles.actions}>
                        <IconButton
                            icon="heart"
                            size={20}
                            onPress={onAddToWishlist}
                        />
                        <IconButton
                            icon="cart"
                            size={20}
                            onPress={onAddToCart}
                        />
                    </View>
                </View>
            </View>
        </Card>
    );
}