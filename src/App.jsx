import { Route, Routes } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import { ThemeProvider } from './context/ThemeProvider';
import { ToastProvider } from './context/ToastProvider';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Transactions from './pages/Transactions/Transactions';
import TransactionNew from './pages/TransactionNew/TransactionNew';
import TransactionEdit from './pages/TransactionEdit/TransactionEdit';
import Recurring from './pages/Recurring/Recurring';
import Categories from './pages/Categories/Categories';
import NotFound from './pages/NotFound/NotFound';

/**
 * Ponto único de definição de rotas e dos providers globais.
 *
 * Ordem dos providers: `ThemeProvider` e `ToastProvider` ficam por fora
 * porque são preocupações de UI que não dependem de dados financeiros;
 * `FinanceProvider` fica por dentro porque é ele quem carrega/persiste os
 * dados que as telas realmente precisam.
 * `Layout` (com a navegação lateral) envolve as rotas "internas" via
 * rota-pai com <Outlet />, então não precisa ser repetido em cada página.
 */
export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <FinanceProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="transacoes" element={<Transactions />} />
              <Route path="transacoes/nova" element={<TransactionNew />} />
              <Route path="transacoes/:id/editar" element={<TransactionEdit />} />
              <Route path="recorrentes" element={<Recurring />} />
              <Route path="categorias" element={<Categories />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </FinanceProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
