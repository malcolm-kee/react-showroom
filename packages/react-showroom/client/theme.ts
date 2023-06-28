export const THEME = process.env.REACT_SHOWROOM_THEME;

const THEME_CLASS_NAME = '__react-showroom-theme__';

export const colorTheme = THEME_CLASS_NAME;

export const colorThemeCss = `
  .${THEME_CLASS_NAME} {
    --react-showroom-primary-50: ${THEME.colors['primary-50']};
    --react-showroom-primary-100: ${THEME.colors['primary-100']};
    --react-showroom-primary-200: ${THEME.colors['primary-200']};
    --react-showroom-primary-300: ${THEME.colors['primary-300']};
    --react-showroom-primary-400: ${THEME.colors['primary-400']};
    --react-showroom-primary-500: ${THEME.colors['primary-500']};
    --react-showroom-primary-600: ${THEME.colors['primary-600']};
    --react-showroom-primary-700: ${THEME.colors['primary-700']};
    --react-showroom-primary-800: ${THEME.colors['primary-800']};
    --react-showroom-primary-900: ${THEME.colors['primary-900']};
  }
`;
