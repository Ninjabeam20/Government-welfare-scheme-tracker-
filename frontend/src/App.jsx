import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import BrowseSchemes from './pages/citizen/BrowseSchemes';
import ApplicationForm from './pages/citizen/ApplicationForm';
import TrackStatus from './pages/citizen/TrackStatus';
// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageSchemes from './pages/admin/ManageSchemes';
import ManageOfficers from './pages/admin/ManageOfficers';
import AuditLogs from './pages/admin/AuditLogs';
// Officer Pages (Teammate's Integrated Dashboard)
import OfficerDashboard from './pages/officer/OfficerDashboard'; 

function App() {
  return (
    <Router>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
        html, body, #root { width: 100vw; height: 100vh; background-color: #f1f5f9; }
      `}</style>
      
      <Routes>
        {/* Default to Citizen for testing */}
        <Route path="/" element={<CitizenDashboard />} />
        <Route path="/citizen/schemes" element={<BrowseSchemes />} />
        <Route path="/citizen/apply/:schemeId" element={<ApplicationForm />} />
        <Route path="/citizen/track" element={<TrackStatus />} />

        {/* Admin Section */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/schemes" element={<ManageSchemes />} />
        <Route path="/admin/officers" element={<ManageOfficers />} />
        <Route path="/admin/audits" element={<AuditLogs />} />

        {/* Officer Section (Using OfficerDashboard2 logic) */}
        <Route path="/officer" element={<OfficerDashboard />} />

        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;