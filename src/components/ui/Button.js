import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Text from './Text';

/**
 * Custom Button component with consistent styling
 */
export default function Button({
    children,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    style,
    textStyle,
    ...props
}) {
    const { colors } = useTheme();

    const isOutline = variant === 'outline';
    const buttonStyles = [
        styles.button,
        styles[size],
        {
            backgroundColor: disabled ? colors.disabled : (isOutline ? 'transparent' : (colors[variant] || colors.primary)),
            borderWidth: isOutline ? 1 : 0,
            borderColor: isOutline ? colors.primary : 'transparent',
            opacity: disabled ? 0.7 : 1,
        },
        style
    ];

    const textStyles = [
        styles.text,
        { color: isOutline ? colors.primary : colors.buttonText },
        textStyle
    ];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={colors.buttonText} />
            ) : (
                <Text style={textStyles}>{children}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    small: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    medium: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    large: {
        paddingVertical: 16,
        paddingHorizontal: 24,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
});
