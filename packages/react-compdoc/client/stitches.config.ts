import type * as Stitches from '@stitches/react';
import { createStitches } from '@stitches/react';

const SPACE_UNIT = 4;
const SPACE_VARIANTS = [
  0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 24, 28, 32, 36,
  40,
] as const;

const spaces = SPACE_VARIANTS.reduce<
  Record<typeof SPACE_VARIANTS[number], string>
>(
  (result, item) => ({
    ...result,
    [item]: `${item * SPACE_UNIT}px`,
  }),
  {} as any
);

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
      '8xl': '6rem',
    },
    lineHeights: {
      xs: '1rem',
      sm: '1.25rem',
      base: '1.5rem',
      lg: '1.75rem',
      xl: '1.75rem',
      '2xl': '2rem',
      '3xl': '2.25rem',
      '4xl': '2.5rem',
      '5xl': '1',
      '6xl': '1',
      '7xl': '1',
      '8xl': '1',
    },
    sizes: {
      screenXl: '1280px',
    },
    space: {
      px: '1px',
      ...spaces,
    },
    colors: {
      'gray-50': '#F9FAFB',
      'gray-100': '#F3F4F6',
      'gray-200': '#E5E7EB',
      'gray-300': '#D1D5DB',
      'gray-400': '#9CA3AF',
      'gray-500': '#6B7280',
      'gray-600': '#4B5563',
      'gray-700': '#374151',
      'gray-800': '#1F2937',
      'gray-900': '#111827',
      'red-50': '#FEF2F2',
      'red-400': '#F87171',
      'red-800': '#991B1B',
      'green-50': '#ECFDF',
      'green-400': '#34D399',
      'green-800': '#065F46',
      'blue-50': '#EFF6FF',
      'blue-400': '#60A5FA',
      'blue-800': '#1E40AF',
      'yellow-50': '#FFFBEB',
      'yellow-400': '#FBBF24',
      'yellow-800': '#92400E',
    },
    radii: {
      none: '0px',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
    },
  },
  utils: {
    marginX: (value: Stitches.PropertyValue<'margin'>) => ({
      marginLeft: value,
      marginRight: value,
    }),
    marginY: (value: Stitches.PropertyValue<'margin'>) => ({
      marginTop: value,
      marginBottom: value,
    }),
    px: (value: Stitches.PropertyValue<'padding'>) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: (value: Stitches.PropertyValue<'padding'>) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
    inset: (value: Stitches.PropertyValue<'top'>) => ({
      top: value,
      left: value,
      right: value,
      bottom: value,
    }),
    roundedT: (value: Stitches.PropertyValue<'borderRadius'>) => ({
      borderTopLeftRadius: value,
      borderTopRightRadius: value,
    }),
    roundedB: (value: Stitches.PropertyValue<'borderRadius'>) => ({
      borderBottomLeftRadius: value,
      borderBottomRightRadius: value,
    }),
  },
});
