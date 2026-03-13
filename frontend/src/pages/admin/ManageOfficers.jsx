import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageOfficers = () => {
  const navigate = useNavigate();

  // Mock data for Officers
  const [officers, setOfficers] = useState([
    { id: 'OFF-101', name: 'Aarti Sharma', dept: 'Healthcare Dept', scheme: 'Senior Citizen Pension Scheme', status: 'Active', recentAction: 'Approved APP-2026-8821 (1hr ago)' },
    { id: 'OFF-102', name: 'Rajesh Kumar', dept: 'Education Dept', scheme: 'Student Scholarship Program', status: 'Active', recentAction: 'Rejected eKYC for Aadhaar Mismatch (3hrs ago)' },
    { id: 'OFF-103', name: 'Vikram Singh', dept: 'Rural Development', scheme: 'Kisan Housing Grant', status: 'Suspended', recentAction: 'Logged out (2 days ago)' },
  ]);

  const [selectedOfficer, setSelectedOfficer] = useState(null);

  const handleStatusChange = (newStatus) => {
    setOfficers(officers.map(o => o.id === selectedOfficer.id ? { ...o, status: newStatus } : o));
    setSelectedOfficer({ ...selectedOfficer, status: newStatus });
  };

  return (
    <div className="admin-container">
      {/* FLUENT UI STYLES */}
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

        .table-card { background: #ffffff; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); overflow: hidden; padding: 20px; }
        .data-table { width: 100%; border-collapse: collapse; text-align: left; }
        .data-table th { padding: 16px 20px; font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; }
        .data-table td { padding: 16px 20px; font-size: 14px; color: #0f172a; border-bottom: 1px solid #f1f5f9; cursor: pointer; transition: background 0.2s; }
        .data-table tr:hover td { background: #f8fafc; color: #4f46e5; }
        
        .badge-active { background: #ecfdf5; color: #10b981; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; }
        .badge-suspended { background: #fef2f2; color: #ef4444; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; }
        .badge-terminated { background: #f1f5f9; color: #64748b; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; }
        
        .recent-msg { font-family: monospace; color: #64748b; background: #f8fafc; padding: 6px 10px; border-radius: 6px; font-size: 13px; }

        /* Modal Styles */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s; }
        .modal-content { background: white; padding: 32px; border-radius: 24px; width: 100%; max-width: 550px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); animation: slideUp 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        .btn-action { padding: 12px 20px; border: none; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; text-align: center; }
        .btn-outline { background: white; border: 1px solid #cbd5e1; color: #0f172a; }
        .btn-outline:hover { background: #f8fafc; border-color: #94a3b8; }
        .btn-blue { background: #eff6ff; color: #2563eb; }
        .btn-blue:hover { background: #dbeafe; }
        
        .select-status { padding: 12px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 600; outline: none; background: #f8fafc; cursor: pointer; }
      `}</style>

      <aside className="sidebar">
        <div className="logo">AdminPortal.</div>
        <nav>
          <div className="nav-link" onClick={() => navigate('/admin')}><span>✨</span> Dashboard Overview</div>
          <div className="nav-link" onClick={() => navigate('/admin/schemes')}><span>🗂️</span> Manage Schemes</div>
          <div className="nav-link active" onClick={() => navigate('/admin/officers')}><span>👮‍♂️</span> Manage Officers</div>
          <div className="nav-link" onClick={() => navigate('/admin/audits')}><span>🛡️</span> System Audit Logs</div>
          <div className="nav-link"><span>📊</span> Fiscal Predictability</div>
        </nav>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <h2>Manage Officers</h2>
            <p style={{ color: '#64748b', fontWeight: '500', marginTop: '5px' }}>Oversee verifying officers and department access.</p>
          </div>
          <button className="btn-action btn-blue">+ Add New Officer</button>
        </header>

        <section className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Officer Details</th>
                <th>Department</th>
                <th>Assigned Scheme</th>
                <th>Status</th>
                <th>Most Recent Action</th>
              </tr>
            </thead>
            <tbody>
              {officers.map((officer) => (
                <tr key={officer.id} onClick={() => setSelectedOfficer(officer)}>
                  <td>
                    <div style={{ fontWeight: '700' }}>{officer.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{officer.id}</div>
                  </td>
                  <td>{officer.dept}</td>
                  <td>{officer.scheme}</td>
                  <td>
                    <span className={`badge-${officer.status.toLowerCase()}`}>{officer.status}</span>
                  </td>
                  <td><span className="recent-msg">{officer.recentAction}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* OFFICER DETAILS MODAL */}
      {selectedOfficer && (
        <div className="modal-overlay" onClick={() => setSelectedOfficer(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '24px', color: '#0f172a', fontWeight: '800' }}>{selectedOfficer.name}</h3>
                <p style={{ color: '#64748b', fontWeight: '500' }}>Officer ID: {selectedOfficer.id}</p>
              </div>
              <button onClick={() => setSelectedOfficer(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#64748b' }}>✕</button>
            </div>
            
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
              <div style={{ marginBottom: '12px' }}><strong>Department:</strong> <span style={{ color: '#4b5563' }}>{selectedOfficer.dept}</span></div>
              <div style={{ marginBottom: '12px' }}><strong>Assigned Scheme:</strong> <span style={{ color: '#4b5563' }}>{selectedOfficer.scheme}</span></div>
              <div><strong>Latest Activity:</strong> <span className="recent-msg" style={{ marginLeft: '10px' }}>{selectedOfficer.recentAction}</span></div>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Change System Access Status:</label>
              <select 
                className="select-status" 
                value={selectedOfficer.status} 
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="Active">🟢 Active (Full Access)</option>
                <option value="Suspended">🟡 Suspended (Read-Only)</option>
                <option value="Terminated">🔴 Terminated (Revoke Access)</option>
              </select>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button className="btn-action btn-outline" style={{ flex: 1 }}>Edit Details</button>
                <button className="btn-action btn-blue" style={{ flex: 1 }}>View All Actions</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOfficers;