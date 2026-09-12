import { useState } from 'react';
import { useFinance } from '../../hooks/useFinance';
import './TransactionForm.css';

const TODAY = () => new Date().toISOString().slice(0, 10);

/**
 * Formulário de transação, compartilhado entre as telas de "Nova
 * transação" e "Editar transação".
 *
 * Por que um componente só para as duas telas em vez de duplicar o JSX?
 * O formulário (campos, validação, layout) é idêntico nos dois casos —
 * a única diferença é se já existe um valor inicial e o que fazer no
 * envio. Isolar isso em um componente controlado por props (`initialData`
 * e `onSubmit`) evita manter duas cópias do mesmo formulário sincronizadas.
 */
export default function TransactionForm({ initialData, onSubmit, submitLabel }) {
  const { categories } = useFinance();

  const [form, setForm] = useState(() => ({
    description: initialData?.description ?? '',
    amount: initialData?.amount != null ? String(initialData.amount) : '',
    type: initialData?.type ?? 'expense',
    categoryId: initialData?.categoryId ?? '',
    date: initialData?.date ?? TODAY(),
  }));

  const [errors, setErrors] = useState({});

  // Só mostramos categorias compatíveis com o tipo escolhido (receita
  // ou despesa), para evitar, por exemplo, marcar "Salário" numa despesa.
  const filteredCategories = categories.filter((category) => category.type === form.type);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validate() {
    const nextErrors = {};

    if (!form.description.trim()) {
      nextErrors.description = 'Informe uma descrição.';
    }

    const amountNumber = Number(form.amount);
    if (!form.amount || Number.isNaN(amountNumber) || amountNumber <= 0) {
      nextErrors.amount = 'Informe um valor maior que zero.';
    }

    if (!form.date) {
      nextErrors.date = 'Informe a data.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) return;

    onSubmit({
      description: form.description.trim(),
      amount: Number(form.amount),
      type: form.type,
      categoryId: form.categoryId || null,
      date: form.date,
    });
  }

  return (
    <form className="transaction-form" onSubmit={handleSubmit} noValidate>
      <div className="transaction-form__type-toggle">
        <button
          type="button"
          className={`transaction-form__type-btn${form.type === 'expense' ? ' transaction-form__type-btn--active-expense' : ''}`}
          onClick={() => updateField('type', 'expense')}
        >
          Despesa
        </button>
        <button
          type="button"
          className={`transaction-form__type-btn${form.type === 'income' ? ' transaction-form__type-btn--active-income' : ''}`}
          onClick={() => updateField('type', 'income')}
        >
          Receita
        </button>
      </div>

      <div className="field">
        <label htmlFor="description">Descrição</label>
        <input
          id="description"
          type="text"
          placeholder="Ex: Supermercado, Salário de setembro..."
          value={form.description}
          onChange={(event) => updateField('description', event.target.value)}
        />
        {errors.description && <span className="field__error">{errors.description}</span>}
      </div>

      <div className="transaction-form__row">
        <div className="field">
          <label htmlFor="amount">Valor (R$)</label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            value={form.amount}
            onChange={(event) => updateField('amount', event.target.value)}
          />
          {errors.amount && <span className="field__error">{errors.amount}</span>}
        </div>

        <div className="field">
          <label htmlFor="date">Data</label>
          <input
            id="date"
            type="date"
            value={form.date}
            onChange={(event) => updateField('date', event.target.value)}
          />
          {errors.date && <span className="field__error">{errors.date}</span>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="category">Categoria</label>
        <select
          id="category"
          value={form.categoryId}
          onChange={(event) => updateField('categoryId', event.target.value)}
        >
          <option value="">Sem categoria</option>
          {filteredCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn--primary transaction-form__submit">
        {submitLabel}
      </button>
    </form>
  );
}
