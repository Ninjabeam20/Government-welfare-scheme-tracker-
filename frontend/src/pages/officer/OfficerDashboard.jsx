import React from 'react';

const OfficerDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* FLUENT UI STYLES - Consistent with Admin Dashboard */}
      <style>{`
        .dashboard-container { 
          display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; 
        }
        
        .sidebar { 
          width: 280px; background: #ffffff; margin: 20px; border-radius: 24px; 
          padding: 30px 20px; display: flex; flex-direction: column; 
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06); 
        }
        .logo { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 40px; padding-left: 10px; letter-spacing: -0.5px; }
        .nav-link { 
          padding: 14px 20px; color: #64748b; font-weight: 600; border-radius: 16px; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; gap: 12px;
        }
        .nav-link:hover { background: #f8fafc; color: #0f172a; transform: translateX(6px); }
        .nav-link.active { 
          background: #10b981; color: #ffffff; /* Green theme for Officer */
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.25); 
        }

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
        
        .btn-secondary {
          background: #f1f5f9; color: #0f172a;
        }
        .btn-secondary:hover { background: #e2e8f0; box-shadow: 0 8px 20px rgba(0,0,0,0.05); }
      `}</style>

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo">OfficerPortal.</div>
        <nav>
          <div className="nav-link active"><span>📋</span> Verification Queue</div>
          <div className="nav-link"><span>✅</span> Approved Apps</div>
          <div className="nav-link"><span>❌</span> Rejected Apps</div>
          <div className="nav-link"><span>🔀</span> Routing History</div>
        </nav>
      </aside>

      {/* Main Dashboard Content */}
      <main className="main">
        <header className="header">
          <h2>Verification Operations</h2>
          <div className="profile-badge">👮‍♂️ Welfare Officer</div>
        </header>

        <section className="grid">
          {/* Card 1: Document Verification */}
          <div className="card">
            <h3>Pending Verifications</h3>
            <div className="value">42</div>
            <p>Aadhaar & eKYC documents awaiting review</p>
            <button className="btn-action">Review Documents</button>
          </div>

          {/* Card 2: Routing/Workflows */}
          <div className="card">
            <h3>Auto-Routed Today</h3>
            <div className="value">18</div>
            <p>Sent to Finance/DBT Department</p>
            <button className="btn-action btn-secondary">View Routing Log</button>
          </div>

          {/* Card 3: Fraud/AI Detection (From Lab 3A Future Enhancements) */}
          <div className="card">
            <h3>Suspicious Flags</h3>
            <div className="value">3</div>
            <p>Potential duplicate/ghost beneficiaries</p>
            <button className="btn-action" style={{ background: '#ef4444', boxShadow: 'none' }}>Investigate</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OfficerDashboard;