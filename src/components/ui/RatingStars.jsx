import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { Text } from 'react-native-paper';
import { useTheme } from '../../hooks/useTheme';

const RatingStars = ({ rating, count, showCount = true, size = 14 }) => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <AirbnbRating
                count={5}
                defaultRating={rating}
                size={size}
                showRating={false}
                isDisabled
                selectedColor={theme.colors.primary}
                unSelectedColor={theme.colors.disabled}
            />
            {showCount && count > 0 && (
                <Text style={[styles.count, { color: theme.colors.secondary }]}>
                    ({count})
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    count: {
        fontSize: 12,
        marginLeft: 4,
    },
});

export default RatingStars;