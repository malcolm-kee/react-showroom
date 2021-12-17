export interface FrameDimension {
  width: number;
  height: number | '100%';
  name: string;
}

/**
 * dimensions presets for devices
 */
export const deviceDimensions = {
  'Galaxy Note 10': { width: 412, height: 869, name: 'Galaxy Note 10' },
  'iPhone 6/7/8': { width: 375, height: 667, name: 'iPhone 6/7/8' },
  'iPhone X': { width: 375, height: 812, name: 'iPhone X' },
  'iPhone 12': { width: 390, height: 844, name: 'iPhone 12' },
  'iPhone 12 Mini': { width: 360, height: 780, name: 'iPhone 12 Mini' },
  iPad: { width: 768, height: 1024, name: 'iPad' },
  'iPad Pro': { width: 1024, height: 1366, name: 'iPad Pro' },
  'Macbook Air': { width: 1440, height: 900, name: 'Macbook Air' },
} as const;
