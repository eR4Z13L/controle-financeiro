import { useEffect, useState } from 'react';

/**
 * Hook genérico que sincroniza um pedaço de estado com o localStorage.
 *
 * Por que um hook separado em vez de salvar direto no Context?
 * - Reutilização: qualquer estado (transações, categorias, preferências...)
 *   pode usar o mesmo mecanismo de persistência sem repetir código.
 * - Separação de responsabilidades: o Context cuida da REGRA DE NEGÓCIO
 *   (o que é uma transação, como somar totais etc.), e este hook cuida
 *   apenas de PERSISTÊNCIA (onde os dados ficam guardados).
 *   Se um dia trocarmos localStorage por uma API/backend, só este arquivo
 *   muda (ou o Context passa a usar outro hook, tipo `useApi`).
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (error) {
      console.error(`Erro ao ler "${key}" do localStorage:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erro ao salvar "${key}" no localStorage:`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
