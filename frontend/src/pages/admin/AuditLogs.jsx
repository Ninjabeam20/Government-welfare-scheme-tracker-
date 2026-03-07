import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuditLogs = () => {
  const navigate = useNavigate();

  // Mock Data: System Audit Logs (Sorted latest first)
  const [logs] = useState([
    { id: 'LOG-8842', actor: 'Beneficiary Individual', action: 'Uploaded Income Certificate (eKYC)', date: '2026-02-27', time: '11:45 AM' },
    { id: 'LOG-8841', actor: 'Officer', action: 'Approved Application APP-2026-8821', date: '2026-02-27', time: '10:30 AM' },
    { id: 'LOG-8840', actor: 'Admin', action: 'Created Scheme: Youth Tech Grant', date: '2026-02-26', time: '04:15 PM' },
    { id: 'LOG-8839', actor: 'Beneficiary Organization', action: 'Submitted NGO Grant Application', date: '2026-02-26', time: '02:00 PM' },
    { id: 'LOG-8838', actor: 'Officer', action: 'Auto-Routed Application to DBT', date: '2026-02-25', time: '09:12 AM' }
  ]);

  const getActorBadge = (actor) => {
    if (actor === 'Admin') return 'badge-admin';
    if (actor === 'Officer') return 'badge-officer';
    if (actor.includes('Organization')) return 'badge-org';
    return 'badge-citizen';
  };

  return (
    <div className="admin-container">
      {/* FLUENT UI STYLES */}
      <style>{`
        .admin-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
        .sidebar { width: 280px; background: #ffffff; margin: 20px; border-radius: 24px; padding: 30px 20px; display: flex; flex-direction: column; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06); }
        .logo { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 40px; padding-left: 10px; letter-spacing: -0.5px; }
        .nav-link { padding: 14px 20px; color: #64748b; font-weight: 600; border-radius: 16px; transition: all 0.3s ease; margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; gap: 12px; }
        .nav-link:hover { background: #f8fafc; color: #0f172a; transform: translateX(6px); }
        .nav-link.active { background: #4f46e5; color: #ffffff; box-shadow: 0 8px 20px rgba(79, 70, 229, 0.25); }

        .main { flex: 1; padding: 20px 40px 40px 20px; display: flex; flex-direction: column; overflow-y: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 30px 0; }
        .header h2 { font-size: 30px; color: #0f172a; font-weight: 800; letter-spacing: -1px; }

        .table-card { background: #ffffff; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); overflow: hidden; padding: 20px; }
        .data-table { width: 100%; border-collapse: collapse; text-align: left; }
        .data-table th { padding: 16px 20px; font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #f1f5f9; }
        .data-table td { padding: 16px 20px; font-size: 14px; color: #0f172a; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .data-table tr:hover td { background: #f8fafc; }
        .data-table tr:last-child td { border-bottom: none; }
        
        .badge { padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; }
        .badge-admin { background: #f3e8ff; color: #9333ea; }
        .badge-officer { background: #ecfdf5; color: #10b981; }
        .badge-org { background: #fef3c7; color: #d97706; }
        .badge-citizen { background: #eff6ff; color: #2563eb; }
        
        .log-id { font-family: monospace; font-weight: 600; color: #64748b; }
        .log-date { font-size: 13px; color: #94a3b8; display: block; margin-top: 4px; }
      `}</style>

      <aside className="sidebar">
        <div className="logo">AdminPortal.</div>
        <nav>
          <div className="nav-link" onClick={() => navigate('/admin')}><span>✨</span> Dashboard Overview</div>
          <div className="nav-link" onClick={() => navigate('/admin/schemes')}><span>🗂️</span> Manage Schemes</div>
          <div className="nav-link" onClick={() => navigate('/admin/officers')}><span>👮‍♂️</span> Manage Officers</div>
          <div className="nav-link active" onClick={() => navigate('/admin/audits')}><span>🛡️</span> System Audit Logs</div>
          <div className="nav-link"><span>📊</span> Fiscal Predictability</div>
        </nav>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <h2>System Audit Logs</h2>
            <p style={{ color: '#64748b', fontWeight: '500', marginTop: '5px' }}>Read-only chronological record of all system activities.</p>
          </div>
        </header>

        <section className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Actor Type</th>
                <th>Action Taken</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="log-id">{log.id}</td>
                  <td><span className={`badge ${getActorBadge(log.actor)}`}>{log.actor}</span></td>
                  <td style={{ fontWeight: '500' }}>{log.action}</td>
                  <td>
                    <span style={{ fontWeight: '600' }}>{log.date}</span>
                    <span className="log-date">{log.time}</span>
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