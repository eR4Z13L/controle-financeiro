import { createContext } from 'react';

// Fica isolado num arquivo próprio (sem JSX) porque tanto o Provider
// (`FinanceContext.jsx`) quanto o hook de consumo (`hooks/useFinance.js`)
// precisam importar o mesmo objeto de contexto, e nenhum dos dois deveria
// depender do outro diretamente.
export const FinanceContext = createContext(null);
