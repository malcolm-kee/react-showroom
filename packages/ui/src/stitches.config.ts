import type { PropertyValue } from '@stitches/react';
import type { DefaultThemeMap } from '@stitches/react/types/config';
import type Stitches from '@stitches/react/types/stitches';
import { createStitches } from '@stitches/react';

const SPACE_UNIT = 4;
const SPACE_VARIANTS = [
  0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 24, 28, 32,
  36, 40,
] as const;

const spaces = SPACE_VARIANTS.reduce<
  Record<typeof SPACE_VARIANTS[number], string>
>(
  (result, item) => ({
    ...result,
    [item]: `${Math.round(item * SPACE_UNIT)}px`,
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  {} as any
);

const StitchConfig = {
  media: {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    '2xl': '(min-width: 1536px)',
  },
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
      screenMd: '768px',
      screenLg: '1024px',
      screenXl: '1280px',
      screen2Xl: '1536px',
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
      'red-100': '#FEE2E2',
      'red-400': '#F87171',
      'red-500': '#EF4444',
      'red-800': '#991B1B',
      'green-50': '#ECFDF',
      'green-400': '#34D399',
      'green-500': '#10B981',
      'green-800': '#065F46',
      'blue-50': '#EFF6FF',
      'blue-100': '#DBEAFE',
      'blue-400': '#60A5FA',
      'blue-800': '#1E40AF',
      'yellow-50': '#FFFBEB',
      'yellow-100': '#FEF3C7',
      'yellow-200': '#FDE68A',
      'yellow-400': '#FBBF24',
      'yellow-500': '#F59E0B',
      'yellow-800': '#92400E',
      'primary-50': '#FDF2F8',
      'primary-100': '#FCE7F3',
      'primary-200': '#FBCFE8',
      'primary-300': '#F9A8D4',
      'primary-400': '#F472B6',
      'primary-500': '#EC4899',
      'primary-600': '#DB2777',
      'primary-700': '#BE185D',
      'primary-800': '#9D174D',
      'primary-900': '#831843',
    },
    fonts: {
      untitled: 'Untitled Sans, apple-system, sans-serif',
      sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    radii: {
      none: '0px',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    },
  },
  utils: {
    marginX: (value: PropertyValue<'margin'>) => ({
      marginLeft: value,
      marginRight: value,
    }),
    marginY: (value: PropertyValue<'margin'>) => ({
      marginTop: value,
      marginBottom: value,
    }),
    px: (value: PropertyValue<'padding'>) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: (value: PropertyValue<'padding'>) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
    inset: (value: PropertyValue<'top'>) => ({
      top: value,
      left: value,
      right: value,
      bottom: value,
    }),
    roundedT: (value: PropertyValue<'borderRadius'>) => ({
      borderTopLeftRadius: value,
      borderTopRightRadius: value,
    }),
    roundedB: (value: PropertyValue<'borderRadius'>) => ({
      borderBottomLeftRadius: value,
      borderBottomRightRadius: value,
    }),
    outlineRing: (value: PropertyValue<'color'>) => ({
      '&:focus': {
        outline: 'none',
        borderColor: 'transparent',
      },
      '&:focus-visible': {
        outlineColor: value || '$primary-200',
        outlineStyle: 'solid',
        outlineWidth: '2px',
      },
    }),
    shadow: (type: 'sm' | 'lg' | 'inner') => ({
      boxShadow: `0 0 #0000, 0 0 #0000, ${
        type === 'inner'
          ? 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
          : type === 'lg'
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      }`,
    }),
    srOnly: (applied: boolean) =>
      applied
        ? {
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            borderWidth: 0,
          }
        : {
            position: 'static',
            width: 'auto',
            height: 'auto',
            padding: 0,
            margin: 0,
            overflow: 'visible',
            clip: 'auto',
            whiteSpace: 'normal',
          },
  },
} as const;

type StitchConfigType = typeof StitchConfig;

type StitchResult = Stitches<
  '',
  StitchConfigType['media'],
  StitchConfigType['theme'],
  DefaultThemeMap,
  StitchConfigType['utils']
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const result: StitchResult = createStitches(StitchConfig) as any;

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = result;

export const text = css({
  variants: {
    variant: {
      xs: {
        fontSize: '$xs',
        lineHeight: '$xs',
      },
      sm: {
        fontSize: '$sm',
        lineHeight: '$sm',
      },
      base: {
        fontSize: '$base',
        lineHeight: '$base',
      },
      lg: {
        fontSize: '$lg',
        lineHeight: '$lg',
      },
      xl: {
        fontSize: '$xl',
        lineHeight: '$xl',
      },
      '2xl': {
        fontSize: '$2xl',
        lineHeight: '$2xl',
      },
      '3xl': {
        fontSize: '$3xl',
        lineHeight: '$3xl',
      },
      '4xl': {
        fontSize: '$4xl',
        lineHeight: '$4xl',
      },
      '5xl': {
        fontSize: '$5xl',
        lineHeight: '$5xl',
      },
      '6xl': {
        fontSize: '$6xl',
        lineHeight: '$6xl',
      },
      '7xl': {
        fontSize: '$7xl',
        lineHeight: '$7xl',
      },
      '8xl': {
        fontSize: '$8xl',
        lineHeight: '$8xl',
      },
    },
  },
});
