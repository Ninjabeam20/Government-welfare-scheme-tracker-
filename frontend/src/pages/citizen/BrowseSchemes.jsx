import React from 'react';
import { useNavigate } from 'react-router-dom';

const BrowseSchemes = () => {
  const navigate = useNavigate();

  // Mock data based strictly on your DBMS Lab welfareschemes table schema
  const mockSchemes =[
    { id: 1, name: "Senior Citizen Pension Scheme", category: "Healthcare", maxIncome: 50000, desc: "Monthly financial support for senior citizens without regular income." },
    { id: 2, name: "Student Scholarship Program", category: "Education", maxIncome: 120000, desc: "Full tuition coverage for higher education for low-income families." },
    { id: 3, name: "Kisan Housing Grant", category: "Housing", maxIncome: 80000, desc: "Subsidy for building concrete houses for agricultural workers." },
    { id: 4, name: "Women Entrepreneurship Fund", category: "Women", maxIncome: 200000, desc: "Seed funding for women starting small-scale businesses." },
  ];

  return (
    <div className="dashboard-container">
      {/* FLUENT UI STYLES - Consistent Blue Theme */}
      <style>{`
        .dashboard-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
        
        .sidebar { width: 280px; background: #ffffff; margin: 20px; border-radius: 24px; padding: 30px 20px; display: flex; flex-direction: column; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06); }
        .logo { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 40px; padding-left: 10px; letter-spacing: -0.5px; }
        
        .nav-link { padding: 14px 20px; color: #64748b; font-weight: 600; border-radius: 16px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; gap: 12px; }
        .nav-link:hover { background: #f8fafc; color: #0f172a; transform: translateX(6px); }
        .nav-link.active { background: #2563eb; color: #ffffff; box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25); }

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
      `}</style>

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo">WelfarePortal.</div>
        <nav>
          <div className="nav-link" onClick={() => navigate('/')}><span>🏠</span> Dashboard</div>
          <div className="nav-link active" onClick={() => navigate('/citizen/schemes')}><span>📄</span> Apply for Schemes</div>
          <div className="nav-link" onClick={() => navigate('/citizen/track')}><span>📊</span> Track Status</div>
          <div className="nav-link" onClick={() => navigate('/citizen/documents')}><span>📁</span> My Documents</div>
          <div className="nav-link"><span>🎧</span> Grievance Support</div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main">
        <header className="header">
          <h2>Discover Schemes</h2>
          <input type="text" className="search-bar" placeholder="Search by name or category..." />
        </header>

        <section className="scheme-grid">
          {mockSchemes.map((scheme) => (
            <div className="scheme-card" key={scheme.id}>
              <div>
                <span className="badge">{scheme.category}</span>
                <h3 className="scheme-title">{scheme.name}</h3>
                <p className="scheme-desc">{scheme.desc}</p>
                <div className="scheme-meta">
                  <span>💰</span> Max Family Income: ₹{scheme.maxIncome.toLocaleString()}
                </div>
              </div>
              <button 
                className="apply-btn" 
                onClick={() => navigate(`/citizen/apply/${scheme.id}`)}
              >
                Check Eligibility & Apply
              </button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default BrowseSchemes;