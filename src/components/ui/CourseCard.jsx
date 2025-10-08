import React, { useCallback } from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { useTheme } from '../../hooks/useTheme';
import RatingStars from './RatingStars';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { selectWishlist, addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';
import { selectFavorites, addFavorite, removeFavorite } from '../../redux/slices/favoritesSlice';
import { addToCart, selectCart } from '../../redux/slices/cartSlice';
import { useTranslation } from '../../i18n/i18n';
import { showToast } from '../common/Toast';

// onPress/onToggleWishlist/onAddToCart allow consumers to override default behavior
const CourseCard = ({ course, horizontal = false, style, onPress, onToggleWishlist, onAddToCart }) => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const wishlist = useSelector(selectWishlist);
    const favorites = useSelector(selectFavorites);
    const cartItems = useSelector(selectCart);
    const inWishlist = wishlist.includes(String(course?.id));
    const inFavorites = favorites.includes(String(course?.id));
    const inCart = cartItems.includes(String(course?.id));

    const handlePress = useCallback(() => {
        if (typeof onPress === 'function') return onPress();
        navigation.navigate('CourseDetail', { courseId: course.id });
    }, [navigation, course?.id, onPress]);

    const handleFavorite = useCallback(() => {
        if (typeof onToggleWishlist === 'function') return onToggleWishlist();
        if (!course?.id) return;
        if (inWishlist) { dispatch(removeFromWishlist(course.id)); showToast(t('toast.removedFromWishlist','Removed from wishlist')); }
        else { dispatch(addToWishlist(course.id)); showToast(t('toast.addedToWishlist','Added to wishlist')); }
    }, [onToggleWishlist, course?.id, inWishlist, dispatch]);

    const handleAddToCart = useCallback(() => {
        if (typeof onAddToCart === 'function') return onAddToCart();
        if (!course?.id) return;
        dispatch(addToCart(course.id));
        showToast(t('toast.addedToCart','Added to cart'));
    }, [onAddToCart, course?.id, dispatch]);

    const handleToggleFavorite = useCallback(() => {
        if (!course?.id) return;
        if (inFavorites) { dispatch(removeFavorite(course.id)); showToast(t('toast.removedFromFavorites','Removed from favorites')); }
        else { dispatch(addFavorite(course.id)); showToast(t('toast.addedToFavorites','Added to favorites')); }
    }, [course?.id, inFavorites, dispatch]);

    return (
        <Card
            mode="elevated"
            style={[
                styles.card,
                horizontal && styles.horizontalCard,
                { backgroundColor: theme.colors.surface },
                style,
            ]}
            onPress={handlePress}
        >
            <Card.Cover
                source={{ uri: course.thumbnail || course.image }}
                style={[styles.image, horizontal && styles.horizontalImage]}
            />
            <Card.Content style={styles.content}>
                <View style={styles.header}>
                    <Text variant="labelMedium" style={[styles.category, { backgroundColor: theme.colors.tertiary + '22', color: theme.colors.tertiary }]}>
                        {course.category || course.level || 'General'}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IconButton
                            icon={inFavorites ? 'star' : 'star-outline'}
                            size={20}
                            onPress={(e) => { e?.stopPropagation?.(); handleToggleFavorite(); }}
                            style={styles.favoriteButton}
                            iconColor={inFavorites ? theme.colors.warning : undefined}
                        />
                        <IconButton
                            icon={inWishlist ? 'heart' : 'heart-outline'}
                            size={20}
                            onPress={(e) => { e?.stopPropagation?.(); handleFavorite(); }}
                            style={styles.favoriteButton}
                            iconColor={inWishlist ? theme.colors.error : undefined}
                        />
                    </View>
                </View>

                <Text
                    variant="titleMedium"
                    numberOfLines={2}
                    style={[styles.title, { color: theme.colors.primary }]}
                >
                    {course.title}
                </Text>

                <Pressable
                    onPress={() => navigation.navigate('TeacherDetail', { teacherId: course.teacherId })}
                    style={styles.instructor}
                    accessibilityRole="button"
                    accessibilityLabel="Open teacher details"
                >
                    <Image
                        source={{ uri: course.instructor?.avatar }}
                        style={styles.instructorAvatar}
                    />
                    <Text variant="labelMedium" numberOfLines={1}>
                        {course.instructor?.name || 'Teacher'}
                    </Text>
                </Pressable>

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
                            {typeof course.price === 'number' ? `$${Number(course.price).toFixed(0)}` : 'Free'}
                        </Text>
                        {course.originalPrice > course.price && (
                            <Text
                                variant="labelSmall"
                                style={[styles.originalPrice, { color: theme.colors.disabled }]}
                            >
                                ${Number(course.originalPrice).toFixed(0)}
                            </Text>
                        )}
                    </View>
                </View>

                <IconButton
                    icon="cart"
                    mode="contained"
                    size={20}
                    onPress={(e) => { e?.stopPropagation?.(); handleAddToCart(); }}
                    style={[
                        styles.cartButton,
                        { backgroundColor: theme.colors.primary }
                    ]}
                    iconColor={theme.colors.onPrimary}
                />
                {inCart && (
                    <View style={styles.cartBadge}>
                        <Text style={{ color: theme.colors.onPrimary, fontSize: 10 }}>✓</Text>
                    </View>
                )}
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 8,
        borderRadius: 12,
        overflow: 'hidden',
        width: '100%',
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
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
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
    cartBadge: {
        position: 'absolute',
        right: 8,
        bottom: 48,
        backgroundColor: '#43A047',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
});

export default CourseCard;
