import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CitizenSidebar from './CitizenSidebar';

const MyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [uploadForm, setUploadForm] = useState({ type: '', file: null });
  const [uploading, setUploading] = useState(false);
  const [beneficiaryId, setBeneficiaryId] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const meRes = await axios.get('http://localhost:5000/auth/me', { withCredentials: true });
        const uid = meRes.data.userId;
        setBeneficiaryId(uid);
        const docsRes = await axios.get(`http://localhost:5000/api/citizen/documents/${uid}`);
        setDocuments(docsRes.data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file || !uploadForm.type) return alert('Please fill all fields');
    const formData = new FormData();
    formData.append('file', uploadForm.file);
    formData.append('beneficiaryId', beneficiaryId);
    formData.append('docType', uploadForm.type);
    try {
      setUploading(true);
      await axios.post('http://localhost:5000/api/citizen/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const docsRes = await axios.get(`http://localhost:5000/api/citizen/documents/${beneficiaryId}`);
      setDocuments(docsRes.data);
      setUploadForm({ type: '', file: null });
      setIsUploadOpen(false);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Approved') return '#10b981';
    if (status === 'Pending') return '#f59e0b';
    if (status === 'Rejected') return '#ef4444';
    return '#64748b';
  };

  const getPreviewUrl = (filePath) => `http://localhost:5000/uploads/${filePath}`;
  const isImage = (fileName) => /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
  const isPDF = (fileName) => /\.pdf$/i.test(fileName);

  const handleDownload = (filePath, fileName) => {
    const link = document.createElement('a');
    link.href = getPreviewUrl(filePath);
    link.download = fileName;
    link.click();
  };

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
        .main { flex: 1; padding: 20px 40px 40px 20px; display: flex; flex-direction: column; overflow-y: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 30px 0; }
        .header h2 { font-size: 30px; color: #0f172a; font-weight: 800; letter-spacing: -1px; }
        .btn-primary { padding: 12px 24px; background: #2563eb; color: white; border: none; border-radius: 14px; font-size: 15px; font-weight: 600; cursor: pointer; }
        .doc-list { background: #ffffff; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); overflow: hidden; }
        .doc-item { display: flex; justify-content: space-between; align-items: center; padding: 20px 30px; border-bottom: 1px solid #f1f5f9; transition: background 0.2s; }
        .doc-item:hover { background: #f8fafc; }
        .doc-item:last-child { border-bottom: none; }
        .doc-info { display: flex; align-items: center; gap: 16px; }
        .doc-icon { width: 48px; height: 48px; background: #eff6ff; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .doc-type { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
        .doc-name { font-size: 14px; color: #2563eb; font-weight: 500; cursor: pointer; }
        .doc-name:hover { text-decoration: underline; }
        .doc-date { font-size: 13px; color: #94a3b8; margin-top: 4px; }
        .doc-right { display: flex; align-items: center; gap: 12px; }
        .status-badge { padding: 8px 16px; border-radius: 12px; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; }
        .btn-preview { padding: 8px 16px; background: #f1f5f9; border: none; border-radius: 10px; cursor: pointer; font-size: 13px; font-weight: 600; color: #334155; }
        .btn-preview:hover { background: #e2e8f0; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; }
        .modal-content { background: white; padding: 32px; border-radius: 24px; width: 100%; max-width: 520px; box-shadow: 0 25px 50px rgba(0,0,0,0.25); }
        .preview-modal { max-width: 800px; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .close-btn { background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; cursor: pointer; }
        .form-control { width: 100%; padding: 14px 16px; border-radius: 12px; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 15px; margin-bottom: 20px; outline: none; box-sizing: border-box; }
        .file-box { border: 2px dashed #cbd5e1; padding: 40px 20px; border-radius: 16px; text-align: center; background: #f8fafc; cursor: pointer; margin-bottom: 24px; position: relative; }
        .file-box input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
      `}</style>

      <CitizenSidebar />

      <main className="main">
        <header className="header">
          <div>
            <h2>My Documents & eKYC</h2>
            <p style={{ color: '#64748b', fontWeight: '500', marginTop: '5px' }}>
              Manage your identity and income proofs.
            </p>
          </div>
          <button className="btn-primary" onClick={() => setIsUploadOpen(true)}>
            + Upload Document
          </button>
        </header>

        {loading ? (
          <p style={{ color: '#64748b' }}>Loading documents...</p>
        ) : (
          <section className="doc-list">
            {documents.length === 0 ? (
              <p style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                No documents uploaded yet.
              </p>
            ) : (
              documents.map(doc => (
                <div className="doc-item" key={doc.DocID}>
                  <div className="doc-info">
                    <div className="doc-icon">📄</div>
                    <div>
                      <div className="doc-type">{doc.DocType}</div>
                      <div className="doc-name" onClick={() => setPreviewDoc(doc)}>
                        {doc.FileName}
                      </div>
                      <div className="doc-date">
                        Uploaded: {new Date(doc.UploadedOn).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="doc-right">
                    <button className="btn-preview" onClick={() => setPreviewDoc(doc)}>
                      👁 Preview
                    </button>
                    <button
                      className="btn-preview"
                      onClick={() => handleDownload(doc.FilePath, doc.FileName)}
                    >
                      ⬇ Download
                    </button>
                    <div
                      className="status-badge"
                      style={{
                        backgroundColor: `${getStatusColor(doc.Status)}15`,
                        color: getStatusColor(doc.Status)
                      }}
                    >
                      <span style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        backgroundColor: getStatusColor(doc.Status),
                        display: 'inline-block'
                      }}></span>
                      {doc.Status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        )}
      </main>

      {isUploadOpen && (
        <div className="modal-overlay" onClick={() => setIsUploadOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '20px', color: '#0f172a' }}>Upload New Document</h3>
              <button className="close-btn" onClick={() => setIsUploadOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleUpload}>
              <select
                className="form-control"
                value={uploadForm.type}
                onChange={e => setUploadForm({ ...uploadForm, type: e.target.value })}
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
                  {uploadForm.file ? uploadForm.file.name : 'Click to browse or drag file here'}
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>PDF, JPG, PNG (Max 5MB)</div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={e => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                  required
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Secure Upload'}
              </button>
            </form>
          </div>
        </div>
      )}

      {previewDoc && (
        <div className="modal-overlay" onClick={() => setPreviewDoc(null)}>
          <div className="modal-content preview-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '20px', color: '#0f172a' }}>
                {previewDoc.DocType} — {previewDoc.FileName}
              </h3>
              <button className="close-btn" onClick={() => setPreviewDoc(null)}>✕</button>
            </div>
            {isImage(previewDoc.FileName) ? (
              <img
                src={getPreviewUrl(previewDoc.FilePath)}
                alt={previewDoc.DocType}
                style={{ width: '100%', borderRadius: '12px', objectFit: 'contain' }}
              />
            ) : isPDF(previewDoc.FileName) ? (
              <iframe
                src={getPreviewUrl(previewDoc.FilePath)}
                style={{ width: '100%', height: '500px', borderRadius: '12px', border: 'none' }}
                title={previewDoc.DocType}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
                <p>Preview not available for this file type.</p>
                <button
                  className="btn-primary"
                  style={{ marginTop: '16px' }}
                  onClick={() => handleDownload(previewDoc.FilePath, previewDoc.FileName)}
                >
                  Download File
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDocuments;
