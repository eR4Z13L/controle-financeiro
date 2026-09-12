import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFinance } from '../../hooks/useFinance';
import TransactionItem from '../../components/TransactionItem/TransactionItem';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import './Transactions.css';

/**
 * Tela 2: Transações.
 * Aqui vive o "R" (read, com filtros) e o "D" (delete) do CRUD de
 * transações. O "C" (criar) e o "U" (atualizar) ficam em telas próprias
 * porque envolvem um formulário maior — misturar tudo numa tela só
 * deixaria o componente inchado e mais difícil de manter.
 */
export default function Transactions() {
  const { transactions, categories, deleteTransaction } = useFinance();
  const [typeFilter, setTypeFilter] = useState('all');
  // Guardamos a transação "candidata a exclusão" em vez de um booleano
  // simples, porque o modal de confirmação precisa saber QUAL transação
  // (para mostrar a descrição) e o handler de confirmação precisa do id.
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const filteredTransactions = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (typeFilter === 'all') return sorted;
    return sorted.filter((transaction) => transaction.type === typeFilter);
  }, [transactions, typeFilter]);

  function getCategoryName(categoryId) {
    return categories.find((category) => category.id === categoryId)?.name;
  }

  function handleConfirmDelete() {
    deleteTransaction(transactionToDelete.id);
    setTransactionToDelete(null);
  }

  return (
    <div className="transactions-page">
      <header className="transactions-page__header">
        <h2>Transações</h2>
        <Link to="/transacoes/nova" className="btn btn--primary">
          + Nova transação
        </Link>
      </header>

      <div className="transactions-page__filters">
        {[
          { value: 'all', label: 'Todas' },
          { value: 'income', label: 'Receitas' },
          { value: 'expense', label: 'Despesas' },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            className={`transactions-page__filter-btn${typeFilter === option.value ? ' transactions-page__filter-btn--active' : ''}`}
            onClick={() => setTypeFilter(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {filteredTransactions.length === 0 ? (
        <p className="transactions-page__empty">Nenhuma transação encontrada.</p>
      ) : (
        <ul className="transactions-page__list">
          {filteredTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              categoryName={getCategoryName(transaction.categoryId)}
              onDelete={setTransactionToDelete}
            />
          ))}
        </ul>
      )}

      <ConfirmDialog
        isOpen={Boolean(transactionToDelete)}
        title="Excluir transação"
        description={`Tem certeza que deseja excluir "${transactionToDelete?.description}"? Essa ação não pode ser desfeita.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTransactionToDelete(null)}
      />
    </div>
  );
}
