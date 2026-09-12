import { NavLink, Outlet } from 'react-router-dom';
import './Layout.css';

// Itens do menu centralizados em um array: adicionar uma nova página no
// futuro é só adicionar um objeto aqui, em vez de mexer em vários <NavLink>.
const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/transacoes', label: 'Transações' },
  { to: '/categorias', label: 'Categorias' },
];

/**
 * Layout compartilhado por todas as telas (navegação lateral + conteúdo).
 * O <Outlet /> do React Router renderiza a página da rota atual aqui dentro,
 * então não precisamos repetir a navegação em cada página.
 */
export default function Layout() {
  return (
    <div className="layout">
      <aside className="layout__sidebar">
        <h1 className="layout__logo">💰 Meu Financeiro</h1>
        <nav className="layout__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `layout__nav-link${isActive ? ' layout__nav-link--active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="layout__content">
        <Outlet />
      </main>
    </div>
  );
}
