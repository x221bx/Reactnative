import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Text from '../ui/Text';

/**
 * Loading state component with optional message
 */
export default function LoadingState({
    loading = true,
    message,
    size = 'large',
    overlay = false,
    children,
}) {
    const { colors } = useTheme();

    if (!loading) return children || null;

    const content = (
        <View style={[
            styles.container,
            overlay && styles.overlay,
            { backgroundColor: overlay ? colors.overlay : colors.background }
        ]}>
            <ActivityIndicator
                size={size}
                color={colors.primary}
                style={styles.spinner}
            />
            {message && (
                <Text style={styles.message} color={overlay ? 'buttonText' : 'text'}>
                    {message}
                </Text>
            )}
        </View>
    );

    if (overlay) {
        return (
            <>
                {children}
                {content}
            </>
        );
    }

    return content;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        elevation: 5,
    },
    spinner: {
        marginBottom: 16,
    },
    message: {
        textAlign: 'center',
    },
});