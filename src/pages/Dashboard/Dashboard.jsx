import { Link } from 'react-router-dom';
import { useFinance } from '../../hooks/useFinance';
import SummaryCard from '../../components/SummaryCard/SummaryCard';
import TransactionItem from '../../components/TransactionItem/TransactionItem';
import './Dashboard.css';

/**
 * Tela 1: Dashboard.
 * Mostra uma visão geral (totais + últimas movimentações), sem CRUD direto
 * aqui — a exclusão nas últimas transações é só um atalho para a mesma
 * ação disponível na tela de Transações, reaproveitando o mesmo componente
 * de linha (<TransactionItem>) e a mesma lógica de exclusão do Context.
 */
export default function Dashboard() {
  const { transactions, categories, summary } = useFinance();

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  function getCategoryName(categoryId) {
    return categories.find((category) => category.id === categoryId)?.name;
  }

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h2>Dashboard</h2>
        <Link to="/transacoes/nova" className="btn btn--primary">
          + Nova transação
        </Link>
      </header>

      <section className="dashboard__summary">
        <SummaryCard title="Receitas" value={summary.income} tone="income" />
        <SummaryCard title="Despesas" value={summary.expense} tone="expense" />
        <SummaryCard title="Saldo" value={summary.balance} tone="balance" />
      </section>

      <section>
        <h3 className="dashboard__section-title">Últimas movimentações</h3>

        {recentTransactions.length === 0 ? (
          <p className="dashboard__empty">
            Nenhuma transação ainda. Que tal <Link to="/transacoes/nova">criar a primeira</Link>?
          </p>
        ) : (
          <ul className="dashboard__list">
            {recentTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                categoryName={getCategoryName(transaction.categoryId)}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
