import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuditLogs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/audits')
      .then(res => { setLogs(res.data); setLoading(false); })
      .catch(err => console.error(err));
  }, []);

  if (loading) return <div style={{padding: '40px', fontFamily: 'sans-serif'}}>Fetching System Logs...</div>;

  return (
    <div className="admin-container">
      <style>{`
        .admin-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
        .sidebar { width: 280px; background: #ffffff; margin: 20px; border-radius: 24px; padding: 30px 20px; display: flex; flex-direction: column; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06); }
        .logo { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 40px; padding-left: 10px; letter-spacing: -0.5px; }
        .nav-link { padding: 14px 20px; color: #64748b; font-weight: 600; border-radius: 16px; transition: 0.3s; margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; gap: 12px; }
        .nav-link:hover { background: #f8fafc; color: #0f172a; transform: translateX(6px); }
        .nav-link.active { background: #4f46e5; color: #ffffff; }
        .main { flex: 1; padding: 20px 40px 40px 20px; display: flex; flex-direction: column; overflow-y: auto; }
        .header { padding: 20px 0 30px 0; }
        .table-card { background: #ffffff; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); padding: 20px; }
        .data-table { width: 100%; border-collapse: collapse; text-align: left; }
        .data-table th { padding: 16px 20px; font-size: 13px; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; }
        .data-table td { padding: 16px 20px; font-size: 14px; color: #0f172a; border-bottom: 1px solid #f1f5f9; }
      `}</style>

      <aside className="sidebar">
        <div className="logo">AdminPortal.</div>
        <nav>
          <div className="nav-link" onClick={() => navigate('/admin')}><span>✨</span> Dashboard Overview</div>
          <div className="nav-link" onClick={() => navigate('/admin/schemes')}><span>🗂️</span> Manage Schemes</div>
          <div className="nav-link" onClick={() => navigate('/admin/officers')}><span>👮‍♂️</span> Manage Officers</div>
          <div className="nav-link active" onClick={() => navigate('/admin/audits')}><span>🛡️</span> System Audit Logs</div>
        </nav>
      </aside>

      <main className="main">
        <header className="header">
          <h2>System Audit Trail</h2>
          <p style={{ color: '#64748b', marginTop: '5px' }}>Tracking administrative and officer actions.</p>
        </header>

        <section className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Actor</th>
                <th>Action Details</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id}>
                  <td style={{fontWeight: '700'}}>{l.actor}</td>
                  <td>{l.action}</td>
                  <td>
                    <span style={{ fontWeight: '600' }}>{l.date}</span>
                    <span style={{ color: '#94a3b8', marginLeft: '10px' }}>{l.time}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default AuditLogs;