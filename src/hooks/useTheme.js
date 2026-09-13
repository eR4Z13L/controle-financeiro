import { useContext } from 'react';
import { ThemeContext } from '../context/themeContext';

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme precisa ser usado dentro de um <ThemeProvider>.');
  }
  return context;
}
