import { generateId } from './format';

/**
 * Regras de geração de transações recorrentes.
 * Fica separado do FinanceContext porque é lógica pura (sem estado React,
 * sem side effects) — dá para testar isolado só chamando a função com
 * arrays de entrada e conferindo a saída.
 */

/** Último dia válido de um mês (ex: fevereiro pode não ter dia 30/31). */
function lastDayOfMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function toYearMonth(year, monthIndex) {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
}

/**
 * A partir de uma data inicial até hoje, gera a lista de transações que
 * ainda não existem para cada modelo recorrente ativo.
 *
 * Cada ocorrência já criada é identificada por `recurringId` + o mês da
 * data (`YYYY-MM`), então rodar esta função várias vezes é seguro — ela só
 * cria o que ainda está faltando (idempotente).
 */
export function getMissingOccurrences(templates, transactions, today = new Date()) {
  const missing = [];

  for (const template of templates) {
    const start = new Date(`${template.startDate}T12:00:00`);
    let cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    const limit = new Date(today.getFullYear(), today.getMonth(), 1);

    while (cursor <= limit) {
      const year = cursor.getFullYear();
      const monthIndex = cursor.getMonth();
      const yearMonth = toYearMonth(year, monthIndex);

      const alreadyExists = transactions.some(
        (transaction) =>
          transaction.recurringId === template.id && transaction.date.startsWith(yearMonth)
      );

      if (!alreadyExists) {
        const day = Math.min(template.dayOfMonth, lastDayOfMonth(year, monthIndex));
        missing.push({
          id: generateId(),
          recurringId: template.id,
          description: template.description,
          amount: template.amount,
          type: template.type,
          categoryId: template.categoryId,
          date: `${yearMonth}-${String(day).padStart(2, '0')}`,
        });
      }

      cursor = new Date(year, monthIndex + 1, 1);
    }
  }

  return missing;
}
