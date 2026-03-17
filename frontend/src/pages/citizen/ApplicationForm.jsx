import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CitizenSidebar from './CitizenSidebar';

const ApplicationForm = () => {
  const navigate = useNavigate();
  const { schemeId } = useParams();

  const [formData, setFormData] = useState({
    applicantName: '',
    aadhaarNumber: '',
    annualIncome: '',
    category: 'General',
    document: null
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/citizen/apply', {
        citizen_id: 1,
        scheme_id: schemeId
      });
      navigate('/citizen/track');
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container { display: flex; height: 100vh; width: 100vw; background-color: #f1f5f9; }
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
        .file-upload-box { border: 2px dashed #cbd5e1; padding: 30px; border-radius: 16px; text-align: center; cursor: pointer; background: #f8fafc; transition: all 0.3s; position: relative; overflow: hidden; }
        .file-upload-box:hover { border-color: #2563eb; background: #eff6ff; }
        .submit-btn { margin-top: 10px; padding: 16px; width: 100%; border: none; background: #2563eb; color: white; border-radius: 16px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
        .submit-btn:hover { background: #1d4ed8; box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3); transform: translateY(-2px); }
        .submit-btn:disabled { background: #94a3b8; cursor: not-allowed; transform: none; box-shadow: none; }
      `}</style>

      <CitizenSidebar />

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
                <input type="file" style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }} required />
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default ApplicationForm;