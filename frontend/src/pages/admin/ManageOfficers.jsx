import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';

const ManageOfficers = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ Name: '', Email: '', Department: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchOfficers(); }, []);

  const fetchOfficers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/officers');
      setOfficers(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      await axios.put(`http://localhost:5000/api/admin/officers/${id}/status`, { Status: newStatus });
      fetchOfficers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddOfficer = async () => {
    if (!formData.Name || !formData.Email || !formData.Department) {
      alert('All fields are required');
      return;
    }
    try {
      setSubmitting(true);
      await axios.post('http://localhost:5000/api/admin/officers', formData);
      setFormData({ Name: '', Email: '', Department: '' });
      setShowForm(false);
      fetchOfficers();
    } catch (err) {
      alert('Error adding officer: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-container">
      <style>{`
        .admin-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
        .main { flex: 1; padding: 20px 40px 40px 20px; display: flex; flex-direction: column; overflow-y: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 30px 0; }
        .header h2 { font-size: 30px; color: #0f172a; font-weight: 800; letter-spacing: -1px; }
        .btn-add { background: #4f46e5; color: white; border: none; padding: 12px 24px; border-radius: 12px; cursor: pointer; font-weight: 700; font-size: 14px; }
        .form-card { background: #ffffff; border-radius: 20px; padding: 28px; margin-bottom: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 16px; align-items: end; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; }
        .form-group input { padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; outline: none; }
        .form-group input:focus { border-color: #4f46e5; }
        .btn-submit { background: #0f172a; color: white; border: none; padding: 12px 24px; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 14px; white-space: nowrap; }
        .table-card { background: #ffffff; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); overflow: hidden; padding: 20px; }
        .data-table { width: 100%; border-collapse: collapse; text-align: left; }
        .data-table th { padding: 16px 20px; font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; }
        .data-table td { padding: 16px 20px; font-size: 14px; color: #0f172a; border-bottom: 1px solid #f1f5f9; }
        .badge { padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; color: white; }
        .badge-active { background: #10b981; }
        .badge-suspended { background: #ef4444; }
        .btn-toggle { background: #0f172a; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px; }
        .state-container { display: flex; justify-content: center; align-items: center; padding: 40px; color: #64748b; font-weight: 600; }
        .error-container { color: #ef4444; }
      `}</style>

      <AdminSidebar />

      <main className="main">
        <header className="header">
          <h2>Manage Officers</h2>
          <button className="btn-add" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add Officer'}
          </button>
        </header>

        {showForm && (
          <div className="form-card">
            <div className="form-group">
              <label>Name</label>
              <input placeholder="Full name" value={formData.Name}
                onChange={e => setFormData({...formData, Name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input placeholder="officer@govt.in" value={formData.Email}
                onChange={e => setFormData({...formData, Email: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input placeholder="e.g. Healthcare" value={formData.Department}
                onChange={e => setFormData({...formData, Department: e.target.value})} />
            </div>
            <button className="btn-submit" onClick={handleAddOfficer} disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Officer'}
            </button>
          </div>
        )}

        {loading ? (
          <div className="state-container">Loading Officers...</div>
        ) : error ? (
          <div className="state-container error-container">Error: {error}</div>
        ) : officers.length === 0 ? (
          <div className="state-container">No officers found.</div>
        ) : (
          <section className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {officers.map(officer => (
                  <tr key={officer.OfficerID}>
                    <td style={{ fontWeight: '700' }}>{officer.Name}</td>
                    <td>{officer.Email}</td>
                    <td>{officer.Department}</td>
                    <td>
                      <span className={`badge ${officer.Status === 'Active' ? 'badge-active' : 'badge-suspended'}`}>
                        {officer.Status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-toggle"
                        onClick={() => handleStatusChange(officer.OfficerID, officer.Status)}>
                        {officer.Status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  );
};

export default ManageOfficers;