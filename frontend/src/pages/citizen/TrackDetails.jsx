import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TrackDetails = () => {
  const navigate = useNavigate();
  const { appId } = useParams();

  // Mock workflow timeline based on your Lab 4A process
  const trackingSteps =[
    { title: 'Application Submitted', date: 'Feb 20, 2026', status: 'completed', desc: 'Form submitted successfully via Citizen Portal.' },
    { title: 'eKYC & Document Verification', date: 'Feb 22, 2026', status: 'completed', desc: 'Aadhaar identity and income certificates verified by system.' },
    { title: 'Officer Review', date: 'Feb 25, 2026', status: 'current', desc: 'Currently under manual review by the Welfare Department.' },
    { title: 'Final Approval', date: 'Pending', status: 'upcoming', desc: 'Awaiting Administrator sign-off for funds.' },
    { title: 'DBT Disbursement', date: 'Pending', status: 'upcoming', desc: 'Direct Benefit Transfer to your registered bank account.' }
  ];

  return (
    <div className="dashboard-container">
      {/* FLUENT UI STYLES - Consistent Blue Theme */}
      <style>{`
        .dashboard-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
        .sidebar { width: 280px; background: #ffffff; margin: 20px; border-radius: 24px; padding: 30px 20px; display: flex; flex-direction: column; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06); }
        .logo { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 40px; padding-left: 10px; letter-spacing: -0.5px; }
        
        .nav-link { padding: 14px 20px; color: #64748b; font-weight: 600; border-radius: 16px; transition: all 0.3s ease; margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; gap: 12px; }
        .nav-link:hover { background: #f8fafc; color: #0f172a; transform: translateX(6px); }
        .nav-link.active { background: #2563eb; color: #ffffff; box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25); }

        .main { flex: 1; padding: 20px 40px 40px 20px; display: flex; flex-direction: column; overflow-y: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 30px 0; }
        .header h2 { font-size: 30px; color: #0f172a; font-weight: 800; letter-spacing: -1px; }
        .back-btn { background: none; border: none; color: #64748b; font-size: 15px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: color 0.2s; margin-bottom: 10px; }
        .back-btn:hover { color: #0f172a; }

        .card { background: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); max-width: 800px; width: 100%; }
        
        /* Stunning Vertical Timeline CSS */
        .timeline { position: relative; padding-left: 40px; margin-top: 30px; }
        .timeline::before { content: ''; position: absolute; left: 15px; top: 0; bottom: 0; width: 2px; background: #e2e8f0; border-radius: 2px; }
        
        .timeline-item { position: relative; margin-bottom: 30px; }
        .timeline-item:last-child { margin-bottom: 0; }
        
        .timeline-dot { position: absolute; left: -40px; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; z-index: 2; transition: all 0.3s; }
        .dot-completed { background: #10b981; color: white; box-shadow: 0 0 0 4px #ecfdf5; }
        .dot-current { background: #2563eb; color: white; box-shadow: 0 0 0 6px #eff6ff; animation: pulse 2s infinite; }
        .dot-upcoming { background: #f1f5f9; border: 2px solid #cbd5e1; color: #94a3b8; }
        
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(37,99,235,0.4); } 70% { box-shadow: 0 0 0 10px rgba(37,99,235,0); } 100% { box-shadow: 0 0 0 0 rgba(37,99,235,0); } }

        .timeline-content { padding: 20px; border-radius: 16px; border: 1px solid #f1f5f9; background: #ffffff; transition: all 0.3s ease; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .content-current { border-color: #bfdbfe; background: #f8fafc; transform: translateX(5px); box-shadow: 0 8px 20px rgba(37,99,235,0.08); }
        
        .timeline-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center; }
        .timeline-date { font-size: 13px; font-weight: 600; color: #94a3b8; }
        .timeline-desc { font-size: 14px; color: #64748b; line-height: 1.5; margin-top: 8px; }
      `}</style>

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

      <main className="main">
        <header className="header">
          <div>
            <button className="back-btn" onClick={() => navigate('/citizen/track')}>
              ← Back to List
            </button>
            <h2 style={{ marginTop: '5px' }}>Tracking ID: {appId}</h2>
          </div>
        </header>

        <section className="card">
          <h3 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '20px' }}>Application Progress</h3>
          
          <div className="timeline">
            {trackingSteps.map((step, index) => (
              <div className="timeline-item" key={index}>
                {/* Timeline Dot Indicator */}
                <div className={`timeline-dot dot-${step.status}`}>
                  {step.status === 'completed' && '✓'}
                  {step.status === 'current' && '●'}
                  {step.status === 'upcoming' && '○'}
                </div>
                
                {/* Timeline Content Box */}
                <div className={`timeline-content ${step.status === 'current' ? 'content-current' : ''}`}>
                  <div className="timeline-title">
                    {step.title}
                    <span className="timeline-date">{step.date}</span>
                  </div>
                  <p className="timeline-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TrackDetails;