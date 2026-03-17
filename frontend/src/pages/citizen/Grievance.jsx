import React, { useState } from 'react';
import axios from 'axios';
import CitizenSidebar from './CitizenSidebar';

const Grievance = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await axios.post('http://localhost:5000/api/citizen/grievance', {
        citizen_id: 1, // Hardcoded for now
        subject,
        description
      });
      setSuccessMsg('Your grievance has been successfully submitted and will be reviewed shortly.');
      setSubject('');
      setDescription('');
    } catch (err) {
      console.error('Error submitting grievance:', err);
      setErrorMsg('Failed to submit grievance. Please try again later.');
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
        .form-card { background: #ffffff; padding: 40px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); max-width: 600px; width: 100%; }
        .form-group { margin-bottom: 20px; }
        .form-label { display: block; font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 8px; }
        .form-control { width: 100%; padding: 14px 20px; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 15px; outline: none; transition: box-shadow 0.3s; background: #f8fafc; }
        .form-control:focus { box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2); border-color: #2563eb; background: #ffffff; }
        textarea.form-control { resize: vertical; min-height: 120px; }
        .submit-btn { padding: 14px 20px; width: 100%; border: none; background: #2563eb; color: white; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
        .submit-btn:hover { background: #1d4ed8; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); }
        .submit-btn:disabled { background: #94a3b8; cursor: not-allowed; box-shadow: none; }
        .success-msg { padding: 14px 20px; background: #dcfce7; color: #166534; border-radius: 12px; font-weight: 500; font-size: 14px; margin-bottom: 20px; }
        .error-msg { padding: 14px 20px; background: #fee2e2; color: #991b1b; border-radius: 12px; font-weight: 500; font-size: 14px; margin-bottom: 20px; }
      `}</style>

      <CitizenSidebar />

      <main className="main">
        <header className="header">
          <h2>Grievance Support</h2>
        </header>

        <div className="form-card">
          {successMsg && <div className="success-msg">{successMsg}</div>}
          {errorMsg && <div className="error-msg">{errorMsg}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Enter the subject of your grievance" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                className="form-control" 
                placeholder="Describe your issue in detail..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Grievance'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Grievance;