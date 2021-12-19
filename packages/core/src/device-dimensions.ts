export interface FrameDimension {
  width: number;
  height: number | '100%';
  name: string;
}

/**
 * dimensions presets for devices
 */
export const deviceDimensions = [
  { width: 400, height: 822, name: 'Galaxy Note 8' },
  { width: 412, height: 869, name: 'Galaxy Note 10' },
  { width: 375, height: 667, name: 'iPhone 6/7/8' },
  { width: 375, height: 812, name: 'iPhone X' },
  { width: 390, height: 844, name: 'iPhone 12' },
  { width: 360, height: 780, name: 'iPhone 12 Mini' },
  { width: 768, height: 1024, name: 'iPad' },
  { width: 576, height: 768, name: 'iPad Mini' },
  { width: 1024, height: 1366, name: 'iPad Pro' },
  { width: 1440, height: 900, name: 'Macbook Air' },
  { width: 960, height: 600, name: 'Macbook Pro' },
] as const;

export type DeviceName = typeof deviceDimensions[number]['name'];

export const deviceDimensionsByName = deviceDimensions.reduce(
  (result, d) => ({
    ...result,
    [d.name]: d,
  }),
  {} as { [key in DeviceName]: typeof deviceDimensions[number] }
);
