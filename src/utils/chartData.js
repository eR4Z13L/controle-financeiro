/**
 * Transformações puras de dados para os gráficos do Dashboard.
 * Separado dos componentes de gráfico por dois motivos: dá para testar sem
 * precisar renderizar SVG, e os componentes ficam só com a parte visual.
 */

/** Agrupa despesas por categoria, somando os valores — vira as fatias da pizza. */
export function buildExpensesByCategory(transactions, categories) {
  const totals = new Map();

  for (const transaction of transactions) {
    if (transaction.type !== 'expense') continue;
    const key = transaction.categoryId ?? 'sem-categoria';
    totals.set(key, (totals.get(key) ?? 0) + transaction.amount);
  }

  return Array.from(totals.entries())
    .map(([categoryId, value]) => ({
      name: categories.find((category) => category.id === categoryId)?.name ?? 'Sem categoria',
      value,
    }))
    .sort((a, b) => b.value - a.value);
}

const MONTH_LABELS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

/**
 * Agrupa receitas e despesas por mês para os últimos `monthCount` meses
 * (incluindo o atual), preenchendo com zero os meses sem nenhuma
 * transação — assim a linha do gráfico não "pula" meses vazios.
 */
export function buildMonthlyEvolution(transactions, monthCount = 6, today = new Date()) {
  const months = [];
  for (let i = monthCount - 1; i >= 0; i -= 1) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({
      yearMonth: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      label: `${MONTH_LABELS[date.getMonth()]}/${String(date.getFullYear()).slice(2)}`,
      receitas: 0,
      despesas: 0,
    });
  }

  const byYearMonth = new Map(months.map((month) => [month.yearMonth, month]));

  for (const transaction of transactions) {
    const yearMonth = transaction.date.slice(0, 7);
    const bucket = byYearMonth.get(yearMonth);
    if (!bucket) continue; // fora da janela de meses exibida
    if (transaction.type === 'income') bucket.receitas += transaction.amount;
    else bucket.despesas += transaction.amount;
  }

  return months;
}
