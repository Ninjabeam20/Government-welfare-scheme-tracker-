import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BrowseSchemes = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetching from the Unified Backend
    axios.get('http://localhost:5000/api/citizen/schemes')
      .then(res => {
        setSchemes(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9' }}>
        <h2 style={{ color: '#64748b', fontFamily: 'sans-serif' }}>Scanning Welfare Database...</h2>
      </div>
    );
  }

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
        .scheme-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; margin-top: 20px; }
        .scheme-card { background: #ffffff; padding: 24px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); transition: all 0.3s ease; display: flex; flex-direction: column; justify-content: space-between; }
        .badge { display: inline-block; padding: 6px 12px; background: #eff6ff; color: #2563eb; font-size: 12px; font-weight: 700; border-radius: 8px; margin-bottom: 12px; text-transform: uppercase; }
        .scheme-title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 10px; }
        .scheme-desc { font-size: 14px; color: #64748b; margin-bottom: 20px; line-height: 1.5; flex-grow: 1; }
        .apply-btn { padding: 12px; width: 100%; border: none; background: #2563eb; color: white; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; }
      `}</style>

      <aside className="sidebar">
        <div className="logo">WelfarePortal.</div>
        <nav>
          <div className="nav-link" onClick={() => navigate('/')}><span>🏠</span> Dashboard</div>
          <div className="nav-link active"><span>📄</span> Apply for Schemes</div>
          <div className="nav-link" onClick={() => navigate('/citizen/track')}><span>📊</span> Track Status</div>
          <div className="nav-link" onClick={() => navigate('/citizen/documents')}><span>📁</span> My Documents</div>
        </nav>
      </aside>

      <main className="main">
        <header className="header">
          <h2>Discover Schemes</h2>
        </header>

        <section className="scheme-grid">
          {schemes.length > 0 ? schemes.map((scheme) => (
            <div className="scheme-card" key={scheme.id}>
              <div>
                {/* Fixed Mapping: Using scheme.category and scheme.scheme_name */}
                <span className="badge">{scheme.category || 'General'}</span>
                <h3 className="scheme-title">{scheme.scheme_name}</h3>
                <p className="scheme-desc">{scheme.description}</p>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '15px' }}>
                  💰 Max Income: ₹{Number(scheme.max_income).toLocaleString()}
                </div>
              </div>
              <button className="apply-btn" onClick={() => navigate(`/citizen/apply/${scheme.id}`)}>
                Check Eligibility & Apply
              </button>
            </div>
          )) : (
            <p>No active schemes found in the database.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default BrowseSchemes;