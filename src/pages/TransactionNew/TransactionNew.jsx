import { useNavigate } from 'react-router-dom';
import { useFinance } from '../../hooks/useFinance';
import TransactionForm from '../../components/TransactionForm/TransactionForm';

/**
 * Tela 3: Nova transação ("C" de Create no CRUD).
 * A tela em si é bem enxuta porque toda a complexidade do formulário
 * (campos, validação) já está no <TransactionForm>. Essa página só
 * decide O QUE fazer quando o formulário é enviado.
 */
export default function TransactionNew() {
  const { addTransaction } = useFinance();
  const navigate = useNavigate();

  function handleSubmit(data) {
    addTransaction(data);
    // Depois de criar, voltamos para a listagem para o usuário já ver
    // o resultado — melhor feedback do que ficar num formulário vazio.
    navigate('/transacoes');
  }

  return (
    <div className="page-form">
      <h2>Nova transação</h2>
      <TransactionForm onSubmit={handleSubmit} submitLabel="Adicionar transação" />
    </div>
  );
}
