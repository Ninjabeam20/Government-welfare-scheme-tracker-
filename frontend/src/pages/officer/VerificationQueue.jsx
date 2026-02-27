import React, { useState } from 'react';
import DocumentReviewModal from './DocumentReviewModal';

const VerificationQueue = () => {
  // Mock data representing pending applications
  const[pendingApps, setPendingApps] = useState([
    { id: 'APP-101', name: 'Rahul Sharma', scheme: 'Education Scholarship', date: '26 Feb 2026', status: 'Pending eKYC', income: '85,000' },
    { id: 'APP-102', name: 'Priya Patel', scheme: 'Senior Citizen Pension', date: '25 Feb 2026', status: 'Pending Review', income: '45,000' },
    { id: 'APP-103', name: 'Amit Singh', scheme: 'Housing Grant', date: '24 Feb 2026', status: 'Flagged (Duplicate)', income: '2,10,000' },
  ]);

  // State to hold the currently selected application for the Modal
  const[selectedApp, setSelectedApp] = useState(null);

  // Handle Approve/Reject action from the Modal
  const handleAction = (appId, actionType) => {
    alert(`Application ${appId} has been ${actionType}!`);
    
    // Remove the reviewed application from the queue to simulate workflow
    setPendingApps(pendingApps.filter(app => app.id !== appId));
    
    // Close the modal
    setSelectedApp(null);
  };

  return (
    <div className="queue-container">
      <style>{`
        .queue-container { background: #ffffff; border-radius: 24px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .queue-header { margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
        .queue-header h3 { color: #0f172a; font-size: 20px; font-weight: 700; }
        
        .modern-table { width: 100%; border-collapse: collapse; text-align: left; }
        .modern-table th { padding: 16px; background: #f8fafc; color: #64748b; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
        .modern-table th:first-child { border-top-left-radius: 12px; border-bottom-left-radius: 12px; }
        .modern-table th:last-child { border-top-right-radius: 12px; border-bottom-right-radius: 12px; }
        
        .modern-table td { padding: 16px; color: #334155; font-weight: 500; border-bottom: 1px solid #f1f5f9; }
        .modern-table tr:hover td { background: #f8fafc; }
        
        .status-badge { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; display: inline-block; }
        .status-pending { background: #fef3c7; color: #d97706; }
        .status-review { background: #e0e7ff; color: #4338ca; }
        .status-flagged { background: #fee2e2; color: #ef4444; }

        .btn-review {
          padding: 8px 16px; background: #10b981; color: white; border: none; 
          border-radius: 10px; font-weight: 600; cursor: pointer; transition: 0.3s;
        }
        .btn-review:hover { background: #059669; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2); transform: scale(1.05); }
      `}</style>

      <div className="queue-header">
        <h3>Applications Awaiting Verification</h3>
        <span style={{ color: '#64748b', fontWeight: '500' }}>{pendingApps.length} Remaining</span>
      </div>

      <table className="modern-table">
        <thead>
          <tr>
            <th>App ID</th>
            <th>Applicant Name</th>
            <th>Welfare Scheme</th>
            <th>Date Applied</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingApps.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                🎉 All caught up! No applications pending verification.
              </td>
            </tr>
          ) : (
            pendingApps.map((app) => (
              <tr key={app.id}>
                <td style={{ fontWeight: '700', color: '#0f172a' }}>{app.id}</td>
                <td>{app.name}</td>
                <td>{app.scheme}</td>
                <td>{app.date}</td>
                <td>
                  <span className={`status-badge ${
                    app.status.includes('eKYC') ? 'status-pending' : 
                    app.status.includes('Flagged') ? 'status-flagged' : 'status-review'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td>
                  <button className="btn-review" onClick={() => setSelectedApp(app)}>
                    Review
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* The Review Modal - Renders only if an app is selected */}
      <DocumentReviewModal 
        app={selectedApp} 
        onClose={() => setSelectedApp(null)} 
        onAction={handleAction}
      />
    </div>
  );
};

export default VerificationQueue;