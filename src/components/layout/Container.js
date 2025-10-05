import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

/**
 * Container component with consistent padding and background
 */
export default function Container({ children, style }) {
    const { colors } = useTheme();

    return (
        <View style={[
            styles.container,
            { backgroundColor: colors.background },
            style
        ]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
});