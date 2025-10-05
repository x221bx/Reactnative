import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { getResponsiveValue } from '../../utils/responsive';

/**
 * Box component for responsive layouts with spacing and flex support
 */
export default function Box({
    children,
    flex,
    direction = 'column',
    align,
    justify,
    wrap,
    margin,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    marginX,
    marginY,
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    paddingX,
    paddingY,
    width,
    height,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    backgroundColor,
    style,
    ...props
}) {
    const { spacing, colors } = useTheme();

    // Process spacing values
    const getSpacing = (value) => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') return spacing[value] || 0;
        return getResponsiveValue(value) || 0;
    };

    const styles = StyleSheet.create({
        box: {
            flexDirection: direction,
            alignItems: align,
            justifyContent: justify,
            flexWrap: wrap,
            flex: flex,
            margin: getSpacing(margin),
            marginTop: getSpacing(marginTop || marginY),
            marginRight: getSpacing(marginRight || marginX),
            marginBottom: getSpacing(marginBottom || marginY),
            marginLeft: getSpacing(marginLeft || marginX),
            padding: getSpacing(padding),
            paddingTop: getSpacing(paddingTop || paddingY),
            paddingRight: getSpacing(paddingRight || paddingX),
            paddingBottom: getSpacing(paddingBottom || paddingY),
            paddingLeft: getSpacing(paddingLeft || paddingX),
            width: getResponsiveValue(width),
            height: getResponsiveValue(height),
            minWidth: getResponsiveValue(minWidth),
            maxWidth: getResponsiveValue(maxWidth),
            minHeight: getResponsiveValue(minHeight),
            maxHeight: getResponsiveValue(maxHeight),
            backgroundColor: backgroundColor && (colors[backgroundColor] || backgroundColor),
        },
    });

    return (
        <View style={[styles.box, style]} {...props}>
            {children}
        </View>
    );
}