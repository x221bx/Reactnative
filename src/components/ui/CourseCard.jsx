import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { useTheme } from '../../hooks/useTheme';
import RatingStars from './RatingStars';
import { useNavigation } from '@react-navigation/native';

const CourseCard = ({ course, horizontal = false }) => {
    const { theme } = useTheme();
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('CourseDetail', { courseId: course.id });
    };

    const handleFavorite = () => {
        // TODO: Implement favorite toggle
    };

    const handleAddToCart = () => {
        // TODO: Implement add to cart
    };

    return (
        <Card
            mode="elevated"
            style={[
                styles.card,
                horizontal && styles.horizontalCard,
                { backgroundColor: theme.colors.surface }
            ]}
            onPress={handlePress}
        >
            <Card.Cover
                source={{ uri: course.thumbnail }}
                style={[styles.image, horizontal && styles.horizontalImage]}
            />
            <Card.Content style={styles.content}>
                <View style={styles.header}>
                    <Text variant="labelMedium" style={styles.category}>
                        {course.category}
                    </Text>
                    <IconButton
                        icon="heart-outline"
                        size={20}
                        onPress={handleFavorite}
                        style={styles.favoriteButton}
                    />
                </View>

                <Text
                    variant="titleMedium"
                    numberOfLines={2}
                    style={[styles.title, { color: theme.colors.primary }]}
                >
                    {course.title}
                </Text>

                <View style={styles.instructor}>
                    <Image
                        source={{ uri: course.instructor.avatar }}
                        style={styles.instructorAvatar}
                    />
                    <Text variant="labelMedium" numberOfLines={1}>
                        {course.instructor.name}
                    </Text>
                </View>

                <View style={styles.footer}>
                    <RatingStars
                        rating={course.rating}
                        count={course.ratingCount}
                        size={12}
                    />

                    <View style={styles.priceContainer}>
                        <Text
                            variant="titleMedium"
                            style={[styles.price, { color: theme.colors.primary }]}
                        >
                            ${course.price}
                        </Text>
                        {course.originalPrice > course.price && (
                            <Text
                                variant="labelSmall"
                                style={[styles.originalPrice, { color: theme.colors.disabled }]}
                            >
                                ${course.originalPrice}
                            </Text>
                        )}
                    </View>
                </View>

                <IconButton
                    icon="cart"
                    mode="contained"
                    size={20}
                    onPress={handleAddToCart}
                    style={[
                        styles.cartButton,
                        { backgroundColor: theme.colors.primary }
                    ]}
                    iconColor={theme.colors.onPrimary}
                />
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 8,
        borderRadius: 12,
        overflow: 'hidden',
        width: 240,
    },
    horizontalCard: {
        width: '100%',
        flexDirection: 'row',
    },
    image: {
        height: 140,
    },
    horizontalImage: {
        width: 120,
        height: '100%',
    },
    content: {
        padding: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    category: {
        textTransform: 'uppercase',
    },
    favoriteButton: {
        margin: 0,
        padding: 0,
    },
    title: {
        marginBottom: 8,
        lineHeight: 20,
    },
    instructor: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    instructorAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    price: {
        fontWeight: 'bold',
    },
    originalPrice: {
        marginLeft: 4,
        textDecorationLine: 'line-through',
    },
    cartButton: {
        position: 'absolute',
        right: 8,
        bottom: 8,
        margin: 0,
    },
});

export default CourseCard;