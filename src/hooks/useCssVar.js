import { useMemo } from 'react';
import { useTheme } from './useTheme';

/**
 * Lê o valor calculado de uma variável CSS (ex: "--color-income").
 *
 * Os gráficos (Recharts) não entendem `var(--cor)` diretamente em todas as
 * situações — precisam do valor final (ex: "#22c55e"). Como as cores mudam
 * entre os temas claro/escuro, recalculamos sempre que `theme` muda, para
 * o gráfico já nascer com a cor certa em vez de só atualizar no próximo
 * re-render por outro motivo.
 */
export function useCssVar(variableName) {
  const { theme } = useTheme();

  return useMemo(
    () => getComputedStyle(document.documentElement).getPropertyValue(variableName).trim(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme, variableName]
  );
}
