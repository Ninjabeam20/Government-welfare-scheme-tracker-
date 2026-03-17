import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CitizenSidebar from './CitizenSidebar';

const BrowseSchemes = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [citizenIncome, setCitizenIncome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schemesRes, profileRes] = await Promise.all([
          axios.get('http://localhost:5000/api/citizen/schemes'),
          axios.get('http://localhost:5000/auth/me', { withCredentials: true })
        ]);
        setSchemes(schemesRes.data);
        const userId = profileRes.data.userId;
        const citizenRes = await axios.get(`http://localhost:5000/api/citizen/profile/${userId}`);
        setCitizenIncome(citizenRes.data.Income);
      } catch (err) {
        setError('Failed to fetch schemes.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.SchemeName.toLowerCase().includes(search.toLowerCase()) ||
      scheme.Description.toLowerCase().includes(search.toLowerCase());
    if (filter === 'eligible') {
      return matchesSearch && citizenIncome !== null && scheme.max_income >= citizenIncome;
    }
    return matchesSearch;
  });

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
        .main { flex: 1; padding: 20px 40px 40px 20px; display: flex; flex-direction: column; overflow-y: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 20px 0; }
        .header h2 { font-size: 30px; color: #0f172a; font-weight: 800; letter-spacing: -1px; }
        .filter-bar { display: flex; gap: 12px; align-items: center; margin-bottom: 24px; flex-wrap: wrap; }
        .search-bar { flex: 1; min-width: 200px; max-width: 360px; padding: 12px 18px; border-radius: 14px; border: 2px solid #e2e8f0; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .search-bar:focus { border-color: #2563eb; }
        .filter-btn { padding: 12px 20px; border-radius: 12px; border: 2px solid #e2e8f0; background: #ffffff; font-size: 14px; font-weight: 600; cursor: pointer; color: #64748b; transition: all 0.2s; }
        .filter-btn.active { background: #2563eb; color: #ffffff; border-color: #2563eb; }
        .filter-btn:hover:not(.active) { border-color: #2563eb; color: #2563eb; }
        .scheme-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        .scheme-card { background: #ffffff; padding: 24px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); transition: all 0.3s ease; display: flex; flex-direction: column; justify-content: space-between; }
        .scheme-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); }
        .badge { display: inline-block; padding: 6px 12px; background: #eff6ff; color: #2563eb; font-size: 12px; font-weight: 700; border-radius: 8px; margin-bottom: 12px; }
        .eligible-badge { background: #f0fdf4; color: #16a34a; }
        .scheme-title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 10px; }
        .scheme-desc { font-size: 14px; color: #64748b; margin-bottom: 16px; line-height: 1.5; flex-grow: 1; }
        .scheme-meta { font-size: 13px; color: #94a3b8; font-weight: 500; margin-bottom: 16px; }
        .apply-btn { padding: 12px; width: 100%; border: none; background: #2563eb; color: white; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
        .apply-btn:hover { background: #1d4ed8; box-shadow: 0 4px 12px rgba(37,99,235,0.3); }
        .state-text { color: #64748b; font-size: 16px; margin-top: 20px; }
      `}</style>

      <CitizenSidebar />

      <main className="main">
        <header className="header">
          <h2>Discover Schemes</h2>
        </header>

        <div className="filter-bar">
          <input
            type="text"
            className="search-bar"
            placeholder="Search by name or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            View All
          </button>
          <button
            className={`filter-btn ${filter === 'eligible' ? 'active' : ''}`}
            onClick={() => setFilter('eligible')}
          >
            ✓ Eligible for Me
          </button>
        </div>

        {loading && <div className="state-text">Loading schemes...</div>}
        {error && <div className="state-text" style={{ color: '#ef4444' }}>{error}</div>}
        {!loading && !error && filteredSchemes.length === 0 && (
          <div className="state-text">
            {filter === 'eligible'
              ? 'No schemes match your income eligibility. Try "View All".'
              : 'No schemes found.'}
          </div>
        )}

        {!loading && !error && filteredSchemes.length > 0 && (
          <section className="scheme-grid">
            {filteredSchemes.map(scheme => {
              const isEligible = citizenIncome !== null && scheme.max_income >= citizenIncome;
              return (
                <div className="scheme-card" key={scheme.SchemeID}>
                  <div>
                    <span className={`badge ${isEligible ? 'eligible-badge' : ''}`}>
                      {isEligible ? '✓ Eligible' : 'General'}
                    </span>
                    <h3 className="scheme-title">{scheme.SchemeName}</h3>
                    <p className="scheme-desc">{scheme.Description}</p>
                    <div className="scheme-meta">
                      💰 Max Income: ₹{scheme.max_income?.toLocaleString() || 0}
                    </div>
                  </div>
                  <button
                    className="apply-btn"
                    onClick={() => navigate(`/citizen/apply/${scheme.SchemeID}`)}
                  >
                    Apply Now
                  </button>
                </div>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
};

export default BrowseSchemes;