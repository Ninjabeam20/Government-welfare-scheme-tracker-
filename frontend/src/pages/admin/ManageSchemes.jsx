import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ManageSchemes = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newScheme, setNewScheme] = useState({ name: '', category: '', maxIncome: '', description: '' });

  // 1. Fetch Schemes from Unified Backend
  const fetchSchemes = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/admin/schemes')
      .then(res => {
        setSchemes(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching schemes:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSchemes();
    // Logic to auto-open modal if navigated from Admin Dashboard "Create" button
    if (location.state?.openModal) setIsModalOpen(true);
  }, [location]);

  // 2. Create New Scheme
  const handleCreateScheme = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/admin/schemes', {
      scheme_name: newScheme.name,
      category: newScheme.category,
      max_income: newScheme.maxIncome,
      description: newScheme.description
    })
    .then(() => {
      alert("Scheme Published Successfully!");
      setIsModalOpen(false);
      setNewScheme({ name: '', category: '', maxIncome: '', description: '' });
      fetchSchemes(); 
    })
    .catch(err => alert("Failed to create scheme. Check if name is unique."));
  };

  // 3. Toggle Status (Active/Inactive)
  const toggleStatus = (id) => {
    axios.patch(`http://localhost:5000/api/admin/schemes/${id}/toggle`)
      .then(() => fetchSchemes())
      .catch(err => console.error(err));
  };

  if (loading) return <div style={{padding: '40px', fontFamily: 'sans-serif'}}>Updating Scheme Registry...</div>;

  return (
    <div className="admin-container">
      <style>{`
        .admin-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
        .sidebar { width: 280px; background: #ffffff; margin: 20px; border-radius: 24px; padding: 30px 20px; display: flex; flex-direction: column; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06); }
        .logo { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 40px; padding-left: 10px; letter-spacing: -0.5px; }
        .nav-link { padding: 14px 20px; color: #64748b; font-weight: 600; border-radius: 16px; transition: all 0.3s ease; margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; gap: 12px; }
        .nav-link:hover { background: #f8fafc; color: #0f172a; transform: translateX(6px); }
        .nav-link.active { background: #4f46e5; color: #ffffff; box-shadow: 0 8px 20px rgba(79, 70, 229, 0.25); }
        .main { flex: 1; padding: 20px 40px 40px 20px; display: flex; flex-direction: column; overflow-y: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 30px 0; }
        .header h2 { font-size: 30px; color: #0f172a; font-weight: 800; letter-spacing: -1px; }
        .btn-primary { padding: 12px 24px; background: #0f172a; color: white; border: none; border-radius: 14px; font-weight: 600; cursor: pointer; transition: 0.3s; }
        .btn-primary:hover { background: #4f46e5; transform: translateY(-2px); }
        .table-card { background: #ffffff; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); overflow: hidden; padding: 20px; }
        .data-table { width: 100%; border-collapse: collapse; text-align: left; }
        .data-table th { padding: 16px 20px; font-size: 13px; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; }
        .data-table td { padding: 16px 20px; font-size: 15px; color: #0f172a; border-bottom: 1px solid #f1f5f9; }
        .badge { padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; }
        .badge-active { background: #ecfdf5; color: #10b981; }
        .badge-inactive { background: #f1f5f9; color: #64748b; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; }
        .modal-content { background: white; padding: 32px; border-radius: 24px; width: 100%; max-width: 500px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
        .form-control { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 15px; margin-bottom: 16px; outline: none; }
      `}</style>

      {/* Sidebar - Paths match App.jsx */}
      <aside className="sidebar">
        <div className="logo">AdminPortal.</div>
        <nav>
          <div className="nav-link" onClick={() => navigate('/admin')}><span>✨</span> Dashboard Overview</div>
          <div className="nav-link active" onClick={() => navigate('/admin/schemes')}><span>🗂️</span> Manage Schemes</div>
          <div className="nav-link" onClick={() => navigate('/admin/officers')}><span>👮‍♂️</span> Manage Officers</div>
          <div className="nav-link" onClick={() => navigate('/admin/audits')}><span>🛡️</span> System Audit Logs</div>
        </nav>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <h2>Welfare Schemes</h2>
            <p style={{ color: '#64748b', marginTop: '5px' }}>Registry contains {schemes.length} records.</p>
          </div>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ Create New Scheme</button>
        </header>

        <section className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Scheme Name</th>
                <th>Category</th>
                <th>Eligibility (Income)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {schemes.map(scheme => (
                <tr key={scheme.id}>
                  <td style={{ fontWeight: '600' }}>{scheme.scheme_name}</td>
                  <td><span className="badge" style={{background: '#eef2ff', color: '#4f46e5'}}>{scheme.category}</span></td>
                  <td>Up to ₹{Number(scheme.max_income).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${scheme.is_active ? 'badge-active' : 'badge-inactive'}`}>
                      {scheme.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button 
                      style={{background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline'}} 
                      onClick={() => toggleStatus(scheme.id)}
                    >
                      {scheme.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* Modal for creating a scheme */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '20px', fontWeight: '800' }}>Publish New Scheme</h3>
            <form onSubmit={handleCreateScheme}>
              <input type="text" className="form-control" placeholder="Full Scheme Name" required value={newScheme.name} onChange={e => setNewScheme({...newScheme, name: e.target.value})} />
              <select className="form-control" required value={newScheme.category} onChange={e => setNewScheme({...newScheme, category: e.target.value})}>
                <option value="">Select Domain...</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Women">Women</option>
                <option value="Housing">Housing</option>
              </select>
              <input type="number" className="form-control" placeholder="Max Family Income Limit" required value={newScheme.maxIncome} onChange={e => setNewScheme({...newScheme, maxIncome: e.target.value})} />
              <textarea className="form-control" placeholder="Brief description of benefits..." rows="3" required value={newScheme.description} onChange={e => setNewScheme({...newScheme, description: e.target.value})}></textarea>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Finalize & Publish</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSchemes;