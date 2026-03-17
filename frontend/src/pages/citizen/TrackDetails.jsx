import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CitizenSidebar from './CitizenSidebar';

const TrackDetails = () => {
  const navigate = useNavigate();
  const { appId } = useParams();

  const [applicationData, setApplicationData] = useState(null);

  useEffect(() => {
    const fetchApplicationRecord = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/citizen/track/${appId}`);
        setApplicationData(response.data);
      } catch (error) {
        console.error('Error tracking application:', error);
      }
    };
    fetchApplicationRecord();
  }, [appId]);

  const getStatusLevel = (status) => {
    switch (status) {
      case 'Pending eKYC': return 0;
      case 'Pending': return 1;
      case 'Under Review': return 2;
      case 'Approved': return 3;
      case 'Rejected': return -1;
      case 'Routed to DBT': return 4;
      default: return 1;
    }
  };

  const level = applicationData ? getStatusLevel(applicationData.Status) : 0;
  const appliedDate = applicationData ? new Date(applicationData.Applied_on).toLocaleDateString() : 'Loading...';

  const trackingSteps = [
    { title: 'Application Submitted', date: appliedDate, status: level >= 0 ? (level > 0 ? 'completed' : 'current') : 'completed', desc: 'Form submitted successfully via Citizen Portal.' },
    { title: 'eKYC & Document Verification', date: level > 0 ? appliedDate : 'Pending', status: level >= 1 ? (level > 1 ? 'completed' : 'current') : 'upcoming', desc: 'Aadhaar identity and income certificates verified by system.' },
    { title: 'Officer Review', date: level > 1 ? appliedDate : 'Pending', status: level >= 2 ? (level > 2 ? 'completed' : 'current') : 'upcoming', desc: 'Currently under manual review by the Welfare Department.' },
    { title: 'Final Approval', date: level > 2 ? appliedDate : 'Pending', status: level >= 3 ? (level > 3 ? 'completed' : 'current') : 'upcoming', desc: 'Awaiting Administrator sign-off for funds.' },
    { title: 'DBT Disbursement', date: level > 3 ? appliedDate : 'Pending', status: level >= 4 ? 'completed' : 'upcoming', desc: 'Direct Benefit Transfer to your registered bank account.' }
  ];

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
        .main { flex: 1; padding: 20px 40px 40px 20px; display: flex; flex-direction: column; overflow-y: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 30px 0; }
        .header h2 { font-size: 30px; color: #0f172a; font-weight: 800; letter-spacing: -1px; }
        .back-btn { background: none; border: none; color: #64748b; font-size: 15px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: color 0.2s; margin-bottom: 10px; }
        .back-btn:hover { color: #0f172a; }
        .card { background: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); max-width: 800px; width: 100%; }
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

      <CitizenSidebar />

      <main className="main">
        <header className="header">
          <div>
            <button className="back-btn" onClick={() => navigate('/citizen/track')}>
              ← Back to List
            </button>
            <h2 style={{ marginTop: '5px' }}>Tracking ID: APP-2026-{appId}</h2>
          </div>
        </header>

        <section className="card">
          <h3 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '20px' }}>Application Progress</h3>
          
          <div className="timeline">
            {trackingSteps.map((step, index) => (
              <div className="timeline-item" key={index}>
                <div className={`timeline-dot dot-${step.status}`}>
                  {step.status === 'completed' && '✓'}
                  {step.status === 'current' && '●'}
                  {step.status === 'upcoming' && '○'}
                </div>
                
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