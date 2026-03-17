import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CitizenSidebar from './CitizenSidebar';

const TrackStatus = () => {
  const navigate = useNavigate();
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/citizen/applications/1');
        const mappedApps = response.data.map(app => {
          const dateObj = new Date(app.Applied_on);
          return {
            id: `APP-2026-${app.RecordID}`,
            rawId: app.RecordID,
            scheme: app.SchemeName,
            date: dateObj.toLocaleDateString(),
            status: app.Status,
            statusColor: app.Status === 'Approved' ? '#10b981' : 
                         app.Status === 'Rejected' ? '#ef4444' : '#f59e0b'
          };
        });
        setMyApplications(mappedApps);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
        .main { flex: 1; padding: 20px 40px 40px 20px; display: flex; flex-direction: column; overflow-y: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 40px 0; }
        .header h2 { font-size: 30px; color: #0f172a; font-weight: 800; letter-spacing: -1px; }
        .status-card { background: #ffffff; padding: 24px 30px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; transition: all 0.3s ease; }
        .status-card:hover { transform: translateX(8px); box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
        .app-id { font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 6px; letter-spacing: 0.5px; }
        .app-name { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
        .app-date { font-size: 14px; color: #94a3b8; font-weight: 500; }
        .status-badge { padding: 8px 16px; border-radius: 12px; font-size: 14px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .btn-action { margin-left: 20px; padding: 10px 20px; border: none; background: #f1f5f9; color: #0f172a; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
        .btn-action:hover { background: #e2e8f0; }
        .state-text { color: #64748b; font-size: 16px; margin-top: 20px; }
      `}</style>

      <CitizenSidebar />

      <main className="main">
        <header className="header">
          <div>
            <h2>Application Tracker</h2>
            <p style={{ color: '#64748b', fontWeight: '500' }}>Monitor your real-time approval status.</p>
          </div>
        </header>

        {loading && <div className="state-text">Loading applications...</div>}
        {error && <div className="state-text" style={{ color: '#ef4444' }}>{error}</div>}
        {!loading && !error && myApplications.length === 0 && (
          <div className="state-text">You have no active applications.</div>
        )}

        {!loading && !error && myApplications.length > 0 && (
          <section>
            {myApplications.map((app, index) => (
              <div className="status-card" key={index}>
                <div>
                  <div className="app-id">ID: {app.id}</div>
                  <h3 className="app-name">{app.scheme}</h3>
                  <div className="app-date">Applied on: {app.date}</div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="status-badge" style={{ backgroundColor: `${app.statusColor}20`, color: app.statusColor }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: app.statusColor }}></span>
                    {app.status}
                  </div>
                  <button className="btn-action" onClick={() => navigate(`/citizen/track/${app.rawId}`)}>View Details</button>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default TrackStatus;