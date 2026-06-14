import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', full_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await api.post('/auth/register', formData);
        setIsRegister(false);
        setError('✅ Account created! Please log in.');
      } else {
        const res = await api.post('/auth/login', formData);
        localStorage.setItem('token', res.data.access_token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.brand}>
          <span style={styles.brandIcon}>💰</span>
          <h1 style={styles.brandName}>FinanceTracker</h1>
        </div>
        <h2 style={styles.tagline}>Take control of your<br />financial future.</h2>
        <p style={styles.subTagline}>Track income, expenses, and savings — all in one place.</p>
        <div style={styles.features}>
          {['📊 Visual spending insights', '🔒 Secure JWT authentication', '⚡ Real-time updates'].map(f => (
            <div key={f} style={styles.feature}>{f}</div>
          ))}
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>{isRegister ? 'Create account' : 'Welcome back'}</h2>
          <p style={styles.cardSubtitle}>{isRegister ? 'Start tracking your finances today' : 'Sign in to your account'}</p>

          {error && (
            <div style={{
              ...styles.alert,
              backgroundColor: error.startsWith('✅') ? '#f0fdf4' : '#fef2f2',
              borderColor: error.startsWith('✅') ? '#86efac' : '#fca5a5',
              color: error.startsWith('✅') ? '#166534' : '#dc2626',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            {isRegister && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input style={styles.input} name="full_name" placeholder="John Doe" onChange={handleChange} />
              </div>
            )}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input style={styles.input} name="email" type="email" placeholder="you@example.com" onChange={handleChange} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
            </div>
            <button style={{ ...styles.button, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <p style={styles.toggle}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <span style={styles.link} onClick={() => { setIsRegister(!isRegister); setError(''); }}>
              {isRegister ? ' Sign in' : ' Create one'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  left: { flex: 1, background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'white' },
  brand: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' },
  brandIcon: { fontSize: '32px' },
  brandName: { fontSize: '24px', fontWeight: '700', margin: 0 },
  tagline: { fontSize: '42px', fontWeight: '800', lineHeight: '1.2', margin: '0 0 16px 0' },
  subTagline: { fontSize: '18px', opacity: 0.85, margin: '0 0 48px 0', lineHeight: '1.6' },
  features: { display: 'flex', flexDirection: 'column', gap: '16px' },
  feature: { fontSize: '16px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '8px' },
  right: { width: '480px', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' },
  card: { backgroundColor: 'white', padding: '48px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '100%' },
  cardTitle: { fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' },
  cardSubtitle: { fontSize: '15px', color: '#64748b', margin: '0 0 32px 0' },
  alert: { padding: '12px 16px', borderRadius: '8px', border: '1px solid', marginBottom: '20px', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: '500', color: '#374151' },
  input: { padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s', color: '#1e293b' },
  button: { padding: '14px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '4px' },
  toggle: { textAlign: 'center', marginTop: '24px', color: '#64748b', fontSize: '14px' },
  link: { color: '#4f46e5', cursor: 'pointer', fontWeight: '600' },
};

export default Login;