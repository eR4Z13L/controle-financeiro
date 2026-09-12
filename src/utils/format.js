// Funções utilitárias de formatação.
// Ficam isoladas aqui para que qualquer componente possa reaproveitá-las
// sem duplicar lógica (princípio DRY) e para facilitar testes futuros.

/**
 * Formata um número como moeda brasileira (R$).
 * Ex: formatCurrency(1234.5) -> "R$ 1.234,50"
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata uma data ISO (yyyy-mm-dd) para o formato brasileiro (dd/mm/aaaa).
 * Construímos a data com hora fixa em meio-dia para evitar o bug clássico
 * de fuso horário que "volta um dia" ao usar apenas `new Date(isoDate)`.
 */
export function formatDate(isoDate) {
  const date = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

/**
 * Gera um id único simples para cada registro.
 * `crypto.randomUUID` é nativo do navegador, então evitamos instalar
 * uma lib externa só para isso.
 */
export function generateId() {
  return crypto.randomUUID();
}
