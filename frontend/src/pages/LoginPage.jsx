import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({ detail: 'Login failed' }));
        throw new Error(detail.detail || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page page-auth">
      <section className="card auth-card surface">
        <div className="auth-head">
          <p className="eyebrow">Sales Intelligence</p>
          <h1>Masuk ke Dashboard</h1>
          <p className="muted">Gunakan akun default: admin / admin123</p>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <label className="form-field">
            <span>Username</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label className="form-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        {error ? <p className="error">{error}</p> : null}
      </section>
    </main>
  );
}
