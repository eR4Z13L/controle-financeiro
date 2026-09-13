import { createContext } from 'react';

// Isolado num arquivo próprio (sem JSX), pelo mesmo motivo do FinanceContext:
// o Provider e o hook de consumo (`hooks/useToast.js`) importam o mesmo
// objeto, sem que um dependa do outro — e o Fast Refresh do Vite fica feliz
// porque cada arquivo .jsx só exporta componentes.
export const ToastContext = createContext(null);
