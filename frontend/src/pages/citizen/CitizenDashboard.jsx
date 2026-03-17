import React from 'react';
import { useNavigate } from 'react-router-dom';
import CitizenSidebar from './CitizenSidebar';

const CitizenDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
        .main { flex: 1; padding: 20px 40px 40px 20px; display: flex; flex-direction: column; overflow-y: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 40px 0; }
        .header h2 { font-size: 30px; color: #0f172a; font-weight: 800; letter-spacing: -1px; }
        .profile-badge { background: #ffffff; padding: 12px 24px; border-radius: 99px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); font-weight: 600; color: #334155; cursor: pointer; transition: all 0.3s ease; }
        .profile-badge:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .card { background: #ffffff; padding: 30px; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
        .card h3 { color: #64748b; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
        .card .value { font-size: 36px; color: #0f172a; font-weight: 800; margin-bottom: 8px; line-height: 1.2; }
        .card p { color: #94a3b8; font-size: 15px; font-weight: 500;}
        .btn-action { margin-top: 24px; padding: 16px; width: 100%; border: none; background: #2563eb; color: white; border-radius: 16px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
        .btn-action:hover { background: #1d4ed8; box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3); }
        .btn-secondary { background: #f1f5f9; color: #0f172a; }
        .btn-secondary:hover { background: #e2e8f0; box-shadow: 0 8px 20px rgba(0,0,0,0.05); }
      `}</style>

      <CitizenSidebar />

      <main className="main">
        <header className="header">
          <h2>Welcome, Beneficiary</h2>
          <div className="profile-badge">👤 My Profile</div>
        </header>

        <section className="grid">
          <div className="card">
            <h3>Available Schemes</h3>
            <div className="value">12</div>
            <p>Schemes matching your eligibility</p>
            <button className="btn-action" onClick={() => navigate('/citizen/schemes')}>Browse Schemes</button>
          </div>

          <div className="card">
            <h3>Active Applications</h3>
            <div className="value">Under Review</div>
            <p>Education Scholarship 2026</p>
            <button className="btn-action btn-secondary" onClick={() => navigate('/citizen/track')}>Track Live Status</button>
          </div>

          <div className="card">
            <h3>eKYC Verification</h3>
            <div className="value" style={{ color: '#ef4444' }}>Pending</div>
            <p>Upload Aadhaar to receive DBT funds</p>
            <button className="btn-action" onClick={() => navigate('/citizen/documents')}>Upload Documents</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CitizenDashboard;