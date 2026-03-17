import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CitizenSidebar from './CitizenSidebar';

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalSchemes: 0, totalApplications: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [schemesRes, appsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/citizen/schemes'),
          axios.get('http://localhost:5000/api/citizen/applications/1')
        ]);
        setStats({
          totalSchemes: schemesRes.data.length,
          totalApplications: appsRes.data.length
        });
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = async () => {
    await axios.get('http://localhost:5000/auth/logout', { withCredentials: true });
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
        .main { flex: 1; padding: 20px 40px 40px 20px; display: flex; flex-direction: column; overflow-y: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 40px 0; }
        .header h2 { font-size: 30px; color: #0f172a; font-weight: 800; letter-spacing: -1px; }
        .header-actions { display: flex; gap: 12px; align-items: center; }
        .profile-badge { background: #ffffff; padding: 12px 24px; border-radius: 99px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); font-weight: 600; color: #334155; }
        .btn-logout { background: #fee2e2; color: #dc2626; border: none; padding: 12px 24px; border-radius: 99px; font-weight: 700; cursor: pointer; font-size: 14px; }
        .btn-logout:hover { background: #fecaca; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .card { background: #ffffff; padding: 30px; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
        .card h3 { color: #64748b; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
        .card .value { font-size: 36px; color: #0f172a; font-weight: 800; margin-bottom: 8px; line-height: 1.2; }
        .card p { color: #94a3b8; font-size: 15px; font-weight: 500; }
        .btn-action { margin-top: 24px; padding: 16px; width: 100%; border: none; background: #2563eb; color: white; border-radius: 16px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
        .btn-action:hover { background: #1d4ed8; box-shadow: 0 8px 20px rgba(37,99,235,0.3); }
        .btn-secondary { background: #f1f5f9; color: #0f172a; }
        .btn-secondary:hover { background: #e2e8f0; box-shadow: 0 8px 20px rgba(0,0,0,0.05); }
      `}</style>

      <CitizenSidebar />

      <main className="main">
        <header className="header">
          <h2>Welcome, Beneficiary</h2>
          <div className="header-actions">
            <div className="profile-badge">👤 My Profile</div>
            <button className="btn-logout" onClick={handleLogout}>Sign Out</button>
          </div>
        </header>

        {loading ? (
          <div style={{ color: '#64748b', fontWeight: '600' }}>Loading...</div>
        ) : (
          <section className="grid">
            <div className="card">
              <h3>Available Schemes</h3>
              <div className="value">{stats.totalSchemes}</div>
              <p>Active schemes you can apply for</p>
              <button className="btn-action" onClick={() => navigate('/citizen/schemes')}>
                Browse Schemes
              </button>
            </div>
            <div className="card">
              <h3>My Applications</h3>
              <div className="value">{stats.totalApplications}</div>
              <p>Total applications submitted</p>
              <button className="btn-action btn-secondary" onClick={() => navigate('/citizen/track')}>
                Track Status
              </button>
            </div>
            <div className="card">
              <h3>My Documents</h3>
              <div className="value" style={{ fontSize: '28px' }}>Vault</div>
              <p>Manage your identity documents</p>
              <button className="btn-action" onClick={() => navigate('/citizen/documents')}>
                Upload Documents
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default CitizenDashboard;