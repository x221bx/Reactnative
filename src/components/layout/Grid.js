import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useBreakpoints, grid } from '../../utils/responsive';
import { useTheme } from '../../theme/ThemeContext';

/**
 * Grid container component for responsive layouts
 */
export default function Grid({
    children,
    spacing = 'md',
    align = 'flex-start',
    justify = 'flex-start',
    wrap = true,
    style,
    ...props
}) {
    const { spacing: themeSpacing } = useTheme();
    const { width } = useBreakpoints();

    // Calculate current grid configuration
    const currentGrid = Object.entries(grid.columns).reduce((acc, [breakpoint, columns]) => {
        if (width >= breakpoints[breakpoint]) {
            return { columns, gutter: grid.gutter[breakpoint] };
        }
        return acc;
    }, { columns: grid.columns.xs, gutter: grid.gutter.xs });

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            flexWrap: wrap ? 'wrap' : 'nowrap',
            alignItems: align,
            justifyContent: justify,
            margin: -themeSpacing[spacing] / 2,
        },
        item: {
            padding: themeSpacing[spacing] / 2,
        },
    });

    // Clone children with proper styling
    const gridItems = React.Children.map(children, child => {
        if (!React.isValidElement(child)) return null;

        const itemStyle = [
            styles.item,
            child.props.style,
        ];

        return React.cloneElement(child, {
            style: itemStyle,
        });
    });

    return (
        <View style={[styles.container, style]} {...props}>
            {gridItems}
        </View>
    );
}