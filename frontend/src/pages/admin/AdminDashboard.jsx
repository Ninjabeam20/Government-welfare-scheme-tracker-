import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalSchemes: 0, activeSchemes: 0, totalOfficers: 0, activeOfficers: 0 });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [schemesRes, officersRes, logsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/schemes'),
          axios.get('http://localhost:5000/api/admin/officers'),
          axios.get('http://localhost:5000/api/admin/auditlogs')
        ]);
        
        const schemes = schemesRes.data || [];
        const officers = officersRes.data || [];
        const logs = logsRes.data || [];

        setStats({
          totalSchemes: schemes.length,
          activeSchemes: schemes.filter(s => s.isactive).length,
          totalOfficers: officers.length,
          activeOfficers: officers.filter(o => o.Status === 'Active').length
        });
        setRecentLogs(logs.slice(0, 5));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="admin-container">
      <style>{`
        .admin-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
        .sidebar { width: 280px; background: #ffffff; margin: 20px; border-radius: 24px; padding: 30px 20px; display: flex; flex-direction: column; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06); }
        .logo { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 40px; padding-left: 10px; letter-spacing: -0.5px; }
        .nav-link { padding: 14px 20px; color: #64748b; font-weight: 600; border-radius: 16px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; }
        .nav-link:hover { background: #f8fafc; color: #0f172a; transform: translateX(6px); }
        .nav-link.active { background: #4f46e5; color: #ffffff; box-shadow: 0 8px 20px rgba(79, 70, 229, 0.25); }
        .main { flex: 1; padding: 20px 40px 40px 20px; display: flex; flex-direction: column; overflow-y: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 40px 0; }
        .header h2 { font-size: 30px; color: #0f172a; font-weight: 800; letter-spacing: -1px; }
        .profile-badge { background: #ffffff; padding: 12px 24px; border-radius: 99px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); font-weight: 600; color: #334155; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; margin-bottom: 30px; }
        .card { background: #ffffff; padding: 30px; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
        .card h3 { color: #64748b; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
        .card .value { font-size: 42px; color: #0f172a; font-weight: 800; margin-bottom: 8px; line-height: 1; }
        .list-card { background: #ffffff; border-radius: 24px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
        .list-card h3 { color: #0f172a; font-size: 18px; font-weight: 700; margin-bottom: 20px; }
        .log-item { display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #f1f5f9; }
        .log-item:last-child { border-bottom: none; }
        .log-date { color: #94a3b8; font-size: 14px; }
        .log-detail { color: #334155; font-weight: 500; }
        .state-container { display: flex; justify-content: center; align-items: center; height: 100%; color: #64748b; font-weight: 600; }
        .error-container { color: #ef4444; margin-top: 20px; }
      `}</style>
      
      <AdminSidebar />
      
      <main className="main">
        <header className="header">
          <h2>System Operations</h2>
          <div className="profile-badge">Administrator</div>
        </header>

        {loading ? (
          <div className="state-container">Loading Dashboard Data...</div>
        ) : error ? (
          <div className="state-container error-container">Error: {error}</div>
        ) : (
          <>
            <section className="grid">
              <div className="card">
                <h3>Total Schemes</h3>
                <div className="value">{stats.totalSchemes}</div>
              </div>
              <div className="card">
                <h3>Active Schemes</h3>
                <div className="value">{stats.activeSchemes}</div>
              </div>
              <div className="card">
                <h3>Total Officers</h3>
                <div className="value">{stats.totalOfficers}</div>
              </div>
              <div className="card">
                <h3>Active Officers</h3>
                <div className="value">{stats.activeOfficers}</div>
              </div>
            </section>
            
            <section className="list-card">
              <h3>Recent Audit Activity</h3>
              {recentLogs.length === 0 ? (
                <div className="state-container" style={{ padding: '20px' }}>No recent activity found.</div>
              ) : (
                recentLogs.map(log => (
                  <div key={log.LogID} className="log-item">
                    <div className="log-detail">{log.ActionDetails}</div>
                    <div className="log-date">{new Date(log.ActionTime).toLocaleString()}</div>
                  </div>
                ))
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;