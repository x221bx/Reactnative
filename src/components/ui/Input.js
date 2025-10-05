import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Text from './Text';

/**
 * Custom Input component with consistent styling
 */
export default function Input({
    label,
    error,
    touched,
    containerStyle,
    inputStyle,
    ...props
}) {
    const { colors } = useTheme();

    const inputStyles = [
        styles.input,
        {
            borderColor: touched && error ? colors.error : colors.border,
            backgroundColor: colors.inputBackground,
            color: colors.text,
        },
        inputStyle
    ];

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text variant="small" style={styles.label}>
                    {label}
                </Text>
            )}
            <TextInput
                style={inputStyles}
                placeholderTextColor={colors.placeholder}
                {...props}
            />
            {touched && error && (
                <Text variant="small" style={[styles.error, { color: colors.error }]}>
                    {error}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    error: {
        marginTop: 4,
    },
});