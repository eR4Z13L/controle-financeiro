import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFinance } from '../../hooks/useFinance';
import { useToast } from '../../hooks/useToast';
import TransactionItem from '../../components/TransactionItem/TransactionItem';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { exportToCSV, exportToJSON, parseImportFile } from '../../utils/exportImport';
import './Transactions.css';

const EMPTY_FILTERS = { search: '', categoryId: 'all', dateFrom: '', dateTo: '' };

/**
 * Tela 2: Transações.
 * Aqui vive o "R" (read, com filtros e busca) e o "D" (delete) do CRUD de
 * transações. O "C" (criar) e o "U" (atualizar) ficam em telas próprias
 * porque envolvem um formulário maior — misturar tudo numa tela só
 * deixaria o componente inchado e mais difícil de manter.
 */
export default function Transactions() {
  const { transactions, categories, deleteTransaction, importData } = useFinance();
  const { showToast } = useToast();

  const [typeFilter, setTypeFilter] = useState('all');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  // Guardamos a transação "candidata a exclusão" em vez de um booleano
  // simples, porque o modal de confirmação precisa saber QUAL transação
  // (para mostrar a descrição) e o handler de confirmação precisa do id.
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const fileInputRef = useRef(null);

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  const filteredTransactions = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    const search = filters.search.trim().toLowerCase();

    return sorted.filter((transaction) => {
      if (typeFilter !== 'all' && transaction.type !== typeFilter) return false;
      if (filters.categoryId !== 'all' && transaction.categoryId !== filters.categoryId) {
        return false;
      }
      if (search && !transaction.description.toLowerCase().includes(search)) return false;
      if (filters.dateFrom && transaction.date < filters.dateFrom) return false;
      if (filters.dateTo && transaction.date > filters.dateTo) return false;
      return true;
    });
  }, [transactions, typeFilter, filters]);

  function getCategoryName(categoryId) {
    return categories.find((category) => category.id === categoryId)?.name;
  }

  function handleConfirmDelete() {
    deleteTransaction(transactionToDelete.id);
    showToast('Transação excluída.');
    setTransactionToDelete(null);
  }

  async function handleImportFile(event) {
    const file = event.target.files[0];
    event.target.value = ''; // permite re-selecionar o mesmo arquivo depois
    if (!file) return;

    try {
      const data = await parseImportFile(file);
      const result = importData(data);
      showToast(
        `Importado: ${result.transactionsCount} transação(ões) e ${result.categoriesCount} categoria(s).`
      );
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  return (
    <div className="transactions-page">
      <header className="transactions-page__header">
        <h2>Transações</h2>
        <div className="transactions-page__header-actions">
          <button type="button" className="btn btn--ghost" onClick={() => exportToJSON(categories, transactions)}>
            ⬇️ Exportar JSON
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => exportToCSV(transactions, categories)}>
            ⬇️ Exportar CSV
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => fileInputRef.current?.click()}>
            ⬆️ Importar
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            hidden
            onChange={handleImportFile}
          />
          <Link to="/transacoes/nova" className="btn btn--primary">
            + Nova transação
          </Link>
        </div>
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

      <div className="transactions-page__advanced-filters">
        <input
          type="text"
          placeholder="🔍 Buscar por descrição..."
          value={filters.search}
          onChange={(event) => updateFilter('search', event.target.value)}
          className="transactions-page__search"
        />

        <select value={filters.categoryId} onChange={(event) => updateFilter('categoryId', event.target.value)}>
          <option value="all">Todas as categorias</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <label className="transactions-page__date-field">
          De
          <input type="date" value={filters.dateFrom} onChange={(event) => updateFilter('dateFrom', event.target.value)} />
        </label>

        <label className="transactions-page__date-field">
          Até
          <input type="date" value={filters.dateTo} onChange={(event) => updateFilter('dateTo', event.target.value)} />
        </label>

        {(filters.search || filters.categoryId !== 'all' || filters.dateFrom || filters.dateTo) && (
          <button type="button" className="btn btn--ghost" onClick={() => setFilters(EMPTY_FILTERS)}>
            Limpar filtros
          </button>
        )}
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
