import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/admin/auditlogs');
        setLogs(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="admin-container">
      <style>{`
        .admin-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
        .sidebar { width: 280px; background: #ffffff; margin: 20px; border-radius: 24px; padding: 30px 20px; display: flex; flex-direction: column; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06); }
        .logo { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 40px; padding-left: 10px; letter-spacing: -0.5px; }
        .nav-link { padding: 14px 20px; color: #64748b; font-weight: 600; border-radius: 16px; transition: all 0.3s ease; margin-bottom: 8px; cursor: pointer; display: flex; align-items: center;}
        .nav-link:hover { background: #f8fafc; color: #0f172a; transform: translateX(6px); }
        .nav-link.active { background: #4f46e5; color: #ffffff; box-shadow: 0 8px 20px rgba(79, 70, 229, 0.25); }
        .main { flex: 1; padding: 20px 40px 40px 20px; display: flex; flex-direction: column; overflow-y: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 30px 0; }
        .header h2 { font-size: 30px; color: #0f172a; font-weight: 800; letter-spacing: -1px; }
        .table-card { background: #ffffff; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); overflow: hidden; padding: 20px; }
        .data-table { width: 100%; border-collapse: collapse; text-align: left; }
        .data-table th { padding: 16px 20px; font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; }
        .data-table td { padding: 16px 20px; font-size: 14px; color: #0f172a; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .badge { padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; background: #e0e7ff; color: #3730a3; }
        .state-container { display: flex; justify-content: center; align-items: center; padding: 40px; color: #64748b; font-weight: 600; }
        .error-container { color: #ef4444; }
      `}</style>
      
      <AdminSidebar />

      <main className="main">
        <header className="header">
          <div>
            <h2>System Audit Logs</h2>
          </div>
        </header>

        {loading ? (
          <div className="state-container">Loading Audit Logs...</div>
        ) : error ? (
          <div className="state-container error-container">Error: {error}</div>
        ) : logs.length === 0 ? (
          <div className="state-container">No audit logs found.</div>
        ) : (
          <section className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Actor Type</th>
                  <th>Action Details</th>
                  <th>Action Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.LogID}>
                    <td><span className="badge">{log.ActorType}</span></td>
                    <td style={{ fontWeight: '500' }}>{log.ActionDetails}</td>
                    <td>{new Date(log.ActionTime).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  );
};

export default AuditLogs;