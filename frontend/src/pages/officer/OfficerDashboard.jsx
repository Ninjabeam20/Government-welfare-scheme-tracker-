import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VerificationQueue from './VerificationQueue';
import OfficerSidebar from './OfficerSidebar';

const OfficerDashboard = () => {
  // State to manage which view is active in the main content area
  const [activeView, setActiveView] = useState('dashboard');
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch dashboard stats (pending verifications)
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Assuming officer ID is 1 for now
        const res = await axios.get('http://localhost:5000/api/officer/queue/1');
        setPendingCount(res.data.length);
        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard statistics.");
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
        .main { flex: 1; padding: 20px 40px 40px 20px; display: flex; flex-direction: column; overflow-y: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 40px 0; }
        .header h2 { font-size: 30px; color: #0f172a; font-weight: 800; letter-spacing: -1px; }
        .profile-badge { 
          background: #ffffff; padding: 12px 24px; border-radius: 99px; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.05); font-weight: 600; color: #334155; 
          cursor: pointer; transition: all 0.3s ease; 
        }
        .profile-badge:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }

        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .card { 
          background: #ffffff; padding: 30px; border-radius: 24px; 
          box-shadow: 0 4px 20px rgba(0,0,0,0.03); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
        }
        .card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
        .card h3 { color: #64748b; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
        .card .value { font-size: 42px; color: #0f172a; font-weight: 800; margin-bottom: 8px; line-height: 1; }
        .card p { color: #94a3b8; font-size: 15px; font-weight: 500;}
        
        .btn-action { 
          margin-top: 24px; padding: 16px; width: 100%; border: none; 
          background: #10b981; color: white; border-radius: 16px; font-size: 15px; 
          font-weight: 600; cursor: pointer; transition: all 0.3s ease; 
        }
        .btn-action:hover { background: #059669; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3); }
        .btn-secondary { background: #f1f5f9; color: #0f172a; }
        .btn-secondary:hover { background: #e2e8f0; box-shadow: 0 8px 20px rgba(0,0,0,0.05); }
        .loading-text { font-size: 16px; color: #64748b; font-weight: 500; }
        .error-text { font-size: 16px; color: #ef4444; font-weight: 500; }
      `}</style>

      {/* Sidebar Navigation */}
      <OfficerSidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Dashboard Content */}
      <main className="main">
        <header className="header">
          <h2>
            {activeView === 'dashboard' ? 'Verification Operations' : 'Verification Queue'}
          </h2>
          <div className="profile-badge">👮‍♂️ Welfare Officer</div>
        </header>

        {activeView === 'dashboard' && (
          <section className="grid">
            <div className="card">
              <h3>Total Assigned Queue</h3>
              {loading ? (
                <div className="loading-text">Loading stats...</div>
              ) : error ? (
                <div className="error-text">{error}</div>
              ) : (
                <div className="value">{pendingCount}</div>
              )}
              <p>Applications awaiting review</p>
              <button className="btn-action" onClick={() => setActiveView('queue')}>Review Documents</button>
            </div>
            {/* The rest of the dashboard was mock data, but we can keep these structure for UI */}
            <div className="card">
              <h3>Auto-Routed Today</h3>
              <div className="value">-</div>
              <p>Sent to Finance/DBT Department</p>
              <button className="btn-action btn-secondary" disabled>View Routing Log</button>
            </div>
            <div className="card">
              <h3>Suspicious Flags</h3>
              <div className="value">-</div>
              <p>Potential duplicate/ghost beneficiaries</p>
              <button className="btn-action" style={{ background: '#ef4444', boxShadow: 'none' }} disabled>Investigate</button>
            </div>
          </section>
        )}

        {activeView === 'queue' && (
          <VerificationQueue />
        )}
      </main>
    </div>
  );
};

export default OfficerDashboard;