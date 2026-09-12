import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-form">
      <h2>Página não encontrada</h2>
      <p>A rota que você tentou acessar não existe.</p>
      <Link to="/" className="btn btn--primary">
        Voltar ao Dashboard
      </Link>
    </div>
  );
}
