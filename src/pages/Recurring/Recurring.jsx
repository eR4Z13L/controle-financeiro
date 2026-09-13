import { useState } from 'react';
import { useFinance } from '../../hooks/useFinance';
import { useToast } from '../../hooks/useToast';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { formatCurrency } from '../../utils/format';
import './Recurring.css';

/**
 * Tela: Transações Recorrentes.
 * Não é onde elas são CRIADAS (isso acontece no formulário de "Nova
 * transação", marcando a caixinha "Repetir todo mês") — aqui só listamos
 * os modelos ativos e permitimos excluir um (o que para as futuras
 * ocorrências, sem apagar as transações já geradas).
 */
export default function Recurring() {
  const { recurringTemplates, categories, deleteRecurringTemplate } = useFinance();
  const { showToast } = useToast();
  const [templateToDelete, setTemplateToDelete] = useState(null);

  function getCategoryName(categoryId) {
    return categories.find((category) => category.id === categoryId)?.name;
  }

  function handleConfirmDelete() {
    deleteRecurringTemplate(templateToDelete.id);
    showToast('Recorrência excluída. As transações já geradas continuam no histórico.');
    setTemplateToDelete(null);
  }

  return (
    <div className="recurring-page">
      <h2>Transações Recorrentes</h2>
      <p className="recurring-page__hint">
        Para criar uma nova recorrência, marque a opção "Repetir todo mês" ao adicionar uma
        transação.
      </p>

      {recurringTemplates.length === 0 ? (
        <p className="recurring-page__empty">Nenhuma transação recorrente configurada.</p>
      ) : (
        <ul className="recurring-page__list">
          {recurringTemplates.map((template) => (
            <li key={template.id} className="recurring-page__item">
              <div className={`recurring-page__icon recurring-page__icon--${template.type}`}>
                🔁
              </div>
              <div className="recurring-page__info">
                <span className="recurring-page__description">{template.description}</span>
                <span className="recurring-page__meta">
                  {getCategoryName(template.categoryId) ?? 'Sem categoria'} · todo dia{' '}
                  {template.dayOfMonth}
                </span>
              </div>
              <span
                className={`recurring-page__amount recurring-page__amount--${template.type}`}
              >
                {template.type === 'income' ? '+' : '-'} {formatCurrency(template.amount)}/mês
              </span>
              <button
                type="button"
                className="btn btn--icon"
                title="Excluir recorrência"
                onClick={() => setTemplateToDelete(template)}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        isOpen={Boolean(templateToDelete)}
        title="Excluir recorrência"
        description={`Parar de repetir "${templateToDelete?.description}" todo mês? As transações já geradas continuam no seu histórico.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTemplateToDelete(null)}
      />
    </div>
  );
}
