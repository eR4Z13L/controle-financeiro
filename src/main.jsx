import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter fica no ponto mais alto da árvore para que qualquer
        componente abaixo possa usar hooks de navegação (useNavigate,
        useParams, Link, etc.) */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
