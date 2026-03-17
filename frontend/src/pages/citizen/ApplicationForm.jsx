import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ApplicationForm = () => {
  const navigate = useNavigate();
  const { schemeId } = useParams(); // Gets the scheme ID from the URL

  // Mock state for the form
  const [formData, setFormData] = useState({
    applicantName: '',
    aadhaarNumber: '',
    annualIncome: '',
    category: 'General',
    document: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Application Submitted Successfully! It is now 'Under Review' by the Welfare Officer.");
    navigate('/'); // Route back to dashboard after applying
  };

  return (
    <div className="dashboard-container">
      {/* FLUENT UI STYLES - Consistent Blue Theme */}
      <style>{`
        .dashboard-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
        
        .sidebar { width: 280px; background: #ffffff; margin: 20px; border-radius: 24px; padding: 30px 20px; display: flex; flex-direction: column; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06); }
        .logo { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 40px; padding-left: 10px; letter-spacing: -0.5px; }
        
        .nav-link { padding: 14px 20px; color: #64748b; font-weight: 600; border-radius: 16px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; gap: 12px; }
        .nav-link:hover { background: #f8fafc; color: #0f172a; transform: translateX(6px); }
        .nav-link.active { background: #2563eb; color: #ffffff; box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25); }

        .main { flex: 1; padding: 20px 40px 40px 20px; display: flex; flex-direction: column; overflow-y: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 30px 0; }
        .header h2 { font-size: 30px; color: #0f172a; font-weight: 800; letter-spacing: -1px; }
        .back-btn { background: none; border: none; color: #64748b; font-size: 15px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: color 0.2s; }
        .back-btn:hover { color: #0f172a; }

        .form-card { background: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); max-width: 800px; width: 100%; }
        .form-group { margin-bottom: 24px; }
        .form-label { display: block; font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 8px; }
        
        .form-control { width: 100%; padding: 14px 16px; border-radius: 12px; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 15px; color: #0f172a; transition: all 0.3s ease; outline: none; }
        .form-control:focus { background: #ffffff; border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
        
        .file-upload-box { border: 2px dashed #cbd5e1; padding: 30px; border-radius: 16px; text-align: center; cursor: pointer; background: #f8fafc; transition: all 0.3s; }
        .file-upload-box:hover { border-color: #2563eb; background: #eff6ff; }
        
        .submit-btn { margin-top: 10px; padding: 16px; width: 100%; border: none; background: #2563eb; color: white; border-radius: 16px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
        .submit-btn:hover { background: #1d4ed8; box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3); transform: translateY(-2px); }
      `}</style>

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo">WelfarePortal.</div>
        <nav>
          <div className="nav-link" onClick={() => navigate('/')}><span>🏠</span> Dashboard</div>
          <div className="nav-link active" onClick={() => navigate('/citizen/schemes')}><span>📄</span> Apply for Schemes</div>
          <div className="nav-link" onClick={() => navigate('/citizen/track')}><span>📊</span> Track Status</div>
          <div className="nav-link" onClick={() => navigate('/citizen/documents')}><span>📁</span> My Documents</div>
          <div className="nav-link"><span>🎧</span> Grievance Support</div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main">
        <header className="header">
          <div>
            <button className="back-btn" onClick={() => navigate('/citizen/schemes')}>
              ← Back to Schemes
            </button>
            <h2 style={{ marginTop: '10px' }}>Scheme Application Form</h2>
          </div>
        </header>

        <section className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Applicant Full Name</label>
              <input type="text" className="form-control" placeholder="Enter as per Aadhaar" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Aadhaar Number</label>
                <input type="text" className="form-control" placeholder="12-digit number" required maxLength="12" />
              </div>

              <div className="form-group">
                <label className="form-label">Annual Family Income (₹)</label>
                <input type="number" className="form-control" placeholder="e.g. 50000" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Social Category</label>
              <select className="form-control" required>
                <option value="">Select Category</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Upload Income Certificate / eKYC Document (PDF/JPG)</label>
              <div className="file-upload-box">
                <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
                  📁 Click to browse or drag and drop your file here
                </p>
                <input type="file" style={{ opacity: 0, position: 'absolute', width: '10px' }} required />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Submit Application
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default ApplicationForm;