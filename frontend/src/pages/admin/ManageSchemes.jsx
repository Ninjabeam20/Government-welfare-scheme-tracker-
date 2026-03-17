import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';

const ManageSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({ SchemeName: '', Description: '', max_income: '', isactive: 1 });

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/schemes');
      setSchemes(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ SchemeName: '', Description: '', max_income: '', isactive: 1 });
    setIsModalOpen(true);
  };

  const openEditModal = (scheme) => {
    setEditingId(scheme.SchemeID);
    setFormData({ 
      SchemeName: scheme.SchemeName, 
      Description: scheme.Description, 
      max_income: scheme.max_income, 
      isactive: scheme.isactive 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        await axios.put(`http://localhost:5000/api/admin/schemes/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/admin/schemes', formData);
      }
      setIsModalOpen(false);
      fetchSchemes();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/admin/schemes/${id}/toggle`);
      fetchSchemes();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this scheme?")) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5000/api/admin/schemes/${id}`);
        fetchSchemes();
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className="admin-container">
      <style>{`
        .admin-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
        .sidebar { width: 280px; background: #ffffff; margin: 20px; border-radius: 24px; padding: 30px 20px; display: flex; flex-direction: column; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06); }
        .logo { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 40px; padding-left: 10px; letter-spacing: -0.5px; }
        .nav-link { padding: 14px 20px; color: #64748b; font-weight: 600; border-radius: 16px; transition: all 0.3s ease; margin-bottom: 8px; cursor: pointer; display: flex; align-items: center;}
        .nav-link:hover { background: #f8fafc; color: #0f172a; transform: translateX(6px); }
        .nav-link.active { background: #4f46e5; color: #ffffff; box-shadow: 0 8px 20px rgba(79, 70, 229, 0.25); }
        .main { flex: 1; padding: 20px 40px 40px 20px; display: flex; flex-direction: column; overflow-y: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 30px 0; }
        .header h2 { font-size: 30px; color: #0f172a; font-weight: 800; letter-spacing: -1px; }
        .btn-primary { padding: 12px 24px; background: #0f172a; color: white; border: none; border-radius: 14px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
        .btn-primary:hover { background: #4f46e5; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3); }
        .btn-danger { background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px; transition: 0.2s; }
        .btn-danger:hover { background: #dc2626; }
        .btn-edit { background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px; margin-right: 8px; transition: 0.2s; }
        .btn-edit:hover { background: #2563eb; }
        .table-card { background: #ffffff; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); overflow: hidden; padding: 20px; }
        .data-table { width: 100%; border-collapse: collapse; text-align: left; }
        .data-table th { padding: 16px 20px; font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; }
        .data-table td { padding: 16px 20px; font-size: 15px; color: #0f172a; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .toggle-btn { background: #10b981; border: none; font-size: 13px; font-weight: 600; cursor: pointer; color: white; border-radius: 8px; padding: 8px 16px; margin-right: 15px; transition: 0.2s;}
        .toggle-btn:hover { opacity: 0.9; }
        .toggle-btn.deactivate { background: #f59e0b; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); z-index: 100; display: flex; align-items: center; justify-content: center; }
        .modal-content { background: white; padding: 32px; border-radius: 24px; width: 100%; max-width: 500px; }
        .form-control { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 15px; margin-bottom: 16px; outline: none; }
        .state-container { display: flex; justify-content: center; align-items: center; padding: 40px; color: #64748b; font-weight: 600; }
        .error-container { color: #ef4444; }
      `}</style>
      
      <AdminSidebar />
      
      <main className="main">
        <header className="header">
          <div>
            <h2>Welfare Schemes</h2>
          </div>
          <button className="btn-primary" onClick={openCreateModal}>+ Create New Scheme</button>
        </header>

        {loading ? (
          <div className="state-container">Loading Schemes...</div>
        ) : error ? (
          <div className="state-container error-container">Error: {error}</div>
        ) : schemes.length === 0 ? (
          <div className="state-container">No schemes available.</div>
        ) : (
          <section className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Scheme Name</th>
                  <th>Description</th>
                  <th>Max Income</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {schemes.map(scheme => (
                  <tr key={scheme.SchemeID}>
                    <td style={{ fontWeight: '600' }}>{scheme.SchemeName}</td>
                    <td>{scheme.Description}</td>
                    <td style={{ color: '#64748b' }}>₹{scheme.max_income}</td>
                    <td style={{ color: scheme.isactive ? '#10b981' : '#64748b', fontWeight: 'bold' }}>{scheme.isactive ? 'Active' : 'Inactive'}</td>
                    <td>
                      <button className={`toggle-btn ${scheme.isactive ? 'deactivate' : ''}`} onClick={() => toggleStatus(scheme.SchemeID)}>
                        {scheme.isactive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="btn-edit" onClick={() => openEditModal(scheme)}>Edit</button>
                      <button className="btn-danger" onClick={() => handleDelete(scheme.SchemeID)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', color: '#0f172a' }}>{editingId ? 'Edit Scheme' : 'Create New Scheme'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '6px', display: 'block' }}>Scheme Name</label>
              <input type="text" className="form-control" required value={formData.SchemeName} onChange={e => setFormData({...formData, SchemeName: e.target.value})} />
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '6px', display: 'block' }}>Max Income Eligibility (₹)</label>
              <input type="number" className="form-control" required value={formData.max_income} onChange={e => setFormData({...formData, max_income: e.target.value})} />
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '6px', display: 'block' }}>Description</label>
              <textarea className="form-control" rows="3" required value={formData.Description} onChange={e => setFormData({...formData, Description: e.target.value})}></textarea>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '6px', display: 'block' }}>Status</label>
              <select className="form-control" required value={formData.isactive} onChange={e => setFormData({...formData, isactive: Number(e.target.value)})}>
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>{editingId ? 'Update Scheme' : 'Publish Scheme'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSchemes;