/**
 * Exportação/Importação de dados.
 * Fica em `utils` (fora do Context) porque é manipulação de arquivo — não
 * é regra de negócio, é I/O. O FinanceContext só recebe os dados já
 * validados/parseados através de `importData`.
 */

function downloadBlob(content, mimeType, filename) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  // Um link temporário é o jeito padrão de disparar um download a partir
  // de dados gerados em memória (sem precisar de um servidor por trás).
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}

/** Exporta tudo (categorias + transações) num JSON que pode ser reimportado depois. */
export function exportToJSON(categories, transactions) {
  const payload = {
    exportedAt: new Date().toISOString(),
    categories,
    transactions,
  };
  downloadBlob(JSON.stringify(payload, null, 2), 'application/json', `financeiro-backup-${dateStamp()}.json`);
}

function escapeCsvField(value) {
  const str = String(value ?? '');
  // Campos com vírgula, aspas ou quebra de linha precisam ser "escapados"
  // entre aspas duplas, senão quebram o parser de CSV do Excel/Sheets.
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/** Exporta as transações em CSV — pensado para abrir direto no Excel/Sheets. */
export function exportToCSV(transactions, categories) {
  const header = ['Data', 'Descrição', 'Tipo', 'Categoria', 'Valor'];

  const rows = transactions.map((transaction) => [
    transaction.date,
    transaction.description,
    transaction.type === 'income' ? 'Receita' : 'Despesa',
    categories.find((category) => category.id === transaction.categoryId)?.name ?? '',
    transaction.amount,
  ]);

  const csvContent = [header, ...rows]
    .map((row) => row.map(escapeCsvField).join(','))
    .join('\n');

  // Prefixo BOM (byte-order mark) no início evita que o Excel exiba
  // acentos quebrados ao abrir o arquivo.
  const BOM = String.fromCharCode(0xfeff);
  downloadBlob(BOM + csvContent, 'text/csv;charset=utf-8', `transacoes-${dateStamp()}.csv`);
}

/** Lê um arquivo JSON exportado anteriormente e devolve seu conteúdo já parseado. */
export function parseImportFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result));
      } catch {
        reject(new Error('Arquivo inválido. Selecione um JSON exportado por este app.'));
      }
    };
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
    reader.readAsText(file);
  });
}
