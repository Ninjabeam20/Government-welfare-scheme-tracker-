import React from 'react';
import { useNavigate } from 'react-router-dom';

const TrackStatus = () => {
  const navigate = useNavigate();

  // Mock data representing the currentapplications table
  const myApplications =[
    { id: "APP-2026-8821", scheme: "Senior Citizen Pension Scheme", date: "Feb 20, 2026", status: "Approved", statusColor: "#10b981" },
    { id: "APP-2026-9042", scheme: "Women Entrepreneurship Fund", date: "Feb 25, 2026", status: "Under Review", statusColor: "#f59e0b" },
    { id: "APP-2026-9110", scheme: "Kisan Housing Grant", date: "Feb 26, 2026", status: "Pending eKYC", statusColor: "#ef4444" }
  ];

  return (
    <div className="dashboard-container">
      {/* FLUENT UI STYLES */}
      <style>{`
        .dashboard-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
        
        .sidebar { width: 280px; background: #ffffff; margin: 20px; border-radius: 24px; padding: 30px 20px; display: flex; flex-direction: column; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06); }
        .logo { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 40px; padding-left: 10px; letter-spacing: -0.5px; }
        
        .nav-link { padding: 14px 20px; color: #64748b; font-weight: 600; border-radius: 16px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; gap: 12px; }
        .nav-link:hover { background: #f8fafc; color: #0f172a; transform: translateX(6px); }
        .nav-link.active { background: #2563eb; color: #ffffff; box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25); }

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
      `}</style>

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo">WelfarePortal.</div>
        <nav>
          <div className="nav-link" onClick={() => navigate('/')}><span>🏠</span> Dashboard</div>
          <div className="nav-link" onClick={() => navigate('/citizen/schemes')}><span>📄</span> Apply for Schemes</div>
          <div className="nav-link active" onClick={() => navigate('/citizen/track')}><span>📊</span> Track Status</div>
          <div className="nav-link" onClick={() => navigate('/citizen/documents')}><span>📁</span> My Documents</div>
          <div className="nav-link"><span>🎧</span> Grievance Support</div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main">
        <header className="header">
          <h2>Application Tracker</h2>
          <p style={{ color: '#64748b', fontWeight: '500' }}>Monitor your real-time approval status.</p>
        </header>

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
                    <button className="btn-action" onClick={() => navigate(`/citizen/track/${app.id}`)}>View Details</button>
                </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default TrackStatus;