import './ConfirmDialog.css';

/**
 * Modal de confirmação genérico, usado antes de qualquer exclusão (o "D"
 * de CRUD). Excluir é uma ação destrutiva e irreversível nesta aplicação
 * (não temos "lixeira"), então sempre confirmamos com o usuário antes.
 *
 * `isOpen` controla se o modal deve ser exibido; mantemos o componente
 * sempre "montado" no JSX do chamador e só alternamos a visibilidade,
 * o que simplifica o controle de estado de quem o usa.
 */
export default function ConfirmDialog({ isOpen, title, description, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog__overlay" role="presentation" onClick={onCancel}>
      {/* stopPropagation evita que um clique dentro da caixa feche o modal
          (o clique "vaza" para o overlay por padrão) */}
      <div
        className="confirm-dialog__box"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="confirm-dialog__title">{title}</h3>
        <p className="confirm-dialog__description">{description}</p>
        <div className="confirm-dialog__actions">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" className="btn btn--danger" onClick={onConfirm}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
