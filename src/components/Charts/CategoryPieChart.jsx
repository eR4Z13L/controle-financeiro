import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/format';
import './Charts.css';

// Paleta fixa para as fatias: como categorias são criadas livremente pelo
// usuário, não dá pra ter uma cor "oficial" por categoria — em vez disso,
// ciclamos por uma paleta com cores bem distintas entre si.
const SLICE_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16', '#a855f7'];

export default function CategoryPieChart({ data }) {
  if (data.length === 0) {
    return <p className="chart-card__empty">Nenhuma despesa registrada ainda.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={SLICE_COLORS[index % SLICE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
}
