import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VerificationQueue = ({ officerId = 1 }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null);

  useEffect(() => {
    fetchQueue();
  }, [officerId]);

  const fetchQueue = () => {
    setLoading(true);
    setError(null);
    axios.get(`http://localhost:5000/api/officer/queue/${officerId}`)
      .then(res => {
        setApplications(res.data);
      })
      .catch(err => {
        console.error("API Error:", err);
        setError("Failed to load verification queue.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAction = (id, status) => {
    const actionText = status === 'Approved' ? 'approve' : 'reject';
    if (!window.confirm(`Are you sure you want to ${actionText} this application?`)) {
      return;
    }

    const endpoint = status === 'Approved' ? 'approve' : 'reject';

    axios.put(`http://localhost:5000/api/officer/applications/${id}/${endpoint}`)
      .then(() => {
        // Remove from the queue instantly on success
        setApplications(applications.filter(app => app.RecordID !== id));
        if (expandedRowId === id) setExpandedRowId(null);
      })
      .catch(err => {
        console.error("Action Error:", err);
        alert(`Failed to ${actionText} application.`);
      });
  };

  const toggleReview = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  if (loading) return <div style={{ padding: '20px', color: '#64748b', fontWeight: '500' }}>Loading Verification Queue...</div>;
  if (error) return <div style={{ padding: '20px', color: '#ef4444', fontWeight: '500' }}>{error}</div>;

  return (
    <div style={{ background: '#fff', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      {applications.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b', fontWeight: '500' }}>
          No pending applications. You're all caught up!
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '13px' }}>
              <th style={{ padding: '15px' }}>APPLICANT</th>
              <th>SCHEME</th>
              <th>APPLIED ON</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <React.Fragment key={app.RecordID}>
                <tr style={{ borderBottom: expandedRowId === app.RecordID ? 'none' : '1px solid #f1f5f9' }}>
                  <td style={{ padding: '15px', fontWeight: '700' }}>{app.Name}</td>
                  <td style={{ color: '#4b5563' }}>{app.SchemeName}</td>
                  <td style={{ color: '#4b5563' }}>{new Date(app.Applied_on).toLocaleDateString()}</td>
                  <td>
                    <span style={{ padding: '4px 10px', background: '#eff6ff', color: '#2563eb', borderRadius: '8px', fontSize: '12px' }}>
                      {app.Status}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => toggleReview(app.RecordID)} 
                      style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', marginRight: '15px' }}
                    >
                      {expandedRowId === app.RecordID ? 'Close Review' : 'Review'}
                    </button>
                    <button onClick={() => handleAction(app.RecordID, 'Approved')} style={{ color: '#10b981', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', marginRight: '15px' }}>Approve</button>
                    <button onClick={() => handleAction(app.RecordID, 'Rejected')} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }}>Reject</button>
                  </td>
                </tr>
                {expandedRowId === app.RecordID && (
                  <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                    <td colSpan="5" style={{ padding: '20px 15px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', fontSize: '14px' }}>
                        <div><strong>Full Name:</strong> {app.Name}</div>
                        <div><strong>Email:</strong> {app.Email || 'N/A'}</div>
                        <div><strong>Aadhaar:</strong> {app.Aadhaar}</div>
                        <div><strong>Income:</strong> ₹{app.Income?.toLocaleString()}</div>
                        <div><strong>Scheme Applied:</strong> {app.SchemeName}</div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VerificationQueue;