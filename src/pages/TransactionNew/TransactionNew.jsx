import { useNavigate } from 'react-router-dom';
import { useFinance } from '../../hooks/useFinance';
import { useToast } from '../../hooks/useToast';
import TransactionForm from '../../components/TransactionForm/TransactionForm';

/**
 * Tela 3: Nova transação ("C" de Create no CRUD).
 * A tela em si é bem enxuta porque toda a complexidade do formulário
 * (campos, validação) já está no <TransactionForm>. Essa página só
 * decide O QUE fazer quando o formulário é enviado.
 */
export default function TransactionNew() {
  const { addTransaction, addRecurringTemplate } = useFinance();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function handleSubmit({ recurring, ...data }) {
    if (recurring) {
      // Um modelo recorrente não é uma transação em si: o dia do mês e a
      // data de início vêm da data escolhida no formulário, e as
      // ocorrências (incluindo a de hoje) são geradas automaticamente pelo
      // FinanceProvider a partir daí.
      addRecurringTemplate({
        description: data.description,
        amount: data.amount,
        type: data.type,
        categoryId: data.categoryId,
        dayOfMonth: Number(data.date.slice(-2)),
        startDate: data.date,
      });
      showToast('Transação recorrente criada! Ela vai se repetir todo mês.');
    } else {
      addTransaction(data);
      showToast('Transação criada!');
    }

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
