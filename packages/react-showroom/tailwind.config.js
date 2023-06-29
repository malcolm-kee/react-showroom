const baseConfig = require('@showroomjs/ui/tailwind.config');

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  ...baseConfig,
  content: [
    './client/**/*.ts',
    './client/**/*.tsx',
    './node_modules/@showroomjs/ui/dist/*.js',
  ],
};
