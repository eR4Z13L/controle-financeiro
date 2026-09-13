import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFinance } from '../../hooks/useFinance';
import { useToast } from '../../hooks/useToast';
import TransactionForm from '../../components/TransactionForm/TransactionForm';

/**
 * Tela: Editar transação ("U" de Update no CRUD).
 * Reaproveita o mesmo <TransactionForm> da criação, passando os dados
 * atuais como `initialData` para pré-preencher os campos.
 */
export default function TransactionEdit() {
  const { id } = useParams();
  const { transactions, updateTransaction } = useFinance();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const transaction = transactions.find((item) => item.id === id);

  // Guarda contra acessar uma URL de edição com um id que não existe mais
  // (por exemplo, a transação foi excluída em outra aba).
  if (!transaction) {
    return (
      <div className="page-form">
        <p>Transação não encontrada.</p>
        <Link to="/transacoes" className="btn btn--ghost">
          Voltar para transações
        </Link>
      </div>
    );
  }

  function handleSubmit({ recurring: _recurring, ...data }) {
    updateTransaction(id, data);
    showToast('Transação atualizada!');
    navigate('/transacoes');
  }

  return (
    <div className="page-form">
      <h2>Editar transação</h2>
      <TransactionForm
        initialData={transaction}
        onSubmit={handleSubmit}
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
