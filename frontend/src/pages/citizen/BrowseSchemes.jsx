import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CitizenSidebar from './CitizenSidebar';

const BrowseSchemes = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/citizen/schemes')
      .then(res => {
        setSchemes(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching citizen schemes:", err);
        setError('Failed to fetch schemes.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
        .main { flex: 1; padding: 20px 40px 40px 20px; display: flex; flex-direction: column; overflow-y: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 30px 0; }
        .header h2 { font-size: 30px; color: #0f172a; font-weight: 800; letter-spacing: -1px; }
        .search-bar { width: 100%; max-width: 400px; padding: 14px 20px; border-radius: 16px; border: 1px solid #e2e8f0; font-size: 15px; outline: none; transition: box-shadow 0.3s; }
        .search-bar:focus { box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2); border-color: #2563eb; }
        .scheme-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; margin-top: 20px; }
        .scheme-card { background: #ffffff; padding: 24px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); transition: all 0.3s ease; display: flex; flex-direction: column; justify-content: space-between; }
        .scheme-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); }
        .badge { display: inline-block; padding: 6px 12px; background: #eff6ff; color: #2563eb; font-size: 12px; font-weight: 700; border-radius: 8px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .scheme-title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 10px; line-height: 1.3; }
        .scheme-desc { font-size: 14px; color: #64748b; margin-bottom: 20px; line-height: 1.5; flex-grow: 1; }
        .scheme-meta { font-size: 13px; color: #94a3b8; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 6px;}
        .apply-btn { padding: 12px; width: 100%; border: none; background: #2563eb; color: white; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
        .apply-btn:hover { background: #1d4ed8; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); }
        .state-text { color: #64748b; font-size: 16px; margin-top: 20px; }
      `}</style>

      <CitizenSidebar />

      <main className="main">
        <header className="header">
          <h2>Discover Schemes</h2>
          <input type="text" className="search-bar" placeholder="Search by name or category..." />
        </header>

        {loading && <div className="state-text">Loading schemes...</div>}
        {error && <div className="state-text" style={{ color: '#ef4444' }}>{error}</div>}
        {!loading && !error && schemes.length === 0 && (
          <div className="state-text">No active schemes available right now.</div>
        )}

        {!loading && !error && schemes.length > 0 && (
          <section className="scheme-grid">
            {schemes.map((scheme) => (
              <div className="scheme-card" key={scheme.SchemeID}>
                <div>
                  <span className="badge">General</span>
                  <h3 className="scheme-title">{scheme.SchemeName}</h3>
                  <p className="scheme-desc">{scheme.Description}</p>
                  <div className="scheme-meta">
                    <span>💰</span> Max Family Income: ₹{scheme.MaxFamilyIncome || 0}
                  </div>
                </div>
                <button 
                  className="apply-btn" 
                  onClick={() => navigate(`/citizen/apply/${scheme.SchemeID}`)}
                >
                  Apply Now
                </button>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default BrowseSchemes;