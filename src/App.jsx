import { Route, Routes } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Transactions from './pages/Transactions/Transactions';
import TransactionNew from './pages/TransactionNew/TransactionNew';
import TransactionEdit from './pages/TransactionEdit/TransactionEdit';
import Categories from './pages/Categories/Categories';
import NotFound from './pages/NotFound/NotFound';

/**
 * Ponto único de definição de rotas.
 * `FinanceProvider` envolve TODAS as rotas porque qualquer tela pode
 * precisar ler ou alterar transações/categorias.
 * `Layout` (com a navegação lateral) envolve as rotas "internas" via
 * rota-pai com <Outlet />, então não precisa ser repetido em cada página.
 */
export default function App() {
  return (
    <FinanceProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="transacoes" element={<Transactions />} />
          <Route path="transacoes/nova" element={<TransactionNew />} />
          <Route path="transacoes/:id/editar" element={<TransactionEdit />} />
          <Route path="categorias" element={<Categories />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </FinanceProvider>
  );
}
