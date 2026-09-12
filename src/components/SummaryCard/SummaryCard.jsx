import { formatCurrency } from '../../utils/format';
import './SummaryCard.css';

/**
 * Card genérico de resumo (usado no Dashboard para Receitas, Despesas e Saldo).
 * Recebe `tone` para decidir a cor de destaque sem precisar de 3 componentes
 * quase-idênticos.
 */
export default function SummaryCard({ title, value, tone = 'neutral' }) {
  return (
    <div className={`summary-card summary-card--${tone}`}>
      <span className="summary-card__title">{title}</span>
      <strong className="summary-card__value">{formatCurrency(value)}</strong>
    </div>
  );
}
