import { useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ThemeContext } from './themeContext';

/**
 * Controla o tema claro/escuro do app.
 *
 * A troca de cores em si é feita em CSS puro (ver `index.css`, seletor
 * `[data-theme="light"]`): este Provider só decide QUAL tema está ativo e
 * escreve isso como atributo `data-theme` no `<html>`. Fazer a pintura via
 * CSS (e não via estilos inline em JS) significa que qualquer componente
 * já herda o tema automaticamente, sem precisar saber que o tema existe.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('finance:theme', 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}
