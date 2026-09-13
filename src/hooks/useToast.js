import { useContext } from 'react';
import { ToastContext } from '../context/toastContext';

/**
 * Hook de acesso ao sistema de toasts.
 * Uso: `const { showToast } = useToast(); showToast('Salvo com sucesso!');`
 * O segundo argumento aceita 'success' | 'error' (default: 'success').
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast precisa ser usado dentro de um <ToastProvider>.');
  }
  return context;
}
