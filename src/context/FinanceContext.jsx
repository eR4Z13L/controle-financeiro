import { useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils/format';
import { FinanceContext } from './context';

// Categorias padrão criadas na primeira vez que o app roda.
// O usuário pode editar/excluir/criar novas depois (é um CRUD independente).
const DEFAULT_CATEGORIES = [
  { id: generateId(), name: 'Salário', type: 'income' },
  { id: generateId(), name: 'Freelance', type: 'income' },
  { id: generateId(), name: 'Alimentação', type: 'expense' },
  { id: generateId(), name: 'Transporte', type: 'expense' },
  { id: generateId(), name: 'Moradia', type: 'expense' },
  { id: generateId(), name: 'Lazer', type: 'expense' },
];

/**
 * Por que Context + useReducer em vez de useState "solto" em cada tela?
 * - As transações e categorias precisam ser lidas/alteradas por várias telas
 *   (Dashboard, Transações, Formulário, Categorias). Sem um estado global,
 *   teríamos que "subir e descer" props por vários níveis (prop drilling).
 * - `useReducer` deixa explícito TODO comportamento possível sobre os dados
 *   (ADD, UPDATE, DELETE...) em um único lugar, como se fosse um pequeno
 *   "banco de dados" do app. Isso facilita entender e testar a lógica.
 */

function transactionsReducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return [action.payload, ...state];

    case 'UPDATE_TRANSACTION':
      return state.map((transaction) =>
        transaction.id === action.payload.id ? action.payload : transaction
      );

    case 'DELETE_TRANSACTION':
      return state.filter((transaction) => transaction.id !== action.payload.id);

    default:
      return state;
  }
}

function categoriesReducer(state, action) {
  switch (action.type) {
    case 'ADD_CATEGORY':
      return [...state, action.payload];

    case 'UPDATE_CATEGORY':
      return state.map((category) =>
        category.id === action.payload.id ? action.payload : category
      );

    case 'DELETE_CATEGORY':
      return state.filter((category) => category.id !== action.payload.id);

    default:
      return state;
  }
}

export function FinanceProvider({ children }) {
  // Guardamos o estado "cru" no localStorage e usamos o reducer por cima
  // dele para aplicar as regras de atualização de forma previsível.
  const [transactions, setTransactions] = useLocalStorage('finance:transactions', []);
  const [categories, setCategories] = useLocalStorage('finance:categories', DEFAULT_CATEGORIES);

  // `dispatch` para transações: aplica o reducer sobre o valor atual
  // e já persiste o resultado via setTransactions (que vem do useLocalStorage).
  const dispatchTransactions = (action) => {
    setTransactions((current) => transactionsReducer(current, action));
  };

  const dispatchCategories = (action) => {
    setCategories((current) => categoriesReducer(current, action));
  };

  // --- Ações de Transações (CRUD completo) ---
  const addTransaction = (data) => {
    dispatchTransactions({
      type: 'ADD_TRANSACTION',
      payload: { id: generateId(), ...data },
    });
  };

  const updateTransaction = (id, data) => {
    dispatchTransactions({
      type: 'UPDATE_TRANSACTION',
      payload: { id, ...data },
    });
  };

  const deleteTransaction = (id) => {
    dispatchTransactions({ type: 'DELETE_TRANSACTION', payload: { id } });
  };

  // --- Ações de Categorias (CRUD completo) ---
  const addCategory = (data) => {
    dispatchCategories({ type: 'ADD_CATEGORY', payload: { id: generateId(), ...data } });
  };

  const updateCategory = (id, data) => {
    dispatchCategories({ type: 'UPDATE_CATEGORY', payload: { id, ...data } });
  };

  const deleteCategory = (id) => {
    dispatchCategories({ type: 'DELETE_CATEGORY', payload: { id } });
    // Se a categoria for excluída, as transações que a usavam ficam órfãs.
    // Optamos por reclassificá-las como "Sem categoria" (null) em vez de
    // apagar as transações — perder um histórico financeiro seria pior
    // do que só perder a categorização dele.
    setTransactions((current) =>
      current.map((transaction) =>
        transaction.categoryId === id ? { ...transaction, categoryId: null } : transaction
      )
    );
  };

  // Valores derivados (totais) recalculados só quando `transactions` muda,
  // evitando recomputar em toda renderização sem necessidade.
  const summary = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expense, balance: income - expense };
  }, [transactions]);

  const value = {
    transactions,
    categories,
    summary,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}
