import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ManageOfficers = () => {
  const navigate = useNavigate();
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOfficer, setSelectedOfficer] = useState(null);

  const fetchOfficers = () => {
    axios.get('http://localhost:5000/api/admin/officers')
      .then(res => { setOfficers(res.data); setLoading(false); })
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchOfficers(); }, []);

  const handleStatusChange = (id, newStatus) => {
    // In a real app, we would use a PATCH request. 
    // For now, we simulate the update and alert the user.
    alert(`Status updated to ${newStatus} for Officer ID: ${id}`);
    setOfficers(officers.map(o => o.id === id ? { ...o, status: newStatus } : o));
    setSelectedOfficer(null);
  };

  if (loading) return <div style={{padding: '40px', fontFamily: 'sans-serif'}}>Accessing HR Records...</div>;

  return (
    <div className="admin-container">
      <style>{`
        .admin-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
        .sidebar { width: 280px; background: #ffffff; margin: 20px; border-radius: 24px; padding: 30px 20px; display: flex; flex-direction: column; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06); }
        .logo { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 40px; padding-left: 10px; letter-spacing: -0.5px; }
        .nav-link { padding: 14px 20px; color: #64748b; font-weight: 600; border-radius: 16px; transition: 0.3s; margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; gap: 12px; }
        .nav-link:hover { background: #f8fafc; color: #0f172a; transform: translateX(6px); }
        .nav-link.active { background: #4f46e5; color: #ffffff; box-shadow: 0 8px 20px rgba(79, 70, 229, 0.25); }
        .main { flex: 1; padding: 20px 40px 40px 20px; display: flex; flex-direction: column; overflow-y: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 30px 0; }
        .table-card { background: #ffffff; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); overflow: hidden; padding: 20px; }
        .data-table { width: 100%; border-collapse: collapse; text-align: left; }
        .data-table th { padding: 16px 20px; font-size: 13px; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; }
        .data-table td { padding: 16px 20px; font-size: 14px; border-bottom: 1px solid #f1f5f9; cursor: pointer; }
        .badge { padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; }
        .status-active { background: #ecfdf5; color: #10b981; }
        .status-suspended { background: #fef2f2; color: #ef4444; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); display: flex; align-items: center; justify-content: center; z-index: 100; }
        .modal-content { background: white; padding: 32px; border-radius: 24px; width: 450px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); }
      `}</style>

      <aside className="sidebar">
        <div className="logo">AdminPortal.</div>
        <nav>
          <div className="nav-link" onClick={() => navigate('/admin')}><span>✨</span> Dashboard Overview</div>
          <div className="nav-link" onClick={() => navigate('/admin/schemes')}><span>🗂️</span> Manage Schemes</div>
          <div className="nav-link active" onClick={() => navigate('/admin/officers')}><span>👮‍♂️</span> Manage Officers</div>
          <div className="nav-link" onClick={() => navigate('/admin/audits')}><span>🛡️</span> System Audit Logs</div>
        </nav>
      </aside>

      <main className="main">
        <header className="header">
          <h2>Officer Registry</h2>
        </header>

        <section className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Officer</th>
                <th>Department</th>
                <th>Status</th>
                <th>Recent Action</th>
              </tr>
            </thead>
            <tbody>
              {officers.map(o => (
                <tr key={o.id} onClick={() => setSelectedOfficer(o)}>
                  <td style={{ fontWeight: '700' }}>{o.name}<br/><span style={{fontSize: '11px', color: '#94a3b8'}}>{o.email}</span></td>
                  <td>{o.department}</td>
                  <td><span className={`badge status-${o.status.toLowerCase()}`}>{o.status}</span></td>
                  <td style={{fontFamily: 'monospace', fontSize: '12px'}}>{o.recent_action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {selectedOfficer && (
        <div className="modal-overlay" onClick={() => setSelectedOfficer(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '10px' }}>Modify Officer Status</h3>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>{selectedOfficer.name} ({selectedOfficer.department})</p>
            
            <div style={{ display: 'grid', gap: '10px' }}>
              <button style={{ padding: '12px', background: '#ecfdf5', color: '#10b981', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }} 
                onClick={() => handleStatusChange(selectedOfficer.id, 'Active')}>Set to Active</button>
              <button style={{ padding: '12px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}
                onClick={() => handleStatusChange(selectedOfficer.id, 'Suspended')}>Set to Suspended</button>
              <button style={{ padding: '12px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}
                onClick={() => setSelectedOfficer(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOfficers;