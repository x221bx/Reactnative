import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

/**
 * Custom Text component with consistent styling
 */
export default function Text({
    children,
    style,
    variant = 'body',
    color,
    ...props
}) {
    const { colors } = useTheme();

    return (
        <RNText
            style={[
                styles.text,
                styles[variant],
                { color: color || colors.text },
                style
            ]}
            {...props}
        >
            {children}
        </RNText>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        lineHeight: 24,
    },
    h1: {
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 40,
    },
    h2: {
        fontSize: 24,
        fontWeight: 'bold',
        lineHeight: 32,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 28,
    },
    body: {
        fontSize: 16,
        lineHeight: 24,
    },
    small: {
        fontSize: 14,
        lineHeight: 20,
    },
});