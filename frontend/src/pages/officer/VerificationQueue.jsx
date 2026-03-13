import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VerificationQueue = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch live data from teammate's API
  useEffect(() => {
    axios.get('http://localhost:5000/api/officer/applications/pending')
      .then(res => {
        setApplications(res.data);
        setLoading(false);
      })
      .catch(err => console.error("API Error:", err));
  }, []);

  const handleAction = (id, status) => {
    axios.patch(`http://localhost:5000/api/officer/applications/${id}/status`, { status })
      .then(() => {
        alert(`Application ${status}!`);
        setApplications(applications.filter(app => app.id !== id)); // Remove from queue
      });
  };

  if (loading) return <p style={{ padding: '20px' }}>Loading Verification Queue...</p>;

  return (
    <div style={{ background: '#fff', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '13px' }}>
            <th style={{ padding: '15px' }}>APPLICANT</th>
            <th>SCHEME</th>
            <th>INCOME</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '15px', fontWeight: '700' }}>{app.name}</td>
              <td style={{ color: '#4b5563' }}>{app.scheme}</td>
              <td style={{ color: '#10b981', fontWeight: '600' }}>₹{app.income}</td>
              <td><span style={{ padding: '4px 10px', background: '#eff6ff', color: '#2563eb', borderRadius: '8px', fontSize: '12px' }}>{app.status}</span></td>
              <td>
                <button onClick={() => handleAction(app.id, 'Approved')} style={{ color: '#10b981', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', marginRight: '15px' }}>Approve</button>
                <button onClick={() => handleAction(app.id, 'Rejected')} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerificationQueue;