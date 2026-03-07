import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import BrowseSchemes from './pages/citizen/BrowseSchemes';
import ApplicationForm from './pages/citizen/ApplicationForm';
import TrackStatus from './pages/citizen/TrackStatus';
import TrackDetails from './pages/citizen/TrackDetails';
import MyDocuments from './pages/citizen/MyDocuments';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageSchemes from './pages/admin/ManageSchemes'; // ADDED THIS
import OfficerDashboard from './pages/officer/OfficerDashboard';
import ManageOfficers from './pages/admin/ManageOfficers';
import AuditLogs from './pages/admin/AuditLogs';

function App() {
  return (
    <Router>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', system-ui, -apple-system, sans-serif; }
        html, body, #root { width: 100vw; height: 100vh; overflow-x: hidden; background-color: #f1f5f9; }
        `}</style>
      
      <Routes>
        {/* Citizen Routes */}
        <Route path="/" element={<CitizenDashboard />} />
        <Route path="/citizen/schemes" element={<BrowseSchemes />} />
        <Route path="/citizen/apply/:schemeId" element={<ApplicationForm />} />
        <Route path="/citizen/track" element={<TrackStatus />} />
        <Route path="/citizen/track/:appId" element={<TrackDetails />} />
        <Route path="/citizen/documents" element={<MyDocuments />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/schemes" element={<ManageSchemes />} /> {/* ADDED THIS */}
        <Route path="/admin/officers" element={<ManageOfficers />} />
        <Route path="/admin/audits" element={<AuditLogs />} />
        
        {/* Officer Routes */}
        <Route path="/officer" element={<OfficerDashboard />} />
        
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;