# Meu Financeiro

Aplicação de controle de gastos pessoais, construída em **React** como projeto-base
de estudo. A ideia é servir de ponto de partida para projetos adjacentes,
seguindo boas práticas de arquitetura desde o início.

## Funcionalidades

- **Dashboard**: resumo de receitas, despesas, saldo e últimas movimentações.
- **Transações**: listagem com filtro por tipo, criação, edição e exclusão
  (CRUD completo), com confirmação antes de excluir.
- **Categorias**: CRUD completo de categorias de receita/despesa, usadas para
  classificar as transações.
- Dados persistidos no `localStorage` do navegador (sem backend).
- Animações de transição (fade/slide) em navegação, listas e modais.

## Stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/) para navegação entre telas
- Context API + `useReducer` para o estado global (sem libs externas de estado)
- CSS puro com variáveis (design tokens) — sem framework de UI

## Arquitetura

```
src/
  components/    Componentes de UI reutilizáveis (Layout, formulário, cards...)
  pages/         Uma pasta por tela (Dashboard, Transactions, Categories...)
  context/       Estado global da aplicação (FinanceContext)
  hooks/         Hooks reutilizáveis (ex: useLocalStorage)
  utils/         Funções puras (formatação de moeda/data, geração de id)
```

Principais decisões, comentadas diretamente no código onde fazem diferença:

- `context/FinanceContext.jsx`: por que Context + reducer em vez de estado
  local em cada tela.
- `hooks/useLocalStorage.js`: por que persistência fica separada da regra
  de negócio.
- `components/TransactionForm`: por que o mesmo formulário atende criação
  e edição.

## Rodando o projeto

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Próximos passos sugeridos (para estudo)

- Trocar `localStorage` por uma API real (Node/Express, Firebase, etc.).
- Adicionar autenticação de usuário.
- Gráficos de gastos por categoria/mês.
- Testes automatizados (Vitest + Testing Library).
