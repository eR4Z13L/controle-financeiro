import { useCallback, useState } from 'react';
import { ToastContext } from './toastContext';
import ToastContainer from '../components/Toast/ToastContainer';
import { generateId } from '../utils/format';

const AUTO_DISMISS_MS = 3500;

/**
 * Provider de toasts: guarda a lista de notificações ativas e expõe
 * `showToast` para qualquer tela disparar um feedback rápido (ex: "Transação
 * criada!"). Fica de fora do FinanceContext de propósito — notificação é
 * uma preocupação de UI, não de regra de negócio, então não devem se
 * misturar no mesmo contexto.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'success') => {
      const id = generateId();
      setToasts((current) => [...current, { id, message, type }]);

      // Auto-remove depois de um tempo, para o usuário não precisar fechar
      // manualmente cada notificação.
      setTimeout(() => dismissToast(id), AUTO_DISMISS_MS);
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}
