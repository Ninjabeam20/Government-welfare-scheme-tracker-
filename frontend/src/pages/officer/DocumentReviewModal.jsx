import React from 'react';

const DocumentReviewModal = ({ app, onClose, onAction }) => {
  if (!app) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <style>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.3); backdrop-filter: blur(6px);
          display: flex; justify-content: center; align-items: center;
          z-index: 1000; animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .modal-content {
          background: #ffffff; width: 800px; max-width: 95%; max-height: 90vh;
          border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          display: flex; flex-direction: column; overflow: hidden;
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        
        .modal-header {
          padding: 24px 30px; border-bottom: 1px solid #f1f5f9;
          display: flex; justify-content: space-between; align-items: center;
        }
        .modal-header h3 { color: #0f172a; font-size: 20px; font-weight: 800; }
        .close-btn { background: #f1f5f9; border: none; width: 36px; height: 36px; border-radius: 50%; font-size: 16px; cursor: pointer; color: #64748b; transition: 0.2s; }
        .close-btn:hover { background: #e2e8f0; color: #0f172a; }

        .modal-body { padding: 30px; overflow-y: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        
        .info-group { margin-bottom: 20px; }
        .info-group label { display: block; font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .info-group p { font-size: 16px; color: #0f172a; font-weight: 600; background: #f8fafc; padding: 12px; border-radius: 12px; border: 1px solid #e2e8f0; }

        .doc-preview {
          background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 16px;
          height: 140px; display: flex; flex-direction: column; justify-content: center; align-items: center;
          color: #64748b; font-weight: 500; margin-bottom: 16px; transition: 0.3s; cursor: pointer;
        }
        .doc-preview:hover { border-color: #3b82f6; background: #eff6ff; color: #3b82f6; }
        
        .modal-footer {
          padding: 24px 30px; background: #f8fafc; border-top: 1px solid #f1f5f9;
          display: flex; justify-content: flex-end; gap: 16px;
        }
        
        .btn { padding: 12px 24px; border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; border: none; transition: 0.3s; }
        .btn-reject { background: #fee2e2; color: #ef4444; }
        .btn-reject:hover { background: #fca5a5; color: #991b1b; }
        .btn-approve { background: #10b981; color: #ffffff; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2); }
        .btn-approve:hover { background: #059669; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3); }
      `}</style>

      {/* Stop click event from bubbling up to the overlay so clicking inside doesn't close it */}
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Document Verification</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Reviewing App: {app.id}</p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Left Side: Extracted Data */}
          <div>
            <h4 style={{ marginBottom: '16px', color: '#0f172a' }}>Applicant Details</h4>
            <div className="info-group">
              <label>Full Name</label>
              <p>{app.name}</p>
            </div>
            <div className="info-group">
              <label>Applied Scheme</label>
              <p>{app.scheme}</p>
            </div>
            <div className="info-group">
              <label>Declared Income</label>
              <p>₹ {app.income || '1,20,000'} / year</p>
            </div>
            <div className="info-group">
              <label>Aadhaar Number (eKYC)</label>
              <p>XXXX - XXXX - {Math.floor(1000 + Math.random() * 9000)} <span style={{ color: '#10b981', fontSize: '12px', marginLeft: '8px' }}>✓ Verified</span></p>
            </div>
          </div>

          {/* Right Side: Uploaded Documents */}
          <div>
            <h4 style={{ marginBottom: '16px', color: '#0f172a' }}>Uploaded Documents</h4>
            
            <div className="doc-preview">
              <span style={{ fontSize: '24px', marginBottom: '8px' }}>📄</span>
              Aadhaar Card (Front & Back).pdf
            </div>

            <div className="doc-preview">
              <span style={{ fontSize: '24px', marginBottom: '8px' }}>📑</span>
              Income_Certificate_2025.jpeg
            </div>
            
            <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center' }}>
              Click documents to view in full screen.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-reject" onClick={() => onAction(app.id, 'Rejected')}>
            Reject Application
          </button>
          <button className="btn btn-approve" onClick={() => onAction(app.id, 'Approved')}>
            Approve & Route to DBT
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentReviewModal;