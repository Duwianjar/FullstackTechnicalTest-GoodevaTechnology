import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

function mapStatus(status) {
  return status === 'Laris' ? 'Laris' : 'Tidak Laris';
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const [salesRows, setSalesRows] = useState([]);
  const [salesError, setSalesError] = useState('');
  const [loadingSales, setLoadingSales] = useState(false);

  const [form, setForm] = useState({ jumlah_penjualan: '', harga: '', diskon: '' });
  const [predictResult, setPredictResult] = useState('');
  const [predictProbability, setPredictProbability] = useState(null);
  const [predictError, setPredictError] = useState('');
  const [predictLoading, setPredictLoading] = useState(false);

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }),
    [token]
  );

  function handleUnauthorized(statusCode) {
    if (statusCode === 401) {
      localStorage.removeItem('access_token');
      navigate('/login');
      return true;
    }
    return false;
  }

  async function handleLoadSales() {
    setLoadingSales(true);
    setSalesError('');
    try {
      const response = await fetch(`${API_BASE_URL}/sales`, { headers: authHeaders });
      if (handleUnauthorized(response.status)) return;
      if (!response.ok) throw new Error('Gagal memuat data sales');
      const data = await response.json();
      setSalesRows(data);
    } catch (err) {
      setSalesError(err.message);
    } finally {
      setLoadingSales(false);
    }
  }

  async function handlePredict(event) {
    event.preventDefault();
    setPredictLoading(true);
    setPredictError('');

    const payload = {
      jumlah_penjualan: Number(form.jumlah_penjualan),
      harga: Number(form.harga),
      diskon: Number(form.diskon)
    };

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(payload)
      });
      if (handleUnauthorized(response.status)) return;
      if (!response.ok) {
        const detail = await response.json().catch(() => ({ detail: 'Prediksi gagal' }));
        throw new Error(detail.detail || 'Prediksi gagal');
      }

      const data = await response.json();
      setPredictResult(mapStatus(data.status_prediksi));
      setPredictProbability(
        typeof data.probability === 'number' ? `${(data.probability * 100).toFixed(2)}%` : null
      );
    } catch (err) {
      setPredictError(err.message);
    } finally {
      setPredictLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('access_token');
    navigate('/login');
  }

  return (
    <main className="page page-dashboard">
      <section className="card dashboard-card surface">
        <header className="topbar">
          <div>
            <p className="eyebrow">Realtime Workspace</p>
            <h1>Sales Dashboard</h1>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </header>

        <div className="dashboard-grid">
          <div className="block panel">
            <div className="panel-head">
              <h2>Data Sales</h2>
              <button onClick={handleLoadSales} disabled={loadingSales} className="btn btn-primary">
                {loadingSales ? 'Loading...' : 'Load Sales'}
              </button>
            </div>
            {salesRows.length > 0 ? <p className="muted">Total data: {salesRows.length}</p> : null}
            {salesError ? <p className="error">{salesError}</p> : null}
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Jumlah Penjualan</th>
                    <th>Harga</th>
                    <th>Diskon</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {salesRows.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="muted center">
                        Belum ada data. Klik "Load Sales".
                      </td>
                    </tr>
                  ) : (
                    salesRows.slice(0, 50).map((row) => (
                      <tr key={row.product_id}>
                        <td>{row.product_name}</td>
                        <td>{row.jumlah_penjualan}</td>
                        <td>{row.harga}</td>
                        <td>{row.diskon}</td>
                        <td>{mapStatus(row.status)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {salesRows.length > 50 ? (
              <p className="muted">Menampilkan 50 dari {salesRows.length} data.</p>
            ) : null}
          </div>

          <div className="block panel">
            <h2>Prediksi Status Produk</h2>
            <form onSubmit={handlePredict} className="form-grid dashboard-form">
              <label className="form-field">
                <span>Jumlah Penjualan</span>
                <input
                  type="number"
                  value={form.jumlah_penjualan}
                  onChange={(e) => setForm((prev) => ({ ...prev, jumlah_penjualan: e.target.value }))}
                  required
                />
              </label>
              <label className="form-field">
                <span>Harga</span>
                <input
                  type="number"
                  value={form.harga}
                  onChange={(e) => setForm((prev) => ({ ...prev, harga: e.target.value }))}
                  required
                />
              </label>
              <label className="form-field">
                <span>Diskon</span>
                <input
                  type="number"
                  value={form.diskon}
                  onChange={(e) => setForm((prev) => ({ ...prev, diskon: e.target.value }))}
                  required
                />
              </label>
              <button type="submit" disabled={predictLoading} className="btn btn-primary">
                {predictLoading ? 'Predicting...' : 'Predict'}
              </button>
            </form>

            {predictError ? <p className="error">{predictError}</p> : null}
            {predictResult ? (
              <div className="result-box">
                <p className="result">
                  Hasil Prediksi: <strong>{predictResult}</strong>
                </p>
                {predictProbability ? <p className="muted">Confidence: {predictProbability}</p> : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
