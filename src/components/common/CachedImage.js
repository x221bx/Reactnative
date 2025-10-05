import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../../theme/ThemeContext';
import Text from '../ui/Text';

const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Cached and optimized image component
 */
export default function CachedImage({
    source,
    style,
    contentFit = 'cover',
    placeholder,
    placeholderText,
    onError,
    transition = 300,
    ...props
}) {
    const { colors } = useTheme();
    const [error, setError] = useState(false);

    const handleError = (e) => {
        setError(true);
        onError?.(e);
    };

    if (error) {
        return (
            <View
                style={[
                    styles.errorContainer,
                    { backgroundColor: colors.background },
                    style
                ]}
            >
                {placeholder ? (
                    <Image
                        source={placeholder}
                        style={styles.placeholder}
                        contentFit="contain"
                    />
                ) : (
                    <Text color="textSecondary">
                        {placeholderText || 'Image not available'}
                    </Text>
                )}
            </View>
        );
    }

    return (
        <Image
            source={source}
            style={style}
            contentFit={contentFit}
            transition={transition}
            cachePolicy="memory-disk"
            onError={handleError}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        overflow: 'hidden',
    },
    placeholder: {
        width: '50%',
        height: '50%',
        opacity: 0.5,
    },
});