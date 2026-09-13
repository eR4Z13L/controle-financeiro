import { useState } from 'react';
import { useFinance } from '../../hooks/useFinance';
import { useToast } from '../../hooks/useToast';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import './Categories.css';

const EMPTY_FORM = { name: '', type: 'expense' };

/**
 * Tela 4: Categorias.
 * Segundo CRUD completo do app (Create, Read, Update, Delete), agora
 * numa única tela com formulário inline — diferente das transações, o
 * cadastro de categoria é simples o bastante (só nome + tipo) para não
 * justificar uma tela de formulário separada.
 */
export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useFinance();
  const { showToast } = useToast();

  const [form, setForm] = useState(EMPTY_FORM);
  // `editingId` diferencia se o formulário está criando (null) ou
  // atualizando uma categoria existente (guarda o id dela).
  const [editingId, setEditingId] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.name.trim()) return;

    if (editingId) {
      updateCategory(editingId, { name: form.name.trim(), type: form.type });
      showToast('Categoria atualizada!');
    } else {
      addCategory({ name: form.name.trim(), type: form.type });
      showToast('Categoria criada!');
    }

    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function startEditing(category) {
    setEditingId(category.id);
    setForm({ name: category.name, type: category.type });
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function handleConfirmDelete() {
    deleteCategory(categoryToDelete.id);
    showToast('Categoria excluída.');
    setCategoryToDelete(null);
  }

  return (
    <div className="categories-page">
      <h2>Categorias</h2>

      <form className="categories-page__form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome da categoria"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
        />
        <select
          value={form.type}
          onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
        >
          <option value="expense">Despesa</option>
          <option value="income">Receita</option>
        </select>
        <button type="submit" className="btn btn--primary">
          {editingId ? 'Salvar' : 'Adicionar'}
        </button>
        {editingId && (
          <button type="button" className="btn btn--ghost" onClick={cancelEditing}>
            Cancelar
          </button>
        )}
      </form>

      <ul className="categories-page__list">
        {categories.map((category) => (
          <li key={category.id} className="categories-page__item">
            <span className={`categories-page__badge categories-page__badge--${category.type}`}>
              {category.type === 'income' ? 'Receita' : 'Despesa'}
            </span>
            <span className="categories-page__name">{category.name}</span>
            <div className="categories-page__actions">
              <button type="button" className="btn btn--icon" onClick={() => startEditing(category)}>
                ✏️
              </button>
              <button
                type="button"
                className="btn btn--icon"
                onClick={() => setCategoryToDelete(category)}
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        isOpen={Boolean(categoryToDelete)}
        title="Excluir categoria"
        description={`Excluir "${categoryToDelete?.name}"? As transações que usam essa categoria ficarão sem categoria, mas não serão apagadas.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCategoryToDelete(null)}
      />
    </div>
  );
}
