import { createTheme } from '@showroomjs/ui';

export const THEME = process.env.REACT_SHOWROOM_THEME;

export const colorTheme = createTheme({
  colors: THEME.colors,
});
