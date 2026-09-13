import { useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils/format';
import { getMissingOccurrences } from '../utils/recurring';
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

    case 'ADD_MANY_TRANSACTIONS':
      return [...action.payload, ...state];

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

    case 'ADD_MANY_CATEGORIES':
      return [...state, ...action.payload];

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

function recurringReducer(state, action) {
  switch (action.type) {
    case 'ADD_RECURRING':
      return [...state, action.payload];

    case 'DELETE_RECURRING':
      return state.filter((template) => template.id !== action.payload.id);

    default:
      return state;
  }
}

export function FinanceProvider({ children }) {
  // Guardamos o estado "cru" no localStorage e usamos o reducer por cima
  // dele para aplicar as regras de atualização de forma previsível.
  const [transactions, setTransactions] = useLocalStorage('finance:transactions', []);
  const [categories, setCategories] = useLocalStorage('finance:categories', DEFAULT_CATEGORIES);
  const [recurringTemplates, setRecurringTemplates] = useLocalStorage(
    'finance:recurringTemplates',
    []
  );

  // `dispatch` para transações: aplica o reducer sobre o valor atual
  // e já persiste o resultado via setTransactions (que vem do useLocalStorage).
  const dispatchTransactions = (action) => {
    setTransactions((current) => transactionsReducer(current, action));
  };

  const dispatchCategories = (action) => {
    setCategories((current) => categoriesReducer(current, action));
  };

  const dispatchRecurring = (action) => {
    setRecurringTemplates((current) => recurringReducer(current, action));
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

  // --- Ações de Transações Recorrentes ---
  // Um "modelo" recorrente (ex: "Aluguel, todo dia 5") não é uma transação
  // em si — ele só descreve o padrão. As transações de verdade são geradas
  // a partir dele pelo efeito logo abaixo.
  const addRecurringTemplate = (data) => {
    dispatchRecurring({ type: 'ADD_RECURRING', payload: { id: generateId(), ...data } });
  };

  const deleteRecurringTemplate = (id) => {
    dispatchRecurring({ type: 'DELETE_RECURRING', payload: { id } });
    // Assim como nas categorias, excluir o modelo só impede NOVAS
    // ocorrências futuras — as transações já geradas continuam no
    // histórico normalmente.
  };

  // Sempre que a lista de modelos recorrentes muda (app abriu, ou um novo
  // modelo foi criado), verificamos se algum mês entre o início do modelo
  // e hoje ainda não tem uma ocorrência gerada, e criamos as que faltarem.
  // Não depende de `transactions` no array de dependências de propósito:
  // a função já é idempotente (não duplica), então rodar só quando os
  // modelos mudam é suficiente e evita loops de re-render.
  useEffect(() => {
    if (recurringTemplates.length === 0) return;

    setTransactions((current) => {
      const missing = getMissingOccurrences(recurringTemplates, current);
      return missing.length > 0 ? [...missing, ...current] : current;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recurringTemplates]);

  // --- Importação de dados (exportados anteriormente em JSON) ---
  // Os ids são regenerados para não colidir com o que já existe no
  // navegador — importar nunca sobrescreve nada, só adiciona.
  const importData = ({ categories: importedCategories = [], transactions: importedTransactions = [] }) => {
    const categoryIdMap = new Map();
    const newCategories = importedCategories.map((category) => {
      const newId = generateId();
      categoryIdMap.set(category.id, newId);
      return { ...category, id: newId };
    });

    const newTransactions = importedTransactions.map((transaction) => ({
      ...transaction,
      id: generateId(),
      categoryId: categoryIdMap.get(transaction.categoryId) ?? transaction.categoryId ?? null,
    }));

    if (newCategories.length > 0) {
      dispatchCategories({ type: 'ADD_MANY_CATEGORIES', payload: newCategories });
    }
    if (newTransactions.length > 0) {
      dispatchTransactions({ type: 'ADD_MANY_TRANSACTIONS', payload: newTransactions });
    }

    return { categoriesCount: newCategories.length, transactionsCount: newTransactions.length };
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
    recurringTemplates,
    summary,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    addRecurringTemplate,
    deleteRecurringTemplate,
    importData,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}
