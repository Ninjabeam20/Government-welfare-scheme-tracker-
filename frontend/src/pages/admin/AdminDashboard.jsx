import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="admin-container">
      {/* FLUENT UI STYLES */}
      <style>{`
        .admin-container { 
          display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; 
        }
        
        /* Floating, Curvy Sidebar */
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
          background: #4f46e5; color: #ffffff; 
          box-shadow: 0 8px 20px rgba(79, 70, 229, 0.25); 
        }

        /* Main Content Area */
        .main { flex: 1; padding: 20px 40px 40px 20px; display: flex; flex-direction: column; overflow-y: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 40px 0; }
        .header h2 { font-size: 30px; color: #0f172a; font-weight: 800; letter-spacing: -1px; }
        .profile-badge { 
          background: #ffffff; padding: 12px 24px; border-radius: 99px; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.05); font-weight: 600; color: #334155; 
          cursor: pointer; transition: all 0.3s ease; 
        }
        .profile-badge:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }

        /* Smooth Floating Cards Grid */
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .card { 
          background: #ffffff; padding: 30px; border-radius: 24px; 
          box-shadow: 0 4px 20px rgba(0,0,0,0.03); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
        }
        .card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
        .card h3 { color: #64748b; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
        .card .value { font-size: 42px; color: #0f172a; font-weight: 800; margin-bottom: 8px; line-height: 1; }
        .card p { color: #94a3b8; font-size: 15px; font-weight: 500;}
        
        /* Modern Buttons */
        .btn-primary { 
          margin-top: 24px; padding: 16px; width: 100%; border: none; 
          background: #0f172a; color: white; border-radius: 16px; font-size: 15px; 
          font-weight: 600; cursor: pointer; transition: all 0.3s ease; 
        }
        .btn-primary:hover { background: #4f46e5; box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3); }
      `}</style>

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo">AdminPortal.</div>
        <nav>
          <div className="nav-link active"><span>✨</span> Dashboard Overview</div>
          <div className="nav-link"><span>🗂️</span> Manage Schemes</div>
          <div className="nav-link"><span>🛡️</span> System Audit Logs</div>
          <div className="nav-link"><span>📊</span> Fiscal Predictability</div>
        </nav>
      </aside>

      {/* Main Dashboard Content */}
      <main className="main">
        <header className="header">
          <h2>System Operations</h2>
          <div className="profile-badge">👨‍💻 Administrator</div>
        </header>

        <section className="grid">
          {/* Card 1 based on Manage Schemes Use Case */}
          <div className="card">
            <h3>Total Welfare Schemes</h3>
            <div className="value">14</div>
            <p>+2 added this quarter</p>
            <button className="btn-primary">Create New Scheme</button>
          </div>

          {/* Card 2 based on Audits Use Case */}
          <div className="card">
            <h3>System Compliance</h3>
            <div className="value">100%</div>
            <p>No anomalies detected in DB</p>
            <button className="btn-primary">View Audit Logs</button>
          </div>

          {/* Card 3 based on Centralized Workflow Use Case */}
          <div className="card">
            <h3>Pending Applications</h3>
            <div className="value">342</div>
            <p>Awaiting Officer Verification</p>
            <button className="btn-primary">Monitor Workflows</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;