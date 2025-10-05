import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { getResponsiveValue } from '../../utils/responsive';

/**
 * Stack component for managing vertical spacing between elements
 */
export default function Stack({
    children,
    spacing = 'md',
    align = 'stretch',
    justify = 'flex-start',
    direction = 'column',
    wrap,
    style,
    ...props
}) {
    const { spacing: themeSpacing } = useTheme();

    const gap = getResponsiveValue(
        typeof spacing === 'string' ? themeSpacing[spacing] : spacing
    );

    const styles = StyleSheet.create({
        stack: {
            flexDirection: direction,
            alignItems: align,
            justifyContent: justify,
            flexWrap: wrap,
        },
    });

    // Add spacing between children
    const stackItems = React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;

        const itemStyle = [
            direction === 'column' && index > 0 && { marginTop: gap },
            direction === 'row' && index > 0 && { marginLeft: gap },
            child.props.style,
        ];

        return React.cloneElement(child, {
            style: itemStyle,
        });
    });

    return (
        <View style={[styles.stack, style]} {...props}>
            {stackItems}
        </View>
    );
}