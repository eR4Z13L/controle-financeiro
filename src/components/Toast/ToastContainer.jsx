import './ToastContainer.css';

/**
 * Renderiza a pilha de toasts ativos no canto da tela.
 * Componente "burro": só recebe a lista e uma função de fechar — toda a
 * lógica de criar/expirar toasts vive no ToastProvider.
 */
export default function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type}`}>
          <span className="toast__icon">{toast.type === 'error' ? '⚠️' : '✅'}</span>
          <span className="toast__message">{toast.message}</span>
          <button
            type="button"
            className="toast__close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Fechar notificação"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
