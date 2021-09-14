import { ThemeConfiguration } from '@showroomjs/core/react';
import { createTheme } from '@showroomjs/ui';

export const THEME: ThemeConfiguration = JSON.parse(
  process.env.REACT_SHOWROOM_THEME
);

export const colorTheme = createTheme({
  colors: THEME.colors,
});
