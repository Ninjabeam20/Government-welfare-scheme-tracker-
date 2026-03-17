import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Add this!


const ManageSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newScheme, setNewScheme] = useState({ name: '', category: '', maxIncome: '', description: '' });

  // Fetch real schemes from MySQL on load
  useEffect(() => {
    fetchSchemes();
  },[]);

  const fetchSchemes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/schemes');
      console.log("Backend Data Received:", response.data); // This helps us debug!

      // Check if response.data is actually an array before mapping
      if (Array.isArray(response.data)) {
       // Inside fetchSchemes in ManageSchemes.jsx
    const formattedSchemes = response.data.map(dbScheme => ({
      id: dbScheme.SchemeID, // Directly use SchemeID
      name: dbScheme.SchemeName, // Directly use SchemeName
      category: dbScheme.SchemeCategory || 'General', // If category is not in DB, use default
      applications: 0, // Placeholder
      active: dbScheme.isactive === 1 || dbScheme.isactive === true, // Check if 'isactive' exists, otherwise default
      maxIncome: dbScheme.max_income || dbScheme.MaxIncome || 0 // Fallback for maxIncome
    }));
    setSchemes(formattedSchemes);
      } else {
        console.error("Backend did not return an array:", response.data);
        setSchemes([]); // Set to empty array so it doesn't crash
      }
    } catch (error) {
      console.error("API Error:", error);
      setSchemes([]);
    }
  };

  // Send new scheme to Node.js Backend
  const handleCreateScheme = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/schemes', {
        scheme_name: newScheme.name,
        description: newScheme.description,
        // max_income: Number(newScheme.maxIncome) // Only include if max_income column exists in DB
    });
      alert("Scheme Published Successfully!");
      setIsModalOpen(false);
      setNewScheme({ name: '', category: '', maxIncome: '', description: '' });
      fetchSchemes(); // Refresh the table instantly!
    } catch (error) {
      console.error("Error saving scheme:", error);
      alert("Failed to create scheme. Check console.");
    }
  };
  const toggleStatus = async (id, currentStatus) => {
    try {
      // Toggle logic: If current is 1 (active), send 0 (inactive), and vice versa
      const newStatus = currentStatus ? 0 : 1; 
      await axios.patch(`http://localhost:5000/api/admin/schemes/${id}/toggle`, { isactive: newStatus });
      fetchSchemes(); // Refresh list from DB
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Failed to update status.");
    }
  };
  return (
    <div className="admin-container">
      {/* FLUENT UI STYLES - Indigo Theme for Admin */}
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

        .btn-primary { padding: 12px 24px; background: #0f172a; color: white; border: none; border-radius: 14px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
        .btn-primary:hover { background: #4f46e5; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3); }

        /* Modern Data Table */
        .table-card { background: #ffffff; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); overflow: hidden; padding: 20px; }
        .data-table { width: 100%; border-collapse: collapse; text-align: left; }
        .data-table th { padding: 16px 20px; font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #f1f5f9; }
        .data-table td { padding: 16px 20px; font-size: 15px; color: #0f172a; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .data-table tr:hover td { background: #f8fafc; }
        .data-table tr:last-child td { border-bottom: none; }
        
        .badge { padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; }
        .badge-active { background: #ecfdf5; color: #10b981; }
        .badge-inactive { background: #f1f5f9; color: #64748b; }
        .badge-category { background: #eef2ff; color: #4f46e5; }

        .toggle-btn { background: none; border: none; font-size: 13px; font-weight: 600; cursor: pointer; color: #4f46e5; text-decoration: underline; }

        /* Modal Styles */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s; }
        .modal-content { background: white; padding: 32px; border-radius: 24px; width: 100%; max-width: 500px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .form-control { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 15px; margin-bottom: 16px; outline: none; transition: 0.2s; }
        .form-control:focus { border-color: #4f46e5; background: white; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
      `}</style>

      <aside className="sidebar">
        <div className="logo">AdminPortal.</div>
        <nav>
          <div className="nav-link" onClick={() => navigate('/admin')}><span>✨</span> Dashboard Overview</div>
          <div className="nav-link active" onClick={() => navigate('/admin/schemes')}><span>🗂️</span> Manage Schemes</div>
          <div className="nav-link" onClick={() => navigate('/admin/officers')}><span>👮‍♂️</span> Manage Officers</div>
          <div className="nav-link" onClick={() => navigate('/admin/audits')}><span>🛡️</span> System Audit Logs</div>
          <div className="nav-link"><span>📊</span> Fiscal Predictability</div>
        </nav>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <h2>Welfare Schemes</h2>
            <p style={{ color: '#64748b', fontWeight: '500', marginTop: '5px' }}>Manage eligibility, limits, and active statuses.</p>
          </div>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ Create New Scheme</button>
        </header>

        <section className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Scheme Name</th>
                <th>Category</th>
                <th>Max Income</th>
                <th>Total Apps</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {schemes.map(scheme => (
                <tr key={scheme.id}>
                  <td style={{ fontWeight: '600' }}>{scheme.name}</td>
                  <td><span className="badge badge-category">{scheme.category}</span></td>
                  <td style={{ color: '#64748b' }}>₹{scheme.maxIncome.toLocaleString()}</td>
                  <td style={{ fontWeight: '600', color: '#4f46e5' }}>{scheme.applications}</td>
                  <td>
                    <span className={`badge ${scheme.active ? 'badge-active' : 'badge-inactive'}`}>
                      {scheme.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="toggle-btn" onClick={() => toggleStatus(scheme.id, scheme.active)}>
  {scheme.active ? 'Deactivate' : 'Activate'}
</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* CREATE SCHEME MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', color: '#0f172a' }}>Create New Scheme</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>
            
            <form onSubmit={handleCreateScheme}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '6px', display: 'block' }}>Scheme Name</label>
              <input type="text" className="form-control" required value={newScheme.name} onChange={e => setNewScheme({...newScheme, name: e.target.value})} placeholder="e.g. Youth Tech Grant" />
              
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '6px', display: 'block' }}>Category</label>
              <select className="form-control" required value={newScheme.category} onChange={e => setNewScheme({...newScheme, category: e.target.value})}>
                <option value="">Select Domain...</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Women">Women</option>
                <option value="Housing">Housing</option>
              </select>

              <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '6px', display: 'block' }}>Max Income Eligibility (₹)</label>
              <input type="number" className="form-control" required value={newScheme.maxIncome} onChange={e => setNewScheme({...newScheme, maxIncome: e.target.value})} placeholder="e.g. 150000" />

              <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '6px', display: 'block' }}>Details / Description</label>
              <textarea className="form-control" rows="3" required value={newScheme.description} onChange={e => setNewScheme({...newScheme, description: e.target.value})} placeholder="Provide scheme objectives..."></textarea>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Publish Scheme</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSchemes;