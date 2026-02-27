import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyDocuments = () => {
  const navigate = useNavigate();

  // 1. Initial Mock Data (Simulating a database fetch)
  const [documents, setDocuments] = useState([
    { id: 1, type: 'Aadhaar Card', name: 'Aadhaar_Front_Back.pdf', status: 'Approved', date: '2026-02-15' },
    { id: 2, type: 'Income Certificate', name: 'Income_Proof_2026.pdf', status: 'Pending', date: '2026-02-26' },
    { id: 3, type: 'Bank Passbook', name: 'SBI_Passbook.jpg', status: 'Rejected', date: '2026-02-10' }
  ].sort((a, b) => new Date(b.date) - new Date(a.date))); // Sorted chronologically (newest first)

  // 2. Modal States
  const[isUploadOpen, setIsUploadOpen] = useState(false);
  const [viewDoc, setViewDoc] = useState(null); // Holds the doc being viewed

  // 3. Form State for new upload
  const[uploadForm, setUploadForm] = useState({ type: '', file: null });

  // Handle new document submission
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadForm.file || !uploadForm.type) return alert("Please fill all fields");

    const newDoc = {
      id: Date.now(),
      type: uploadForm.type,
      name: uploadForm.file.name,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0] // Current Date (YYYY-MM-DD)
    };

    // Add new doc and re-sort chronologically
    const updatedDocs = [newDoc, ...documents].sort((a, b) => new Date(b.date) - new Date(a.date));
    setDocuments(updatedDocs);
    
    // Reset and close modal
    setUploadForm({ type: '', file: null });
    setIsUploadOpen(false);
  };

  const getStatusColor = (status) => {
    if (status === 'Approved') return '#10b981'; // Green
    if (status === 'Pending') return '#f59e0b';  // Yellow
    if (status === 'Rejected') return '#ef4444'; // Red
    return '#64748b';
  };

  return (
    <div className="dashboard-container">
      {/* FLUENT UI STYLES */}
      <style>{`
        .dashboard-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
        .sidebar { width: 280px; background: #ffffff; margin: 20px; border-radius: 24px; padding: 30px 20px; display: flex; flex-direction: column; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06); }
        .logo { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 40px; padding-left: 10px; letter-spacing: -0.5px; }
        .nav-link { padding: 14px 20px; color: #64748b; font-weight: 600; border-radius: 16px; transition: all 0.3s ease; margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; gap: 12px; }
        .nav-link:hover { background: #f8fafc; color: #0f172a; transform: translateX(6px); }
        .nav-link.active { background: #2563eb; color: #ffffff; box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25); }

        .main { flex: 1; padding: 20px 40px 40px 20px; display: flex; flex-direction: column; overflow-y: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 30px 0; }
        .header h2 { font-size: 30px; color: #0f172a; font-weight: 800; letter-spacing: -1px; }

        .btn-primary { padding: 12px 24px; background: #2563eb; color: white; border: none; border-radius: 14px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }
        .btn-primary:hover { background: #1d4ed8; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3); }

        .doc-list { background: #ffffff; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); overflow: hidden; }
        .doc-item { display: flex; justify-content: space-between; align-items: center; padding: 20px 30px; border-bottom: 1px solid #f1f5f9; transition: background 0.2s; }
        .doc-item:hover { background: #f8fafc; }
        .doc-item:last-child { border-bottom: none; }
        
        .doc-info { display: flex; align-items: center; gap: 16px; }
        .doc-icon { width: 48px; height: 48px; background: #eff6ff; color: #2563eb; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .doc-type { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
        .doc-name { font-size: 14px; color: #64748b; font-weight: 500; cursor: pointer; transition: color 0.2s; }
        .doc-name:hover { color: #2563eb; text-decoration: underline; }
        .doc-date { font-size: 13px; color: #94a3b8; margin-top: 4px; }

        .status-badge { padding: 8px 16px; border-radius: 12px; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; }

        /* Smooth Modals */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s ease-out; }
        .modal-content { background: white; padding: 32px; border-radius: 24px; width: 100%; max-width: 500px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .close-btn { background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; cursor: pointer; color: #64748b; transition: all 0.2s; }
        .close-btn:hover { background: #e2e8f0; color: #0f172a; }

        .form-control { width: 100%; padding: 14px 16px; border-radius: 12px; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 15px; margin-bottom: 20px; outline: none; transition: all 0.2s; }
        .form-control:focus { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); background: white; }
        
        .file-box { border: 2px dashed #cbd5e1; padding: 40px 20px; border-radius: 16px; text-align: center; background: #f8fafc; cursor: pointer; transition: all 0.2s; margin-bottom: 24px; position: relative; }
        .file-box:hover { border-color: #2563eb; background: #eff6ff; }
        .file-box input { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
      `}</style>

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo">WelfarePortal.</div>
        <nav>
          <div className="nav-link" onClick={() => navigate('/')}><span>🏠</span> Dashboard</div>
          <div className="nav-link" onClick={() => navigate('/citizen/schemes')}><span>📄</span> Apply for Schemes</div>
          <div className="nav-link" onClick={() => navigate('/citizen/track')}><span>📊</span> Track Status</div>
          <div className="nav-link active" onClick={() => navigate('/citizen/documents')}><span>📁</span> My Documents</div>
          <div className="nav-link"><span>🎧</span> Grievance Support</div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main">
        <header className="header">
          <div>
            <h2>My Documents & eKYC</h2>
            <p style={{ color: '#64748b', fontWeight: '500', marginTop: '5px' }}>Manage your identity and income proofs.</p>
          </div>
          <button className="btn-primary" onClick={() => setIsUploadOpen(true)}>
            + Upload Document
          </button>
        </header>

        <section className="doc-list">
          {documents.map(doc => (
            <div className="doc-item" key={doc.id}>
              <div className="doc-info">
                <div className="doc-icon">📄</div>
                <div>
                  <div className="doc-type">{doc.type}</div>
                  {/* Clickable name to view document popup */}
                  <div className="doc-name" onClick={() => setViewDoc(doc)}>
                    {doc.name}
                  </div>
                  <div className="doc-date">Uploaded: {doc.date}</div>
                </div>
              </div>
              
              <div className="status-badge" style={{ backgroundColor: `${getStatusColor(doc.status)}15`, color: getStatusColor(doc.status) }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getStatusColor(doc.status) }}></span>
                {doc.status}
              </div>
            </div>
          ))}
          {documents.length === 0 && <p style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>No documents uploaded yet.</p>}
        </section>
      </main>

      {/* MODAL 1: Upload Document */}
      {isUploadOpen && (
        <div className="modal-overlay" onClick={() => setIsUploadOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '20px', color: '#0f172a' }}>Upload New Document</h3>
              <button className="close-btn" onClick={() => setIsUploadOpen(false)}>✕</button>
            </div>
            
            <form onSubmit={handleUploadSubmit}>
              <select 
                className="form-control" 
                value={uploadForm.type}
                onChange={e => setUploadForm({...uploadForm, type: e.target.value})}
                required
              >
                <option value="">Select Document Type...</option>
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="PAN Card">PAN Card</option>
                <option value="Income Certificate">Income Certificate</option>
                <option value="Caste Certificate">Caste/Social Category Certificate</option>
              </select>

              <div className="file-box">
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>📁</div>
                <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>
                  {uploadForm.file ? uploadForm.file.name : "Click to browse or drag file here"}
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>PDF, JPG, PNG (Max 5MB)</div>
                <input 
                  type="file" 
                  onChange={e => setUploadForm({...uploadForm, file: e.target.files[0]})}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Secure Upload</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: View Document Preview */}
      {viewDoc && (
        <div className="modal-overlay" onClick={() => setViewDoc(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '20px', color: '#0f172a' }}>Document Preview: {viewDoc.type}</h3>
              <button className="close-btn" onClick={() => setViewDoc(null)}>✕</button>
            </div>
            
            <div style={{ background: '#f8fafc', borderRadius: '16px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', flexDirection: 'column' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>📄</div>
              <p style={{ color: '#64748b', fontWeight: '500' }}>{viewDoc.name}</p>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '10px' }}>
                (Document preview placeholder. Actual file rendering will happen when backend is connected.)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDocuments; 