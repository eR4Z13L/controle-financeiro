import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/format';
import './TransactionItem.css';

/**
 * Uma linha da lista de transações.
 * Recebe `categoryName` já resolvido (em vez de todas as categorias +
 * fazer o find aqui) para manter este componente "burro" — ele só exibe
 * dados prontos, não sabe de onde vêm nem como resolvê-los.
 */
export default function TransactionItem({ transaction, categoryName, onDelete }) {
  const isIncome = transaction.type === 'income';

  return (
    <li className="transaction-item">
      <div className={`transaction-item__icon transaction-item__icon--${transaction.type}`}>
        {isIncome ? '↑' : '↓'}
      </div>

      <div className="transaction-item__info">
        <span className="transaction-item__description">{transaction.description}</span>
        <span className="transaction-item__meta">
          {categoryName ?? 'Sem categoria'} · {formatDate(transaction.date)}
        </span>
      </div>

      <span className={`transaction-item__amount transaction-item__amount--${transaction.type}`}>
        {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
      </span>

      <div className="transaction-item__actions">
        <Link to={`/transacoes/${transaction.id}/editar`} className="btn btn--icon" title="Editar">
          ✏️
        </Link>
        {/* `onDelete` é opcional: telas só de leitura (como o resumo do
            Dashboard) podem reaproveitar este item sem oferecer exclusão. */}
        {onDelete && (
          <button
            type="button"
            className="btn btn--icon"
            title="Excluir"
            onClick={() => onDelete(transaction)}
          >
            🗑️
          </button>
        )}
      </div>
    </li>
  );
}
