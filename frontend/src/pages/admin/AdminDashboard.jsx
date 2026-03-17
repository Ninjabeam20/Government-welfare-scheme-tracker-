import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalSchemes: 0, totalOfficers: 0, pendingApps: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/stats')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{padding: '40px', fontFamily: 'sans-serif'}}>Loading Operations Hub...</div>;

  return (
    <div className="admin-container">
      <style>{`
        .admin-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
        .sidebar { width: 280px; background: #ffffff; margin: 20px; border-radius: 24px; padding: 30px 20px; display: flex; flex-direction: column; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06); }
        .logo { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 40px; padding-left: 10px; letter-spacing: -0.5px; }
        .nav-link { padding: 14px 20px; color: #64748b; font-weight: 600; border-radius: 16px; transition: 0.3s; margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; gap: 12px; }
        .nav-link:hover { background: #f8fafc; color: #0f172a; transform: translateX(6px); }
        .nav-link.active { background: #4f46e5; color: #ffffff; box-shadow: 0 8px 20px rgba(79, 70, 229, 0.25); }
        .main { flex: 1; padding: 20px 40px 40px 20px; display: flex; flex-direction: column; overflow-y: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 40px 0; }
        .header h2 { font-size: 30px; color: #0f172a; font-weight: 800; letter-spacing: -1px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .card { background: #ffffff; padding: 30px; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); transition: 0.4s; }
        .card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
        .card h3 { color: #64748b; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
        .card .value { font-size: 42px; color: #0f172a; font-weight: 800; margin-bottom: 8px; line-height: 1; }
        .card p { color: #94a3b8; font-size: 15px; font-weight: 500;}
        .btn-primary { margin-top: 24px; padding: 16px; width: 100%; border: none; background: #0f172a; color: white; border-radius: 16px; font-size: 15px; font-weight: 600; cursor: pointer; transition: 0.3s; }
        .btn-primary:hover { background: #4f46e5; }
      `}</style>

      <aside className="sidebar">
        <div className="logo">AdminPortal.</div>
        <nav>
          <div className="nav-link active" onClick={() => navigate('/admin')}><span>✨</span> Dashboard Overview</div>
          <div className="nav-link" onClick={() => navigate('/admin/schemes')}><span>🗂️</span> Manage Schemes</div>
          <div className="nav-link" onClick={() => navigate('/admin/officers')}><span>👮‍♂️</span> Manage Officers</div>
          <div className="nav-link" onClick={() => navigate('/admin/audits')}><span>🛡️</span> System Audit Logs</div>
        </nav>
      </aside>

      <main className="main">
        <header className="header">
          <h2>System Operations</h2>
          <div style={{ background: '#ffffff', padding: '12px 24px', borderRadius: '99px', fontWeight: '600', color: '#334155', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            👨‍💻 Root Admin
          </div>
        </header>

        <section className="grid">
          <div className="card">
            <h3>Total Welfare Schemes</h3>
            <div className="value">{stats.totalSchemes}</div>
            <p>Active in Public Portal</p>
            <button className="btn-primary" onClick={() => navigate('/admin/schemes', { state: { openModal: true } })}>
              Create New Scheme
            </button>
          </div>

          <div className="card">
            <h3>Registered Officers</h3>
            <div className="value">{stats.totalOfficers}</div>
            <p>Verifying Applications</p>
            <button className="btn-primary" onClick={() => navigate('/admin/officers')}>Manage Officers</button>
          </div>

          <div className="card">
            <h3>Pending Actions</h3>
            <div className="value">{stats.pendingApps}</div>
            <p>Awaiting Verification</p>
            <button className="btn-primary" onClick={() => navigate('/admin/audits')}>View Audit Logs</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;