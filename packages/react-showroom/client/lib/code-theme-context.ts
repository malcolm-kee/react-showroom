import nightOwlTheme from 'prism-react-renderer/themes/nightOwl';
import * as React from 'react';

export const CodeThemeContext = React.createContext(nightOwlTheme);
CodeThemeContext.displayName = 'ShowroomCodeThemeContext';

export const useCodeTheme = () => React.useContext(CodeThemeContext);
