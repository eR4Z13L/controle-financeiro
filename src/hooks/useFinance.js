import { useContext } from 'react';
import { FinanceContext } from '../context/context';

/**
 * Hook de acesso ao contexto financeiro. Lançar um erro explícito quando
 * usado fora do `<FinanceProvider>` ajuda a pegar o bug na hora (em vez de
 * um `undefined` silencioso quebrando alguma tela mais na frente).
 */
export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance precisa ser usado dentro de um <FinanceProvider>.');
  }
  return context;
}
