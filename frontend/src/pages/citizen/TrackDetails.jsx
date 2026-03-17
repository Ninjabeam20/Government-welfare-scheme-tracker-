import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TrackDetails = () => {
  const navigate = useNavigate();
  const { appId } = useParams();

  const trackingSteps = [
    { title: 'Application Submitted', status: 'completed', desc: 'Received by the central system.' },
    { title: 'Officer Verification', status: 'current', desc: 'Under manual review by Welfare Officer.' },
    { title: 'Final Approval', status: 'upcoming', desc: 'Pending Administrator sign-off.' }
  ];

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
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 30px 0; }
        .header h2 { font-size: 30px; color: #0f172a; font-weight: 800; letter-spacing: -1px; }
        .card { background: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); max-width: 800px; }
        .timeline { position: relative; padding-left: 40px; margin-top: 30px; }
        .timeline::before { content: ''; position: absolute; left: 15px; top: 0; bottom: 0; width: 2px; background: #e2e8f0; }
        .timeline-item { position: relative; margin-bottom: 30px; }
        .timeline-dot { position: absolute; left: -40px; width: 32px; height: 32px; border-radius: 50%; z-index: 2; display: flex; align-items: center; justify-content: center; font-size: 14px; }
        .dot-completed { background: #10b981; color: white; }
        .dot-current { background: #2563eb; color: white; box-shadow: 0 0 0 6px #eff6ff; }
        .dot-upcoming { background: #f1f5f9; border: 2px solid #cbd5e1; }
        .timeline-content { padding: 20px; border-radius: 16px; border: 1px solid #f1f5f9; background: #ffffff; }
      `}</style>

      <aside className="sidebar">
        <div className="logo">WelfarePortal.</div>
        <nav>
          <div className="nav-link" onClick={() => navigate('/')}><span>🏠</span> Dashboard</div>
          <div className="nav-link" onClick={() => navigate('/citizen/schemes')}><span>📄</span> Apply for Schemes</div>
          <div className="nav-link active" onClick={() => navigate('/citizen/track')}><span>📊</span> Track Status</div>
          <div className="nav-link" onClick={() => navigate('/citizen/documents')}><span>📁</span> My Documents</div>
        </nav>
      </aside>

      <main className="main">
        <header className="header">
          <h2>Tracking ID: #{appId}</h2>
        </header>

        <section className="card">
          <div className="timeline">
            {trackingSteps.map((step, index) => (
              <div className="timeline-item" key={index}>
                <div className={`timeline-dot dot-${step.status}`}>
                  {step.status === 'completed' ? '✓' : '●'}
                </div>
                <div className="timeline-content">
                  <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{step.title}</h3>
                  <p style={{ fontSize: '14px', color: '#64748b', marginTop: '5px' }}>{step.desc}</p>
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