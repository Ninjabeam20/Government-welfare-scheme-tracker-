import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './pages/auth/Login';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import BrowseSchemes from './pages/citizen/BrowseSchemes';
import ApplicationForm from './pages/citizen/ApplicationForm';
import TrackStatus from './pages/citizen/TrackStatus';
import TrackDetails from './pages/citizen/TrackDetails';
import MyDocuments from './pages/citizen/MyDocuments';
import Grievance from './pages/citizen/Grievance';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageSchemes from './pages/admin/ManageSchemes';
import ManageOfficers from './pages/admin/ManageOfficers';
import AuditLogs from './pages/admin/AuditLogs';

// Officer Pages
import OfficerDashboard from './pages/officer/OfficerDashboard';
import VerificationQueue from './pages/officer/VerificationQueue';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/auth/me', { withCredentials: true })
      .then(res => { setUser(res.data); setLoading(false); })
      .catch(() => { setUser(null); setLoading(false); });
  }, []);

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== requiredRole) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
        html, body, #root { width: 100vw; height: 100vh; background-color: #f1f5f9; }
      `}</style>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* Citizen */}
        <Route path="/citizen/dashboard" element={
          <ProtectedRoute requiredRole="citizen"><CitizenDashboard /></ProtectedRoute>
        } />
        <Route path="/citizen/schemes" element={
          <ProtectedRoute requiredRole="citizen"><BrowseSchemes /></ProtectedRoute>
        } />
        <Route path="/citizen/apply/:schemeId" element={
          <ProtectedRoute requiredRole="citizen"><ApplicationForm /></ProtectedRoute>
        } />
        <Route path="/citizen/track" element={
          <ProtectedRoute requiredRole="citizen"><TrackStatus /></ProtectedRoute>
        } />
        <Route path="/citizen/track/:appId" element={
          <ProtectedRoute requiredRole="citizen"><TrackDetails /></ProtectedRoute>
        } />
        <Route path="/citizen/documents" element={
          <ProtectedRoute requiredRole="citizen"><MyDocuments /></ProtectedRoute>
        } />
        <Route path="/citizen/grievance" element={
          <ProtectedRoute requiredRole="citizen"><Grievance /></ProtectedRoute>
        } />

        {/* Officer */}
        <Route path="/officer/dashboard" element={
          <ProtectedRoute requiredRole="officer"><OfficerDashboard /></ProtectedRoute>
        } />
        <Route path="/officer/queue" element={
          <ProtectedRoute requiredRole="officer"><VerificationQueue /></ProtectedRoute>
        } />

        {/* Admin */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/schemes" element={
          <ProtectedRoute requiredRole="admin"><ManageSchemes /></ProtectedRoute>
        } />
        <Route path="/admin/officers" element={
          <ProtectedRoute requiredRole="admin"><ManageOfficers /></ProtectedRoute>
        } />
        <Route path="/admin/audit" element={
          <ProtectedRoute requiredRole="admin"><AuditLogs /></ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;