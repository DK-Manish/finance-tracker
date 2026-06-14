import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import SpendingChart from '../components/SpendingChart';


function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ amount: '', type: 'income', category: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions/');
      setTransactions(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/transactions/', { ...form, amount: parseFloat(form.amount) });
      setForm({ amount: '', type: 'income', category: '', description: '' });
      fetchTransactions();
    } catch (err) {
      setError('Failed to add transaction');
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/transactions/${id}`);
    fetchTransactions();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <span style={styles.navBrand}>💰 FinanceTracker</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </nav>

      <div style={styles.content}>
        {/* Summary Cards */}
        <div style={styles.cards}>
          <div style={{ ...styles.card, borderTop: '4px solid #4f46e5' }}>
            <p style={styles.cardLabel}>Balance</p>
            <p style={{ ...styles.cardAmount, color: balance >= 0 ? '#4f46e5' : '#ef4444' }}>
              £{balance.toFixed(2)}
            </p>
          </div>
          <div style={{ ...styles.card, borderTop: '4px solid #10b981' }}>
            <p style={styles.cardLabel}>Total Income</p>
            <p style={{ ...styles.cardAmount, color: '#10b981' }}>£{totalIncome.toFixed(2)}</p>
          </div>
          <div style={{ ...styles.card, borderTop: '4px solid #ef4444' }}>
            <p style={styles.cardLabel}>Total Expenses</p>
            <p style={{ ...styles.cardAmount, color: '#ef4444' }}>£{totalExpenses.toFixed(2)}</p>
          </div>
        </div>

<SpendingChart transactions={transactions} />


        <div style={styles.main}>
          {/* Add Transaction Form */}
          <div style={styles.formCard}>
            <h2 style={styles.sectionTitle}>Add Transaction</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                style={styles.input}
                placeholder="Amount"
                type="number"
                step="0.01"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                required
              />
              <select
                style={styles.input}
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <input
                style={styles.input}
                placeholder="Category (e.g. Salary, Food)"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                required
              />
              <input
                style={styles.input}
                placeholder="Description (optional)"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
              <button style={styles.button} type="submit">+ Add Transaction</button>
            </form>
          </div>

          {/* Transaction List */}
          <div style={styles.listCard}>
            <h2 style={styles.sectionTitle}>Transactions</h2>
            {loading ? (
              <p style={{ color: '#64748b' }}>Loading...</p>
            ) : transactions.length === 0 ? (
              <p style={{ color: '#64748b' }}>No transactions yet. Add one!</p>
            ) : (
              transactions.map(t => (
                <div key={t.id} style={styles.transaction}>
                  <div style={styles.txLeft}>
                    <span style={styles.txCategory}>{t.category}</span>
                    <span style={styles.txDesc}>{t.description}</span>
                  </div>
                  <div style={styles.txRight}>
                    <span style={{ ...styles.txAmount, color: t.type === 'income' ? '#10b981' : '#ef4444' }}>
                      {t.type === 'income' ? '+' : '-'}£{t.amount.toFixed(2)}
                    </span>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(t.id)}>✕</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif" },
  nav: { backgroundColor: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  navBrand: { fontSize: '20px', fontWeight: '700', color: '#4f46e5' },
  logoutBtn: { padding: '8px 16px', backgroundColor: 'transparent', border: '1.5px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#64748b', fontWeight: '500' },
  content: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' },
  card: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardLabel: { fontSize: '14px', color: '#64748b', margin: '0 0 8px 0' },
  cardAmount: { fontSize: '28px', fontWeight: '700', margin: 0 },
  main: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' },
  formCard: { backgroundColor: 'white', padding: '28px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: 'fit-content' },
  listCard: { backgroundColor: 'white', padding: '28px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  sectionTitle: { fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0 0 20px 0' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', color: '#1e293b' },
  button: { padding: '12px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  error: { color: '#ef4444', fontSize: '14px', marginBottom: '12px' },
  transaction: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f1f5f9' },
  txLeft: { display: 'flex', flexDirection: 'column', gap: '4px' },
  txCategory: { fontSize: '15px', fontWeight: '600', color: '#1e293b' },
  txDesc: { fontSize: '13px', color: '#94a3b8' },
  txRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  txAmount: { fontSize: '16px', fontWeight: '700' },
  deleteBtn: { background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '16px', padding: '4px' },
};

export default Dashboard;