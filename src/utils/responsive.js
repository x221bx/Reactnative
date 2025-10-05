import { useWindowDimensions, Dimensions } from 'react-native';

// Breakpoints (in dp/px)
export const breakpoints = {
  xs: 0,
  sm: 360,
  md: 600,
  lg: 960,
  xl: 1280,
};

// Grid system configuration
export const grid = {
  columns: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 12,
    xl: 12,
  },
  gutter: {
    xs: 16,
    sm: 16,
    md: 24,
    lg: 24,
    xl: 24,
  },
  margin: {
    xs: 16,
    sm: 16,
    md: 24,
    lg: 24,
    xl: 24,
  },
};

// Hook for responsive breakpoints
export function useBreakpoints() {
  const { width } = useWindowDimensions();

  return {
    width,
    isXs: width < breakpoints.sm,
    isSm: width >= breakpoints.sm && width < breakpoints.md,
    isMd: width >= breakpoints.md && width < breakpoints.lg,
    isLg: width >= breakpoints.lg && width < breakpoints.xl,
    isXl: width >= breakpoints.xl,
    columns: width >= breakpoints.lg ? 3 : width >= breakpoints.md ? 2 : 1,
  };
}

// Get responsive value based on screen size
export function getResponsiveValue(values) {
  const { width } = Dimensions.get('window');

  if (typeof values === 'object') {
    if (width >= breakpoints.xl && values.xl !== undefined) return values.xl;
    if (width >= breakpoints.lg && values.lg !== undefined) return values.lg;
    if (width >= breakpoints.md && values.md !== undefined) return values.md;
    if (width >= breakpoints.sm && values.sm !== undefined) return values.sm;
    return values.xs;
  }

  return values;
}

// Calculate responsive dimension
export function responsiveDimension(dimension, options = {}) {
  const { width, height } = Dimensions.get('window');
  const {
    base = 'width',
    min,
    max,
  } = options;

  const baseValue = base === 'width' ? width : height;
  let value = (baseValue * dimension) / 100;

  if (min !== undefined) value = Math.max(value, min);
  if (max !== undefined) value = Math.min(value, max);

  return value;
}

// Calculate responsive font size
export function responsiveFontSize(size) {
  const { width } = Dimensions.get('window');
  const baseWidth = 360;
  const factor = Math.min(width / baseWidth, 1.2);

  return Math.round(size * factor);
}

// Calculate responsive spacing
export function responsiveSpacing(space) {
  return getResponsiveValue({
    xs: space,
    sm: space * 1.2,
    md: space * 1.5,
    lg: space * 1.8,
    xl: space * 2,
  });
}

// Export screen information
export const screen = {
  ...Dimensions.get('window'),
  isSmallDevice: Dimensions.get('window').width < breakpoints.sm,
  isTablet: Dimensions.get('window').width >= breakpoints.md && Dimensions.get('window').width < breakpoints.lg,
  isDesktop: Dimensions.get('window').width >= breakpoints.lg,
};
