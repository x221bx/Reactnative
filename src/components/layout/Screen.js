import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { getResponsiveValue } from '../../utils/responsive';

/**
 * Screen component for consistent page layouts with safe area handling
 */
export default function Screen({
    children,
    scrollable = true,
    safeArea = true,
    backgroundColor,
    padding = 'md',
    style,
    contentContainerStyle,
    ...props
}) {
    const { colors, spacing } = useTheme();

    const containerStyle = [
        styles.container,
        {
            backgroundColor: backgroundColor ? colors[backgroundColor] || backgroundColor : colors.background,
            padding: getResponsiveValue(typeof padding === 'string' ? spacing[padding] : padding),
        },
        style,
    ];

    const content = scrollable ? (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.content, contentContainerStyle]}
            showsVerticalScrollIndicator={false}
            {...props}
        >
            {children}
        </ScrollView>
    ) : (
        children
    );

    if (safeArea) {
        return (
            <SafeAreaView style={containerStyle} edges={['top', 'left', 'right']}>
                {content}
            </SafeAreaView>
        );
    }

    return <ScrollView style={containerStyle}>{content}</ScrollView>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scroll: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
    },
});