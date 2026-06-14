import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function SpendingChart({ transactions }) {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  // Group expenses by category
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const doughnutData = {
    labels: ['Income', 'Expenses'],
    datasets: [{
      data: [totalIncome, totalExpenses],
      backgroundColor: ['#10b981', '#ef4444'],
      borderWidth: 0,
    }],
  };

  const barData = {
    labels: Object.keys(expenseByCategory),
    datasets: [{
      label: 'Expenses by Category',
      data: Object.values(expenseByCategory),
      backgroundColor: '#4f46e5',
      borderRadius: 6,
    }],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  if (transactions.length === 0) return null;

  return (
    <div style={styles.container}>
      <div style={styles.chart}>
        <h3 style={styles.title}>Income vs Expenses</h3>
        <Doughnut data={doughnutData} />
      </div>
      {Object.keys(expenseByCategory).length > 0 && (
        <div style={styles.chart}>
          <h3 style={styles.title}>Expenses by Category</h3>
          <Bar data={barData} options={barOptions} />
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' },
  chart: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  title: { fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 20px 0' },
};

export default SpendingChart;