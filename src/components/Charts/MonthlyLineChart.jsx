import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useCssVar } from '../../hooks/useCssVar';
import { formatCurrency } from '../../utils/format';
import './Charts.css';

export default function MonthlyLineChart({ data }) {
  const incomeColor = useCssVar('--color-income');
  const expenseColor = useCssVar('--color-expense');
  const borderColor = useCssVar('--color-border');
  const mutedColor = useCssVar('--color-text-muted');

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
        <XAxis dataKey="label" stroke={mutedColor} fontSize={12} />
        <YAxis stroke={mutedColor} fontSize={12} tickFormatter={(value) => formatCurrency(value)} width={90} />
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Legend />
        <Line type="monotone" dataKey="receitas" name="Receitas" stroke={incomeColor} strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="despesas" name="Despesas" stroke={expenseColor} strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
