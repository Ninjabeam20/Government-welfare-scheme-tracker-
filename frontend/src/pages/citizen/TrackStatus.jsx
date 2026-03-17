import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TrackStatus = () => {
  const navigate = useNavigate();
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hardcoded citizenId 1 for development
    axios.get('http://localhost:5000/api/citizen/applications/status/1')
      .then(res => {
        setMyApplications(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status) => {
    if (status === 'Approved') return '#10b981';
    if (status.includes('Review')) return '#f59e0b';
    if (status.includes('eKYC') || status === 'Rejected') return '#ef4444';
    return '#64748b';
  };

  if (loading) return <div style={{padding: '40px'}}>Retrieving your applications...</div>;

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
        .sidebar { width: 280px; background: #ffffff; margin: 20px; border-radius: 24px; padding: 30px 20px; display: flex; flex-direction: column; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06); }
        .logo { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 40px; padding-left: 10px; letter-spacing: -0.5px; }
        .nav-link { padding: 14px 20px; color: #64748b; font-weight: 600; border-radius: 16px; transition: all 0.3s ease; margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; gap: 12px; }
        .nav-link:hover { background: #f8fafc; color: #0f172a; transform: translateX(6px); }
        .nav-link.active { background: #2563eb; color: #ffffff; box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25); }
        .main { flex: 1; padding: 20px 40px 40px 20px; display: flex; flex-direction: column; overflow-y: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 40px 0; }
        .header h2 { font-size: 30px; color: #0f172a; font-weight: 800; letter-spacing: -1px; }
        .status-card { background: #ffffff; padding: 24px 30px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        .status-badge { padding: 8px 16px; border-radius: 12px; font-size: 14px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .btn-action { margin-left: 20px; padding: 10px 20px; border: none; background: #f1f5f9; color: #0f172a; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; }
      `}</style>

      <aside className="sidebar">
        <div className="logo">WelfarePortal.</div>
        <nav>
          <div className="nav-link" onClick={() => navigate('/')}><span>🏠</span> Dashboard</div>
          <div className="nav-link" onClick={() => navigate('/citizen/schemes')}><span>📄</span> Apply for Schemes</div>
          <div className="nav-link active"><span>📊</span> Track Status</div>
          <div className="nav-link" onClick={() => navigate('/citizen/documents')}><span>📁</span> My Documents</div>
        </nav>
      </aside>

      <main className="main">
        <header className="header">
          <h2>Application Tracker</h2>
        </header>

        <section>
          {myApplications.length > 0 ? myApplications.map((app) => (
            <div className="status-card" key={app.id}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>APP ID: #{app.id}</div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{app.scheme_name}</h3>
                <div style={{ fontSize: '14px', color: '#94a3b8' }}>Applied: {new Date(app.applied_on).toLocaleDateString()}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="status-badge" style={{ backgroundColor: `${getStatusColor(app.status)}15`, color: getStatusColor(app.status) }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getStatusColor(app.status) }}></span>
                  {app.status}
                </div>
                <button className="btn-action" onClick={() => navigate(`/citizen/track/${app.id}`)}>View Details</button>
              </div>
            </div>
          )) : <p>No applications found.</p>}
        </section>
      </main>
    </div>
  );
};

export default TrackStatus;