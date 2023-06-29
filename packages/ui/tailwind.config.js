const defaultColors = require('tailwindcss/colors');

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ['./src/**/*.ts', './src/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: `var(--react-showroom-primary-50, ${defaultColors.sky['50']})`,
          100: `var(--react-showroom-primary-100, ${defaultColors.sky['100']})`,
          200: `var(--react-showroom-primary-200, ${defaultColors.sky['200']})`,
          300: `var(--react-showroom-primary-300, ${defaultColors.sky['300']})`,
          400: `var(--react-showroom-primary-400, ${defaultColors.sky['400']})`,
          500: `var(--react-showroom-primary-500, ${defaultColors.sky['500']})`,
          600: `var(--react-showroom-primary-600, ${defaultColors.sky['600']})`,
          700: `var(--react-showroom-primary-700, ${defaultColors.sky['700']})`,
          800: `var(--react-showroom-primary-800, ${defaultColors.sky['800']})`,
          900: `var(--react-showroom-primary-900, ${defaultColors.sky['900']})`,
        },
      },
      keyframes: {
        'collapsible-open': {
          from: { height: 0 },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-closed': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'collapsible-open': 'collapsible-open 300ms ease-out',
        'collapsible-closed': 'collapsible-closed 300ms ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
  corePlugins: {
    preflight: false,
  },
};
